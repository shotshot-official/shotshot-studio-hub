// components/ShimmerCta.tsx
'use client';

import React, { MouseEvent } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ShimmerCtaProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  ariaLabel?: string;
}

/**
 * Magnetic Pull + Conic Shimmer CTA Button
 * - Follows cursor with subtle magnetic spring pull
 * - Traveling 360deg conic shimmer beam along perimeter
 */
export default function ShimmerCta({
  href,
  onClick,
  children,
  icon = (
    <ArrowUpRight className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
  ),
  variant = 'primary',
  className = '',
  ariaLabel,
}: ShimmerCtaProps) {
  const isPrimary = variant === 'primary';
  const shouldReduceMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 280, damping: 18, mass: 0.4 });
  const springY = useSpring(rawY, { stiffness: 280, damping: 18, mass: 0.4 });

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    rawX.set(deltaX * 0.22);
    rawY.set(deltaY * 0.3);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const content = (
    <span
      className={`relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-[3px] font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
        isPrimary
          ? 'bg-white text-black group-hover:bg-neutral-100 px-6 py-3.5'
          : 'bg-neutral-950 text-neutral-200 group-hover:text-white px-3 py-1.5'
      }`}
    >
      <span>{children}</span>
      {icon}
    </span>
  );

  const containerClasses = `group relative inline-flex items-center justify-center overflow-hidden rounded-[4px] p-[1px] swiss-focus transition-shadow ${
    isPrimary
      ? 'w-full sm:w-auto shadow-[0_0_20px_-8px_rgba(255,255,255,0.45)] hover:shadow-[0_0_32px_-4px_rgba(255,255,255,0.75)]'
      : 'border border-neutral-700/80 hover:border-neutral-400'
  } ${className}`;

  const shimmerBeam = (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-[-100%] motion-safe:animate-[spin_3.5s_linear_infinite] motion-reduce:hidden ${
        isPrimary
          ? 'bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_300deg,rgba(0,0,0,0.85)_335deg,white_360deg)]'
          : 'bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_300deg,rgba(255,255,255,0.15)_335deg,rgba(255,255,255,0.9)_360deg)]'
      }`}
    />
  );

  const motionStyle = shouldReduceMotion ? undefined : { x: springX, y: springY };

  if (href) {
    if (href.startsWith('mailto:') || href.startsWith('http')) {
      return (
        <motion.a
          href={href}
          aria-label={ariaLabel}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={motionStyle}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          className={containerClasses}
        >
          {shimmerBeam}
          {content}
        </motion.a>
      );
    }
    return (
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={motionStyle}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        className="inline-flex w-full sm:w-auto"
      >
        <Link href={href} aria-label={ariaLabel} className={containerClasses}>
          {shimmerBeam}
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={motionStyle}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      className={containerClasses}
    >
      {shimmerBeam}
      {content}
    </motion.button>
  );
}
