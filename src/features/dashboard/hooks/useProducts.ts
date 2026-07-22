import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import type { ProductPage } from "../types/product";

export interface UseProductsResult {
  data: ProductPage | null;
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  refetch: () => void;
}

/** Loads a paginated slice of products from the ERP backend and exposes pagination controls. */
export function useProducts(initialPage = 0, initialSize = 10): UseProductsResult {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [data, setData] = useState<ProductPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchProducts(page, size)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar os produtos.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, size, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const changeSize = useCallback((nextSize: number) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  return { data, loading, error, page, size, setPage, setSize: changeSize, refetch };
}
