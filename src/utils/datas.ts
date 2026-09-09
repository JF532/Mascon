import { Timestamp } from "firebase/firestore";

export function timestampToDate(ts: Timestamp | null | undefined): Date | null {
  if (!ts) return null;
  return ts.toDate();
}

export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

export function formatDateBR(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTimeBR(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toInputDateValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseInputDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function isAtrasada(prazo: Timestamp | null | undefined, concluida: boolean): boolean {
  if (concluida) return false;
  if (!prazo) return false;
  const prazoDate = prazo.toDate();
  const hojeInicio = new Date();
  hojeInicio.setHours(0, 0, 0, 0);
  return prazoDate < hojeInicio;
}

export function getStatusLabel(
  concluida: boolean,
  prazo: Timestamp | null | undefined
): { label: string; tone: "pendente" | "atrasada" | "concluida" } {
  if (concluida) return { label: "Concluída", tone: "concluida" };
  if (isAtrasada(prazo, concluida)) return { label: "Atrasada", tone: "atrasada" };
  return { label: "Pendente", tone: "pendente" };
}
