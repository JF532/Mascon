import type { Timestamp } from "firebase/firestore";

export interface Atividade {
  id: string;
  titulo: string;
  descricao: string;
  criadaPor: string; // id do usuario mock
  criadaPorNome: string;
  criadaEm: Timestamp;
  prazo: Timestamp;
  concluida: boolean;
  concluidaPor: string | null;
  concluidaPorNome: string | null;
  concluidaEm: Timestamp | null;
}

export type AtividadeInput = {
  titulo: string;
  descricao: string;
  prazo: Date;
};

export type FiltroAtividade = "todas" | "pendentes" | "atrasadas" | "concluidas";
export type OrdenacaoAtividade = "prazo-asc" | "prazo-desc" | "criadaEm-desc" | "criadaEm-asc";
