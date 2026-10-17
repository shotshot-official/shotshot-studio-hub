// components/ProjectDrawer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Sparkles, CheckCircle2, AlertCircle, Rocket, Upload } from 'lucide-react';
import { TeamMember, ProductStatus } from '@/types/notion';
import { AuthSession } from '@/lib/auth';
import { createProductAction } from '@/app/actions/product';

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  session: AuthSession | null;
  productsDbId?: string;
  onOpenAuth?: () => void;
}

export default function ProjectDrawer({
  isOpen,
  onClose,
  members,
  session,
  productsDbId,
  onOpenAuth,
}: ProjectDrawerProps) {
  const [brandName, setBrandName] = useState('');
  const [status, setStatus] = useState<ProductStatus>('Active');
  const [oneLiner, setOneLiner] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    session ? [session.memberId] : []
  );
  const [techStack, setTechStack] = useState<string[]>([
    'Next.js 15',
    'Tailwind CSS v4',
    'TypeScript',
  ]);
  const [newTag, setNewTag] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [internalLink, setInternalLink] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleToggleMember(id: string) {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((mId) => mId !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  }

  function handleAddTag() {
    const trimmed = newTag.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setNewTag('');
    }
  }

  function handleRemoveTag(tag: string) {
    setTechStack(techStack.filter((t) => t !== tag));
  }

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

    const res = await createProductAction({
      brandName,
      status,
      oneLiner,
      memberIds: selectedMemberIds,
      techStack,
      liveUrl,
      internalLink,
      coverImage,
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setBrandName('');
        setOneLiner('');
        setLiveUrl('');
        setInternalLink('');
        setCoverImage('');
      }, 1200);
    } else {
      setError(res.error || 'Could not save project. Please try again.');
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
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border-l border-neutral-800 p-6 md:p-8 flex flex-col justify-between h-full overflow-y-auto shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                SELECTED WORKS
              </span>
              <h2
                id="project-drawer-title"
                className="text-2xl font-bold text-white tracking-tight mt-0.5 uppercase"
              >
                Add Project
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
              <span>Project added.</span>
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
            {/* Brand Name & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
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
                  placeholder="e.g. OrbitPulse"
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 swiss-focus"
                />
              </div>

              <div>
                <label
                  htmlFor="venture-status"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Status
                </label>
                <select
                  id="venture-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white swiss-focus"
                >
                  <option value="Active">Active</option>
                  <option value="In Development">In Development</option>
                  <option value="Concept">Concept</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* One-Liner Description */}
            <div>
              <label
                htmlFor="venture-one-liner"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Short Description
              </label>
              <textarea
                id="venture-one-liner"
                required
                rows={2}
                maxLength={200}
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                placeholder="Describe what this venture does in one or two sentences."
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus resize-none leading-relaxed"
              />
            </div>

            {/* Contributing Team Members */}
            <div>
              <span className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                Team Members
              </span>
              <div className="grid grid-cols-2 gap-2">
                {members.map((member) => {
                  const isChecked = selectedMemberIds.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      aria-pressed={isChecked}
                      onClick={() => handleToggleMember(member.id)}
                      className={`flex items-center gap-2.5 p-2 border text-left transition-colors text-xs swiss-focus ${
                        isChecked
                          ? 'bg-neutral-800/90 border-white text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="relative w-6 h-6 bg-neutral-900 border border-neutral-700 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-mono">
                        {member.avatarUrl ? (
                          <Image
                            src={member.avatarUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        ) : (
                          member.name.slice(0, 1)
                        )}
                      </div>
                      <div className="truncate flex-1">
                        <div className="font-medium truncate">{member.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono truncate">{member.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div>
              <label
                htmlFor="venture-new-tag"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Tech Stack
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase px-2.5 py-1 bg-neutral-950 text-neutral-200 border border-neutral-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="swiss-focus text-neutral-400 hover:text-red-400 transition-colors"
                      title={`Remove ${tag}`}
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="venture-new-tag"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add technology (e.g. Next.js, TypeScript)"
                  className="flex-1 bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white placeholder-neutral-400 swiss-focus"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="swiss-focus px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-mono transition-colors"
                  aria-label="Add technology"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cover Image URL & Direct Notion Upload Redirect */}
            <div>
              <label
                htmlFor="venture-cover-image"
                className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5"
              >
                Cover Image (Optional)
              </label>

              <div className="space-y-2">
                <a
                  href={
                    productsDbId
                      ? `https://www.notion.so/${productsDbId.replace(/-/g, '')}`
                      : 'https://www.notion.so'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="swiss-focus w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-700 hover:border-white text-xs font-mono uppercase tracking-wider text-white transition-colors group"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                  <span>Upload in Notion &rarr;</span>
                </a>

                <input
                  id="venture-cover-image"
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Or paste image URL (https://...)"
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus font-mono"
                />
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
              <p className="text-[11px] text-neutral-400 font-mono mt-1">
                Attach a cover file in Notion or paste a public image link.
              </p>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="venture-live-url"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Live URL (Optional)
                </label>
                <input
                  id="venture-live-url"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://myservice.dev"
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus"
                />
              </div>

              <div>
                <label
                  htmlFor="venture-repo-url"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Source or Docs (Optional)
                </label>
                <input
                  id="venture-repo-url"
                  type="url"
                  value={internalLink}
                  onChange={(e) => setInternalLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus"
                />
              </div>
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
                    ? 'Sign In to Add Project'
                    : loading
                    ? 'Saving...'
                    : 'Add Project'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-neutral-400 font-mono uppercase tracking-wider pt-6 text-center border-t border-neutral-800">
          Synced directly to Notion workspace
        </div>
      </div>
    </div>
  );
}
