/**
 * src/layouts/ReaderLayout.tsx
 * ─────────────────────────────
 * Fullscreen layout для Book Reader.
 *
 * Структура (Edit mode, все панели открыты):
 *   ┌──────────┬─────────────────────────────┐
 *   │  icon-   │        ReaderNavbar         │  ← 48px, сворачиваемый
 *   │  bar     ├─────────────────────────────┤
 *   │ (240px)  │                             │
 *   │ Unmapped │    PDF Viewport             │
 *   │ Sidebar  │    (растягивается)          │
 *   │          │                             │
 *   └──────────┴─────────────────────────────┘
 *
 * Preview mode / Fullscreen: сайдбар скрыт, PDF занимает 100% ширины.
 * Кнопка fullscreen скрывает все панели.
 */

import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Pencil,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useReaderStore } from "@/stores/readerStore";
import { cn } from "@/utils/cn";

interface ReaderLayoutProps {
  children: React.ReactNode;
}

export function ReaderLayout({ children }: ReaderLayoutProps) {
  const { mode, setMode, isFullscreen, toggleFullscreen } = useReaderStore();

  return (
    <div className="h-screen bg-canvas flex flex-col overflow-hidden">
      {/* ── Компактный Navbar ────────────────────────────────────────────── */}
      <ReaderNavbar
        mode={mode}
        isFullscreen={isFullscreen}
        onModeChange={setMode}
        onFullscreen={toggleFullscreen}
      />

      {/* ── Рабочая область ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ── Компактный Navbar ──────────────────────────────────────────────────────────

function ReaderNavbar({
  mode,
  isFullscreen,
  onModeChange,
  onFullscreen,
}: {
  mode: "preview" | "edit";
  isFullscreen: boolean;
  onModeChange: (mode: "preview" | "edit") => void;
  onFullscreen: () => void;
}) {
  return (
    <header
      className={cn(
        "h-12 flex-shrink-0 flex items-center justify-between px-4",
        "bg-surface border-b border-border",
        isFullscreen && "hidden" // В fullscreen navbar скрывается
      )}
    >
      {/* Назад */}
      <Link
        to="/dashboard"
        className="flex items-center gap-1.5 text-sm text-secondary
                   hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Библиотека</span>
      </Link>

      {/* Переключатель Preview / Edit Pins */}
      <div
        className="flex items-center bg-subtle rounded-lg p-0.5 gap-0.5"
        role="group"
        aria-label="Режим редактора"
      >
        <ModeButton
          active={mode === "preview"}
          icon={<Eye className="w-3.5 h-3.5" />}
          label="Preview"
          onClick={() => onModeChange("preview")}
        />
        <ModeButton
          active={mode === "edit"}
          icon={<Pencil className="w-3.5 h-3.5" />}
          label="Edit Pins"
          onClick={() => onModeChange("edit")}
        />
      </div>

      {/* Fullscreen toggle */}
      <button
        onClick={onFullscreen}
        className="w-8 h-8 flex items-center justify-center rounded-md
                   text-secondary hover:text-primary hover:bg-subtle
                   transition-colors"
        title={isFullscreen ? "Свернуть" : "Развернуть на весь экран"}
        aria-label={isFullscreen ? "Свернуть" : "Развернуть"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>
    </header>
  );
}

function ModeButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
        "transition-colors",
        active
          ? "bg-surface text-primary shadow-sm"
          : "text-secondary hover:text-primary"
      )}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}
