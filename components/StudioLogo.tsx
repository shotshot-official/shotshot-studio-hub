// components/StudioLogo.tsx
'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface StudioLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  interactive?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<StudioLogoProps['size']>, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-8 h-8 sm:w-11 sm:h-11',
  lg: 'w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14',
};

/**
 * SHOTSHOT Studio Interlocking Viewfinder Bracket Logo
 * - Pure 2-bracket geometry (no stray flying elements or broken SVG transform origins)
 * - Mount: Clean stroke drawing of the two interlocking L-brackets
 * - Hover: Tactile camera lens-ring 90° snap rotation strictly in place
 */
export default function StudioLogo({
  size = 'lg',
  className = '',
  interactive = true,
}: StudioLogoProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleClick = () => {
    if (interactive && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shotshot:replay-intro'));
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={
        interactive && !shouldReduceMotion
          ? { rotate: 90, scale: 1.05 }
          : undefined
      }
      whileTap={
        interactive && !shouldReduceMotion
          ? { scale: 0.92 }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${SIZE_CLASSES[size]} ${className}`}
      title={interactive ? 'SHOTSHOT Studio (Click to replay intro)' : 'SHOTSHOT Studio'}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        fill="none"
        className="block text-white"
      >
        <g
          stroke="currentColor"
          strokeWidth="24"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {/* Top-Left Bracket ┌ */}
          <motion.path
            id="frame-top-left"
            d="M 140 45 H 45 V 140"
            initial={
              shouldReduceMotion
                ? false
                : { pathLength: 0, opacity: 0 }
            }
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2 },
            }}
          />

          {/* Bottom-Right Bracket ┘ */}
          <motion.path
            id="frame-bottom-right"
            d="M 60 155 H 155 V 60"
            initial={
              shouldReduceMotion
                ? false
                : { pathLength: 0, opacity: 0 }
            }
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
              opacity: { duration: 0.2, delay: 0.08 },
            }}
          />
        </g>
      </svg>
    </motion.div>
  );
}
