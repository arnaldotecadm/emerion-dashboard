import { useEffect, useState } from "react";
import { fetchConsultaDiaria } from "../services/consultaDiariaService";
import type { ConsultaDiaria } from "../types/consultaDiaria";
import { useDashboardDateRange } from "./useDashboardDateRange";

interface ConsultaDiariaResult {
  data: ConsultaDiaria | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Loads the management summary whenever the shared dashboard date range changes. */
export function useConsultaDiaria(): ConsultaDiariaResult {
  const { startDate, endDate } = useDashboardDateRange();
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data: ConsultaDiaria | null;
    error: string | null;
  } | null>(null);
  const requestKey = `${startDate}:${endDate}:${reloadToken}`;

  useEffect(() => {
    let cancelled = false;

    fetchConsultaDiaria(startDate, endDate)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: null,
            error: error instanceof Error ? error.message : "Não foi possível carregar o resumo gerencial.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [endDate, requestKey, startDate]);

  if (result?.key !== requestKey) {
    return {
      data: null,
      loading: true,
      error: null,
      refetch: () => setReloadToken((current) => current + 1),
    };
  }

  return {
    ...result,
    loading: false,
    refetch: () => setReloadToken((current) => current + 1),
  };
}
