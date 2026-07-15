/**
 * src/stores/authStore.ts
 * ───────────────────────
 * Глобальное состояние аутентификации.
 *
 * Хранит:
 *   - данные пользователя (UserRead)
 *   - access и refresh токены
 *
 * persist middleware сохраняет токены в localStorage под ключом 'auth-storage'.
 * Этот ключ используется в api/client.ts для чтения токенов в интерцепторе
 * (без циклического импорта store → client → store).
 *
 * Слушает window-событие 'auth:logout', которое публикует client.ts
 * при провале refresh. Таким образом разрываем циклическую зависимость.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRead } from "@/api/types";

interface AuthState {
  user: UserRead | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Действия
  setUser: (user: UserRead) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  /** Вызывается после успешного login: сохраняет токены и пользователя */
  login: (tokens: { access_token: string; refresh_token: string }, user: UserRead) => void;
  /** Полная очистка состояния */
  logout: () => void;
  /** Обновить профиль пользователя (после PATCH /auth/me) */
  updateUser: (patch: Partial<UserRead>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      login: (tokens, user) =>
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          user,
        }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null }),

      updateUser: (patch) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...patch } });
      },
    }),
    {
      name: "auth-storage", // ← должен совпадать с STORAGE_KEY в api/client.ts
      // Храним только токены и пользователя — этого достаточно
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// ── Слушаем событие logout из API-клиента ────────────────────────────────────
// client.ts публикует 'auth:logout' когда refresh провалился.
// Подписываемся здесь (вне React-дерева) — один раз при загрузке модуля.
if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => {
    useAuthStore.getState().logout();
    // Перенаправляем на /login после очистки состояния
    window.location.href = "/login";
  });
}

// ── Вспомогательные селекторы (используйте в компонентах) ───────────────────
export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => s.user !== null;
export const selectIsTeacher = (s: AuthState) =>
  s.user?.role === "teacher" || s.user?.role === "admin";
export const selectIsStudent = (s: AuthState) => s.user?.role === "student";
export const selectIsAdmin = (s: AuthState) => s.user?.role === "admin";
