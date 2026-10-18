// components/BrandCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BrandCardProps } from '@/types/notion';
import StatusBadge from './StatusBadge';
import SkillMatrix from './SkillMatrix';
import { ArrowUpRight, Github } from 'lucide-react';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function BrandCard({ product, members, featured = false, index = 0 }: BrandCardProps) {
  const [imageError, setImageError] = useState(false);
  const relatedMembers = members.filter(
    (m) =>
      product.memberIds.includes(m.id) ||
      product.memberIds.some(
        (idOrName) =>
          idOrName.toLowerCase().trim() === m.name.toLowerCase().trim() ||
          idOrName.toLowerCase().includes(m.name.toLowerCase())
      )
  );
  const hasCoverImage = product.coverImage && !imageError;
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <article className="swiss-border overflow-hidden flex flex-col justify-between h-full group">
      {/* Unified Responsive Card Layout: Consistent size and structure on mobile, asymmetric in desktop bento */}
      <div className="flex flex-col justify-between h-full">
        {/* Cover Image Area with Swiss Planar Poster Fallback */}
        <div className="relative w-full h-48 sm:h-52 bg-neutral-950 flex items-center justify-center border-b border-neutral-800/80 overflow-hidden">
          {hasCoverImage ? (
            <Image
              src={product.coverImage!}
              alt={product.brandName}
              fill
              className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center px-4 sm:px-6 text-center select-none">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-1">
                PROJECT ARCHIVE
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tighter text-neutral-300 uppercase font-sans">
                {product.brandName.slice(0, 3)}
              </div>
            </div>
          )}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono uppercase tracking-widest bg-neutral-950/90 border border-neutral-700 text-white rounded-[4px]">
              {featured ? `${indexLabel} // FEATURED` : indexLabel}
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
            <StatusBadge status={product.status} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {product.brandName}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 line-clamp-2 leading-relaxed max-w-[65ch]">
              {product.oneLiner || 'Digital product designed and built by ShotShot Studio.'}
            </p>

            <div className="mt-3 sm:mt-4">
              <SkillMatrix skills={product.techStack} variant="featured" />
            </div>
          </div>

          {/* Footer: Related Members & Explicit Editorial Actions */}
          <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0">
              {relatedMembers.length > 0 ? (
                <>
                  <div className="flex -space-x-1 overflow-hidden items-center shrink-0">
                    {relatedMembers.map((m) => (
                      <div
                        key={m.id}
                        title={`${m.name} (${m.role})`}
                        className="relative w-7 h-7 bg-neutral-950 border border-neutral-700 overflow-hidden shrink-0 select-none flex items-center justify-center rounded-[3px]"
                      >
                        {m.avatarUrl ? (
                          <Image
                            src={m.avatarUrl}
                            alt={m.name}
                            fill
                            className="object-cover"
                            sizes="28px"
                          />
                        ) : (
                          <span className="text-xs font-mono font-bold text-neutral-200">
                            {getInitials(m.name)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="sm:hidden text-xs font-mono text-neutral-400 truncate">
                    {relatedMembers.map((m) => m.name.split(' ')[0]).join(', ')}
                  </span>
                </>
              ) : (
                <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                  STUDIO TEAM
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {product.internalLink && (
                <a
                  href={product.internalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${product.brandName} repository or documentation`}
                  className="swiss-focus inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:py-1 min-h-[34px] sm:min-h-0 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-600 bg-neutral-950 rounded-[4px] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>SOURCE</span>
                </a>
              )}
              {product.liveUrl && (
                <a
                  href={product.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${product.brandName} live deployment`}
                  className="swiss-focus inline-flex items-center gap-1 px-2.5 py-1.5 sm:py-1 min-h-[34px] sm:min-h-0 text-xs font-mono uppercase tracking-wider bg-white text-black hover:bg-neutral-200 font-medium rounded-[4px] transition-colors"
                >
                  <span>VISIT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

