import { useEffect, useState } from "react";
import { fetchCustomerOrdersOverTime } from "../services/salesService";
import type { CustomerOrdersOverTime } from "../types/customerOrdersOverTime";

export interface UseCustomerOrdersOverTimeResult {
  data: CustomerOrdersOverTime[];
  loading: boolean;
  error: string | null;
}

/** Loads monthly sales totals and order counts for the "Vendas Totais" page. */
export function useCustomerOrdersOverTime(startDate: string, endDate: string): UseCustomerOrdersOverTimeResult {
  const [result, setResult] = useState<{
    key: string;
    data: CustomerOrdersOverTime[];
    error: string | null;
  } | null>(null);
  const requestKey = `${startDate}:${endDate}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchCustomerOrdersOverTime(startDate, endDate);
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      } catch (err: unknown) {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: [],
            error: err instanceof Error ? err.message : "Não foi possível carregar as vendas por período.",
          });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [endDate, requestKey, startDate]);

  if (result?.key !== requestKey) {
    return { data: [], loading: true, error: null };
  }

  return { data: result.data, loading: false, error: result.error };
}
