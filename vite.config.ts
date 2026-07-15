import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения из .env файлов
  // Это позволяет использовать VITE_API_URL и другие переменные
  // прямо в конфиге (например, для настройки proxy target)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // ── Плагины ─────────────────────────────────────────────────────────────
    plugins: [
      react({
        // Быстрее чем babel для большинства случаев
        // Используем SWC только если нет кастомных Babel-плагинов
      }),
    ],

    // ── Алиасы путей ────────────────────────────────────────────────────────
    // '@/' → 'src/'
    // Вместо: import { Button } from '../../../components/ui/Button'
    // Пишем:  import { Button } from '@/components/ui/Button'
    //
    // Должны совпадать с paths в tsconfig.json:
    //   "paths": { "@/*": ["./src/*"] }
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),

        // Явный алиас для react-pdf worker — исправляет проблему с bundling
        // PDFWorker должен указывать на .mjs файл pdfjs-dist
        "pdfjs-dist": resolve(
          __dirname,
          "./node_modules/pdfjs-dist/build/pdf.min.mjs"
        ),
      },
    },

    // ── Dev Server ───────────────────────────────────────────────────────────
    server: {
      port: 5173,           // стандартный порт Vite
      strictPort: true,     // не пробовать следующий порт если занят
      open: false,          // не открывать браузер автоматически

      // ── API Proxy ─────────────────────────────────────────────────────────
      // Проксируем /api/* запросы на FastAPI backend (порт 8000).
      // Это решает проблему CORS в разработке: браузер думает что
      // запросы идут на тот же origin (localhost:5173).
      //
      // В продакшне на Amvera nginx сам проксирует /api → backend:8000.
      // Здесь мы воспроизводим то же поведение локально.
      proxy: {
        "/api": {
          target: env.VITE_API_TARGET ?? "http://localhost:8000",
          changeOrigin: true,   // меняет Host-заголовок на target
          secure: false,        // не проверяем SSL сертификат localhost

          // Логируем проксируемые запросы в режиме разработки
          configure: (proxy) => {
            proxy.on("error", (err) => {
              console.error("[proxy error]", err.message);
            });
            proxy.on("proxyReq", (_proxyReq, req) => {
              console.log("[proxy]", req.method, req.url, "→ :8000");
            });
          },
        },
      },
    },

    // ── Preview Server (vite preview) ────────────────────────────────────────
    // Используется для тестирования production build локально
    preview: {
      port: 4173,
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },

    // ── Build ────────────────────────────────────────────────────────────────
    build: {
      outDir: "dist",
      emptyOutDir: true,

      // Увеличиваем лимит размера чанка — pdfjs-dist большой (~2МБ)
      chunkSizeWarningLimit: 3000,

      rollupOptions: {
        output: {
          // Разбиваем vendor бандл на отдельные чанки:
          // Браузер кэширует их отдельно — при обновлении приложения
          // пользователь не перекачивает React/PDF.js если они не менялись
          manualChunks: {
            // React core — меняется редко
            "vendor-react": ["react", "react-dom", "react-router-dom"],

            // PDF rendering — большой, меняется редко
            "vendor-pdf": ["pdfjs-dist", "react-pdf"],

            // Data layer — TanStack Query + Axios
            "vendor-data": [
              "axios",
              "@tanstack/react-query",
              "zustand",
            ],

            // DnD kit — только в Reader
            "vendor-dnd": ["@dnd-kit/core", "@dnd-kit/utilities"],

            // UI utilities
            "vendor-ui": ["clsx", "tailwind-merge", "lucide-react", "date-fns"],
          },

          // Хешируем имена файлов для cache-busting
          chunkFileNames:  "assets/[name]-[hash].js",
          entryFileNames:  "assets/[name]-[hash].js",
          assetFileNames:  "assets/[name]-[hash].[ext]",
        },
      },

      // Source maps в продакшне — полезно для мониторинга ошибок (Sentry и т.д.)
      // Ставим 'hidden': файлы генерируются но браузер их не загружает автоматически
      sourcemap: mode === "production" ? "hidden" : true,
    },

    // ── Оптимизации ──────────────────────────────────────────────────────────
    optimizeDeps: {
      // Pre-bundle тяжёлых зависимостей при первом запуске dev сервера
      // Это ускоряет холодный старт
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "axios",
        "zustand",
        "@tanstack/react-query",
        "clsx",
        "tailwind-merge",
        "lucide-react",
        "date-fns",
      ],
      // pdfjs-dist требует особой обработки из-за воркеров
      exclude: ["pdfjs-dist"],
    },

    // ── Переменные окружения ─────────────────────────────────────────────────
    // Только переменные с префиксом VITE_ попадают в браузерный бандл
    // (стандартное поведение Vite, не меняем)
    envPrefix: "VITE_",

    // ── CSS ──────────────────────────────────────────────────────────────────
    css: {
      // PostCSS (tailwind + autoprefixer) настраивается в postcss.config.js
      devSourcemap: true,
    },
  };
});
