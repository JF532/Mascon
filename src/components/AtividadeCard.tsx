import type { Atividade } from "../types/atividade";
import { formatDateBR, formatDateTimeBR, getStatusLabel } from "../utils/datas";

interface Props {
  atividade: Atividade;
  onConcluir: (id: string) => void;
  onEditar: (a: Atividade) => void;
  onExcluir: (a: Atividade) => void;
  concluindoId: string | null;
}

export function AtividadeCard({ atividade, onConcluir, onEditar, onExcluir, concluindoId }: Props) {
  const status = getStatusLabel(atividade.concluida, atividade.prazo);
  const prazoDate = atividade.prazo ? atividade.prazo.toDate() : null;
  const criadaEmDate = (atividade.criadaEm as unknown as { toDate?: () => Date } | null)?.toDate?.() ?? null;
  const concluidaEmDate = atividade.concluidaEm?.toDate() ?? null;

  return (
    <article className={`card card-${status.tone}`}>
      <div className="card-head">
        <h3 className="card-title">{atividade.titulo}</h3>
        <span className={`badge badge-${status.tone}`}>
          {status.tone === "concluida" ? "🟢" : status.tone === "atrasada" ? "🔴" : "🟡"} {status.label}
        </span>
      </div>

      {atividade.descricao && <p className="card-desc">{atividade.descricao}</p>}

      <div className="card-meta">
        <span>📅 Prazo: {formatDateBR(prazoDate)}</span>
        <span>👤 Criada por: {atividade.criadaPorNome}</span>
        <span>🕒 Criada em: {formatDateTimeBR(criadaEmDate)}</span>
      </div>

      {atividade.concluida && (
        <div className="card-concluida">
          <span>✅ Concluída por: {atividade.concluidaPorNome}</span>
          <span>📅 Concluída em: {formatDateTimeBR(concluidaEmDate)}</span>
        </div>
      )}

      <div className="card-actions">
        {!atividade.concluida && (
          <button
            className="btn btn-primary"
            disabled={concluindoId === atividade.id}
            onClick={() => onConcluir(atividade.id)}
          >
            {concluindoId === atividade.id ? "Concluindo..." : "Concluir"}
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => onEditar(atividade)}>
          Editar
        </button>
        <button className="btn btn-danger-ghost" onClick={() => onExcluir(atividade)}>
          Excluir
        </button>
      </div>
    </article>
  );
}
