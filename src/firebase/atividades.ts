import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
  type Unsubscribe,
} from "firebase/firestore";
import { assertDb } from "./config";
import type { Atividade, AtividadeInput } from "../types/atividade";
import type { UsuarioMock } from "../types/usuario";

const COLLECTION = "atividades";

export class ConcluidaError extends Error {
  constructor(public concluidaPorNome: string) {
    super(`Esta tarefa já foi concluída por ${concluidaPorNome}.`);
    this.name = "ConcluidaError";
  }
}

/** Converte doc Firestore -> Atividade tipada */
function mapDocToAtividade(id: string, data: Record<string, unknown>): Atividade {
  return {
    id,
    titulo: data.titulo as string,
    descricao: (data.descricao as string) ?? "",
    criadaPor: data.criadaPor as string,
    criadaPorNome: data.criadaPorNome as string,
    criadaEm: data.criadaEm as Timestamp,
    prazo: data.prazo as Timestamp,
    concluida: Boolean(data.concluida),
    concluidaPor: (data.concluidaPor as string | null) ?? null,
    concluidaPorNome: (data.concluidaPorNome as string | null) ?? null,
    concluidaEm: (data.concluidaEm as Timestamp | null) ?? null,
  };
}

/** ÚNICO listener global — usar apenas uma vez no app */
export function subscribeAtividades(
  onData: (atividades: Atividade[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const db = assertDb();
  const q = query(collection(db, COLLECTION), orderBy("criadaEm", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Atividade[] = snapshot.docs.map((d) =>
        mapDocToAtividade(d.id, d.data())
      );
      onData(list);
    },
    (err) => onError(err as Error)
  );
}

export async function criarAtividade(
  input: AtividadeInput,
  usuario: UsuarioMock
): Promise<string> {
  const db = assertDb();
  if (!input.titulo.trim()) throw new Error("Título é obrigatório.");
  if (input.titulo.trim().length < 3) throw new Error("Título deve ter ao menos 3 caracteres.");
  const ref = await addDoc(collection(db, COLLECTION), {
    titulo: input.titulo.trim(),
    descricao: input.descricao.trim(),
    criadaPor: usuario.id,
    criadaPorNome: usuario.nome,
    criadaEm: serverTimestamp(),
    prazo: Timestamp.fromDate(input.prazo),
    concluida: false,
    concluidaPor: null,
    concluidaPorNome: null,
    concluidaEm: null,
  });
  return ref.id;
}

export async function editarAtividade(
  id: string,
  input: AtividadeInput
): Promise<void> {
  const db = assertDb();
  if (!input.titulo.trim()) throw new Error("Título é obrigatório.");
  const ref = doc(db, COLLECTION, id);
  // Preserva concluida/concluidaPor/concluidaEm — não sobrescreve
  await updateDoc(ref, {
    titulo: input.titulo.trim(),
    descricao: input.descricao.trim(),
    prazo: Timestamp.fromDate(input.prazo),
  });
}

export async function excluirAtividade(id: string): Promise<void> {
  const db = assertDb();
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

/** Conclusão atômica — transaction garante apenas UM consegue */
export async function concluirAtividade(
  atividadeId: string,
  usuario: UsuarioMock
): Promise<void> {
  const db = assertDb();
  const ref = doc(db, COLLECTION, atividadeId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) {
      throw new Error("Tarefa não encontrada. Ela pode ter sido excluída.");
    }
    const data = snap.data() as Record<string, unknown>;
    if (data.concluida === true) {
      const nome = (data.concluidaPorNome as string) ?? "outro usuário";
      throw new ConcluidaError(nome);
    }
    tx.update(ref, {
      concluida: true,
      concluidaPor: usuario.id,
      concluidaPorNome: usuario.nome,
      concluidaEm: serverTimestamp(),
    });
  });
}
