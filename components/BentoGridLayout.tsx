// components/BentoGridLayout.tsx
'use client';

import React, { useState, useMemo } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const shouldReduceMotion = useReducedMotion();

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.category) set.add(p.category);
    }
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      return selectedCategory === 'ALL' || p.category === selectedCategory;
    });
  }, [products, selectedCategory]);

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

  function handleOpenNewProject() {
    if (!session) {
      window.dispatchEvent(new CustomEvent('open-auth-drawer'));
      return;
    }
    setIsProjectDrawerOpen(true);
  }

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
                <MemberCard member={member} products={products} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 02 // Products & Side Brands Section (12-Column Asymmetric Matrix) */}
      <section id="works" className="scroll-mt-6">
        <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3 mb-3 sm:mb-4 border-b border-neutral-800">
          <div className="flex items-baseline gap-2.5 sm:gap-3">
            <span className="text-xs font-mono font-bold text-white tracking-widest">02</span>
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-300 font-mono">
              SELECTED WORKS
            </h2>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
              {String(filteredProducts.length).padStart(2, '0')} / {String(products.length).padStart(2, '0')} PROJECTS
            </span>
            <button
              type="button"
              onClick={handleOpenNewProject}
              className="swiss-focus inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[34px] sm:min-h-0 text-xs font-mono uppercase tracking-wider bg-neutral-950 border border-neutral-700 hover:border-white text-neutral-200 hover:text-white rounded-[4px] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-400" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Interactive Category Filter Bar */}
        {products.length > 0 && categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-5 pb-3 border-b border-neutral-800/60" role="group" aria-label="Filter projects by category">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  className={`swiss-focus px-2.5 py-1 text-xs font-mono uppercase tracking-wider border rounded-[4px] transition-colors ${
                    isActive
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="swiss-border p-12 text-center border-dashed">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
              {products.length === 0
                ? 'NO PROJECTS REGISTERED YET'
                : 'NO PROJECTS MATCH THE SELECTED FILTER'}
            </p>
            {products.length === 0 ? (
              <button
                type="button"
                onClick={handleOpenNewProject}
                className="swiss-focus inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-medium bg-white text-black hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Project</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                }}
                className="swiss-focus inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-medium bg-neutral-900 border border-neutral-700 text-white hover:border-white transition-colors"
              >
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        ) : (
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 @[768px]:grid-cols-2 @[1024px]:grid-cols-12 gap-3 sm:gap-4"
          >
            {filteredProducts.map((product, idx) => {
              let colSpan = '@[768px]:col-span-1 @[1024px]:col-span-6';
              if (filteredProducts.length === 1) {
                colSpan = '@[768px]:col-span-2 @[1024px]:col-span-12';
              } else if (filteredProducts.length >= 2) {
                if (idx === 0) colSpan = '@[768px]:col-span-2 @[1024px]:col-span-8';
                else if (idx === 1) colSpan = '@[768px]:col-span-1 @[1024px]:col-span-4';
                else if (idx === filteredProducts.length - 1 && filteredProducts.length % 2 === 1) {
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
                    featured={idx === 0 && selectedCategory === 'ALL'}
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
