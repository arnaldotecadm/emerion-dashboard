import { useCallback, useEffect, useState } from "react";
import { fetchVendedores } from "../services/vendedorService";
import type { VendedorPage } from "../types/vendedor";

export interface UseVendedoresResult {
  data: VendedorPage | null;
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  refetch: () => void;
}

/** Loads a paginated slice of vendedores from the ERP backend and exposes pagination controls. */
export function useVendedores(initialPage = 0, initialSize = 10): UseVendedoresResult {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [data, setData] = useState<VendedorPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchVendedores(page, size)
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
  }, [page, size, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const changeSize = useCallback((nextSize: number) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  return { data, loading, error, page, size, setPage, setSize: changeSize, refetch };
}
