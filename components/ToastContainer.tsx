// components/ToastContainer.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastItem } from '@/lib/toast';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    function handleToastEvent(e: Event) {
      const customEvent = e as CustomEvent<ToastItem>;
      if (!customEvent.detail) return;

      const newToast = customEvent.detail;
      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 recent toasts

      // Auto dismiss after 3.5 seconds
      setTimeout(() => {
        removeToast(newToast.id);
      }, 3500);
    }

    window.addEventListener('studio-toast', handleToastEvent);
    return () => window.removeEventListener('studio-toast', handleToastEvent);
  }, [removeToast]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 max-w-[92vw] sm:max-w-md w-full pointer-events-none px-3"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;
          const iconColor = isSuccess
            ? 'text-emerald-400'
            : isError
            ? 'text-red-400'
            : 'text-sky-400';
          const borderColor = isSuccess
            ? 'border-emerald-800/80'
            : isError
            ? 'border-red-800/80'
            : 'border-neutral-700';

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10, scale: 0.96 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto w-full bg-neutral-950/95 border ${borderColor} px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md`}
              role={isError ? 'alert' : 'status'}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                <span className="text-xs font-mono tracking-wider uppercase text-neutral-200 truncate">
                  {toast.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="swiss-focus text-neutral-400 hover:text-white p-1 hover:bg-neutral-900 transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
