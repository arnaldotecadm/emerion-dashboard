import { useEffect, useState } from "react";
import { fetchSellerTopTrends } from "../services/salesService";
import type { CustomerOrderBy, DashboardTopTrend } from "../types/dashboardTopTrends";

export interface UseSellerTopTrendsResult {
  data: DashboardTopTrend[];
  loading: boolean;
  error: string | null;
}

/** Loads the seller ranking using the selected metric and year range. */
export function useSellerTopTrends(
  orderBy: CustomerOrderBy,
  startDate: string,
  endDate: string
): UseSellerTopTrendsResult {
  const [result, setResult] = useState<{
    key: string;
    data: DashboardTopTrend[];
    error: string | null;
  } | null>(null);
  const requestKey = `${orderBy}:${startDate}:${endDate}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchSellerTopTrends(orderBy, startDate, endDate);
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      } catch (err: unknown) {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: [],
            error: err instanceof Error ? err.message : "Não foi possível carregar o ranking de vendedores.",
          });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [endDate, orderBy, requestKey, startDate]);

  if (result?.key !== requestKey) {
    return { data: [], loading: true, error: null };
  }
  return { data: result.data, loading: false, error: result.error };
}
