// components/NotionBlocksRenderer.tsx
import React from 'react';
import { ContentBlock } from '@/types/notion';

interface NotionBlocksRendererProps {
  blocks: ContentBlock[];
}

export default function NotionBlocksRenderer({ blocks }: NotionBlocksRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading_1':
            return (
              <h2
                key={block.id}
                className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight pt-10 first:pt-0 border-b border-neutral-800/60 pb-3"
              >
                {block.text}
              </h2>
            );
          case 'heading_2':
            return (
              <h3
                key={block.id}
                className="text-xl sm:text-2xl font-semibold font-sans tracking-tight text-white pt-8 first:pt-0 mb-2"
              >
                {block.text}
              </h3>
            );
          case 'heading_3':
            return (
              <h4
                key={block.id}
                className="text-base sm:text-lg font-medium font-sans text-neutral-200 pt-4 first:pt-0 mb-1"
              >
                {block.text}
              </h4>
            );
          case 'bulleted_list_item':
          case 'numbered_list_item':
            return (
              <div
                key={block.id}
                className="flex items-baseline gap-3 pl-1 text-base text-neutral-300 leading-relaxed max-w-3xl break-keep"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 shrink-0" />
                <span>{block.text}</span>
              </div>
            );
          case 'quote':
            return (
              <blockquote
                key={block.id}
                className="border-l-2 border-white/70 pl-6 py-2 my-8 text-lg sm:text-xl font-sans text-neutral-200 font-light italic leading-relaxed max-w-3xl break-keep"
              >
                &ldquo;{block.text}&rdquo;
              </blockquote>
            );
          case 'callout':
            return (
              <div
                key={block.id}
                className="p-5 bg-neutral-900/30 border border-neutral-800/70 rounded-[4px] text-base text-neutral-200 font-sans leading-relaxed break-keep max-w-3xl"
              >
                {block.text}
              </div>
            );
          case 'divider':
            return <hr key={block.id} className="border-neutral-800/60 my-8" />;
          case 'paragraph':
          default:
            return (
              <p
                key={block.id}
                className="text-base sm:text-lg text-neutral-300 leading-relaxed font-sans max-w-3xl break-keep"
              >
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
