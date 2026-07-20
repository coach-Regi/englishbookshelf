import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // В будущем здесь будет реальный запрос к вашему Backend.
    console.log("Попытка регистрации:", { email, password });
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-book-card">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">Регистрация</h1>
        <p className="text-sm text-secondary mt-1">
          Создайте аккаунт English Bookshelf
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-10 px-3 bg-subtle border border-border rounded-md text-primary placeholder-placeholder focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-10 px-3 bg-subtle border border-border rounded-md text-primary placeholder-placeholder focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md transition-colors disabled:opacity-70 flex items-center justify-center"
        >
          {isLoading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-secondary">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="text-purple-500 hover:text-purple-600 font-medium">
          Войти
        </Link>
      </p>
    </div>
  );
}
