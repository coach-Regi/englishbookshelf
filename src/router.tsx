/**
 * src/router.tsx
 * ───────────────
 * Конфигурация маршрутизации приложения.
 *
 * Архитектура маршрутов:
 *
 *   Публичные (AuthLayout — центрированная карточка):
 *     /login, /register, /join/:token
 *
 *   Защищённые — любой авторизованный (MainLayout):
 *     /dashboard
 *     /materials/:materialId
 *
 *   Защищённые — только Teacher/Admin (MainLayout):
 *     /groups, /groups/:groupId
 *
 *   Защищённые — только Admin (AdminLayout):
 *     /admin, /admin/users, /admin/stats, /admin/tasks
 *
 *   Специальный layout (ReaderLayout — fullscreen):
 *     /books/:bookId
 *
 * Lazy loading: все страницы грузятся лениво через React.lazy.
 * Это уменьшает начальный бандл — пользователь не загружает
 * код Admin-панели при входе как Student.
 */

import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ReaderLayout } from "@/layouts/ReaderLayout";
import { PageLoader } from "@/components/common/PageLoader";

// ── Lazy-загрузка страниц ─────────────────────────────────────────────────────

const LoginPage      = lazy(() => import("@/pages/LoginPage"));
const RegisterPage   = lazy(() => import("@/pages/RegisterPage"));
const JoinGroupPage  = lazy(() => import("@/pages/JoinGroupPage"));

const DashboardPage  = lazy(() => import("@/pages/DashboardPage"));
const BookReaderPage = lazy(() => import("@/pages/BookReaderPage"));
const MaterialPage   = lazy(() => import("@/pages/MaterialPage"));

const GroupsPage     = lazy(() => import("@/pages/GroupsPage"));
const GroupDetailPage = lazy(() => import("@/pages/GroupDetailPage"));

const AdminUsersPage  = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminStatsPage  = lazy(() => import("@/pages/admin/AdminStatsPage"));
const AdminTasksPage  = lazy(() => import("@/pages/admin/AdminTasksPage"));

// ── Guards (защитные обёртки) ─────────────────────────────────────────────────

/**
 * Базовый guard: требует авторизации.
 * Неавторизованных отправляет на /login, сохраняя attempted URL.
 */
function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  return <Outlet />;
}

/**
 * Guard для Teacher и Admin.
 * Student, попавший на /groups, увидит /dashboard.
 */
function RequireTeacher() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "teacher" && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

/**
 * Guard только для Admin.
 */
function RequireAdmin() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

/**
 * Guard для публичных страниц (login, register).
 * Уже авторизованных отправляет на /dashboard.
 */
function RequireGuest() {
  const user = useAuthStore((s) => s.user);

  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

// ── Обёртка для Suspense (Lazy-страницы) ──────────────────────────────────────

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// ── Конфигурация роутера ──────────────────────────────────────────────────────

const router = createBrowserRouter([
  // ── Публичные маршруты (гость) ──────────────────────────────────────────
  {
    element: (
      <RequireGuest />
    ),
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LazyPage><LoginPage /></LazyPage>,
          },
          {
            path: "/register",
            element: <LazyPage><RegisterPage /></LazyPage>,
          },
        ],
      },
    ],
  },

  // Страница join доступна и гостям, и авторизованным
  {
    path: "/join/:token",
    element: (
      <AuthLayout minimal>
        <LazyPage><JoinGroupPage /></LazyPage>
      </AuthLayout>
    ),
  },

  // ── Book Reader (отдельный fullscreen layout) ────────────────────────────
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/books/:bookId",
        element: (
          <ReaderLayout>
            <LazyPage><BookReaderPage /></LazyPage>
          </ReaderLayout>
        ),
      },
    ],
  },

  // ── Основные защищённые маршруты (MainLayout) ───────────────────────────
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Dashboard — для всех ролей (рендерит разный контент)
          {
            path: "/dashboard",
            element: <LazyPage><DashboardPage /></LazyPage>,
          },
          // Просмотр материала — для всех ролей
          {
            path: "/materials/:materialId",
            element: <LazyPage><MaterialPage /></LazyPage>,
          },

          // ── Только Teacher/Admin ───────────────────────────────────────
          {
            element: <RequireTeacher />,
            children: [
              {
                path: "/groups",
                element: <LazyPage><GroupsPage /></LazyPage>,
              },
              {
                path: "/groups/:groupId",
                element: <LazyPage><GroupDetailPage /></LazyPage>,
              },
            ],
          },

          // ── Только Admin ───────────────────────────────────────────────
          {
            element: <RequireAdmin />,
            children: [
              {
                path: "/admin",
                element: <Navigate to="/admin/stats" replace />,
              },
              {
                path: "/admin/stats",
                element: <LazyPage><AdminStatsPage /></LazyPage>,
              },
              {
                path: "/admin/users",
                element: <LazyPage><AdminUsersPage /></LazyPage>,
              },
              {
                path: "/admin/tasks",
                element: <LazyPage><AdminTasksPage /></LazyPage>,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Корневой редирект ────────────────────────────────────────────────────
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // ── 404 ─────────────────────────────────────────────────────────────────
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

// ── 404 компонент (inline, не lazy — нужен всегда) ───────────────────────────

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-semibold text-purple-500 mb-4">404</p>
        <h1 className="text-2xl font-medium text-primary mb-2">
          Страница не найдена
        </h1>
        <p className="text-secondary mb-6">
          Возможно, ссылка устарела или была удалена.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md
                     bg-purple-500 text-white text-sm font-medium
                     hover:bg-purple-600 transition-colors"
        >
          На главную
        </a>
      </div>
    </div>
  );
}

// ── Экспорт ───────────────────────────────────────────────────────────────────

export function AppRouter() {
  return <RouterProvider router={router} />;
}
