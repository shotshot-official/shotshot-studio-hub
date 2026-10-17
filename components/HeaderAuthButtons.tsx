// components/HeaderAuthButtons.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LogIn, UserCog, LogOut } from 'lucide-react';
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
    ? members.find((m) => m.id === session.memberId)
    : undefined;

  async function handleLogout() {
    await logoutAction();
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {session ? (
          <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-full pl-2 pr-3 py-1">
            {/* Avatar thumbnail */}
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0 flex items-center justify-center">
              {currentMember?.avatarUrl || session.avatarUrl ? (
                <Image
                  src={currentMember?.avatarUrl || session.avatarUrl!}
                  alt={session.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              ) : (
                <span className="text-[10px] font-mono font-bold text-neutral-300">
                  {session.name.slice(0, 1)}
                </span>
              )}
            </div>

            <span className="text-xs font-medium text-white truncate max-w-[100px] sm:max-w-none">
              {currentMember?.name || session.name}
            </span>

            <div className="h-3 w-px bg-neutral-800 mx-1" />

            {/* Profile Edit button */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="swiss-focus text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors p-1 rounded hover:bg-neutral-800/80"
              title="Edit Member Profile"
            >
              <UserCog className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="swiss-focus text-xs text-neutral-500 hover:text-red-400 transition-colors p-1 rounded"
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
            className="swiss-focus inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white transition-all shadow-sm hover:bg-neutral-800/60"
          >
            <LogIn className="w-3.5 h-3.5 text-neutral-400" />
            <span>Team Access</span>
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
