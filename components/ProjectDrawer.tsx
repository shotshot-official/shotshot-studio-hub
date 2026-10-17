// components/ProjectDrawer.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Sparkles, CheckCircle2, AlertCircle, Rocket, ExternalLink, Upload } from 'lucide-react';
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
      setError(res.error || 'Failed to publish project to Notion.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-lg bg-neutral-900 border-l border-neutral-800 p-6 md:p-8 flex flex-col justify-between h-full overflow-y-auto shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Portfolio Expansion
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Launch New Brand
              </h2>
            </div>
            <button
              onClick={onClose}
              className="swiss-focus text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Alerts */}
          {success && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Project successfully published to Notion Products DB!</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* Brand Name & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Brand / Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. OrbitPulse"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 swiss-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white swiss-focus"
                >
                  <option value="Active">Active</option>
                  <option value="In Development">In Dev</option>
                  <option value="Concept">Concept</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* One-Liner Description */}
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                One-Liner Value Proposition *
              </label>
              <textarea
                required
                rows={2}
                maxLength={200}
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                placeholder="Explain the core mission and value in 1-2 punchy sentences."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 swiss-focus resize-none leading-relaxed"
              />
            </div>

            {/* Contributing Team Members */}
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                Contributing Team Members
              </label>
              <div className="grid grid-cols-2 gap-2">
                {members.map((member) => {
                  const isChecked = selectedMemberIds.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleToggleMember(member.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all text-xs swiss-focus ${
                        isChecked
                          ? 'bg-neutral-800/90 border-neutral-600 text-white'
                          : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="relative w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-mono">
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
                        <div className="text-[10px] text-neutral-500 font-mono truncate">{member.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                Tech Stack Tokens
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 border border-neutral-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add stack tag (e.g. Next.js 15, AI Agent)"
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-600 swiss-focus"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono transition-colors"
                  aria-label="Add tag"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cover Image URL & Direct Notion Upload Redirect */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-neutral-300 uppercase tracking-wider">
                  Cover Image
                </label>
                <a
                  href={
                    productsDbId
                      ? `https://www.notion.so/${productsDbId.replace(/-/g, '')}`
                      : 'https://www.notion.so'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="swiss-focus inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 hover:text-amber-300 hover:underline transition-colors"
                  title="Open Products DB in Notion to upload high-res cover files directly"
                >
                  <span>Open Products DB in Notion</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-2">
                <a
                  href={
                    productsDbId
                      ? `https://www.notion.so/${productsDbId.replace(/-/g, '')}`
                      : 'https://www.notion.so'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-xs font-mono text-white transition-all group"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-300 transition-colors" />
                  <span>Upload Cover File in Products DB &rarr;</span>
                </a>

                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Or paste external image URL (e.g. Unsplash)..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 swiss-focus font-mono"
                />
              </div>

              {coverImage && (
                <div className="relative w-full h-28 rounded-lg overflow-hidden border border-neutral-800 mt-2 bg-neutral-950">
                  <Image
                    src={coverImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              )}
              <p className="text-[10px] text-neutral-500 font-mono mt-1">
                Opens Products DB directly in Notion. Attach cover files in Notion to keep high-res assets secure, or provide an image link.
              </p>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Live Service URL
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://myservice.dev"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 swiss-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  GitHub / Internal Docs
                </label>
                <input
                  type="url"
                  value={internalLink}
                  onChange={(e) => setInternalLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 swiss-focus"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-neutral-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-medium py-2.5 px-4 rounded-lg text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 swiss-focus"
              >
                <Rocket className="w-4 h-4" />
                {loading ? 'Publishing to Notion...' : 'Publish Project to Matrix'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-neutral-400 font-mono pt-6 text-center border-t border-neutral-800/80">
          Direct Notion Products DB Relation &bull; $0 Infrastructure
        </div>
      </div>
    </div>
  );
}
