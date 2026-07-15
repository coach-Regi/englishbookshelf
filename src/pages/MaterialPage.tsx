// src/pages/MaterialPage.tsx
// Заглушка — полная реализация в Sprint F-4.

import { useParams } from "react-router-dom";
import { FolderOpen } from "lucide-react";

export default function MaterialPage() {
  const { materialId } = useParams<{ materialId: string }>();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20
                        flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-primary">Материал</h1>
          <p className="text-xs text-secondary font-mono">{materialId}</p>
        </div>
      </div>
      <p className="text-secondary">
        Просмотр файлов материала — Sprint F-4.
      </p>
    </div>
  );
}
