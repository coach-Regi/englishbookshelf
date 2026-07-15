/**
 * src/layouts/AuthLayout.tsx
 * ───────────────────────────
 * Центрированный layout для публичных страниц: Login, Register, Join.
 *
 * Структура:
 *   ┌─────────────────────────────────────────────────────┐
 *   │  [Логотип + название]        [Dark Mode toggle]    │  ← шапка
 *   ├─────────────────────────────────────────────────────┤
 *   │                                                     │
 *   │              ┌────────────────┐                     │
 *   │              │   <children>   │   ← карточка формы  │
 *   │              └────────────────┘                     │
 *   │                                                     │
 *   └─────────────────────────────────────────────────────┘
 *
 * prop minimal: убирает лого-шапку (для /join/:token где контекст понятен).
 */

import { Link, Outlet } from "react-router-dom";
import { BookOpen, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

interface AuthLayoutProps {
  /** Если передан children — рендерим их. Иначе — <Outlet /> */
  children?: React.ReactNode;
  /** Убрать верхнюю шапку с логотипом */
  minimal?: boolean;
}

export function AuthLayout({ children, minimal = false }: AuthLayoutProps) {
  const { theme, toggle } = useThemeStore();

  return (
    <div className="min-h-screen bg-canvas flex flex-col">

      {/* ── Шапка ─────────────────────────────────────────────────────────── */}
      {!minimal && (
        <header className="flex items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="English Bookshelf — на главную"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center
                            group-hover:bg-purple-600 transition-colors">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-primary text-sm">
              English Bookshelf
            </span>
          </Link>

          {/* Dark Mode toggle */}
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-md
                       text-secondary hover:text-primary hover:bg-subtle
                       transition-colors"
            aria-label={
              theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </header>
      )}

      {/* ── Центрированный контент ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {children ?? <Outlet />}
        </div>
      </div>

      {/* ── Подвал ───────────────────────────────────────────────────────── */}
      <footer className="py-4 text-center">
        <p className="text-xs text-placeholder">
          © {new Date().getFullYear()} English Bookshelf
        </p>
      </footer>
    </div>
  );
}
