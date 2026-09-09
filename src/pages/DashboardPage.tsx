import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAtividades } from "../hooks/useAtividades";
import { Header } from "../components/Header";
import { DashboardStats } from "../components/DashboardStats";
import { FiltrosBar } from "../components/FiltrosBar";
import { AtividadeCard } from "../components/AtividadeCard";
import { AtividadeForm } from "../components/AtividadeForm";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { Atividade, FiltroAtividade, OrdenacaoAtividade } from "../types/atividade";
import { filtrarAtividades, ordenarAtividades } from "../utils/status";
import { criarAtividade, editarAtividade, excluirAtividade, concluirAtividade, ConcluidaError } from "../firebase/atividades";

export function DashboardPage() {
  const { usuario } = useAuth();
  const { atividades, loading, erro } = useAtividades();

  const [filtro, setFiltro] = useState<FiltroAtividade>("todas");
  const [ordenacao, setOrdenacao] = useState<OrdenacaoAtividade>("prazo-asc");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Atividade | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Atividade | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [concluindoId, setConcluindoId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  const counts = useMemo(() => atividades.length, [atividades]);

  const visiveis = useMemo(() => {
    const filtradas = filtrarAtividades(atividades, filtro);
    return ordenarAtividades(filtradas, ordenacao);
  }, [atividades, filtro, ordenacao]);

  function showToast(msg: string, tone: "success" | "error" = "success") {
    setToast(msg);
    setToastTone(tone);
    setTimeout(() => setToast(null), 3500);
  }

  async function handleCreate(input: { titulo: string; descricao: string; prazo: Date }) {
    if (!usuario) throw new Error("Usuário não autenticado");
    await criarAtividade(input);
    showToast("Atividade criada com sucesso.");
  }

  async function handleEdit(input: { titulo: string; descricao: string; prazo: Date }) {
    if (!editing) return;
    await editarAtividade(editing.id, input);
    showToast("Atividade atualizada.");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await excluirAtividade(deleteTarget.id);
      showToast("Atividade excluída.");
      setDeleteTarget(null);
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setDeleting(false);
    }
  }

  async function handleConcluir(id: string) {
    if (!usuario) return;
    setConcluindoId(id);
    try {
      await concluirAtividade(id);
      showToast("Tarefa concluída!");
    } catch (e) {
      if (e instanceof ConcluidaError) {
        showToast(e.message, "error");
      } else {
        showToast((e as Error).message ?? "Não foi possível concluir. Tente novamente.", "error");
      }
    } finally {
      setConcluindoId(null);
    }
  }

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="page-head">
          <div>
            <h2 className="page-title">Atividades compartilhadas</h2>
            <p className="page-sub">
              {loading ? "Carregando..." : `${counts} ${counts === 1 ? "atividade" : "atividades"} • visíveis: ${visiveis.length}`}
            </p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => { setEditing(null); setFormOpen(true); }}>
            + Nova atividade
          </button>
        </div>

        <DashboardStats atividades={atividades} />

        <FiltrosBar filtro={filtro} ordenacao={ordenacao} onFiltro={setFiltro} onOrdenacao={setOrdenacao} />

        {erro && <div className="alert alert-error">{erro}</div>}

        {loading && <div className="skeleton-grid">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" />)}</div>}

        {!loading && visiveis.length === 0 && (
          <div className="empty">
            <p>Nenhuma atividade encontrada para este filtro.</p>
            <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
              Criar primeira atividade
            </button>
          </div>
        )}

        {!loading && visiveis.length > 0 && (
          <div className="cards-grid">
            {visiveis.map((a) => (
              <AtividadeCard
                key={a.id}
                atividade={a}
                concluindoId={concluindoId}
                onConcluir={handleConcluir}
                onEditar={(at) => { setEditing(at); setFormOpen(true); }}
                onExcluir={(at) => setDeleteTarget(at)}
              />
            ))}
          </div>
        )}
      </main>

      <AtividadeForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={editing ? handleEdit : handleCreate}
        atividade={editing}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Excluir tarefa?"
        message={`Tem certeza que deseja excluir "${deleteTarget?.titulo}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="danger"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {toast && <div className={`toast toast-${toastTone}`}>{toast}</div>}
    </div>
  );
}
