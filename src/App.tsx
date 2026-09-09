import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthMockContext } from "./hooks/useAuthMock";
import type { UsuarioMock } from "./types/usuario";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

const STORAGE_KEY = "mascon_usuario";

function usePersistedUser() {
  const [usuario, setUsuario] = useState<UsuarioMock | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UsuarioMock) : null;
    } catch {
      return null;
    }
  });

  const login = (u: UsuarioMock) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUsuario(u);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  };

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setUsuario(e.newValue ? (JSON.parse(e.newValue) as UsuarioMock) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { usuario, login, logout };
}

function Protected() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const hasUser = Boolean(raw);
  if (!hasUser) return <Navigate to="/login" replace />;
  return <DashboardPage />;
}

export default function App() {
  const auth = usePersistedUser();

  return (
    <AuthMockContext.Provider value={auth}>
      <HashRouter>
        <Routes>
          <Route
            path="/login"
            element={auth.usuario ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route path="/" element={<Protected />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthMockContext.Provider>
  );
}
