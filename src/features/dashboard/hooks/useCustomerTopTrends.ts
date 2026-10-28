import { useEffect, useState } from "react";
import { fetchCustomerTopTrends } from "../services/customerTopTrendsService";
import type { DashboardYears } from "../types/dashboardTopTrends";
import type { CustomerTopTrends } from "../types/customerTopTrends";

export interface UseCustomerTopTrendsResult {
  data: CustomerTopTrends | null;
  loading: boolean;
  error: string | null;
  years: DashboardYears;
  setYears: (years: DashboardYears) => void;
}

/** Loads aggregated customer metrics for the customer dashboard. */
export function useCustomerTopTrends(): UseCustomerTopTrendsResult {
  const [result, setResult] = useState<{
    years: DashboardYears;
    data: CustomerTopTrends | null;
    error: string | null;
  } | null>(null);
  const [years, setYears] = useState<DashboardYears>(1);

  useEffect(() => {
    let cancelled = false;

    fetchCustomerTopTrends(years)
      .then((data) => {
        if (!cancelled) setResult({ years, data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            years,
            data: null,
            error: err instanceof Error ? err.message : "Não foi possível carregar os indicadores de clientes.",
          });
        }
      })

    return () => {
      cancelled = true;
    };
  }, [years]);

  if (result?.years !== years) {
    return { data: null, loading: true, error: null, years, setYears };
  }

  return { ...result, loading: false, years, setYears };
}
