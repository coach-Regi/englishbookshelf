/**
 * src/App.tsx
 * ───────────
 * Корневой компонент приложения.
 * Монтирует роутер и глобальный Toast-контейнер.
 * Все остальное — в layouts и pages.
 */

import { AppRouter } from "./router";

export default function App() {
  return <AppRouter />;
}
