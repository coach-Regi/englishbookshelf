// src/pages/GroupsPage.tsx
// Заглушка — полная реализация в Sprint F-4.

import { Users } from "lucide-react";

export default function GroupsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Группы</h1>
          <p className="text-secondary mt-1">Управление классами и студентами</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md
                           bg-purple-500 text-white text-sm font-medium
                           hover:bg-purple-600 transition-colors opacity-60 cursor-not-allowed">
          + Создать группу
        </button>
      </div>

      {/* Карточки-заглушки */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}
               className="flex items-center gap-4 p-4 bg-surface border border-border
                          rounded-lg animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-subtle flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-subtle rounded w-48" />
              <div className="h-3 bg-subtle rounded w-32" />
            </div>
            <div className="flex items-center gap-1 text-secondary">
              <Users className="w-4 h-4" />
              <span className="text-sm">—</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
