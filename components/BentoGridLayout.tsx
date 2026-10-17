// components/BentoGridLayout.tsx
'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { BentoGridLayoutProps } from '@/types/notion';
import MemberCard from './MemberCard';
import BrandCard from './BrandCard';
import ProjectDrawer from './ProjectDrawer';
import { Plus } from 'lucide-react';

export default function BentoGridLayout({
  members,
  products,
  session,
  productsDbId,
}: BentoGridLayoutProps) {
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="@container w-full">
      {/* 01 // Team Members Section (4 Members x 3 Columns = 12 Track Grid) */}
      {members.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
              01 // Core Creative Team
            </span>
            <div className="h-px flex-1 bg-neutral-800/80" />
            <span className="text-xs text-neutral-500 font-mono">{members.length} Members</span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-12 gap-4"
          >
            {members.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className="col-span-1 @[640px]:col-span-1 @[1024px]:col-span-3"
              >
                <MemberCard member={member} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 02 // Products & Side Brands Section (12-Column Asymmetric Matrix) */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
            02 // Multi-Brand Portfolio Matrix
          </span>
          <div className="h-px flex-1 bg-neutral-800/80" />
          <span className="text-xs text-neutral-500 font-mono">{products.length} Projects</span>
          <button
            type="button"
            onClick={() => setIsProjectDrawerOpen(true)}
            className="swiss-focus inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all hover:bg-neutral-800 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-400" />
            <span>Launch Brand</span>
          </button>
        </div>

        {products.length === 0 ? (
          <div className="swiss-border rounded-xl bg-neutral-900/40 p-8 text-center backdrop-blur-sm border-dashed">
            <p className="text-xs font-mono text-neutral-400 mb-3">No side projects registered in Notion yet.</p>
            <button
              type="button"
              onClick={() => setIsProjectDrawerOpen(true)}
              className="swiss-focus inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch First Brand</span>
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 @[640px]:grid-cols-1 @[1024px]:grid-cols-12 gap-4"
          >
            {products.map((product, idx) => {
              // Asymmetric Bento Sizing:
              // - 1st item: 8 columns (Hero)
              // - 2nd item: 4 columns (Side)
              // - Remaining items: 6 columns (Half & Half)
              let colSpan = '@[1024px]:col-span-6';
              if (products.length >= 2) {
                if (idx === 0) colSpan = '@[1024px]:col-span-8';
                else if (idx === 1) colSpan = '@[1024px]:col-span-4';
              }

              return (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className={`col-span-1 ${colSpan}`}
                >
                  <BrandCard product={product} members={members} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* Slide-over Project Creation Drawer */}
      <ProjectDrawer
        isOpen={isProjectDrawerOpen}
        onClose={() => setIsProjectDrawerOpen(false)}
        members={members}
        session={session || null}
        productsDbId={productsDbId}
      />
    </div>
  );
}
