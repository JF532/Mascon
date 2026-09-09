import type { FiltroAtividade, OrdenacaoAtividade } from "../types/atividade";

interface Props {
  filtro: FiltroAtividade;
  ordenacao: OrdenacaoAtividade;
  onFiltro: (f: FiltroAtividade) => void;
  onOrdenacao: (o: OrdenacaoAtividade) => void;
}

export function FiltrosBar({ filtro, ordenacao, onFiltro, onOrdenacao }: Props) {
  const filtros: { id: FiltroAtividade; label: string }[] = [
    { id: "todas", label: "Todas" },
    { id: "pendentes", label: "Pendentes" },
    { id: "atrasadas", label: "Atrasadas" },
    { id: "concluidas", label: "Concluídas" },
  ];

  return (
    <div className="filtros-bar">
      <div className="filtros-group" role="tablist" aria-label="Filtros">
        {filtros.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filtro === f.id}
            className={`pill ${filtro === f.id ? "pill-active" : ""}`}
            onClick={() => onFiltro(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <label className="select-label">
        Ordenar
        <select
          className="select"
          value={ordenacao}
          onChange={(e) => onOrdenacao(e.target.value as OrdenacaoAtividade)}
        >
          <option value="prazo-asc">Prazo — mais próximo</option>
          <option value="prazo-desc">Prazo — mais distante</option>
          <option value="criadaEm-desc">Mais recentes</option>
          <option value="criadaEm-asc">Mais antigas</option>
        </select>
      </label>
    </div>
  );
}
