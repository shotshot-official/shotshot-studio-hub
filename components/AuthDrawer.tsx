// components/AuthDrawer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import { loginAction, signupAction } from '@/app/actions/auth';
import { toast } from '@/lib/toast';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDrawer({ isOpen, onClose }: AuthDrawerProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
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

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);
    setLoading(false);
    if (res.success) {
      toast.success('Signed in successfully.');
      onClose();
    } else {
      setError(res.error || 'Failed to sign in.');
      toast.error(res.error || 'Failed to sign in.');
    }
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await signupAction(formData);
    setLoading(false);
    if (res.success) {
      toast.success('Account created successfully.');
      onClose();
    } else {
      setError(res.error || 'Failed to register.');
      toast.error(res.error || 'Failed to register.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-[var(--color-surface)] border-l border-neutral-800 p-5 sm:p-6 md:p-8 flex flex-col justify-between h-full overflow-y-auto shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
                STUDIO ACCOUNT
              </span>
              <h2
                id="auth-drawer-title"
                className="text-2xl font-bold text-white tracking-tight mt-0.5 uppercase"
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="swiss-focus text-neutral-400 hover:text-white p-2 border border-transparent hover:border-neutral-700 hover:bg-neutral-950 transition-colors"
              aria-label="Close auth panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-neutral-950 p-1 mt-6 border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`swiss-focus flex-1 py-2 text-xs font-mono uppercase tracking-wider font-medium transition-colors ${
                tab === 'login'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setError(null);
              }}
              className={`swiss-focus flex-1 py-2 text-xs font-mono uppercase tracking-wider font-medium transition-colors ${
                tab === 'signup'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div
              role="alert"
              className="mt-4 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs leading-relaxed font-mono"
            >
              {error}
            </div>
          )}

          {/* Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div>
                <label
                  htmlFor="auth-login-email"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    id="auth-login-email"
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@gmail.com"
                    className="w-full bg-neutral-950 border border-neutral-800 pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-400 swiss-focus font-mono"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-login-password"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    id="auth-login-password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-800 pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-400 swiss-focus font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-white text-black font-mono uppercase tracking-wider font-bold py-2.5 px-4 text-xs hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 swiss-focus"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 mt-6">
              <div>
                <label
                  htmlFor="auth-signup-name"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Full Name
                </label>
                <input
                  id="auth-signup-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. 서민수"
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 swiss-focus"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-signup-email"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Email Address
                </label>
                <input
                  id="auth-signup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 swiss-focus font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-signup-role"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Discipline / Role
                </label>
                <select
                  id="auth-signup-role"
                  name="role"
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white swiss-focus"
                >
                  <option value="Product Designer">Product Designer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Fullstack Dev">Fullstack Dev</option>
                  <option value="Growth Marketer">Growth Marketer</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Contributor">Contributor</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="auth-signup-password"
                  className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider"
                >
                  Password
                </label>
                <input
                  id="auth-signup-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 swiss-focus"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-white text-black font-mono uppercase tracking-wider font-bold py-2.5 px-4 text-xs hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 swiss-focus"
              >
                <span>{loading ? 'Creating...' : 'Create Account'}</span>
                <UserPlus className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="text-xs text-neutral-400 font-mono uppercase tracking-wider pt-6 text-center border-t border-neutral-800">
          Team-only access &bull; Session secured
        </div>
      </div>
    </div>
  );
}
