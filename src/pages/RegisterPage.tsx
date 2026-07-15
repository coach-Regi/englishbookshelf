export default function RegisterPage() {
  return (
    <div>
      <h1>Регистрация</h1>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Введите ваш email" />
        </div>
        <div>
          <label>Пароль:</label>
          <input type="password" placeholder="Введите пароль" />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
    </div>
  );
}