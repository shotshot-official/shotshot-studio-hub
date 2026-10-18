// components/IntroSplashScreen.tsx
'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const SESSION_STORAGE_KEY = 'shotshot_intro_seen_v3';
export const REPLAY_INTRO_EVENT = 'shotshot:replay-intro';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface FlipMetrics {
  deltaX: number;
  deltaY: number;
  heroScale: number;
  slamOffset: number;
}

const PRIMARY_WORD = 'SHOTSHOT'.split('');
const SECONDARY_WORD = 'STUDIO'.split('');

/**
 * High-Impact Kinetic Intro & Zero-Blink FLIP Header Transition
 * - Mobile-safe bounding math: guarantees 0px horizontal/vertical clipping on 320px~430px viewports
 * - Negative-margin expanded character masks (px-[0.14em] -mx-[0.14em] h-[1.08em]) so skewX/scaleX/italic never slice glyphs
 * - 1:1 native H1 handoff with requestAnimationFrame overlap so merging into #studio-brand-anchor has zero blink
 */
export default function IntroSplashScreen() {
  const shouldReduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<
    'checking' | 'enter' | 'flip' | 'handoff' | 'done'
  >('checking');

  const [metrics, setMetrics] = useState<FlipMetrics>({
    deltaX: 0,
    deltaY: 0,
    heroScale: 1.15,
    slamOffset: 12,
  });

  const splashLockupRef = useRef<HTMLDivElement>(null);

  const setHeaderAnchorOpacity = useCallback((visible: boolean) => {
    if (typeof document === 'undefined') return;
    const anchorEl = document.getElementById('studio-brand-anchor');
    if (anchorEl) {
      anchorEl.style.transition = 'none';
      anchorEl.style.opacity = visible ? '1' : '0';
    }
  }, []);

  const measureFlipDelta = useCallback((): FlipMetrics | null => {
    if (typeof window === 'undefined') return null;
    const anchorEl = document.getElementById('studio-brand-anchor');
    if (!anchorEl) return null;

    const targetRect = anchorEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const viewportCenterX = vw / 2;
    const viewportCenterY = vh / 2;

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const isMobile = vw < 640;
    const isDesktop = vw >= 1024;
    const slamOffset = isMobile ? 10 : 28;

    // Account for initial horizontal slam spread so even at t=0 the lockup stays strictly inside the viewfinder frame
    const safeViewportWidth = isMobile ? vw - 44 : vw * 0.84;
    const effectiveBaseWidth = targetRect.width + slamOffset * 1.5;

    const maxCap = isDesktop ? 2.45 : isMobile ? 1.16 : 1.75;
    const minCap = isMobile ? 0.96 : 1.1;

    const computedScale =
      effectiveBaseWidth > 0
        ? Math.max(minCap, Math.min(maxCap, safeViewportWidth / effectiveBaseWidth))
        : 1.1;

    return {
      deltaX: targetCenterX - viewportCenterX,
      deltaY: targetCenterY - viewportCenterY,
      heroScale: computedScale,
      slamOffset,
    };
  }, []);

  const triggerIntro = useCallback(
    (forceReplay = false) => {
      if (typeof window === 'undefined') return;

      if (shouldReduceMotion) {
        setHeaderAnchorOpacity(true);
        setPhase('done');
        return;
      }

      if (!forceReplay) {
        try {
          if (window.sessionStorage.getItem(SESSION_STORAGE_KEY) === '1') {
            setHeaderAnchorOpacity(true);
            setPhase('done');
            return;
          }
        } catch {
          // Ignore storage restrictions
        }
      }

      if (window.scrollY > 5 && forceReplay) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      const m = measureFlipDelta();
      if (m) {
        setMetrics(m);
      }

      setHeaderAnchorOpacity(false);
      setPhase('enter');
    },
    [measureFlipDelta, setHeaderAnchorOpacity, shouldReduceMotion]
  );

  // Synchronous layout check before first paint + resize listener for responsive accuracy
  useIsomorphicLayoutEffect(() => {
    triggerIntro(false);

    const handleReplay = () => triggerIntro(true);
    const handleResize = () => {
      const updated = measureFlipDelta();
      if (updated) setMetrics(updated);
    };

    window.addEventListener(REPLAY_INTRO_EVENT, handleReplay);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener(REPLAY_INTRO_EVENT, handleReplay);
      window.removeEventListener('resize', handleResize);
      setHeaderAnchorOpacity(true);
    };
  }, [triggerIntro, measureFlipDelta, setHeaderAnchorOpacity]);

  // Sequence state machine: 'enter' -> 'flip' -> 'handoff' -> 'done'
  useEffect(() => {
    if (phase === 'enter') {
      const flipTimer = window.setTimeout(() => {
        const fresh = measureFlipDelta();
        if (fresh) {
          setMetrics(fresh);
        }
        setPhase('flip');
      }, 1300);

      return () => window.clearTimeout(flipTimer);
    }

    if (phase === 'flip') {
      const handoffTimer = window.setTimeout(() => {
        setHeaderAnchorOpacity(true);
        window.requestAnimationFrame(() => {
          setPhase('handoff');
        });
      }, 740);

      return () => window.clearTimeout(handoffTimer);
    }

    if (phase === 'handoff') {
      const doneTimer = window.setTimeout(() => {
        try {
          window.sessionStorage.setItem(SESSION_STORAGE_KEY, '1');
        } catch {
          // Ignore storage restrictions
        }
        setPhase('done');
      }, 170);

      return () => window.clearTimeout(doneTimer);
    }
  }, [phase, measureFlipDelta, setHeaderAnchorOpacity]);

  if (phase === 'done') {
    return null;
  }

  if (phase === 'checking') {
    return (
      <div
        className="fixed inset-0 z-50 bg-[var(--color-canvas)] pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  const isFlippingOrHandoff = phase === 'flip' || phase === 'handoff';
  const isHandoff = phase === 'handoff';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Fullscreen Dark Canvas Backdrop — dissolves smoothly during FLIP flight */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isFlippingOrHandoff ? 0 : 1 }}
        transition={{
          duration: isFlippingOrHandoff ? 0.6 : 0.15,
          delay: isFlippingOrHandoff ? 0.08 : 0,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="absolute inset-0 bg-[var(--color-canvas)]"
      >
        {/* Expanding / Contracting Viewfinder Stage Frame */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={
            isFlippingOrHandoff
              ? { scale: 0.92, opacity: 0 }
              : { scale: [1.08, 0.99, 1], opacity: [0, 1, 1] }
          }
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-3.5 sm:inset-10 md:inset-14 border border-neutral-800/70"
        >
          <span className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-l-2 border-white" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-r-2 border-white" />
          <span className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 border-b-2 border-l-2 border-white" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 border-b-2 border-r-2 border-white" />

          <div className="absolute top-2.5 left-3 sm:top-3 sm:left-4 font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-neutral-400 uppercase">
            SHOTSHOT // KINETIC REEL
          </div>
          <div className="absolute bottom-2.5 left-3 sm:bottom-3 sm:left-4 font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-neutral-400 uppercase">
            FRAME 00:00:01:24
          </div>
          <div className="absolute bottom-2.5 right-3 sm:bottom-3 sm:right-4 font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-white uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LOCKED
          </div>
        </motion.div>
      </motion.div>

      {/* FLIP Moving Lockup — matches #studio-brand-anchor dimensions 100.0% at scale(1) */}
      <motion.div
        ref={splashLockupRef}
        initial={{
          x: 0,
          y: 0,
          scale: metrics.heroScale,
          opacity: 1,
        }}
        animate={
          isFlippingOrHandoff
            ? {
                x: metrics.deltaX,
                y: metrics.deltaY,
                scale: 1,
                opacity: isHandoff ? 0 : 1,
              }
            : {
                x: 0,
                y: 0,
                scale: metrics.heroScale,
                opacity: 1,
              }
        }
        transition={{
          x: { duration: 0.72, ease: [0.76, 0, 0.24, 1] },
          y: { duration: 0.72, ease: [0.76, 0, 0.24, 1] },
          scale: { duration: 0.72, ease: [0.76, 0, 0.24, 1] },
          opacity: { duration: isHandoff ? 0.16 : 0.05, ease: 'easeOut' },
        }}
        style={{
          willChange: 'transform, opacity',
          transformOrigin: 'center center',
        }}
        className="relative z-10 inline-flex items-center gap-2.5 sm:gap-4 md:gap-5 whitespace-nowrap"
      >
        {/* Viewfinder Logo with Shutter Snap & Elastic Overshoot */}
        <motion.div
          initial={{
            scale: 1.95,
            rotate: -180,
            opacity: 0,
          }}
          animate={
            isFlippingOrHandoff
              ? { scale: 1, rotate: 0, opacity: 1 }
              : {
                  scale: [1.95, 0.8, 1.14, 0.97, 1],
                  rotate: [-180, 12, -3, 0, 0],
                  opacity: [0, 1, 1, 1, 1],
                }
          }
          transition={{
            duration: 0.88,
            times: [0, 0.48, 0.72, 0.88, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative inline-flex items-center justify-center shrink-0 w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14"
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
              <motion.path
                d="M 140 45 H 45 V 140"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d="M 60 155 H 155 V 60"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.52,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.06,
                }}
              />
            </g>
          </svg>
        </motion.div>

        {/* Typography Container: Holds both the exact native H1 and the Kinetic Slot-Machine Reel */}
        <div className="relative inline-flex items-center">
          {/* Layer A: Exact Native H1 (Matches #studio-brand-anchor kerning 100.0% during FLIP & Handoff) */}
          <h1
            className={`text-[clamp(1.5rem,6.8vw,2.25rem)] sm:text-6xl md:text-7xl font-black tracking-[-0.04em] text-white uppercase font-sans leading-[0.95] whitespace-nowrap transition-opacity duration-150 ${
              isFlippingOrHandoff ? 'opacity-100' : 'opacity-0'
            }`}
          >
            SHOTSHOT{' '}
            <span className="text-neutral-400 font-extralight">STUDIO</span>
          </h1>

          {/* Layer B: Mat Voyce 4x Vertical Slot-Machine Reel + Split Convergence (Active during 'enter') */}
          <div
            className={`absolute inset-0 flex items-center text-[clamp(1.5rem,6.8vw,2.25rem)] sm:text-6xl md:text-7xl font-black tracking-[-0.04em] text-white uppercase font-sans leading-[0.95] whitespace-nowrap transition-opacity duration-150 ${
              isFlippingOrHandoff
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100'
            }`}
          >
            {/* Word 1: SHOTSHOT — Slams in from left while rolling 4x vertically */}
            <motion.span
              initial={{ x: -metrics.slamOffset }}
              animate={{ x: [-metrics.slamOffset, 3, 0] }}
              transition={{
                duration: 0.92,
                times: [0, 0.72, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-flex items-center"
            >
              {PRIMARY_WORD.map((char, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <span
                    key={`p-${idx}`}
                    className="relative inline-block overflow-hidden h-[1.12em] -my-[0.08em] px-[0.14em] -mx-[0.14em] align-middle"
                  >
                    {/* 4-Item Vertical Slot-Machine Strip: 1 item = 25% of flex-col height */}
                    <motion.span
                      initial={{
                        y: isEven ? '25%' : '-100%',
                        scaleY: 1.75,
                        scaleX: 0.68,
                        skewX: isEven ? -12 : 12,
                      }}
                      animate={{
                        y: isEven
                          ? ['25%', '-78%', '-73.5%', '-75%']
                          : ['-100%', '3%', '-1.5%', '0%'],
                        scaleY: [1.75, 0.78, 1.06, 1],
                        scaleX: [0.68, 1.2, 0.96, 1],
                        skewX: [isEven ? -12 : 12, isEven ? 5 : -5, 0, 0],
                      }}
                      transition={{
                        duration: 0.92,
                        delay: idx * 0.03,
                        times: [0, 0.68, 0.86, 1],
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        lineHeight: 1.12,
                        willChange: 'transform',
                        transformOrigin: 'center center',
                      }}
                    >
                      <span className="flex items-center justify-center h-[1.12em] text-white font-black">
                        {char}
                      </span>
                      <span className="flex items-center justify-center h-[1.12em] text-neutral-400 font-extralight italic">
                        {char}
                      </span>
                      <span className="flex items-center justify-center h-[1.12em] text-neutral-300 font-light">
                        {char}
                      </span>
                      <span className="flex items-center justify-center h-[1.12em] text-white font-black">
                        {char}
                      </span>
                    </motion.span>
                  </span>
                );
              })}
            </motion.span>

            {/* Space gap */}
            <span className="inline-block w-[0.22em]" />

            {/* Word 2: STUDIO — Slams in from right while rolling 4x vertically */}
            <motion.span
              initial={{ x: metrics.slamOffset }}
              animate={{ x: [metrics.slamOffset, -3, 0] }}
              transition={{
                duration: 0.92,
                times: [0, 0.72, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-flex items-center text-neutral-400 font-extralight"
            >
              {SECONDARY_WORD.map((char, idx) => {
                const globalIdx = PRIMARY_WORD.length + idx;
                const isEven = globalIdx % 2 === 0;
                return (
                  <span
                    key={`s-${idx}`}
                    className="relative inline-block overflow-hidden h-[1.12em] -my-[0.08em] px-[0.14em] -mx-[0.14em] align-middle"
                  >
                    <motion.span
                      initial={{
                        y: isEven ? '25%' : '-100%',
                        scaleY: 1.75,
                        scaleX: 0.7,
                        skewX: isEven ? -12 : 12,
                      }}
                      animate={{
                        y: isEven
                          ? ['25%', '-78%', '-73.5%', '-75%']
                          : ['-100%', '3%', '-1.5%', '0%'],
                        scaleY: [1.75, 0.8, 1.05, 1],
                        scaleX: [0.7, 1.18, 0.96, 1],
                        skewX: [isEven ? -12 : 12, isEven ? 4 : -4, 0, 0],
                      }}
                      transition={{
                        duration: 0.92,
                        delay: 0.08 + idx * 0.034,
                        times: [0, 0.68, 0.86, 1],
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        lineHeight: 1.12,
                        willChange: 'transform',
                        transformOrigin: 'center center',
                      }}
                    >
                      <span className="flex items-center justify-center h-[1.12em] text-neutral-400 font-extralight">
                        {char}
                      </span>
                      <span className="flex items-center justify-center h-[1.12em] text-white font-black">
                        {char}
                      </span>
                      <span className="flex items-center justify-center h-[1.12em] text-white font-bold italic">
                        {char}
                      </span>
                      <span className="flex items-center justify-center h-[1.12em] text-neutral-400 font-extralight">
                        {char}
                      </span>
                    </motion.span>
                  </span>
                );
              })}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
