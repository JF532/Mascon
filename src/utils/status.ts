import type { Atividade } from "../types/atividade";
import { isAtrasada } from "./datas";

export function getStatus(atividade: Atividade): "pendente" | "atrasada" | "concluida" {
  if (atividade.concluida) return "concluida";
  if (isAtrasada(atividade.prazo, atividade.concluida)) return "atrasada";
  return "pendente";
}

export function filtrarAtividades(
  atividades: Atividade[],
  filtro: import("../types/atividade").FiltroAtividade
): Atividade[] {
  switch (filtro) {
    case "pendentes":
      return atividades.filter((a) => !a.concluida && !isAtrasada(a.prazo, a.concluida));
    case "atrasadas":
      return atividades.filter((a) => isAtrasada(a.prazo, a.concluida));
    case "concluidas":
      return atividades.filter((a) => a.concluida);
    case "todas":
    default:
      return atividades;
  }
}

export function ordenarAtividades(
  atividades: Atividade[],
  ordenacao: import("../types/atividade").OrdenacaoAtividade
): Atividade[] {
  const copy = [...atividades];
  switch (ordenacao) {
    case "prazo-asc":
      return copy.sort((a, b) => (a.prazo?.toMillis() ?? 0) - (b.prazo?.toMillis() ?? 0));
    case "prazo-desc":
      return copy.sort((a, b) => (b.prazo?.toMillis() ?? 0) - (a.prazo?.toMillis() ?? 0));
    case "criadaEm-asc":
      return copy.sort((a, b) => (a.criadaEm?.toMillis() ?? 0) - (b.criadaEm?.toMillis() ?? 0));
    case "criadaEm-desc":
      return copy.sort((a, b) => (b.criadaEm?.toMillis() ?? 0) - (a.criadaEm?.toMillis() ?? 0));
    default:
      return copy;
  }
}
