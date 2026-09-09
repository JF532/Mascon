export interface UsuarioMock {
  id: string;
  nome: string;
  papel: "user" | "admin";
}

// Mapa interno username -> email técnico (sem senhas)
// Usuário digita "Afonso" ou "Marcondes", código converte para @mascon.local
export const USUARIOS_PERMITIDOS: Record<string, string> = {
  afonso: "afonso@mascon.local",
  marcondes: "marcondes@mascon.local",
};

export function usernameParaEmail(username: string): string | null {
  const key = username.trim().toLowerCase();
  return USUARIOS_PERMITIDOS[key] ?? null;
}

export function emailParaNome(email: string | null | undefined): string {
  if (!email) return "Usuário";
  const lower = email.toLowerCase();
  if (lower === "afonso@mascon.local") return "Afonso";
  if (lower === "marcondes@mascon.local") return "Marcondes";
  // fallback: parte antes do @
  return email.split("@")[0] ?? "Usuário";
}

export function getUsuarioById(id: string): UsuarioMock | undefined {
  // compat: não usado com Auth real, mantido para não quebrar imports legados
  const nome = emailParaNome(id.includes("@") ? id : `${id}@mascon.local`);
  return { id, nome, papel: "user" };
}
