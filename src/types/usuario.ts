export interface UsuarioMock {
  id: string;
  nome: string;
  papel: "user" | "admin";
}

export const MOCK_USERS: UsuarioMock[] = [
  { id: "joao", nome: "João", papel: "user" },
  { id: "maria", nome: "Maria", papel: "user" },
  { id: "pedro", nome: "Pedro", papel: "user" },
  { id: "lucas", nome: "Lucas", papel: "user" },
  { id: "admin", nome: "Admin", papel: "admin" },
];

export function getUsuarioById(id: string): UsuarioMock | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
