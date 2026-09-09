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
      return copy.sort((a, b) => a.prazo.toMillis() - b.prazo.toMillis());
    case "prazo-desc":
      return copy.sort((a, b) => b.prazo.toMillis() - a.prazo.toMillis());
    case "criadaEm-asc":
      return copy.sort((a, b) => a.criadaEm.toMillis() - b.criadaEm.toMillis());
    case "criadaEm-desc":
      return copy.sort((a, b) => b.criadaEm.toMillis() - a.criadaEm.toMillis());
    default:
      return copy;
  }
}
