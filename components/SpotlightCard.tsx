// components/SpotlightCard.tsx
'use client';

import React, { MouseEvent } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
  maxTilt?: number;
  onCardHover?: () => void;
}

/**
 * Aceternity UI 3D Card Effect + Glare Card + Spotlight Border
 * - 3D perspective spring tilt (rotateX, rotateY) on cursor movement
 * - Tactile surface glare reflection + 1px razor-sharp border reveal
 * - Zero React state re-renders during pointer tracking
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.085)',
  borderColor = 'rgba(255, 255, 255, 0.55)',
  maxTilt = 4.5,
  onCardHover,
}: SpotlightCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // Pixel coordinates for radial glare & border mask
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Target tilt angles in degrees
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  // Smooth spring physics for 3D tilt
  const rotateX = useSpring(rawRotateX, {
    stiffness: 260,
    damping: 22,
    mass: 0.5,
  });
  const rotateY = useSpring(rawRotateY, {
    stiffness: 260,
    damping: 22,
    mass: 0.5,
  });

  function handleMouseEnter() {
    if (onCardHover) {
      onCardHover();
    }
  }

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    if (!shouldReduceMotion && rect.width > 0 && rect.height > 0) {
      // Normalized -0.5 to +0.5 from center
      const pctX = x / rect.width - 0.5;
      const pctY = y / rect.height - 0.5;

      rawRotateX.set(pctY * -maxTilt * 2);
      rawRotateY.set(pctX * maxTilt * 2);
    }
  }

  function handleMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  return (
    <div className="h-full [perspective:1100px]">
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.008 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`group relative overflow-hidden rounded-[var(--radius-card)] border border-neutral-800/80 bg-[var(--color-surface-card)] transition-[border-color,background-color,box-shadow] duration-300 hover:border-neutral-700 hover:bg-[var(--color-surface-hover)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.75)] ${className}`}
      >
        {/* 1. Tactile Glare Sheen on card surface (tracks cursor) */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[var(--radius-card)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                340px circle at ${mouseX}px ${mouseY}px,
                ${spotlightColor},
                transparent 75%
              )
            `,
          }}
          aria-hidden="true"
        />

        {/* 2. Precision 1px Border Highlight mask (reveals crisp white border under cursor) */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[var(--radius-card)] border opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20"
          style={{
            borderColor,
            maskImage: useMotionTemplate`
              radial-gradient(
                220px circle at ${mouseX}px ${mouseY}px,
                black 0%,
                transparent 100%
              )
            `,
            WebkitMaskImage: useMotionTemplate`
              radial-gradient(
                220px circle at ${mouseX}px ${mouseY}px,
                black 0%,
                transparent 100%
              )
            `,
          }}
          aria-hidden="true"
        />

        {/* 3. Card Content Layer */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
