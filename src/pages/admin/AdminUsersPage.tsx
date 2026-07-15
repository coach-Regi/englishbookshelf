// src/pages/admin/AdminUsersPage.tsx
// Заглушка — полная реализация в Sprint F-5.

import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Users className="w-5 h-5 text-purple-500" />
        <h1 className="text-2xl font-semibold text-primary">Пользователи</h1>
      </div>

      {/* Table skeleton */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex gap-4 px-4 py-3 border-b border-border bg-subtle">
          {["Email", "Имя", "Роль", "Статус", ""].map((h) => (
            <div key={h} className="flex-1 text-xs font-medium text-secondary uppercase tracking-wide">
              {h}
            </div>
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-border last:border-0 animate-pulse">
            <div className="flex-1 h-4 bg-subtle rounded" />
            <div className="flex-1 h-4 bg-subtle rounded" />
            <div className="w-16 h-4 bg-subtle rounded" />
            <div className="w-16 h-4 bg-subtle rounded" />
            <div className="w-8 h-4 bg-subtle rounded" />
          </div>
        ))}
      </div>

      <p className="text-sm text-placeholder mt-6 text-center">
        Управление пользователями — Sprint F-5
      </p>
    </div>
  );
}
