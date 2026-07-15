/**
 * src/stores/uiStore.ts
 * ──────────────────────
 * Глобальное UI-состояние: Toast-уведомления и модальные окна.
 *
 * Toast-уведомления:
 *   Добавляются через addToast(), автоматически удаляются через duration мс.
 *   Слушают window-события из api/client.ts:
 *     'api:rate-limited' → Toast с countdown
 *     'api:server-error' → Toast с ошибкой сервера
 *
 * Модальные окна:
 *   Хранят идентификатор открытой модалки + произвольные данные.
 *   Компонент модалки сам решает что рендерить на основе modalId.
 */

import { create } from "zustand";

// ── Toast ──────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number; // мс
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export interface ModalState {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

// ── Store ──────────────────────────────────────────────────────────────────────

interface UiState {
  toasts: Toast[];
  modal: ModalState | null;

  // Toast actions
  addToast: (
    message: string,
    variant?: ToastVariant,
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;

  // Modal actions
  openModal: (id: string, data?: unknown) => void;
  closeModal: () => void;
}

let toastIdCounter = 0;

export const useUiStore = create<UiState>()((set) => ({
  toasts: [],
  modal: null,

  addToast: (message, variant = "info", duration = 4000) => {
    const id = String(++toastIdCounter);
    set((s) => ({ toasts: [...s.toasts, { id, message, variant, duration }] }));
    // Автоудаление
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // Шорткаты
  success: (message) =>
    useUiStore.getState().addToast(message, "success", 3500),
  error: (message) =>
    useUiStore.getState().addToast(message, "error", 6000),
  warning: (message) =>
    useUiStore.getState().addToast(message, "warning", 5000),
  info: (message) =>
    useUiStore.getState().addToast(message, "info", 4000),

  openModal: (id, data) => set({ modal: { id, data } }),
  closeModal: () => set({ modal: null }),
}));

// ── Слушаем события из API-клиента ───────────────────────────────────────────
if (typeof window !== "undefined") {
  // 429 Rate Limit
  window.addEventListener("api:rate-limited", (e) => {
    const seconds = (e as CustomEvent<{ seconds: number }>).detail.seconds;
    useUiStore
      .getState()
      .warning(`Слишком много запросов. Повторите через ${seconds} сек.`);
  });

  // 5xx Server Error
  window.addEventListener("api:server-error", () => {
    useUiStore
      .getState()
      .error("Ошибка сервера. Мы уже разбираемся. Попробуйте позже.");
  });
}

// ── Удобный хук-шорткат для компонентов ──────────────────────────────────────
export const useToast = () => {
  const { success, error, warning, info, addToast } = useUiStore();
  return { success, error, warning, info, addToast };
};
