// components/BrandCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BrandCardProps } from '@/types/notion';
import StatusBadge from './StatusBadge';
import SkillMatrix from './SkillMatrix';
import { ExternalLink, Github } from 'lucide-react';

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
    <article className="swiss-border bg-neutral-900/60 rounded-xl overflow-hidden flex flex-col justify-between h-full backdrop-blur-sm">
      {/* Cover Image Area with Graceful Dark Gradient Fallback */}
      <div className="relative w-full h-44 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex items-center justify-center border-b border-neutral-800/60 overflow-hidden">
        {hasCoverImage ? (
          <Image
            src={product.coverImage!}
            alt={product.brandName}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-3xl font-black tracking-widest text-neutral-700/80 uppercase font-mono select-none">
            {product.brandName.slice(0, 3)}
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={product.status} />
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">{product.brandName}</h3>
          <p className="text-sm text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
            {product.oneLiner || 'No description provided.'}
          </p>

          <SkillMatrix skills={product.techStack} />
        </div>

        {/* Footer: Related Members & External Actions */}
        <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between">
          <div className="flex -space-x-1.5 overflow-hidden items-center">
            {relatedMembers.length > 0 ? (
              relatedMembers.map((m) => (
                <div
                  key={m.id}
                  title={`${m.name} (${m.role})`}
                  className="relative w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0 select-none shadow-sm flex items-center justify-center"
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
                    <span className="text-[10px] font-mono font-medium text-neutral-200">
                      {m.name.slice(0, 1)}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-xs text-neutral-500 font-mono">Team Project</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.internalLink && (
              <a
                href={product.internalLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${product.brandName} internal repository or docs`}
                className="swiss-focus text-neutral-400 hover:text-white p-1.5 rounded transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {product.liveUrl && (
              <a
                href={product.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${product.brandName} live service demo`}
                className="swiss-focus text-neutral-400 hover:text-white p-1.5 rounded transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
