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
    <article className="swiss-border bg-neutral-900/60 rounded-xl p-5 flex flex-col justify-between h-full backdrop-blur-sm">
      <div>
        {/* Top Header: Profile Avatar & Multi-Social Links Row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Profile Picture with Initials Fallback */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700/60 shrink-0 shadow-inner flex items-center justify-center">
            {hasAvatar ? (
              <Image
                src={member.avatarUrl!}
                alt={member.name}
                fill
                className="object-cover"
                sizes="48px"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="text-xs font-mono font-bold text-neutral-300 select-none">
                {getInitials(member.name)}
              </span>
            )}
          </div>

          {/* Social / Personal Links Bar (Instagram, Blog, GitHub, etc.) */}
          {links.length > 0 && (
            <div className="flex items-center gap-1">
              {links.map((url, idx) => {
                const { icon: Icon, label } = resolveSocialLink(url);
                return (
                  <a
                    key={`${url}-${idx}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${member.name} ${label}`}
                    aria-label={`${member.name} ${label}`}
                    className="swiss-focus text-neutral-400 hover:text-white p-1.5 rounded-md hover:bg-neutral-800/60 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Member Name & Role */}
        <h3 className="text-xl font-bold text-white tracking-tight">{member.name}</h3>
        <p className="text-sm text-neutral-400 mt-0.5 font-medium">{member.role}</p>
      </div>

      {/* Skills Matrix */}
      <div className="mt-4 pt-3 border-t border-neutral-800/60">
        <SkillMatrix skills={member.skills} />
      </div>
    </article>
  );
}
