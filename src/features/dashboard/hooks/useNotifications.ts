import { useCallback, useEffect, useState } from "react";
import { fetchNotifications } from "../services/notificationService";
import type { NotificationCategory, NotificationPage, NotificationStatus } from "../types/notification";

export interface UseNotificationsResult {
  data: NotificationPage | null;
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  refetch: () => void;
}

/** Loads a paginated slice of notifications from the ERP backend and exposes pagination controls. */
export function useNotifications(
  initialPage = 0,
  initialSize = 20,
  status?: NotificationStatus,
  category?: NotificationCategory
): UseNotificationsResult {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [data, setData] = useState<NotificationPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchNotifications(page, size, status, category)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar as notificações.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, size, status, category, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const changeSize = useCallback((nextSize: number) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  return { data, loading, error, page, size, setPage, setSize: changeSize, refetch };
}
