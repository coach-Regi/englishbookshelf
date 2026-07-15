// src/pages/admin/AdminStatsPage.tsx
// Заглушка — полная реализация в Sprint F-5.

import { BarChart3 } from "lucide-react";

const STAT_CARDS = [
  { label: "Пользователи", value: "—", color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
  { label: "Книги",        value: "—", color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400" },
  { label: "Материалы",    value: "—", color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
  { label: "Аудио Пинов",  value: "—", color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
];

export default function AdminStatsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-2 mb-8">
        <BarChart3 className="w-5 h-5 text-purple-500" />
        <h1 className="text-2xl font-semibold text-primary">Статистика</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, color }) => (
          <div key={label}
               className="bg-surface border border-border rounded-xl p-5">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <p className="text-2xl font-semibold text-primary">{value}</p>
            <p className="text-sm text-secondary mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-placeholder mt-8 text-center">
        Реальные данные из API — Sprint F-5
      </p>
    </div>
  );
}
