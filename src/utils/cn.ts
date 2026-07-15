/**
 * src/utils/cn.ts
 * ────────────────
 * Утилита для объединения Tailwind-классов.
 *
 * clsx: объединяет классы с поддержкой условий, массивов, объектов.
 * tailwind-merge: разрешает конфликты Tailwind-классов (bg-red-500 + bg-blue-500 → bg-blue-500).
 *
 * Использование:
 *   cn("px-4 py-2", isActive && "bg-purple-500", className)
 *   cn({ "opacity-50": disabled, "cursor-not-allowed": disabled })
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
