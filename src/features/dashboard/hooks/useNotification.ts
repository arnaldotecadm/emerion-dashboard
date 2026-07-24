import { useEffect, useState } from "react";
import { fetchNotificationById } from "../services/notificationService";
import type { Notification } from "../types/notification";

export interface UseNotificationResult {
  data: Notification | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Loads a single notification by id from the ERP backend. */
export function useNotification(id: string | undefined): UseNotificationResult {
  const [data, setData] = useState<Notification | null>(null);
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

    fetchNotificationById(id)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Não foi possível carregar a notificação.";
        if (message === "Notificação não encontrada.") {
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
