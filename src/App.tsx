import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, useAuth, useAuthProvider } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

function Protected() {
  const { usuario, loading } = useAuth();
  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Carregando...</p>
        </div>
      </div>
    );
  }
  if (!usuario) return <Navigate to="/login" replace />;
  return <DashboardPage />;
}

function LoginRoute() {
  const { usuario, loading } = useAuth();
  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Carregando...</p>
        </div>
      </div>
    );
  }
  if (usuario) return <Navigate to="/" replace />;
  return <LoginPage />;
}

export default function App() {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/" element={<Protected />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}
