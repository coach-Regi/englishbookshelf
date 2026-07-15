// src/pages/DashboardPage.tsx
// Заглушка — полная реализация в Sprint F-2.

import { useAuthStore } from "@/stores/authStore";
import { BookOpen, FolderOpen } from "lucide-react";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isStudent = user?.role === "student";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

      {/* Приветствие */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">
          {isStudent ? "Мои материалы" : "Библиотека"}
        </h1>
        <p className="text-secondary mt-1">
          {isStudent
            ? "Книги и материалы, назначенные вашим преподавателем"
            : "Управляйте учебниками и материалами"}
        </p>
      </div>

      {/* Секция Books */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-medium text-primary">Книги</h2>
        </div>
        {/* Полка-заглушка */}
        <div className="relative pb-2">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 rounded-lg bg-subtle border border-border
                           animate-pulse"
                style={{ height: 213 }}
              />
            ))}
            {/* Кнопка "Добавить" */}
            {!isStudent && (
              <div
                className="flex-shrink-0 w-40 rounded-lg border-2 border-dashed border-border
                           flex items-center justify-center cursor-pointer
                           hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20
                           transition-colors"
                style={{ height: 213 }}
              >
                <span className="text-3xl text-border">+</span>
              </div>
            )}
          </div>
          {/* Линия полки */}
          <div className="shelf-line h-0" />
        </div>
      </section>

      {/* Секция Materials */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-medium text-primary">Материалы</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-subtle border border-border animate-pulse"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
