import { useEffect, useState } from "react";
import type { Atividade, AtividadeInput } from "../types/atividade";
import { parseInputDate, toInputDateValue } from "../utils/datas";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: AtividadeInput) => Promise<void>;
  atividade?: Atividade | null;
}

export function AtividadeForm({ open, onClose, onSubmit, atividade }: Props) {
  const isEditing = Boolean(atividade);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (atividade) {
      setTitulo(atividade.titulo);
      setDescricao(atividade.descricao);
      setPrazo(toInputDateValue(atividade.prazo.toDate()));
    } else {
      setTitulo("");
      setDescricao("");
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setPrazo(toInputDateValue(d));
    }
    setErro(null);
  }, [open, atividade]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!titulo.trim() || titulo.trim().length < 3) {
      setErro("Título deve ter ao menos 3 caracteres.");
      return;
    }
    if (!prazo) {
      setErro("Informe o prazo.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        prazo: parseInputDate(prazo),
      });
      onClose();
    } catch (err) {
      setErro((err as Error).message ?? "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{isEditing ? "Editar atividade" : "Nova atividade"}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>Título *</span>
            <input
              className="input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Fazer o relatório do cliente XC"
              maxLength={120}
              required
            />
          </label>

          <label className="field">
            <span>Descrição</span>
            <textarea
              className="input textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes adicionais (opcional)"
              rows={3}
              maxLength={500}
            />
          </label>

          <label className="field">
            <span>Prazo *</span>
            <input
              type="date"
              className="input"
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              required
            />
          </label>

          {erro && <div className="alert alert-error">{erro}</div>}

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : isEditing ? "Salvar" : "Criar atividade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
