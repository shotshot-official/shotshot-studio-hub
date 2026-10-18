// components/SkillMatrix.tsx
import React from 'react';
import { SkillMatrixProps } from '@/types/notion';

export default function SkillMatrix({ skills, variant = 'default' }: SkillMatrixProps) {
  if (!skills || skills.length === 0) return null;

  const mobileSkills = skills.slice(0, 3);
  const remainingCount = Math.max(0, skills.length - mobileSkills.length);

  return (
    <>
      {/* Mobile (<sm): Compact Swiss Typographic Specification Line to eliminate 40+ box-in-box clutter */}
      {variant === 'member' ? (
        <div className="sm:hidden flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 truncate">
          <span className="truncate">{mobileSkills.join(' · ')}</span>
          {remainingCount > 0 && (
            <span className="text-neutral-300 shrink-0">+{remainingCount}</span>
          )}
        </div>
      ) : (
        <div className="sm:hidden flex flex-wrap gap-1.5 mt-2.5">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs font-mono tracking-tight uppercase px-2 py-0.5 bg-neutral-950/90 text-neutral-300 border border-neutral-800 rounded-[3px]"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-xs font-mono tracking-tight uppercase px-1.5 py-0.5 text-neutral-400">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Tablet & Desktop (sm+): Micro-radius Specification Chips */}
      <div className="hidden sm:flex flex-wrap gap-1.5 mt-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-xs font-mono tracking-tight uppercase px-2 py-0.5 bg-neutral-950/90 text-neutral-300 border border-neutral-800 rounded-[3px] transition-colors hover:border-neutral-600 hover:text-white"
          >
            {skill}
          </span>
        ))}
      </div>
    </>
  );
}

