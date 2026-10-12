import { useCallback, useEffect, useState } from "react";
import { fetchVendedores } from "../services/vendedorService";
import type { VendedorPage } from "../types/vendedor";

export interface UseVendedoresResult {
  data: VendedorPage | null;
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  situacao: "sim" | "nao" | "";
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSituacao: (situacao: "sim" | "nao" | "") => void;
  refetch: () => void;
}

/** Loads a paginated slice of vendedores from the ERP backend and exposes pagination controls. */
export function useVendedores(initialPage = 0, initialSize = 10): UseVendedoresResult {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [situacao, setSituacaoState] = useState<"sim" | "nao" | "">("");
  const [data, setData] = useState<VendedorPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchVendedores(page, size, undefined, situacao || undefined)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar os vendedores.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, size, situacao, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const changeSize = useCallback((nextSize: number) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  const changeSituacao = useCallback((nextSituacao: "sim" | "nao" | "") => {
    setSituacaoState(nextSituacao);
    setPage(0);
  }, []);

  return {
    data,
    loading,
    error,
    page,
    size,
    situacao,
    setPage,
    setSize: changeSize,
    setSituacao: changeSituacao,
    refetch,
  };
}
