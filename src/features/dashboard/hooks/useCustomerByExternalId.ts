import { useEffect, useState } from "react";
import { fetchCustomerByExternalId } from "../services/customerService";
import type { Customer } from "../types/customer";

export interface UseCustomerByExternalIdResult {
  data: Customer | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Looks up a customer by its ERP `externalId` (aka `codCli`), via `GET /api/v1/customers/by-external-id/:externalId`. */
export function useCustomerByExternalId(externalId: string | undefined): UseCustomerByExternalIdResult {
  const [data, setData] = useState<Customer | null>(null);
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

    fetchCustomerByExternalId(externalId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Não foi possível carregar o cliente.";
        if (message === "Cliente não encontrado.") {
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
