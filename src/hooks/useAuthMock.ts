import { createContext, useContext } from "react";
import type { UsuarioMock } from "../types/usuario";

export interface AuthMockContextValue {
  usuario: UsuarioMock | null;
  login: (u: UsuarioMock) => void;
  logout: () => void;
}

export const AuthMockContext = createContext<AuthMockContextValue | null>(null);

export function useAuthMock(): AuthMockContextValue {
  const ctx = useContext(AuthMockContext);
  if (!ctx) throw new Error("useAuthMock deve estar dentro de AuthMockProvider");
  return ctx;
}
