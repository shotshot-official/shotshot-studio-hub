// components/StatusBadge.tsx
import React from 'react';
import { StatusBadgeProps } from '@/types/notion';

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Available':
      case 'Active':
        return {
          indicator: 'bg-[var(--color-status-available)]',
          text: 'text-emerald-300',
          border: 'border-emerald-700/60 bg-neutral-950/90',
          code: 'ACTIVE',
        };
      case 'In Project':
      case 'In Development':
        return {
          indicator: 'bg-[var(--color-status-inproject)]',
          text: 'text-sky-300',
          border: 'border-sky-700/60 bg-neutral-950/90',
          code: status === 'In Development' ? 'IN DEV' : 'IN PROJECT',
        };
      case 'Busy':
        return {
          indicator: 'bg-[var(--color-status-busy)]',
          text: 'text-amber-300',
          border: 'border-amber-700/60 bg-neutral-950/90',
          code: 'BUSY',
        };
      case 'Away':
      case 'Archived':
      case 'Concept':
      default:
        return {
          indicator: 'bg-[var(--color-status-away)]',
          text: 'text-neutral-300',
          border: 'border-neutral-700 bg-neutral-950/90',
          code: status ? status.toUpperCase() : 'CONCEPT',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase border ${style.border} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 shrink-0 ${style.indicator}`} />
      <span>{style.code}</span>
    </span>
  );
}

