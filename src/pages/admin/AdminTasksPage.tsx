// src/pages/admin/AdminTasksPage.tsx
// Заглушка — полная реализация в Sprint F-5.

import { Activity } from "lucide-react";

export default function AdminTasksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Activity className="w-5 h-5 text-purple-500" />
        <h1 className="text-2xl font-semibold text-primary">Очереди задач</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {["pdf_processing", "media_mapping", "default"].map((q) => (
          <div key={q} className="bg-surface border border-border rounded-xl p-4">
            <p className="text-xs font-mono text-secondary mb-1">{q}</p>
            <p className="text-2xl font-semibold text-primary">—</p>
            <p className="text-xs text-placeholder">задач в очереди</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-placeholder text-center">
        Мониторинг Celery-задач — Sprint F-5
      </p>
    </div>
  );
}
