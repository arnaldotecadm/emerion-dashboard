/**
 * Types mirroring the ERP backend's notification endpoints
 * (GET /api/v1/notifications).
 */

export type NotificationStatus = "UNREAD" | "READ" | "DISMISSED";

export type NotificationCategory = "INGESTION" | "STATUS_UPDATE" | "APPROVAL_NEEDED" | "SYSTEM";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH";

/** A single notification row as returned by `GET /api/v1/notifications`. */
export interface Notification {
  id: number;
  userId: string;
  name: string;
  description: string;
  status: NotificationStatus;
  category: NotificationCategory;
  priority: NotificationPriority;
  referenceType: string | null;
  referenceId: string | null;
  actionUrl: string | null;
  createdAt: string;
  updatedAt: string;
  readAt: string | null;
  dismissedAt: string | null;
}

/** Pagination metadata for a `NotificationPage` response. */
export interface NotificationPagination {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/** Paginated response envelope returned by the ERP backend. */
export interface NotificationPage {
  data: Notification[];
  pagination: NotificationPagination;
}
