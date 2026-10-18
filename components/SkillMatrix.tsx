// components/SkillMatrix.tsx
import React from 'react';
import { SkillMatrixProps } from '@/types/notion';

export default function SkillMatrix({ skills, variant = 'default' }: SkillMatrixProps) {
  if (!skills || skills.length === 0) return null;

  const mobileSkills = skills.slice(0, 3);
  const remainingMobileCount = Math.max(0, skills.length - mobileSkills.length);

  // On Member summary cards, cap desktop chips at 4 to prevent 23-chip visual noise across 4 columns
  const desktopLimit = variant === 'member' ? 4 : skills.length;
  const desktopSkills = skills.slice(0, desktopLimit);
  const remainingDesktopCount = Math.max(0, skills.length - desktopSkills.length);

  return (
    <>
      {/* Mobile (<sm): Compact Swiss Typographic Specification Line */}
      {variant === 'member' ? (
        <div className="sm:hidden flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 truncate">
          <span className="truncate">{mobileSkills.join(' · ')}</span>
          {remainingMobileCount > 0 && (
            <span className="text-neutral-300 shrink-0">+{remainingMobileCount}</span>
          )}
        </div>
      ) : (
        <ul className="sm:hidden flex flex-wrap gap-1.5" aria-label="Capabilities and technologies">
          {(variant === 'detail' ? skills : skills.slice(0, 4)).map((skill) => (
            <li
              key={skill}
              className="text-xs font-mono tracking-tight uppercase px-2 py-0.5 bg-neutral-950/90 text-neutral-300 border border-neutral-800 rounded-[4px]"
            >
              {skill}
            </li>
          ))}
          {variant !== 'detail' && skills.length > 4 && (
            <li className="text-xs font-mono tracking-tight uppercase px-1.5 py-0.5 bg-neutral-950 text-neutral-400 border border-neutral-800 rounded-[4px]">
              +{skills.length - 4}
            </li>
          )}
        </ul>
      )}

      {/* Tablet & Desktop (sm+): Rectilinear Specification Chips */}
      <ul className="hidden sm:flex flex-wrap gap-1.5" aria-label="Capabilities and technologies">
        {desktopSkills.map((skill) => (
          <li
            key={skill}
            className="text-xs font-mono tracking-tight uppercase px-2 py-0.5 bg-neutral-950/90 text-neutral-300 border border-neutral-800 rounded-[4px] transition-colors"
          >
            {skill}
          </li>
        ))}
        {remainingDesktopCount > 0 && (
          <li className="text-xs font-mono tracking-tight uppercase px-1.5 py-0.5 bg-neutral-950 text-neutral-400 border border-neutral-800 rounded-[4px]">
            +{remainingDesktopCount}
          </li>
        )}
      </ul>
    </>
  );
}


