import { useEffect, useState } from "react";
import { fetchCustomerById } from "../services/customerService";
import type { Customer } from "../types/customer";

export interface UseCustomerResult {
  data: Customer | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Loads a single customer by id from the ERP backend. */
export function useCustomer(id: string | undefined): UseCustomerResult {
  const [data, setData] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    fetchCustomerById(id)
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
  }, [id]);

  return { data, loading, error, notFound };
}
