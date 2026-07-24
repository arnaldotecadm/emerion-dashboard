import type {
  Notification,
  NotificationCategory,
  NotificationPage,
  NotificationStatus,
} from "../types/notification";
import { API_BASE_URL, apiFetch } from "./apiConfig";

/**
 * Fetches a page of notifications scoped to the authenticated user.
 * @param page zero-based page index.
 * @param size number of rows per page.
 * @param status optional status filter.
 * @param category optional category filter.
 */
export async function fetchNotifications(
  page: number,
  size: number,
  status?: NotificationStatus,
  category?: NotificationCategory
): Promise<NotificationPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set("status", status);
  if (category) params.set("category", category);

  const response = await apiFetch(`${API_BASE_URL}/notifications?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar notificações (HTTP ${response.status}).`);
  }

  return (await response.json()) as NotificationPage;
}

/** Fetches a single notification by id from the ERP backend. */
export async function fetchNotificationById(id: string | number): Promise<Notification> {
  const response = await apiFetch(`${API_BASE_URL}/notifications/${id}`);

  if (!response.ok) {
    throw new Error(
      response.status === 404 || response.status === 500
        ? "Notificação não encontrada."
        : `Falha ao carregar a notificação (HTTP ${response.status}).`
    );
  }

  return (await response.json()) as Notification;
}

/** Marks a notification as read for the authenticated user. */
export async function markNotificationAsRead(id: string | number): Promise<Notification> {
  const response = await apiFetch(`${API_BASE_URL}/notifications/${id}/read`, { method: "PATCH" });

  if (!response.ok) {
    throw new Error(
      response.status === 404 || response.status === 500
        ? "Notificação não encontrada."
        : `Falha ao marcar a notificação como lida (HTTP ${response.status}).`
    );
  }

  return (await response.json()) as Notification;
}

/** Dismisses a notification for the authenticated user. */
export async function dismissNotification(id: string | number): Promise<Notification> {
  const response = await apiFetch(`${API_BASE_URL}/notifications/${id}/dismiss`, { method: "PATCH" });

  if (!response.ok) {
    throw new Error(
      response.status === 404 || response.status === 500
        ? "Notificação não encontrada."
        : `Falha ao dispensar a notificação (HTTP ${response.status}).`
    );
  }

  return (await response.json()) as Notification;
}
