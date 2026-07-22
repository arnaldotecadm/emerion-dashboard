import { useCallback, useEffect, useState } from "react";
import { fetchCustomerOrders } from "../services/customerOrderService";
import type { CustomerOrderPage } from "../types/customerOrder";

export interface UseCustomerOrdersResult {
  data: CustomerOrderPage | null;
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  refetch: () => void;
}

/** Loads a paginated slice of customer orders from the ERP backend and exposes pagination controls. */
export function useCustomerOrders(
  initialPage = 0,
  initialSize = 10,
  codCli?: string,
  sitres?: string
): UseCustomerOrdersResult {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [data, setData] = useState<CustomerOrderPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchCustomerOrders(page, size, codCli, sitres)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar os pedidos.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, size, codCli, sitres, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const changeSize = useCallback((nextSize: number) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  return { data, loading, error, page, size, setPage, setSize: changeSize, refetch };
}
