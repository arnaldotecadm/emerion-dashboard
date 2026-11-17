import { useEffect, useState } from "react";
import { fetchCustomerTopTrends } from "../services/customerTopTrendsService";
import type { CustomerTopTrends } from "../types/customerTopTrends";
import { useDashboardDateRange } from "./useDashboardDateRange";

export interface UseCustomerTopTrendsResult {
  data: CustomerTopTrends | null;
  loading: boolean;
  error: string | null;
}

/** Loads aggregated customer metrics for the customer dashboard. */
export function useCustomerTopTrends(): UseCustomerTopTrendsResult {
  const { startDate, endDate } = useDashboardDateRange();
  const [result, setResult] = useState<{
    key: string;
    data: CustomerTopTrends | null;
    error: string | null;
  } | null>(null);
  const requestKey = `${startDate}:${endDate}`;

  useEffect(() => {
    let cancelled = false;

    fetchCustomerTopTrends(startDate, endDate)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: null,
            error: err instanceof Error ? err.message : "Não foi possível carregar os indicadores de clientes.",
          });
        }
      })

    return () => {
      cancelled = true;
    };
  }, [endDate, requestKey, startDate]);

  if (result?.key !== requestKey) {
    return { data: null, loading: true, error: null };
  }

  return { data: result.data, loading: false, error: result.error };
}
