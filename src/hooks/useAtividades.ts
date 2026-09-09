import { useEffect, useState } from "react";
import type { Atividade } from "../types/atividade";
import { subscribeAtividades } from "../firebase/atividades";

export function useAtividades() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    try {
      const unsub = subscribeAtividades(
        (list) => {
          if (!mounted) return;
          setAtividades(list);
          setLoading(false);
          setErro(null);
        },
        (err) => {
          if (!mounted) return;
          setErro(err.message ?? "Erro ao carregar tarefas.");
          setLoading(false);
        }
      );
      return () => {
        mounted = false;
        unsub();
      };
    } catch (e) {
      setErro((e as Error).message);
      setLoading(false);
    }
  }, []);

  return { atividades, loading, erro };
}
