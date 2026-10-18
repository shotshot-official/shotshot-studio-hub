// components/ProfileDrawer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Plus,
  Trash2,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { AuthSession } from '@/lib/auth';
import { updateProfileAction, logoutAction } from '@/app/actions/auth';
import { uploadAvatarAction } from '@/app/actions/upload';
import { TeamMember } from '@/types/notion';
import { resolveSocialLink } from '@/lib/social-links';

import { toast } from '@/lib/toast';

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
  const initialName = currentMember?.name || session.name || '';
  const initialRole = currentMember?.role || session.role || '';
  const initialAvatar = currentMember?.avatarUrl || session.avatarUrl || '';
  const initialSkills = currentMember?.skills || ['Next.js', 'TypeScript', 'Tailwind CSS'];
  const initialLinks = currentMember?.personalLinks || (currentMember?.personalLink ? [currentMember.personalLink] : []);
  const initialBio = currentMember?.bio || '';
  const initialSpecialty = currentMember?.specialty || '';
  const initialQuote = currentMember?.featuredQuote || '';

  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole);
  const [bio, setBio] = useState(initialBio);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [featuredQuote, setFeaturedQuote] = useState(initialQuote);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState('');
  const [personalLinks, setPersonalLinks] = useState<string[]>(initialLinks);
  const [newLink, setNewLink] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setRole(initialRole);
      setBio(initialBio);
      setSpecialty(initialSpecialty);
      setFeaturedQuote(initialQuote);
      setAvatarUrl(initialAvatar);
      setSkills(initialSkills);
      setPersonalLinks(initialLinks);
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordOpen(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setError(null);
      setSuccess(false);
    }
  }, [
    isOpen,
    initialName,
    initialRole,
    initialBio,
    initialSpecialty,
    initialQuote,
    initialAvatar,
    initialSkills,
    initialLinks,
  ]);

  // Compute password validity
  const isPasswordChanged = newPassword.trim().length > 0;
  const isPasswordMatch = isPasswordChanged && newPassword === confirmPassword;
  const isPasswordLengthOk = newPassword.trim().length >= 4;
  const isPasswordValid = !isPasswordChanged || (isPasswordLengthOk && isPasswordMatch);

  // Compute if any form field has been modified
  const isNameChanged = name.trim() !== initialName.trim();
  const isRoleChanged = role.trim() !== initialRole.trim();
  const isBioChanged = bio.trim() !== initialBio.trim();
  const isSpecialtyChanged = specialty.trim() !== initialSpecialty.trim();
  const isQuoteChanged = featuredQuote.trim() !== initialQuote.trim();
  const isAvatarChanged = avatarUrl.trim() !== initialAvatar.trim();
  const isSkillsChanged =
    skills.length !== initialSkills.length ||
    skills.some((s, idx) => s !== initialSkills[idx]);
  const isLinksChanged =
    personalLinks.length !== initialLinks.length ||
    personalLinks.some((l, idx) => l !== initialLinks[idx]);

  const isDirty =
    isNameChanged ||
    isRoleChanged ||
    isBioChanged ||
    isSpecialtyChanged ||
    isQuoteChanged ||
    isAvatarChanged ||
    isSkillsChanged ||
    isLinksChanged ||
    isPasswordChanged;

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFileUpload(file);
  }

  async function processFileUpload(file: File) {
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await uploadAvatarAction(formData);
    setUploading(false);
    if (res.success && res.url) {
      setAvatarUrl(res.url);
    } else {
      setAvatarUrl(initialAvatar);
      setError(res.error || 'Failed to upload photo file.');
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFileUpload(file);
    }
  }

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
    let trimmed = newLink.trim();
    if (trimmed) {
      if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('mailto:')) {
        trimmed = `https://${trimmed}`;
      }
      if (!personalLinks.includes(trimmed)) {
        setPersonalLinks([...personalLinks, trimmed]);
        setNewLink('');
      }
    }
  }

  function handleRemoveLink(target: string) {
    setPersonalLinks(personalLinks.filter((l) => l !== target));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (uploading) {
      setError('Photo upload is still in progress. Please wait a moment.');
      return;
    }
    if (avatarUrl.startsWith('blob:')) {
      setError('Photo upload did not complete. Please upload the image again.');
      return;
    }

    if (isPasswordChanged) {
      if (!isPasswordLengthOk) {
        setError('New password must be at least 4 characters.');
        return;
      }
      if (!isPasswordMatch) {
        setError('New password and confirmation do not match.');
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await updateProfileAction({
      name,
      role,
      bio: bio.trim(),
      specialty: specialty.trim(),
      featuredQuote: featuredQuote.trim(),
      avatarUrl: avatarUrl.trim(),
      skills,
      personalLinks,
      newPassword: newPassword.trim() || undefined,
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setIsPasswordOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Profile changes saved.');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 800);
    } else {
      setError(res.error || 'Failed to save profile changes.');
      toast.error(res.error || 'Failed to save profile changes.');
    }
  }

  async function handleLogout() {
    await logoutAction();
    toast.info('Signed out successfully.');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border-l border-neutral-800 p-5 sm:p-6 md:p-8 flex flex-col justify-between h-full overflow-y-auto shadow-2xl z-10 sm:rounded-l-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
                MEMBER PROFILE
              </span>
              <h2
                id="profile-drawer-title"
                className="text-2xl font-bold text-white tracking-tight mt-0.5 uppercase"
              >
                Edit Profile
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="swiss-focus text-neutral-400 hover:text-white p-2 border border-transparent hover:border-neutral-700 hover:bg-neutral-950 rounded-[4px] transition-colors"
              aria-label="Close profile panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback messages */}
          {success && (
            <div
              role="status"
              className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 font-mono rounded-[4px]"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profile updated.</span>
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="mt-4 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 font-mono rounded-[4px]"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-5 mt-6">
            {/* Avatar Preview & Real File Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider">
                  Profile Photo
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="swiss-focus text-xs font-mono uppercase text-neutral-400 hover:text-red-400 transition-colors"
                  >
                    Clear Photo (Use Initial)
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex items-start gap-4">
                {/* Clickable Avatar Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="relative group w-20 h-20 rounded-full bg-neutral-950 border-2 border-dashed border-neutral-700 hover:border-white transition-colors shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                  title="Click or drag an image here to upload"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-1">
                      <Camera className="w-5 h-5 text-neutral-400 mb-1 group-hover:text-white transition-colors" />
                      <span className="text-xs font-mono text-neutral-400 group-hover:text-neutral-200 leading-none">
                        UPLOAD
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>

                  {uploading && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="swiss-focus inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-xs font-mono tracking-wider uppercase rounded-[4px] transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-xs font-mono text-neutral-400 hover:text-neutral-300 underline underline-offset-2 transition-colors"
                    >
                      {showUrlInput ? 'Hide URL' : 'Or paste URL'}
                    </button>
                  </div>

                  {showUrlInput && (
                    <input
                      id="profile-avatar-url"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://... direct image URL"
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white placeholder-neutral-400 swiss-focus font-mono rounded-[4px]"
                    />
                  )}

                  <p className="text-xs text-neutral-400 font-mono leading-tight">
                    JPG, PNG, WebP (Max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="profile-full-name"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Full Name
              </label>
              <input
                id="profile-full-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white swiss-focus rounded-[4px]"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="profile-role"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Discipline &amp; Role
              </label>
              <input
                id="profile-role"
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white swiss-focus"
              />
            </div>

            {/* Specialty & Dossier Bio (V2 Schema) */}
            <div>
              <label
                htmlFor="profile-specialty"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Core Specialty Line
              </label>
              <input
                id="profile-specialty"
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. System Architecture · Product Strategy"
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs font-mono text-white placeholder-neutral-400 swiss-focus"
              />
            </div>

            <div>
              <label
                htmlFor="profile-bio"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Dossier Bio
              </label>
              <textarea
                id="profile-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Introduce your creative practice and studio responsibilities."
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-400 swiss-focus leading-relaxed"
              />
            </div>

            <div>
              <label
                htmlFor="profile-quote"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Featured Motto / Statement
              </label>
              <input
                id="profile-quote"
                type="text"
                value={featuredQuote}
                onChange={(e) => setFeaturedQuote(e.target.value)}
                placeholder="A short creative principle displayed on your dossier page."
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs font-mono text-white placeholder-neutral-400 swiss-focus"
              />
            </div>

            {/* Skills Tag Editor */}
            <div>
              <label
                htmlFor="profile-new-skill"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Skills
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase px-2.5 py-1 bg-neutral-950 text-neutral-200 border border-neutral-700 rounded-[3px]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="swiss-focus text-neutral-400 hover:text-red-400 transition-colors"
                      title={`Remove ${skill}`}
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="profile-new-skill"
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add skill (e.g. Next.js, Figma)"
                  className="flex-1 bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white placeholder-neutral-400 swiss-focus rounded-[4px]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="swiss-focus px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-mono rounded-[4px] transition-colors"
                  aria-label="Add skill"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Personal Links Manager */}
            <div>
              <label
                htmlFor="profile-new-link"
                className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
              >
                Social &amp; Portfolio Links
              </label>
              <div className="space-y-1.5 mb-2">
                {personalLinks.map((link) => {
                  const { icon: Icon, label } = resolveSocialLink(link);
                  return (
                    <div
                      key={link}
                      className="flex items-center justify-between gap-2 p-2 bg-neutral-950 border border-neutral-800 text-xs rounded-[4px]"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="p-1 bg-neutral-900 border border-neutral-800 text-neutral-400 shrink-0 rounded-[3px]">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-mono uppercase text-neutral-400 shrink-0">{label}</span>
                        <span className="truncate text-neutral-300 font-mono text-xs">{link}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link)}
                        className="swiss-focus text-neutral-400 hover:text-red-400 p-1 transition-colors shrink-0 rounded-[3px]"
                        title={`Remove ${label} link`}
                        aria-label={`Remove ${label} link`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  id="profile-new-link"
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
                  className="flex-1 bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white placeholder-neutral-400 swiss-focus rounded-[4px]"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="swiss-focus px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-mono rounded-[4px] transition-colors"
                  aria-label="Add link"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Security & Password Credentials Card */}
            <div className="border border-neutral-800 bg-neutral-950/70 rounded-[6px] overflow-hidden transition-all">
              {/* Card Header & Toggle Trigger */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-[4px] bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-neutral-300">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-200 font-medium">
                        Password &amp; Security
                      </span>
                      {isPasswordChanged && isPasswordValid && (
                        <span className="px-1.5 py-0.5 text-xs font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                          READY
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-neutral-400 truncate">
                      SHA-256 encrypted authentication
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isPasswordOpen) {
                      setNewPassword('');
                      setConfirmPassword('');
                    }
                    setIsPasswordOpen(!isPasswordOpen);
                  }}
                  className="swiss-focus px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-xs font-mono uppercase tracking-wider text-neutral-200 transition-colors rounded-[4px] shrink-0"
                >
                  {isPasswordOpen ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {/* Collapsible Password Edit Drawer Section */}
              {isPasswordOpen && (
                <div className="px-3.5 pb-4 pt-3.5 border-t border-neutral-800/80 space-y-3.5 bg-neutral-950/40">
                  {/* New Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="profile-new-password"
                        className="block text-xs font-mono text-neutral-300 uppercase tracking-wider"
                      >
                        New Password
                      </label>
                      <span className="text-xs font-mono text-neutral-400">
                        Min. 4 characters
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="profile-new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new secure password"
                        autoComplete="new-password"
                        className="w-full bg-neutral-900 border border-neutral-800 pl-3 pr-9 py-2 text-xs text-white placeholder-neutral-500 swiss-focus font-mono rounded-[4px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="swiss-focus absolute right-2 top-2 p-1 text-neutral-400 hover:text-white transition-colors"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="profile-confirm-password"
                        className="block text-xs font-mono text-neutral-300 uppercase tracking-wider"
                      >
                        Confirm Password
                      </label>
                      {newPassword.length > 0 && confirmPassword.length > 0 && (
                        <span
                          className={`text-xs font-mono flex items-center gap-1 ${
                            isPasswordMatch ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {isPasswordMatch ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Matched</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              <span>Mismatch</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="profile-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        className="w-full bg-neutral-900 border border-neutral-800 pl-3 pr-9 py-2 text-xs text-white placeholder-neutral-500 swiss-focus font-mono rounded-[4px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="swiss-focus absolute right-2 top-2 p-1 text-neutral-400 hover:text-white transition-colors"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Real-time Requirement Checklist */}
                  {isPasswordChanged && (
                    <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 text-xs font-mono space-y-1 text-neutral-400 rounded-[4px]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPasswordLengthOk ? 'bg-emerald-400' : 'bg-neutral-600'
                          }`}
                        />
                        <span className={isPasswordLengthOk ? 'text-neutral-200' : ''}>
                          At least 4 characters ({newPassword.length}/4)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPasswordMatch ? 'bg-emerald-400' : 'bg-neutral-600'
                          }`}
                        />
                        <span className={isPasswordMatch ? 'text-neutral-200' : ''}>
                          Passwords must match exactly
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>Encrypted with SHA-256 before storage in Notion.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
              <button
                type="submit"
                disabled={!isDirty || loading || uploading || (isPasswordChanged && !isPasswordValid)}
                className={`w-full font-mono uppercase tracking-wider font-bold py-2.5 px-4 text-xs transition-colors flex items-center justify-center gap-2 swiss-focus rounded-[4px] ${
                  isDirty && !loading && !uploading && (!isPasswordChanged || isPasswordValid)
                    ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Saving...'
                    : uploading
                    ? 'Uploading Photo...'
                    : isPasswordChanged && !isPasswordValid
                    ? 'Check Password Fields'
                    : !isDirty
                    ? 'No Changes to Save'
                    : 'Save Changes'}
                </span>
              </button>
              {isDirty && !isPasswordChanged && (
                <p className="text-xs text-neutral-400 font-mono text-center">
                  * You have unsaved changes.
                </p>
              )}
              {isPasswordChanged && !isPasswordValid && (
                <p className="text-xs text-amber-400 font-mono text-center">
                  * Verify new password meets minimum 4 characters and confirmation matches.
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer Logout Button */}
        <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400 font-mono truncate">
            Signed in as {session.email}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="swiss-focus text-neutral-400 hover:text-red-400 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors p-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
