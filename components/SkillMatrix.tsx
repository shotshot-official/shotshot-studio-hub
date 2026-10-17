// components/SkillMatrix.tsx
import React from 'react';
import { SkillMatrixProps } from '@/types/notion';

export default function SkillMatrix({ skills }: SkillMatrixProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {skills.map((skill) => (
        <span
          key={skill}
          className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800/60 text-neutral-300 border border-neutral-700/40"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
