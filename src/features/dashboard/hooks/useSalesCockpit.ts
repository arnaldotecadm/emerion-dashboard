import { useEffect, useState } from "react";
import { fetchSalesCockpit } from "../services/salesCockpitService";
import type { SalesCockpit } from "../types/salesCockpit";

interface SalesCockpitResult {
  data: SalesCockpit | null;
  loading: boolean;
  error: string | null;
}

/** Loads executive sales metrics and recent orders from the backend. */
export function useSalesCockpit(): SalesCockpitResult {
  const [result, setResult] = useState<{ data: SalesCockpit | null; error: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSalesCockpit()
      .then((data) => {
        if (!cancelled) setResult({ data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            data: null,
            error: err instanceof Error ? err.message : "Não foi possível carregar o cockpit de vendas.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!result) return { data: null, loading: true, error: null };
  return { ...result, loading: false };
}
