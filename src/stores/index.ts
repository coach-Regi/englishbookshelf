/**
 * src/stores/index.ts
 * ────────────────────
 * Barrel export. Импортируйте из '@/stores'.
 *
 *   import { useAuthStore, useToast, useReaderStore } from '@/stores'
 */

export { useAuthStore, selectUser, selectIsAuthenticated, selectIsTeacher, selectIsStudent, selectIsAdmin } from "./authStore";
export { useThemeStore } from "./themeStore";
export { useReaderStore, selectReaderMode, selectCurrentPage, selectPlayer, selectIsFullscreen } from "./readerStore";
export type { ReaderMode, PlayerState } from "./readerStore";
export { useUiStore, useToast } from "./uiStore";
export type { Toast, ToastVariant, ModalState } from "./uiStore";
