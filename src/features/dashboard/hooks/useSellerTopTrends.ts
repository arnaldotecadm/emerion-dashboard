import { useEffect, useState } from "react";
import { fetchSellerTopTrends } from "../services/salesService";
import type { CustomerOrderBy, DashboardTopTrend, DashboardYears } from "../types/dashboardTopTrends";

export interface UseSellerTopTrendsResult {
  data: DashboardTopTrend[];
  loading: boolean;
  error: string | null;
}

/** Loads the seller ranking using the selected metric and year range. */
export function useSellerTopTrends(
  orderBy: CustomerOrderBy,
  years: DashboardYears
): UseSellerTopTrendsResult {
  const [result, setResult] = useState<{
    key: string;
    data: DashboardTopTrend[];
    error: string | null;
  } | null>(null);
  const requestKey = `${orderBy}:${years ?? "all"}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchSellerTopTrends(orderBy, years);
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
  }, [orderBy, years, requestKey]);

  if (result?.key !== requestKey) {
    return { data: [], loading: true, error: null };
  }
  return { data: result.data, loading: false, error: result.error };
}
