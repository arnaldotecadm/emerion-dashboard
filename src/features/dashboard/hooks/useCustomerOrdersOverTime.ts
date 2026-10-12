import { useEffect, useState } from "react";
import { fetchCustomerOrdersOverTime } from "../services/salesService";
import type { CustomerOrdersOverTime } from "../types/customerOrdersOverTime";

export interface UseCustomerOrdersOverTimeResult {
  data: CustomerOrdersOverTime[];
  loading: boolean;
  error: string | null;
}

/** Loads monthly sales totals and order counts for the "Vendas Totais" page. */
export function useCustomerOrdersOverTime(): UseCustomerOrdersOverTimeResult {
  const [data, setData] = useState<CustomerOrdersOverTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchCustomerOrdersOverTime();
        if (!cancelled) setData(result);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar as vendas por período.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
