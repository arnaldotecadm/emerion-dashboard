import { useEffect, useState } from "react";
import { fetchCustomerByExternalId } from "../services/customerService";

/**
 * Resolves a batch of customer `externalId`s (codCli) to their `nomeFantasia`,
 * via `GET /api/v1/customers/by-external-id/:externalId`. Intended for small,
 * bounded lists (e.g. one page of an orders table) since each id triggers its
 * own request; failed/missing lookups are simply omitted from the result map.
 */
export function useCustomerNamesByExternalId(externalIds: string[]): Map<string, string> {
  const [names, setNames] = useState<Map<string, string>>(new Map());
  const key = Array.from(new Set(externalIds)).sort().join(",");

  useEffect(() => {
    const uniqueIds = key ? key.split(",") : [];
    if (uniqueIds.length === 0) {
      setNames(new Map());
      return;
    }

    let cancelled = false;

    Promise.all(
      uniqueIds.map((externalId) =>
        fetchCustomerByExternalId(externalId)
          .then((customer): [string, string] => [externalId, customer.nomeFantasia.trim()])
          .catch((): [string, string] | null => null)
      )
    ).then((entries) => {
      if (cancelled) return;
      const resolved = entries.filter((entry): entry is [string, string] => entry !== null);
      setNames(new Map(resolved));
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return names;
}
