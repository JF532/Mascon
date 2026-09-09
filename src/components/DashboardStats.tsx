import type { Atividade } from "../types/atividade";
import { isAtrasada } from "../utils/datas";

export function DashboardStats({ atividades }: { atividades: Atividade[] }) {
  const total = atividades.length;
  const concluidas = atividades.filter((a) => a.concluida).length;
  const atrasadas = atividades.filter((a) => isAtrasada(a.prazo, a.concluida)).length;
  const pendentes = total - concluidas - atrasadas;

  const items = [
    { label: "Total", value: total, tone: "neutral" },
    { label: "Pendentes", value: pendentes, tone: "pendente" },
    { label: "Atrasadas", value: atrasadas, tone: "atrasada" },
    { label: "Concluídas", value: concluidas, tone: "concluida" },
  ] as const;

  return (
    <div className="stats-grid">
      {items.map((it) => (
        <div key={it.label} className={`stat-card stat-${it.tone}`}>
          <span className="stat-label">{it.label}</span>
          <span className="stat-value">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
