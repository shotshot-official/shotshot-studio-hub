// components/HeaderAuthButtons.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserCog, LogOut, ArrowUpRight } from 'lucide-react';
import { AuthSession } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { TeamMember } from '@/types/notion';
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

  async function handleLogout() {
    await logoutAction();
  }

  return (
    <>
      <div className="flex items-center gap-2.5">
        {/* Primary Client Commission Trigger */}
        <a
          href="#inquire"
          className="swiss-focus inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white text-black hover:bg-neutral-200 font-medium transition-colors"
        >
          <span>Contact</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

        {/* Discrete Studio Member Portal Trigger */}
        {session ? (
          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 pl-2 pr-2.5 py-1">
            {/* Square Avatar thumbnail */}
            <div className="relative w-5 h-5 bg-neutral-900 border border-neutral-700 shrink-0 flex items-center justify-center overflow-hidden">
              {avatarToDisplay ? (
                <Image
                  src={avatarToDisplay}
                  alt={session.name}
                  fill
                  className="object-cover"
                  sizes="20px"
                />
              ) : (
                <span className="text-[10px] font-mono font-bold text-neutral-300">
                  {(currentMember?.name || session.name).slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>

            <span className="text-xs font-mono text-neutral-200 truncate max-w-[90px] sm:max-w-none">
              {currentMember?.name || session.name}
            </span>

            <div className="h-3 w-px bg-neutral-800 mx-0.5" />

            {/* Profile Edit button */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="swiss-focus text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1 transition-colors p-1 hover:bg-neutral-900"
              title="Edit Member Profile"
            >
              <UserCog className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline uppercase text-[11px]">Profile</span>
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="swiss-focus text-xs text-neutral-400 hover:text-red-400 transition-colors p-1"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="swiss-focus inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-neutral-950 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors"
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
