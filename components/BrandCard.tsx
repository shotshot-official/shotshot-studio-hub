// components/BrandCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BrandCardProps } from '@/types/notion';
import { ArrowRight } from 'lucide-react';

export default function BrandCard({ product, index = 0 }: BrandCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasCoverImage = product.coverImage && !imageError;
  const indexLabel = String(index + 1).padStart(2, '0');
  const productHref = `/products/${encodeURIComponent(product.id)}`;

  return (
    <article className="swiss-border overflow-hidden flex flex-col justify-between h-full group">
      <Link
        href={productHref}
        className="swiss-focus flex flex-col justify-between h-full group/card"
        aria-label={`View ${product.brandName} project details`}
      >
        {/* Cover Image Area */}
        <div className="relative w-full h-48 sm:h-52 bg-neutral-950 flex items-center justify-center border-b border-neutral-800/80 overflow-hidden">
          {hasCoverImage ? (
            <Image
              src={product.coverImage!}
              alt={product.brandName}
              fill
              className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover/card:scale-[1.03]"
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
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex items-center gap-1.5">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono uppercase tracking-widest bg-neutral-950/90 border border-neutral-700 text-white rounded-[4px]">
              {indexLabel}
            </span>
            {product.category && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-mono uppercase tracking-wider bg-neutral-950/90 border border-neutral-800 text-neutral-300 rounded-[4px]">
                {product.category}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover/card:text-neutral-200 tracking-tight leading-snug transition-colors">
                {product.brandName}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-neutral-400 group-hover/card:text-white transition-colors shrink-0">
                <span>DETAILS</span>
                <ArrowRight className="w-3.5 h-3.5 motion-safe:group-hover/card:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 line-clamp-2 leading-relaxed break-keep">
              {product.oneLiner || 'Digital product designed and built by ShotShot Studio.'}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
