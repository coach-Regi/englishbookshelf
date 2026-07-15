/**
 * src/layouts/MainLayout.tsx
 * ───────────────────────────
 * Основная обёртка для защищённых страниц.
 *
 * Структура:
 *   ┌─────────────────────────────┐
 *   │         AppNavbar (56px)    │  — sticky, backdrop-blur при скролле
 *   ├─────────────────────────────┤
 *   │                             │
 *   │       <Outlet />            │  — контент страницы
 *   │                             │
 *   └─────────────────────────────┘
 *
 * Navbar содержит:
 *   - Логотип + название
 *   - Навигационные ссылки (адаптируются к роли пользователя)
 *   - Переключатель Dark Mode
 *   - Меню пользователя (аватар + dropdown)
 */

import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  LayoutDashboard,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { cn } from "@/utils/cn";

// ── Navbar ────────────────────────────────────────────────────────────────────

function AppNavbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Backdrop-blur появляется только при скролле
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Закрываем dropdown при клике вне
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handler = () => setIsUserMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const isAdmin   = user?.role === "admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 flex items-center border-b border-border",
        "bg-surface transition-shadow duration-200",
        isScrolled && "shadow-sm backdrop-blur-sm bg-surface/90"
      )}
    >
      <div className="flex items-center w-full px-4 md:px-6 gap-4">

        {/* ── Логотип ──────────────────────────────────────────────────── */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center
                          group-hover:bg-purple-600 transition-colors">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-primary text-sm hidden sm:block">
            English Bookshelf
          </span>
        </Link>

        {/* ── Навигация ─────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1 ml-2">
          <NavItem to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
            {user?.role === "student" ? "Мои материалы" : "Библиотека"}
          </NavItem>

          {isTeacher && (
            <NavItem to="/groups" icon={<Users className="w-4 h-4" />}>
              Группы
            </NavItem>
          )}

          {isAdmin && (
            <NavItem to="/admin/stats" icon={<ShieldCheck className="w-4 h-4" />}>
              Админ
            </NavItem>
          )}
        </nav>

        {/* ── Правая часть ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Dark Mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-md
                       text-secondary hover:text-primary hover:bg-subtle
                       transition-colors"
            title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
            aria-label="Переключить тему"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen((v) => !v);
              }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md
                         hover:bg-subtle transition-colors"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              {/* Аватар-заглушка: инициалы */}
              <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40
                              flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {user?.full_name?.[0]?.toUpperCase() ??
                   user?.email?.[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
              <span className="text-sm text-primary hidden md:block max-w-[120px] truncate">
                {user?.full_name ?? user?.email}
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-secondary transition-transform hidden md:block",
                  isUserMenuOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48
                              bg-surface border border-border rounded-lg shadow-dropdown
                              py-1 z-dropdown animate-fade-in">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-xs text-secondary truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs font-medium text-primary capitalize">
                    {user?.role === "teacher" ? "Преподаватель" :
                     user?.role === "student" ? "Студент" : "Администратор"}
                  </p>
                </div>

                <DropdownItem
                  icon={<Settings className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  Профиль
                </DropdownItem>

                <DropdownItem
                  icon={<LogOut className="w-3.5 h-3.5" />}
                  onClick={handleLogout}
                  danger
                >
                  Выйти
                </DropdownItem>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Вспомогательные компоненты ────────────────────────────────────────────────

function NavItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium",
          "transition-colors",
          isActive
            ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
            : "text-secondary hover:text-primary hover:bg-subtle"
        )
      }
    >
      {icon}
      <span className="hidden sm:block">{children}</span>
    </NavLink>
  );
}

function DropdownItem({
  icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-1.5 text-sm",
        "transition-colors",
        danger
          ? "text-danger-DEFAULT hover:bg-danger-light dark:hover:bg-danger-dark/20"
          : "text-primary hover:bg-subtle"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export function MainLayout() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AppNavbar />

      {/* Основной контент */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
