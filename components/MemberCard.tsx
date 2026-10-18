// components/MemberCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MemberCardProps } from '@/types/notion';
import SkillMatrix from './SkillMatrix';
import { resolveSocialLink } from '@/lib/social-links';
import { ArrowUpRight } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

// Extracts 2 initials from member name (e.g. "Alex Kim" -> "AK")
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function MemberCard({ member, products = [] }: MemberCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [hoveredSocialIdx, setHoveredSocialIdx] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Normalize links: support personalLinks array or legacy personalLink string
  const links =
    member.personalLinks && member.personalLinks.length > 0
      ? member.personalLinks
      : member.personalLink
      ? [member.personalLink]
      : [];

  const hasAvatar = member.avatarUrl && !avatarError;
  const memberHref = `/members/${encodeURIComponent(member.id)}`;

  return (
    <SpotlightCard className="p-3.5 sm:p-6 h-full" maxTilt={4}>
      <div>
        {/* Top Header: Compact Horizontal Dossier Row on Mobile (<sm), Architectural Avatar Row on Desktop (sm+) */}
        <div className="flex items-center sm:items-start justify-between gap-3 sm:mb-5">
          <Link
            href={memberHref}
            className="swiss-focus flex items-center gap-3 min-w-0 flex-1 group/link"
            aria-label={`View ${member.name} profile`}
          >
            {/* Profile Picture with Monogram Fallback & Circular Frame */}
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-neutral-950 border border-neutral-800 group-hover:border-neutral-400 motion-safe:transition-all motion-safe:duration-300 motion-safe:group-hover:scale-105 shrink-0 flex items-center justify-center overflow-hidden">
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

            {/* Mobile Inline Identity (<sm) */}
            <div className="sm:hidden min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white tracking-tight leading-snug truncate">
                  {member.name}
                </h3>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 truncate mt-0.5">
                {member.role}
              </p>
            </div>
          </Link>

          {/* Social / Personal Links Bar with Spring Dock Magnification & Pop Tooltip */}
          {links.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-1 shrink-0">
              {links.map((url, idx) => {
                const { icon: Icon, label } = resolveSocialLink(url);
                const isSocialHovered = hoveredSocialIdx === idx;
                return (
                  <motion.div
                    key={`${url}-${idx}`}
                    className="relative"
                    onMouseEnter={() => setHoveredSocialIdx(idx)}
                    onMouseLeave={() => setHoveredSocialIdx(null)}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : { scale: 1.18, y: -3, rotate: idx % 2 === 0 ? -5 : 5 }
                    }
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  >
                    <AnimatePresence>
                      {isSocialHovered && (
                        <motion.span
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: 6, scale: 0.85 }
                          }
                          animate={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { opacity: 1, y: 0, scale: 1 }
                          }
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: 3, scale: 0.9 }
                          }
                          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                          className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-[3px] bg-white px-1.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-black shadow-md"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} ${label}`}
                      className="swiss-focus text-neutral-400 hover:text-white w-8 h-8 sm:w-7 sm:h-7 inline-flex items-center justify-center rounded-full border border-neutral-800/80 hover:border-white/60 bg-neutral-950/60 hover:bg-neutral-900 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop Stacked Discipline Role & Member Name (sm+) */}
        <Link
          href={memberHref}
          className="swiss-focus hidden sm:block group/title"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1 truncate">
            {member.role}
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-2xl font-bold text-white group-hover/title:text-neutral-200 tracking-tight leading-snug transition-colors">
              {member.name}
            </h3>
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-neutral-800 group-hover/title:border-white/60 bg-neutral-950/80 text-neutral-400 group-hover/title:text-white transition-all shrink-0"
              aria-hidden="true"
            >
              <ArrowUpRight className="w-3.5 h-3.5 motion-safe:group-hover/title:translate-x-0.5 motion-safe:group-hover/title:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Skills Matrix */}
        <div className="mt-3.5 sm:mt-4">
          <SkillMatrix skills={member.skills} variant="member" />
        </div>
      </div>
    </SpotlightCard>
  );
}
