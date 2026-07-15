// src/pages/LoginPage.tsx
// Заглушка — полная реализация в Sprint F-2.

import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-book-card">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">Вход</h1>
        <p className="text-sm text-secondary mt-1">
          Войдите в свой аккаунт English Bookshelf
        </p>
      </div>

      {/* Форма-заглушка */}
      <div className="space-y-4">
        <div className="h-10 bg-subtle rounded-md animate-pulse" />
        <div className="h-10 bg-subtle rounded-md animate-pulse" />
        <div className="h-10 bg-purple-500 rounded-md opacity-80 animate-pulse" />
      </div>

      <p className="mt-4 text-center text-sm text-secondary">
        Нет аккаунта?{" "}
        <Link to="/register" className="text-purple-500 hover:text-purple-600 font-medium">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
