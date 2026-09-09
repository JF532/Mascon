import { useAuth } from "../hooks/useAuth";

export function Header() {
  const { usuario, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">MASCON</div>
            <div className="brand-sub">Sistema de Atividades</div>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="hello">
            Olá, <strong>{usuario?.nome ?? "Usuário"}</strong> 👋
          </span>
          <button className="btn btn-ghost" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
