// components/HeaderAuthButtons.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserCog, LogOut, ArrowUpRight } from 'lucide-react';
import { AuthSession } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { TeamMember } from '@/types/notion';
import { toast } from '@/lib/toast';
import AuthDrawer from './AuthDrawer';
import ProfileDrawer from './ProfileDrawer';

interface HeaderAuthButtonsProps {
  session: AuthSession | null;
  members: TeamMember[];
  teamDbId?: string;
}

export default function HeaderAuthButtons({ session, members, teamDbId }: HeaderAuthButtonsProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  React.useEffect(() => {
    function handleOpenAuth() {
      setIsAuthOpen(true);
    }
    window.addEventListener('open-auth-drawer', handleOpenAuth);
    return () => window.removeEventListener('open-auth-drawer', handleOpenAuth);
  }, []);

  const currentMember = session
    ? members.find(
        (m) =>
          m.id === session.memberId ||
          (session.email && m.email && m.email.toLowerCase() === session.email.toLowerCase()) ||
          m.name.toLowerCase() === session.name.toLowerCase()
      )
    : undefined;

  // Real avatar from Notion only (strictly ignore any stale unsplash stock photos)
  const avatarToDisplay =
    currentMember?.avatarUrl ||
    (session?.avatarUrl && !session.avatarUrl.includes('images.unsplash.com') ? session.avatarUrl : undefined);

  // Reset error when avatar changes
  React.useEffect(() => {
    setAvatarError(false);
  }, [avatarToDisplay]);

  async function handleLogout() {
    await logoutAction();
    toast.info('Signed out successfully.');
  }

  const hasAvatar = Boolean(avatarToDisplay && !avatarError);
  const initialLetter = (currentMember?.name || session?.name || 'S').slice(0, 1).toUpperCase();
  const firstName = (currentMember?.name || session?.name || '').split(' ')[0];

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Primary Client Commission Trigger (Visitors Only) */}
        {!session && (
          <a
            href="#inquire"
            className="swiss-focus inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] sm:min-h-0 text-xs font-mono uppercase tracking-wider bg-white text-black hover:bg-neutral-200 font-medium rounded-[4px] transition-colors"
          >
            <span>Contact</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Discrete Studio Member Portal Trigger */}
        {session ? (
          <>
            {/* Mobile View (<sm): Compact Touch-Friendly Member Pill */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="sm:hidden swiss-focus flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 pl-2 pr-2.5 py-1.5 rounded-[4px] transition-colors min-h-[36px]"
              aria-label="Open member profile"
            >
              <div className="relative w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 shrink-0 flex items-center justify-center overflow-hidden">
                {hasAvatar ? (
                  <Image
                    src={avatarToDisplay!}
                    alt={session.name}
                    fill
                    className="object-cover"
                    sizes="20px"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-xs font-mono font-bold text-neutral-300">
                    {initialLetter}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-neutral-300 font-medium max-w-[76px] truncate">
                {firstName}
              </span>
              <UserCog className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </button>

            {/* Desktop / Tablet View (sm+): Full Architectural Dossier Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-neutral-950 border border-neutral-800 pl-2 pr-2.5 py-1 rounded-[4px]">
              {/* Circular Avatar thumbnail */}
              <div className="relative w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 shrink-0 flex items-center justify-center overflow-hidden">
                {hasAvatar ? (
                  <Image
                    src={avatarToDisplay!}
                    alt={session.name}
                    fill
                    className="object-cover"
                    sizes="20px"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-xs font-mono font-bold text-neutral-300">
                    {initialLetter}
                  </span>
                )}
              </div>

              <span className="text-xs font-mono text-neutral-200 truncate max-w-[120px]">
                {currentMember?.name || session.name}
              </span>

              <div className="h-3 w-px bg-neutral-800 mx-0.5" />

              {/* Profile Edit button */}
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="swiss-focus text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1 transition-colors p-1 hover:bg-neutral-900 rounded-[3px]"
                title="Edit Member Profile"
              >
                <UserCog className="w-3.5 h-3.5 text-neutral-400" />
                <span className="uppercase text-xs">Profile</span>
              </button>

              {/* Logout button */}
              <button
                type="button"
                onClick={handleLogout}
                className="swiss-focus text-xs text-neutral-400 hover:text-red-400 transition-colors p-1 rounded-[3px]"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="swiss-focus inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] sm:min-h-0 text-xs font-mono uppercase tracking-wider bg-neutral-950 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white rounded-[4px] transition-colors"
          >
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Drawers */}
      <AuthDrawer isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      {session && (
        <ProfileDrawer
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          session={session}
          currentMember={currentMember}
          teamDbId={teamDbId}
        />
      )}
    </>
  );
}
