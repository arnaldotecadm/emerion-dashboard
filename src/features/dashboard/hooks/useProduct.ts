import { useEffect, useState } from "react";
import { fetchProductById } from "../services/productService";
import type { Product } from "../types/product";

export interface UseProductResult {
  data: Product | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Loads a single product by id from the ERP backend. */
export function useProduct(id: string | undefined): UseProductResult {
  const [data, setData] = useState<Product | null>(null);
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

    fetchProductById(id)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Não foi possível carregar o produto.";
        if (message === "Produto não encontrado.") {
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
