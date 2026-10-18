// components/ProductEditTrigger.tsx
'use client';

import React, { useState } from 'react';
import { ProductItem, TeamMember, AuthSession } from '@/types/notion';
import ProjectDrawer from './ProjectDrawer';
import { SlidersHorizontal } from 'lucide-react';

interface ProductEditTriggerProps {
  product: ProductItem;
  members: TeamMember[];
  session: AuthSession | null;
}

export default function ProductEditTrigger({
  product,
  members,
  session,
}: ProductEditTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="swiss-focus inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-widest bg-neutral-950 border border-neutral-700 hover:border-white text-neutral-200 hover:text-white transition-colors"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
        <span>EDIT SPECS</span>
      </button>

      <ProjectDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        members={members}
        session={session}
        initialProduct={product}
      />
    </>
  );
}
