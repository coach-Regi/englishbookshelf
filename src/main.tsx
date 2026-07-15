/**
 * src/main.tsx
 * ─────────────
 * Точка входа React-приложения.
 * BrowserRouter не нужен — AppRouter использует createBrowserRouter + RouterProvider.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./styles/globals.css";
import App from "./App";

// ── TanStack Query Client ──────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error: any) => {
        if ([401, 403, 404].includes(error?.response?.status)) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// ── Применение темы до рендера (анти-FOUC) ────────────────────────────────
const savedTheme = localStorage.getItem("theme-storage");
if (savedTheme) {
  try {
    const { state } = JSON.parse(savedTheme);
    if (state?.theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch {
    // Игнорируем повреждённый localStorage
  }
}

// ── Root ───────────────────────────────────────────────────────────────────
const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.VITE_DEBUG === "true" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  </StrictMode>
);
