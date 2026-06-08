import { reactive, ref } from 'vue';

export interface Toast {
  id: number;
  intent: 'info' | 'success' | 'error' | 'warning';
  icon?: string;
  title: string;
  msg?: string;
  duration?: number;
  leaving?: boolean;
  action?: { label: string; onClick?: () => void };
}

export interface DialogOptions {
  intent?: 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: string;
  hideCancel?: boolean;
}

const toasts = reactive<Toast[]>([]);
const dialog = ref<DialogOptions | null>(null);
let _confirmResolve: ((v: boolean) => void) | null = null;
let _seq = 0;

function dismissToast(id: number) {
  const idx = toasts.findIndex(t => t.id === id);
  if (idx === -1) return;
  toasts[idx].leaving = true;
  setTimeout(() => {
    const i = toasts.findIndex(t => t.id === id);
    if (i !== -1) toasts.splice(i, 1);
  }, 210);
}

function pushToast(opts: Partial<Toast> & { title: string }): number {
  const id = ++_seq;
  const toast: Toast = { id, intent: 'info', duration: 3400, ...opts };
  toasts.push(toast);
  if (toast.duration) setTimeout(() => dismissToast(id), toast.duration);
  return id;
}

export const tbToast = Object.assign(
  (opts: string | (Partial<Toast> & { title: string })) => pushToast(typeof opts === 'string' ? { title: opts } : opts),
  {
    success: (title: string, msg?: string, extra?: Partial<Toast>) => pushToast({ intent: 'success', icon: 'check', title, msg, ...extra }),
    error: (title: string, msg?: string, extra?: Partial<Toast>) => pushToast({ intent: 'error', icon: 'warn', title, msg, ...extra }),
    warning: (title: string, msg?: string, extra?: Partial<Toast>) => pushToast({ intent: 'warning', icon: 'warn', title, msg, ...extra }),
    info: (title: string, msg?: string, extra?: Partial<Toast>) => pushToast({ intent: 'info', icon: 'info', title, msg, ...extra }),
    dismiss: dismissToast,
  },
);

export function tbConfirm(opts: DialogOptions): Promise<boolean> {
  return new Promise(resolve => {
    _confirmResolve = resolve;
    dialog.value = { intent: 'info', confirmText: 'Confirm', cancelText: 'Cancel', ...opts };
  });
}

export function settleConfirm(val: boolean) {
  const r = _confirmResolve;
  _confirmResolve = null;
  dialog.value = null;
  r?.(val);
}

export function useOverlay() {
  return { toasts, dialog, dismissToast, settleConfirm };
}
