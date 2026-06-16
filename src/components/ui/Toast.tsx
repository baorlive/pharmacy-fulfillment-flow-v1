'use client';

import type { ToastState } from '@/store/orderStore';
import Icon from './Icon';

interface ToastProps {
  toast: ToastState;
}

export default function Toast({ toast }: ToastProps) {
  if (!toast.visible && !toast.leaving) return null;

  return (
    <div className={`toast show ${toast.leaving ? 'is-leaving' : ''}`}>
      <span className="toast-icon"><Icon name={toast.icon} /></span>
      <span className="toast-msg">{toast.message}</span>
    </div>
  );
}
