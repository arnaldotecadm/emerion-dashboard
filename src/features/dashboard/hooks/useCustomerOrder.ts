import { useEffect, useState } from "react";
import { fetchCustomerOrderById } from "../services/customerOrderService";
import type { CustomerOrder } from "../types/customerOrder";

export interface UseCustomerOrderResult {
  data: CustomerOrder | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Loads a single customer order by id from the ERP backend. */
export function useCustomerOrder(id: string | undefined): UseCustomerOrderResult {
  const [data, setData] = useState<CustomerOrder | null>(null);
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

    fetchCustomerOrderById(id)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Não foi possível carregar o pedido.";
        if (message === "Pedido não encontrado.") {
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
