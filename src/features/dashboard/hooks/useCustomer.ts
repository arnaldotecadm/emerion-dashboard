import { useEffect, useState } from "react";
import { fetchCustomerByExternalId, fetchCustomerById } from "../services/customerService";
import type { Customer } from "../types/customer";

export interface UseCustomerResult {
  data: Customer | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Loads a single customer by id from the ERP backend. */
export function useCustomer(id: string | undefined, externalId?: string): UseCustomerResult {
  const [result, setResult] = useState<{
    key: string;
    data: Customer | null;
    error: string | null;
    notFound: boolean;
  } | null>(null);
  const key = externalId ? `external:${externalId}` : id ? `id:${id}` : null;

  useEffect(() => {
    if (!key) return;

    let cancelled = false;
    const request = externalId
      ? fetchCustomerByExternalId(externalId)
      : id
        ? fetchCustomerById(id)
        : null;

    if (!request) return;

    request
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: null, notFound: false });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Não foi possível carregar o cliente.";
        setResult({
          key,
          data: null,
          error: message === "Cliente não encontrado." ? null : message,
          notFound: message === "Cliente não encontrado.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [externalId, id, key]);

  if (!key) return { data: null, loading: false, error: null, notFound: true };
  if (result?.key !== key) return { data: null, loading: true, error: null, notFound: false };
  return { data: result.data, loading: false, error: result.error, notFound: result.notFound };
}
