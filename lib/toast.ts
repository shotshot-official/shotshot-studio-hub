// lib/toast.ts
'use client';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export function showToast(message: string, type: ToastType = 'success') {
  if (typeof window !== 'undefined') {
    const detail: ToastItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      message,
      type,
    };
    window.dispatchEvent(new CustomEvent('studio-toast', { detail }));
  }
}

export const toast = {
  success: (message: string) => showToast(message, 'success'),
  info: (message: string) => showToast(message, 'info'),
  error: (message: string) => showToast(message, 'error'),
};
