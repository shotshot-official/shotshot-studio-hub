// components/ProfileDrawer.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Trash2, Save, LogOut, CheckCircle2, AlertCircle, ExternalLink, Upload } from 'lucide-react';
import { AuthSession } from '@/lib/auth';
import { updateProfileAction, logoutAction } from '@/app/actions/auth';
import { TeamMember } from '@/types/notion';
import { resolveSocialLink } from '@/lib/social-links';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession;
  currentMember?: TeamMember;
  teamDbId?: string;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  session,
  currentMember,
  teamDbId,
}: ProfileDrawerProps) {
  const [name, setName] = useState(currentMember?.name || session.name);
  const [role, setRole] = useState(currentMember?.role || session.role);
  const [avatarUrl, setAvatarUrl] = useState(currentMember?.avatarUrl || session.avatarUrl || '');
  const [skills, setSkills] = useState<string[]>(
    currentMember?.skills || ['Next.js', 'TypeScript', 'Tailwind CSS']
  );
  const [newSkill, setNewSkill] = useState('');
  const [personalLinks, setPersonalLinks] = useState<string[]>(
    currentMember?.personalLinks || (currentMember?.personalLink ? [currentMember.personalLink] : [])
  );
  const [newLink, setNewLink] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleAddSkill() {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  }

  function handleRemoveSkill(target: string) {
    setSkills(skills.filter((s) => s !== target));
  }

  function handleAddLink() {
    const trimmed = newLink.trim();
    if (trimmed && !personalLinks.includes(trimmed)) {
      setPersonalLinks([...personalLinks, trimmed]);
      setNewLink('');
    }
  }

  function handleRemoveLink(target: string) {
    setPersonalLinks(personalLinks.filter((l) => l !== target));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await updateProfileAction({
      name,
      role,
      avatarUrl: avatarUrl.trim() || undefined,
      skills,
      personalLinks,
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to save profile changes.');
    }
  }

  async function handleLogout() {
    await logoutAction();
    onClose();
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
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
                My Profile Management
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Edit Member Profile
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

          {/* Feedback messages */}
          {success && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Profile successfully updated!</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-5 mt-6">
            {/* Avatar Preview & Direct Notion File Upload Redirect */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-neutral-300 uppercase tracking-wider">
                  Avatar Profile Photo
                </label>
                <a
                  href={
                    teamDbId
                      ? `https://www.notion.so/${teamDbId.replace(/-/g, '')}`
                      : currentMember?.id && !currentMember.id.startsWith('member-')
                      ? `https://www.notion.so/${currentMember.id.replace(/-/g, '')}`
                      : 'https://www.notion.so'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="swiss-focus inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 hover:text-amber-300 hover:underline transition-colors"
                  title="Open Team DB in Notion to upload photo file directly"
                >
                  <span>Open Team DB in Notion</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-neutral-950 border border-neutral-700 shrink-0 flex items-center justify-center">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <span className="text-sm font-mono font-bold text-neutral-400">
                      {name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <a
                    href={
                      teamDbId
                        ? `https://www.notion.so/${teamDbId.replace(/-/g, '')}`
                        : currentMember?.id && !currentMember.id.startsWith('member-')
                        ? `https://www.notion.so/${currentMember.id.replace(/-/g, '')}`
                        : 'https://www.notion.so'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-xs font-mono text-white transition-all group"
                  >
                    <Upload className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-300 transition-colors" />
                    <span>Upload Photo in Team DB Table &rarr;</span>
                  </a>

                  <div className="relative">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Or paste external image URL..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-600 swiss-focus font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono leading-tight">
                    Opens Team DB directly in Notion. Click your Avatar cell to attach a photo file, or paste an external URL.
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white swiss-focus"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                Role & Specialty
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white swiss-focus"
              />
            </div>

            {/* Skills Tag Editor */}
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                Skill Matrix Tags
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 border border-neutral-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
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
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add skill tag (e.g. Next.js 15, Figma)"
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-600 swiss-focus"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono transition-colors"
                  aria-label="Add skill"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Personal Links Manager */}
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                Personal & Social Links (Instagram, Blog, GitHub, etc.)
              </label>
              <div className="space-y-1.5 mb-2">
                {personalLinks.map((link) => {
                  const { icon: Icon, label } = resolveSocialLink(link);
                  return (
                    <div
                      key={link}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">{label}</span>
                        <span className="truncate text-neutral-300 font-mono text-[11px]">{link}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors shrink-0"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLink();
                    }
                  }}
                  placeholder="https://instagram.com/... or portfolio URL"
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-600 swiss-focus"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono transition-colors"
                  aria-label="Add link"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-800 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-white text-black font-medium py-2.5 px-4 rounded-lg text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 swiss-focus"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Logout Button */}
        <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400 font-mono truncate">
            Signed in as: {session.email}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="swiss-focus text-neutral-400 hover:text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors p-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
