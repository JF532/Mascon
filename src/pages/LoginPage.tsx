import { useState } from "react";
import { useAuth, mapFirebaseAuthError } from "../hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!usuario.trim() || !senha) {
      setErro("Informe usuário e senha.");
      return;
    }
    setLoading(true);
    try {
      await login(usuario, senha);
    } catch (err) {
      setErro(mapFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark brand-mark-lg">M</div>
          <h1 className="login-title">MASCON</h1>
          <p className="login-sub">Sistema de Atividades</p>
          <p className="login-hint">Acesso restrito • Digite seu usuário e senha</p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Usuário</span>
            <input
              className="input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Afonso ou Marcondes"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={loading}
              required
            />
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              className="input"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </label>

          {erro && <div className="alert alert-error" role="alert">{erro}</div>}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="login-foot">Ambiente interno • Tarefas compartilhadas em tempo real</p>
      </div>
    </div>
  );
}
