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
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="@container w-full">
      {/* 01 // Team Members Section (4 Members x 3 Columns = 12 Track Grid) */}
      {members.length > 0 && (
        <section id="team" className="mb-10 sm:mb-16 scroll-mt-6">
          <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3 mb-3 sm:mb-6 border-b border-neutral-800">
            <div className="flex items-baseline gap-2.5 sm:gap-3">
              <span className="text-xs font-mono font-bold text-white tracking-widest">01</span>
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-300 font-mono">
                TEAM
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
              {String(members.length).padStart(2, '0')} MEMBERS
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-12 gap-2 sm:gap-4"
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
      <section id="works" className="scroll-mt-6">
        <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3 mb-3 sm:mb-6 border-b border-neutral-800">
          <div className="flex items-baseline gap-2.5 sm:gap-3">
            <span className="text-xs font-mono font-bold text-white tracking-widest">02</span>
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-300 font-mono">
              SELECTED WORKS
            </h2>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
              {String(products.length).padStart(2, '0')} PROJECTS
            </span>
            <button
              type="button"
              onClick={() => setIsProjectDrawerOpen(true)}
              className="swiss-focus inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[34px] sm:min-h-0 text-xs font-mono uppercase tracking-wider bg-neutral-950 border border-neutral-700 hover:border-white text-neutral-200 hover:text-white rounded-[4px] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-400" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="swiss-border p-12 text-center border-dashed">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
              NO PROJECTS REGISTERED YET
            </p>
            <button
              type="button"
              onClick={() => setIsProjectDrawerOpen(true)}
              className="swiss-focus inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-medium bg-white text-black hover:bg-neutral-200 rounded-[4px] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Project</span>
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 @[768px]:grid-cols-2 @[1024px]:grid-cols-12 gap-3 sm:gap-4"
          >
            {products.map((product, idx) => {
              // Asymmetric Bento Sizing on 12-column desktop track:
              // - 1st item: 8 columns (Hero Flagship)
              // - 2nd item: 4 columns (Counterweight)
              // - Remaining items: 6 columns (Balanced Diptych), or 12 columns for trailing odd item
              let colSpan = '@[768px]:col-span-1 @[1024px]:col-span-6';
              if (products.length === 1) {
                colSpan = '@[768px]:col-span-2 @[1024px]:col-span-12';
              } else if (products.length >= 2) {
                if (idx === 0) colSpan = '@[768px]:col-span-2 @[1024px]:col-span-8';
                else if (idx === 1) colSpan = '@[768px]:col-span-1 @[1024px]:col-span-4';
                else if (idx === products.length - 1 && products.length % 2 === 1) {
                  colSpan = '@[768px]:col-span-2 @[1024px]:col-span-12';
                }
              }

              return (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className={`col-span-1 ${colSpan}`}
                >
                  <BrandCard
                    product={product}
                    members={members}
                    featured={idx === 0}
                    index={idx}
                  />
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
