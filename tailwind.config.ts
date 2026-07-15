import type { Config } from "tailwindcss";

const config: Config = {
  // ── Dark Mode ─────────────────────────────────────────────────────────────
  // 'class' strategy: добавляем/убираем класс 'dark' на <html>.
  // Пользователь переключает вручную, выбор хранится в themeStore (Zustand persist).
  // Это даёт контроль над переключением в отличие от 'media',
  // который следует за системными настройками без возможности override.
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {

      // ── Цвета ───────────────────────────────────────────────────────────────
      // Все цвета ссылаются на CSS-переменные, определённые в globals.css.
      // Это позволяет Tailwind-классам автоматически переключаться между
      // light и dark режимами без дублирования классов в компонентах.
      //
      // Использование: bg-canvas, text-primary, border-DEFAULT и т.д.
      // Вместо:        bg-[#F8F7F4] dark:bg-[#141312]
      colors: {
        // ── Фоны (semantic) ─────────────────────────────────────────────────
        canvas: "var(--color-bg-canvas)",     // основной фон страницы
        surface: "var(--color-bg-surface)",   // карточки, модалки, dropdown
        subtle: "var(--color-bg-subtle)",     // вторичный фон, ховеры
        overlay: "var(--color-bg-overlay)",   // backdrop модалок

        // ── Текст (semantic) ────────────────────────────────────────────────
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        placeholder: "var(--color-text-placeholder)",
        inverse: "var(--color-text-inverse)",       // текст на тёмном фоне (кнопки)

        // ── Границы (semantic) ──────────────────────────────────────────────
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
          focus: "var(--color-border-focus)",     // фокус-кольцо input'ов
        },

        // ── Акцент: Сиреневый (primary action) ──────────────────────────────
        // Используется для: кнопок CTA, активных пинов (Auto), ссылок,
        // прогресс-баров, выделения активного элемента.
        purple: {
          50:  "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",   // ← основной акцент
          600: "#7C3AED",   // hover
          700: "#6D28D9",   // active / pressed
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },

        // ── Акцент: Жёлтый (secondary / highlight) ──────────────────────────
        // Используется для: статуса "в обработке", новых элементов (бейдж NEW),
        // прогресс-баров маппинга, подсветки track labels в ридере.
        // НЕ используется для кнопок CTA — только вспомогательные акценты.
        yellow: {
          50:  "#FEFCE8",
          100: "#FEF9C3",
          200: "#FEF08A",
          300: "#FDE047",   // ← основной жёлтый акцент
          400: "#FACC15",   // hover
          500: "#EAB308",
          600: "#CA8A04",
          700: "#A16207",
          800: "#854D0E",
          900: "#713F12",
          950: "#422006",
        },

        // ── Статусы ─────────────────────────────────────────────────────────
        success: {
          DEFAULT: "#10B981",
          light:   "#D1FAE5",
          dark:    "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light:   "#FEF3C7",
          dark:    "#D97706",
        },
        danger: {
          DEFAULT: "#EF4444",
          light:   "#FEE2E2",
          dark:    "#DC2626",
        },
        info: {
          DEFAULT: "#6366F1",
          light:   "#E0E7FF",
          dark:    "#4F46E5",
        },

        // ── Пины (Audio Pins в ридере) ───────────────────────────────────────
        pin: {
          auto:   "#8B5CF6",   // Auto-пин — сиреневый
          manual: "#059669",   // Manual-пин — изумрудный (отличается от auto)
        },
      },

      // ── Типографика ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Cascadia Code"',
          "Consolas",
          '"Courier New"',
          "monospace",
        ],
      },

      // ── Шрифтовая шкала ─────────────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],   // 10px — очень мелкий
        xs:    ["0.75rem",  { lineHeight: "1rem" }],       // 12px — мета, бейджи
        sm:    ["0.875rem", { lineHeight: "1.25rem" }],    // 14px — вторичный текст
        base:  ["1rem",     { lineHeight: "1.5rem" }],     // 16px — основной
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],    // 18px — подзаголовки
        xl:    ["1.25rem",  { lineHeight: "1.75rem" }],    // 20px — названия секций
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],       // 24px — заголовки страниц
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],    // 30px — display
        "4xl": ["2.25rem",  { lineHeight: "2.5rem" }],     // 36px
      },

      // ── Тени ────────────────────────────────────────────────────────────────
      // Более мягкие тени чем дефолтные Tailwind — для академического стиля.
      // В Dark Mode тени практически не видны — используем border вместо.
      boxShadow: {
        "book-card":  "0 2px 8px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
        "book-hover": "0 8px 24px 0 rgba(0,0,0,0.10), 0 2px 6px 0 rgba(0,0,0,0.06)",
        "modal":      "0 20px 60px 0 rgba(0,0,0,0.15), 0 4px 16px 0 rgba(0,0,0,0.08)",
        "player":     "0 8px 32px 0 rgba(0,0,0,0.12), 0 2px 8px 0 rgba(0,0,0,0.06)",
        "pin":        "0 2px 8px 0 rgba(139,92,246,0.30)",   // сиреневая тень для пина
        "pin-manual": "0 2px 8px 0 rgba(5,150,105,0.30)",   // изумрудная для manual
        "dropdown":   "0 4px 16px 0 rgba(0,0,0,0.08), 0 1px 4px 0 rgba(0,0,0,0.04)",
        "focus":      "0 0 0 3px rgba(139,92,246,0.25)",     // focus-ring
        "none":       "none",
      },

      // ── Скругления ───────────────────────────────────────────────────────────
      borderRadius: {
        "sm":   "0.25rem",    // 4px  — бейджи, теги
        "md":   "0.5rem",     // 8px  — кнопки, inputs
        "lg":   "0.75rem",    // 12px — карточки, dropdown
        "xl":   "1rem",       // 16px — модалки, плеер
        "2xl":  "1.25rem",    // 20px — большие карточки
        "full": "9999px",     // пины, аватары
      },

      // ── Анимации ────────────────────────────────────────────────────────────
      keyframes: {
        // Появление Audio Pin (используется при создании пина)
        "pin-appear": {
          "0%":   { transform: "scale(0)", opacity: "0" },
          "60%":  { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)",  opacity: "1" },
        },
        // Пульсация для статуса "processing" (PDF обрабатывается)
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
        // Slide-in для Toast уведомлений (справа)
        "slide-in-right": {
          "0%":   { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)",    opacity: "1" },
        },
        // Slide-out для Toast уведомлений (вправо при закрытии)
        "slide-out-right": {
          "0%":   { transform: "translateX(0)",    opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        // Fade-in для модалок
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Scale-up для модалок (появление)
        "modal-enter": {
          "0%":   { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        // Shimmer для скелетонов загрузки
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pin-appear":       "pin-appear 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-slow":       "pulse-slow 2s ease-in-out infinite",
        "slide-in-right":   "slide-in-right 0.2s ease-out",
        "slide-out-right":  "slide-out-right 0.15s ease-in forwards",
        "fade-in":          "fade-in 0.15s ease-out",
        "modal-enter":      "modal-enter 0.15s ease-out",
        "shimmer":          "shimmer 1.5s infinite linear",
        "spin-slow":        "spin 2s linear infinite",
      },

      // ── Переходы ─────────────────────────────────────────────────────────────
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "250": "250ms",
        "350": "350ms",
      },
      transitionTimingFunction: {
        "bounce-sm": "cubic-bezier(0.34, 1.2, 0.64, 1)",
      },

      // ── Размеры ──────────────────────────────────────────────────────────────
      width: {
        "sidebar": "240px",   // ширина UnmappedSidebar
        "player":  "280px",   // ширина FloatingPlayer
        "navbar":  "64px",    // ширина свёрнутого navbar в ReaderLayout
        "book-card": "160px", // ширина BookCard на полке
      },
      height: {
        "navbar":    "56px",  // высота AppNavbar
        "book-cover": "213px", // высота обложки (3:4 к 160px)
      },
      maxWidth: {
        "modal-sm": "384px",
        "modal-md": "512px",
        "modal-lg": "640px",
        "modal-xl": "768px",
      },
      zIndex: {
        "dropdown": "50",
        "modal-backdrop": "100",
        "modal": "110",
        "player": "120",
        "toast": "130",
        "tooltip": "140",
      },
    },
  },

  plugins: [],
};

export default config;
