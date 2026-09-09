import { MOCK_USERS } from "../types/usuario";
import { useAuthMock } from "../hooks/useAuthMock";

export function LoginPage() {
  const { login } = useAuthMock();

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark brand-mark-lg">M</div>
          <h1 className="login-title">MASCON</h1>
          <p className="login-sub">Sistema de Atividades</p>
          <p className="login-hint">Selecione seu usuário para entrar. Login mockado — sem senha.</p>
        </div>

        <div className="login-grid">
          {MOCK_USERS.map((u) => (
            <button key={u.id} className="user-tile" onClick={() => login(u)}>
              <span className="user-avatar">{u.nome.charAt(0)}</span>
              <span className="user-name">{u.nome}</span>
              <span className={`user-role ${u.papel}`}>{u.papel === "admin" ? "admin" : "usuário"}</span>
            </button>
          ))}
        </div>

        <p className="login-foot">
          Ambiente interno • Tarefas compartilhadas em tempo real
        </p>
      </div>
    </div>
  );
}
