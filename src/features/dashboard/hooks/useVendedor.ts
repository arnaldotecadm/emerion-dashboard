import { useEffect, useState } from "react";
import { fetchVendedorById } from "../services/vendedorService";
import type { Vendedor } from "../types/vendedor";

export interface UseVendedorResult {
  data: Vendedor | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Loads a single vendedor by id from the ERP backend. */
export function useVendedor(id: string | undefined): UseVendedorResult {
  const [data, setData] = useState<Vendedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    fetchVendedorById(id)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Não foi possível carregar o vendedor.";
        if (message === "Vendedor não encontrado.") {
          setNotFound(true);
        } else {
          setError(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, loading, error, notFound };
}
