import { useEffect, useState } from "react";
import { fetchProductByExternalId } from "../services/productService";

/**
 * Resolves a batch of product `externalId`s (order item codes) to their internal
 * product `id`, via `GET /api/v1/products/by-external-id/:externalId`. Intended
 * for small, bounded lists (e.g. a single order's line items) since each id
 * triggers its own request; failed/missing lookups are simply omitted from the
 * result map.
 */
export function useProductsByExternalId(externalIds: string[]): Map<string, number> {
  const [ids, setIds] = useState<Map<string, number>>(new Map());
  const key = Array.from(new Set(externalIds)).sort().join(",");

  useEffect(() => {
    const uniqueIds = key ? key.split(",") : [];
    if (uniqueIds.length === 0) {
      setIds(new Map());
      return;
    }

    let cancelled = false;

    Promise.all(
      uniqueIds.map((externalId) =>
        fetchProductByExternalId(externalId)
          .then((product): [string, number] => [externalId, product.id])
          .catch((): [string, number] | null => null)
      )
    ).then((entries) => {
      if (cancelled) return;
      const resolved = entries.filter((entry): entry is [string, number] => entry !== null);
      setIds(new Map(resolved));
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return ids;
}
