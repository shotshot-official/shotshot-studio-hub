// components/AuthDrawer.tsx
'use client';

import React, { useState } from 'react';
import { X, Lock, User, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { loginAction, signupAction, quickDemoLoginAction } from '@/app/actions/auth';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDrawer({ isOpen, onClose }: AuthDrawerProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to sign in.');
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
      onClose();
    } else {
      setError(res.error || 'Failed to register.');
    }
  }

  async function handleQuickLogin(email: string) {
    setLoading(true);
    setError(null);
    const ok = await quickDemoLoginAction(email);
    setLoading(false);
    if (ok) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 p-6 md:p-8 flex flex-col justify-between h-full overflow-y-auto shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
                SHOTSHOT Studio Hub Access
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                {tab === 'login' ? 'Team Sign In' : 'Register Member'}
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

          {/* Tab Selector */}
          <div className="flex rounded-lg bg-neutral-950 p-1 mt-6 border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-mono font-medium rounded-md transition-all ${
                tab === 'login'
                  ? 'bg-neutral-800 text-white shadow-sm'
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
              className={`flex-1 py-2 text-xs font-mono font-medium rounded-md transition-all ${
                tab === 'signup'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="alex@shotshot.dev"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-600 swiss-focus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-600 swiss-focus"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-white text-black font-medium py-2.5 px-4 rounded-lg text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 swiss-focus"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Alex Kim"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 swiss-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="member@shotshot.dev"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 swiss-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Role in Team
                </label>
                <select
                  name="role"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white swiss-focus"
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
                <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 swiss-focus"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-white text-black font-medium py-2.5 px-4 rounded-lg text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 swiss-focus"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
                <UserPlus className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo 1-Click Login Section */}
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono uppercase text-neutral-400">
                Instant 1-Click Demo Login
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Alex Kim', role: 'Designer', email: 'alex@shotshot.dev' },
                { name: 'Chloe Lee', role: 'Frontend', email: 'chloe@shotshot.dev' },
                { name: 'David Park', role: 'Fullstack', email: 'david@shotshot.dev' },
                { name: 'Sara Choi', role: 'Growth', email: 'sara@shotshot.dev' },
              ].map((item) => (
                <button
                  key={item.email}
                  type="button"
                  onClick={() => handleQuickLogin(item.email)}
                  disabled={loading}
                  className="text-left p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50 transition-all text-xs swiss-focus group"
                >
                  <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">{item.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-neutral-400 font-mono pt-6 text-center border-t border-neutral-800/80">
          SHOTSHOT Studio Hub Internal Access &bull; $0 Edge
        </div>
      </div>
    </div>
  );
}
