import { useEffect, useState } from "react";
import { fetchVendedorByExternalId } from "../services/vendedorService";
import type { Vendedor } from "../types/vendedor";

export interface UseVendedorByExternalIdResult {
  data: Vendedor | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Looks up a vendedor by its ERP `externalId`, via `GET /api/v1/vendedores/by-external-id/:externalId`. */
export function useVendedorByExternalId(externalId: string | undefined): UseVendedorByExternalIdResult {
  const [data, setData] = useState<Vendedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!externalId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    fetchVendedorByExternalId(externalId)
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
  }, [externalId]);

  return { data, loading, error, notFound };
}
