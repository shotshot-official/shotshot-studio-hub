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
    <article className="swiss-border p-6 flex flex-col justify-between h-full group relative">
      <div>
        {/* Top Header: Architectural Square Avatar & Multi-Social Links Row */}
        <div className="flex items-start justify-between gap-3 mb-6">
          {/* Profile Picture with Monogram Fallback */}
          <div className="relative w-14 h-14 bg-neutral-950 border border-neutral-800 group-hover:border-neutral-600 transition-colors shrink-0 flex items-center justify-center overflow-hidden">
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
              <span className="text-sm font-mono font-bold tracking-wider text-neutral-200 select-none">
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
                    title={`${member.name} — ${label}`}
                    aria-label={`${member.name} ${label}`}
                    className="swiss-focus text-neutral-400 hover:text-white p-1.5 border border-transparent hover:border-neutral-700 hover:bg-neutral-950 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Discipline Role & Member Name (Swiss Weight Contrast) */}
        <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
          {member.role}
        </p>
        <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
          {member.name}
        </h3>
      </div>

      {/* Skills Specification Matrix */}
      <div className="mt-6 pt-4 border-t border-neutral-800/80">
        <SkillMatrix skills={member.skills} />
      </div>
    </article>
  );
}

