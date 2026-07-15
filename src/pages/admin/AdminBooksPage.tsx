// src/pages/admin/AdminBooksPage.tsx
// Дополнительная страница (не в текущем роутере, добавьте при необходимости).

import { BookOpen } from "lucide-react";

export default function AdminBooksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-purple-500" />
        <h1 className="text-2xl font-semibold text-primary">
          Все книги (Admin)
        </h1>
      </div>
      <p className="text-secondary">
        Список всех книг платформы — Sprint F-5.
      </p>
    </div>
  );
}
