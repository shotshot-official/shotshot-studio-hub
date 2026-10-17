// components/BrandCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BrandCardProps } from '@/types/notion';
import StatusBadge from './StatusBadge';
import SkillMatrix from './SkillMatrix';
import { ArrowUpRight, Github } from 'lucide-react';

export default function BrandCard({ product, members }: BrandCardProps) {
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

  return (
    <article className="swiss-border overflow-hidden flex flex-col justify-between h-full group">
      {/* Cover Image Area with Swiss Planar Poster Fallback */}
      <div className="relative w-full h-52 bg-neutral-950 flex items-center justify-center border-b border-neutral-800/80 overflow-hidden">
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
          <div className="flex flex-col items-center justify-center px-6 text-center select-none">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-1">
              PROJECT ARCHIVE
            </span>
            <div className="text-4xl font-black tracking-tighter text-neutral-300 uppercase font-sans">
              {product.brandName.slice(0, 3)}
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={product.status} />
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
            {product.brandName}
          </h3>
          <p className="text-sm text-neutral-300 mt-2 line-clamp-2 leading-relaxed max-w-[65ch]">
            {product.oneLiner || 'Digital product designed and built by ShotShot Studio.'}
          </p>

          <div className="mt-4">
            <SkillMatrix skills={product.techStack} />
          </div>
        </div>

        {/* Footer: Related Members & Explicit Editorial Actions */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {relatedMembers.length > 0 ? (
              <div className="flex -space-x-1 overflow-hidden items-center">
                {relatedMembers.map((m) => (
                  <div
                    key={m.id}
                    title={`${m.name} (${m.role})`}
                    className="relative w-7 h-7 bg-neutral-950 border border-neutral-700 overflow-hidden shrink-0 select-none flex items-center justify-center"
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
                      <span className="text-[10px] font-mono font-bold text-neutral-200">
                        {m.name.slice(0, 1)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                STUDIO TEAM
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.internalLink && (
              <a
                href={product.internalLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${product.brandName} repository or documentation`}
                className="swiss-focus inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-600 bg-neutral-950 transition-colors"
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
                className="swiss-focus inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-white text-black hover:bg-neutral-200 font-medium transition-colors"
              >
                <span>VISIT</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

