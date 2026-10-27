import { useCallback, useEffect, useState } from "react";
import { fetchCustomerOrders } from "../services/customerOrderService";
import type { CustomerOrdersPeriod } from "../services/customerOrderService";
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
  codigoCliente?: number,
  statusPedido?: string,
  codigoEmpresa?: number,
  numeroPedido?: string,
  period?: CustomerOrdersPeriod
): UseCustomerOrdersResult {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [reloadToken, setReloadToken] = useState(0);
  const requestKey = JSON.stringify([
    page,
    size,
    codigoCliente,
    statusPedido,
    codigoEmpresa,
    numeroPedido,
    period,
    reloadToken,
  ]);
  const [result, setResult] = useState<{
    key: string;
    data: CustomerOrderPage | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchCustomerOrders(page, size, codigoCliente, statusPedido, codigoEmpresa, numeroPedido, period)
      .then((result) => {
        if (!cancelled) setResult({ key: requestKey, data: result, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: null,
            error: err instanceof Error ? err.message : "Não foi possível carregar os pedidos.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, size, codigoCliente, statusPedido, codigoEmpresa, numeroPedido, period, reloadToken, requestKey]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const changeSize = useCallback((nextSize: number) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  const isCurrentResult = result?.key === requestKey;

  return {
    data: isCurrentResult ? result.data : null,
    loading: !isCurrentResult,
    error: isCurrentResult ? result.error : null,
    page,
    size,
    setPage,
    setSize: changeSize,
    refetch,
  };
}
