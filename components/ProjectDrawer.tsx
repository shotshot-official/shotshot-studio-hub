// components/ProjectDrawer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Rocket,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { TeamMember, ProductItem } from '@/types/notion';
import { AuthSession } from '@/lib/auth';
import { createProductAction, updateProductAction } from '@/app/actions/product';
import { uploadImageAction } from '@/app/actions/upload';
import { toast } from '@/lib/toast';

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  session: AuthSession | null;
  productsDbId?: string;
  initialProduct?: ProductItem;
  onOpenAuth?: () => void;
}

export default function ProjectDrawer({
  isOpen,
  onClose,
  members,
  session,
  initialProduct,
  onOpenAuth,
}: ProjectDrawerProps) {
  const isEditMode = Boolean(initialProduct);

  const [brandName, setBrandName] = useState(initialProduct?.brandName || '');
  const [category, setCategory] = useState(initialProduct?.category || 'Original Series');
  const [oneLiner, setOneLiner] = useState(initialProduct?.oneLiner || '');
  const [overview, setOverview] = useState(initialProduct?.overview || '');
  const [deliverablesText, setDeliverablesText] = useState(
    initialProduct?.deliverables ? initialProduct.deliverables.join('\n') : ''
  );
  const [videoUrl, setVideoUrl] = useState(initialProduct?.videoUrl || '');
  const [liveUrl, setLiveUrl] = useState(initialProduct?.liveUrl || '');
  const [internalLink, setInternalLink] = useState(initialProduct?.internalLink || '');
  const [coverImage, setCoverImage] = useState(initialProduct?.coverImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialProduct) return;
    setBrandName(initialProduct.brandName);
    setCategory(initialProduct.category || 'Original Series');
    setOneLiner(initialProduct.oneLiner);
    setOverview(initialProduct.overview || '');
    setDeliverablesText(
      initialProduct.deliverables ? initialProduct.deliverables.join('\n') : ''
    );
    setVideoUrl(initialProduct.videoUrl || '');
    setLiveUrl(initialProduct.liveUrl || '');
    setInternalLink(initialProduct.internalLink || '');
    setCoverImage(initialProduct.coverImage || '');
  }, [initialProduct]);

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadImageAction(formData);
    setUploadingCover(false);
    if (res.success && res.url) {
      setCoverImage(res.url);
    } else {
      setError(res.error || 'Failed to upload cover image.');
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      if (onOpenAuth) onOpenAuth();
      else window.dispatchEvent(new CustomEvent('open-auth-drawer'));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const deliverables = deliverablesText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      brandName,
      category,
      timeline: initialProduct?.timeline || undefined,
      oneLiner,
      overview,
      deliverables,
      videoUrl,
      memberIds: [],
      techStack: initialProduct?.techStack || [],
      liveUrl,
      internalLink,
      coverImage,
    };

    const res =
      isEditMode && initialProduct
        ? await updateProductAction(initialProduct.id, payload)
        : await createProductAction(payload);

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      toast.success(
        isEditMode ? 'Project specifications updated.' : 'Project added to archive.'
      );
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (!isEditMode) {
          setBrandName('');
          setOneLiner('');
          setOverview('');
          setDeliverablesText('');
          setVideoUrl('');
          setLiveUrl('');
          setInternalLink('');
          setCoverImage('');
        }
      }, 900);
    } else {
      setError(res.error || 'Could not save project. Please try again.');
      toast.error(res.error || 'Could not save project.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-xl bg-[var(--color-surface)] border-l border-neutral-800 p-5 sm:p-6 md:p-8 flex flex-col justify-between h-full overflow-y-auto shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isEditMode ? 'PROJECT SPECIFICATIONS' : 'SELECTED WORKS'}
              </span>
              <h2
                id="project-drawer-title"
                className="text-2xl font-bold text-white tracking-tight mt-0.5 uppercase"
              >
                {isEditMode ? 'Edit Project' : 'Add Project'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="swiss-focus text-neutral-400 hover:text-white p-2 border border-transparent hover:border-neutral-700 hover:bg-neutral-950 transition-colors"
              aria-label="Close project panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Alerts */}
          {success && (
            <div
              role="status"
              className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 font-mono"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isEditMode ? 'Project updated in Notion.' : 'Project added.'}</span>
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="mt-4 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 font-mono"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* Brand Name */}
            <div>
              <label
                htmlFor="venture-brand-name"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Project Name
              </label>
              <input
                id="venture-brand-name"
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Hanseong Spots"
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 swiss-focus"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="venture-category"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Category
              </label>
              <select
                id="venture-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white swiss-focus"
              >
                <option value="Original Series">Original Series</option>
                <option value="Web & Media">Web &amp; Media</option>
                <option value="Travel Format">Travel Format</option>
                <option value="Brand Campaign">Brand Campaign</option>
              </select>
            </div>

            {/* One-Liner Description */}
            <div>
              <label
                htmlFor="venture-one-liner"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                One-Line Pitch (Card Summary)
              </label>
              <textarea
                id="venture-one-liner"
                required
                rows={2}
                maxLength={200}
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                placeholder="Describe what this project does in one or two sentences."
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus resize-none leading-relaxed"
              />
            </div>

            {/* Detailed Project Overview (V2 Schema) */}
            <div>
              <label
                htmlFor="venture-overview"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Project Overview (Detail Page)
              </label>
              <textarea
                id="venture-overview"
                rows={3}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Expanded background, editorial thesis, or architecture summary shown on the detail page."
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus leading-relaxed"
              />
            </div>

            {/* Key Deliverables (V2 Schema) */}
            <div>
              <label
                htmlFor="venture-deliverables"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Key Deliverables (One per line)
              </label>
              <textarea
                id="venture-deliverables"
                rows={3}
                value={deliverablesText}
                onChange={(e) => setDeliverablesText(e.target.value)}
                placeholder={'10-15m Cinematic Episode Series\nWalking Route Blueprint\nBilingual Web Index'}
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs font-mono text-white placeholder-neutral-400 swiss-focus leading-relaxed"
              />
            </div>

            {/* Cover Image URL & Upload */}
            <div>
              <label
                htmlFor="venture-cover-image"
                className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5"
              >
                Cover Image (Optional)
              </label>

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleCoverFile}
                  className="hidden"
                />

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="swiss-focus w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-white text-xs font-mono uppercase tracking-wider text-white transition-colors"
                  >
                    {uploadingCover ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                  </button>

                  <input
                    id="venture-cover-image"
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus font-mono"
                  />
                </div>
              </div>

              {coverImage && (
                <div className="relative w-full h-28 overflow-hidden border border-neutral-800 mt-2 bg-neutral-950">
                  <Image
                    src={coverImage}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              )}
            </div>

            {/* URLs & Video Embed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="venture-live-url"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Live / Channel URL
                </label>
                <input
                  id="venture-live-url"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://youtube.com/... or https://..."
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus"
                />
              </div>

              <div>
                <label
                  htmlFor="venture-repo-url"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Source or Docs URL
                </label>
                <input
                  id="venture-repo-url"
                  type="url"
                  value={internalLink}
                  onChange={(e) => setInternalLink(e.target.value)}
                  placeholder="https://notion.so/... or https://github.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="venture-video-url"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Featured Video / YouTube Embed URL (Optional)
              </label>
              <input
                id="venture-video-url"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... (Plays in Detail Page)"
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus font-mono"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-neutral-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-mono uppercase tracking-wider font-bold py-2.5 px-4 text-xs hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 swiss-focus"
              >
                <Rocket className="w-4 h-4" />
                <span>
                  {!session
                    ? 'Sign In to Save Project'
                    : loading
                    ? 'Saving...'
                    : isEditMode
                    ? 'Save Project Changes'
                    : 'Add Project'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-xs text-neutral-400 font-mono uppercase tracking-wider pt-6 text-center border-t border-neutral-800">
          Synced directly to Notion workspace
        </div>
      </div>
    </div>
  );
}
