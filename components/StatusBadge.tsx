// components/StatusBadge.tsx
import React from 'react';
import { StatusBadgeProps } from '@/types/notion';

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Available':
      case 'Active':
        return {
          dot: 'bg-emerald-400',
          text: 'text-emerald-300',
          bg: 'bg-emerald-950/40 border-emerald-800/40',
        };
      case 'In Project':
      case 'In Development':
        return {
          dot: 'bg-sky-400',
          text: 'text-sky-300',
          bg: 'bg-sky-950/40 border-sky-800/40',
        };
      case 'Busy':
        return {
          dot: 'bg-amber-400',
          text: 'text-amber-300',
          bg: 'bg-amber-950/40 border-amber-800/40',
        };
      case 'Away':
      case 'Archived':
      case 'Concept':
      default:
        return {
          dot: 'bg-neutral-400',
          text: 'text-neutral-400',
          bg: 'bg-neutral-900 border-neutral-800',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
