/**
 * src/stores/readerStore.ts
 * ─────────────────────────
 * UI-состояние Book Reader / Media Editor.
 *
 * Этот store — ТОЛЬКО UI-состояние:
 *   - режим (preview / edit)
 *   - открытые панели
 *   - состояние плеера (какой трек играет)
 *   - текущая страница
 *
 * Серверные данные (пины, медиафайлы) — в TanStack Query, не здесь.
 *
 * НЕ персистируется: при открытии книги всегда начинаем с preview,
 * первой страницы и закрытого плеера.
 */

import { create } from "zustand";
import type { PinRead } from "@/api/types";

// ── Типы ──────────────────────────────────────────────────────────────────────

export type ReaderMode = "preview" | "edit";

export interface PlayerState {
  isOpen: boolean;
  isPlaying: boolean;
  /** Пин, аудио которого воспроизводится */
  activePin: PinRead | null;
  /** Presigned URL аудиофайла */
  audioUrl: string | null;
  /** Прогресс 0.0 – 1.0 (для timeline) */
  progress: number;
  /** Elapsed в секундах */
  elapsed: number;
  /** Позиция плавающего плеера на экране */
  position: { x: number; y: number };
}

interface ReaderState {
  // ── Книга ───────────────────────────────────────────────────────────────
  bookId: string | null;

  // ── Режим ───────────────────────────────────────────────────────────────
  mode: ReaderMode;
  setMode: (mode: ReaderMode) => void;

  // ── Страница ─────────────────────────────────────────────────────────────
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;

  // ── Панели ────────────────────────────────────────────────────────────────
  /** Сайдбар с несопоставленными файлами (Edit mode) */
  isSidebarOpen: boolean;
  /** Fullscreen: скрыты все панели, PDF на 100% ширины */
  isFullscreen: boolean;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  setSidebarOpen: (open: boolean) => void;

  // ── Плеер ─────────────────────────────────────────────────────────────────
  player: PlayerState;
  openPlayer: (pin: PinRead, audioUrl: string) => void;
  closePlayer: () => void;
  setPlayerPlaying: (isPlaying: boolean) => void;
  setPlayerProgress: (elapsed: number, duration: number) => void;
  setPlayerPosition: (x: number, y: number) => void;

  // ── Активный пин (выделение в Edit mode) ──────────────────────────────────
  activePinId: string | null;
  setActivePinId: (id: string | null) => void;

  // ── Инициализация / сброс ─────────────────────────────────────────────────
  initReader: (bookId: string, totalPages: number) => void;
  resetReader: () => void;
}

// ── Начальное состояние плеера ────────────────────────────────────────────────

const INITIAL_PLAYER: PlayerState = {
  isOpen: false,
  isPlaying: false,
  activePin: null,
  audioUrl: null,
  progress: 0,
  elapsed: 0,
  // Начальная позиция: правый нижний угол (будет скорректирована под экран)
  position: { x: window.innerWidth - 304, y: window.innerHeight - 200 },
};

// ── Store ──────────────────────────────────────────────────────────────────────

export const useReaderStore = create<ReaderState>()((set, get) => ({
  bookId: null,
  mode: "preview",
  currentPage: 1,
  totalPages: 0,
  isSidebarOpen: false,
  isFullscreen: false,
  player: INITIAL_PLAYER,
  activePinId: null,

  // ── Режим ─────────────────────────────────────────────────────────────────
  setMode: (mode) => {
    // При переходе в preview — закрываем сайдбар
    if (mode === "preview") {
      set({ mode, isSidebarOpen: false, activePinId: null });
    } else {
      set({ mode, isSidebarOpen: true });
    }
  },

  // ── Страница ───────────────────────────────────────────────────────────────
  setCurrentPage: (page) => {
    const { totalPages } = get();
    const clamped = Math.max(1, Math.min(page, totalPages || 1));
    set({ currentPage: clamped });
  },
  setTotalPages: (total) => set({ totalPages: total }),
  goToNextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) set({ currentPage: currentPage + 1 });
  },
  goToPrevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) set({ currentPage: currentPage - 1 });
  },

  // ── Панели ─────────────────────────────────────────────────────────────────
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // ── Плеер ──────────────────────────────────────────────────────────────────
  openPlayer: (pin, audioUrl) =>
    set((s) => ({
      player: {
        ...s.player,
        isOpen: true,
        isPlaying: true,
        activePin: pin,
        audioUrl,
        progress: 0,
        elapsed: 0,
      },
    })),

  closePlayer: () =>
    set((s) => ({
      player: { ...s.player, isOpen: false, isPlaying: false, activePin: null },
    })),

  setPlayerPlaying: (isPlaying) =>
    set((s) => ({ player: { ...s.player, isPlaying } })),

  setPlayerProgress: (elapsed, duration) =>
    set((s) => ({
      player: {
        ...s.player,
        elapsed,
        progress: duration > 0 ? elapsed / duration : 0,
      },
    })),

  setPlayerPosition: (x, y) =>
    set((s) => ({ player: { ...s.player, position: { x, y } } })),

  // ── Активный пин ───────────────────────────────────────────────────────────
  setActivePinId: (id) => set({ activePinId: id }),

  // ── Инициализация ──────────────────────────────────────────────────────────
  initReader: (bookId, totalPages) =>
    set({
      bookId,
      totalPages,
      currentPage: 1,
      mode: "preview",
      isSidebarOpen: false,
      isFullscreen: false,
      activePinId: null,
      player: {
        ...INITIAL_PLAYER,
        position: {
          x: window.innerWidth - 304,
          y: window.innerHeight - 200,
        },
      },
    }),

  resetReader: () =>
    set({
      bookId: null,
      totalPages: 0,
      currentPage: 1,
      mode: "preview",
      isSidebarOpen: false,
      isFullscreen: false,
      activePinId: null,
      player: INITIAL_PLAYER,
    }),
}));

// ── Селекторы ─────────────────────────────────────────────────────────────────
export const selectReaderMode = (s: ReaderState) => s.mode;
export const selectCurrentPage = (s: ReaderState) => s.currentPage;
export const selectPlayer = (s: ReaderState) => s.player;
export const selectIsFullscreen = (s: ReaderState) => s.isFullscreen;
