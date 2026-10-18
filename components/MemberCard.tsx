// components/MemberCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MemberCardProps } from '@/types/notion';
import SkillMatrix from './SkillMatrix';
import { resolveSocialLink } from '@/lib/social-links';

// Extracts 2 initials from member name (e.g. "Alex Kim" -> "AK")
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function MemberCard({ member }: MemberCardProps) {
  const [avatarError, setAvatarError] = useState(false);

  // Normalize links: support personalLinks array or legacy personalLink string
  const links =
    member.personalLinks && member.personalLinks.length > 0
      ? member.personalLinks
      : member.personalLink
      ? [member.personalLink]
      : [];

  const hasAvatar = member.avatarUrl && !avatarError;

  return (
    <article className="swiss-border p-3.5 sm:p-6 flex flex-col justify-between h-full group relative overflow-hidden">
      <div>
        {/* Top Header: Compact Horizontal Dossier Row on Mobile (<sm), Architectural Avatar Row on Desktop (sm+) */}
        <div className="flex items-center sm:items-start justify-between gap-3 sm:mb-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Profile Picture with Monogram Fallback & Micro-radius Polaroid Frame */}
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 bg-neutral-950 border border-neutral-800 group-hover:border-neutral-600 transition-colors shrink-0 flex items-center justify-center overflow-hidden rounded-[6px]">
              {hasAvatar ? (
                <Image
                  src={member.avatarUrl!}
                  alt={member.name}
                  fill
                  className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                  sizes="56px"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-neutral-200 select-none">
                  {getInitials(member.name)}
                </span>
              )}
            </div>

            {/* Mobile Inline Identity (<sm): Eliminates 75% empty horizontal row space */}
            <div className="sm:hidden min-w-0 flex-1">
              <h3 className="text-base font-bold text-white tracking-tight leading-snug truncate">
                {member.name}
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 truncate mt-0.5">
                {member.role}
              </p>
            </div>
          </div>

          {/* Social / Personal Links Bar (Touch-friendly 32x32px targets on mobile) */}
          {links.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-1 shrink-0">
              {links.map((url, idx) => {
                const { icon: Icon, label } = resolveSocialLink(url);
                return (
                  <a
                    key={`${url}-${idx}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${member.name} — ${label}`}
                    aria-label={`${member.name} ${label}`}
                    className="swiss-focus text-neutral-400 hover:text-white w-8 h-8 sm:w-auto sm:h-auto sm:p-1.5 inline-flex items-center justify-center border border-neutral-800/80 sm:border-transparent hover:border-neutral-700 bg-neutral-950/60 sm:bg-transparent hover:bg-neutral-950 rounded-[4px] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop Stacked Discipline Role & Member Name (sm+) */}
        <div className="hidden sm:block">
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
            {member.role}
          </p>
          <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
            {member.name}
          </h3>
        </div>
      </div>

      {/* Skills Specification Matrix: 1-line typographic spec on mobile, full chip matrix on sm+ */}
      <div className="mt-2.5 pt-2.5 sm:mt-6 sm:pt-4 border-t border-neutral-800/80">
        <SkillMatrix skills={member.skills} variant="member" />
      </div>
    </article>
  );
}

