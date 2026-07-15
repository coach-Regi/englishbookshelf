// src/pages/JoinGroupPage.tsx
// Заглушка — полная реализация в Sprint F-4.

import { useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function JoinGroupPage() {
  const { token } = useParams<{ token: string }>();

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-book-card text-center">
      <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30
                      flex items-center justify-center mx-auto mb-4">
        <UserPlus className="w-7 h-7 text-purple-500" />
      </div>
      <h1 className="text-xl font-semibold text-primary mb-2">
        Вступление в группу
      </h1>
      <p className="text-sm text-secondary mb-1">
        Токен:{" "}
        <code className="font-mono bg-subtle px-1 rounded text-xs">{token}</code>
      </p>
      <p className="text-xs text-placeholder mt-3">
        Полная реализация — Sprint F-4
      </p>
    </div>
  );
}
