import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { assertAuth } from "../firebase/config";
import { usernameParaEmail, emailParaNome } from "../types/usuario";

export interface AuthContextValue {
  user: User | null;
  // compat com código legado que espera usuario.nome
  usuario: { uid: string; email: string | null; nome: string } | null;
  loading: boolean;
  login: (username: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve estar dentro de AuthProvider");
  return ctx;
}

// alias compat para não quebrar imports antigos
export const AuthMockContext = AuthContext;
export const useAuthMock = useAuth;

export function useAuthProvider(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let auth;
    try {
      auth = assertAuth();
    } catch {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const usuario = user
    ? {
        uid: user.uid,
        email: user.email,
        nome: emailParaNome(user.email),
      }
    : null;

  const login = async (username: string, senha: string) => {
    if (!username.trim() || !senha) {
      throw new Error("Informe usuário e senha.");
    }
    const email = usernameParaEmail(username);
    if (!email) {
      // Mensagem genérica para não enumerar usuários
      throw new Error("Usuário ou senha inválidos.");
    }
    const auth = assertAuth();
    await signInWithEmailAndPassword(auth, email, senha);
  };

  const logout = async () => {
    const auth = assertAuth();
    await signOut(auth);
  };

  return { user, usuario, loading, login, logout };
}

export function mapFirebaseAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const msg = (err as Error)?.message ?? "";
  // Erros de credencial - mensagem genérica por segurança
  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password" ||
    code === "auth/invalid-email"
  ) {
    return "Usuário ou senha inválidos.";
  }
  if (code === "auth/too-many-requests") {
    return "Muitas tentativas. Tente novamente em alguns minutos.";
  }
  if (code === "auth/network-request-failed") {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }
  if (code === "auth/user-disabled") {
    return "Usuário desabilitado. Contate o administrador.";
  }
  if (msg.includes("Firebase não configurado") || msg.includes("Auth não configurado")) {
    return msg;
  }
  return "Não foi possível entrar. Tente novamente.";
}
