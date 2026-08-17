import type { NotificationCategory } from "../types/notification";
import { ALL_NOTIFICATION_CATEGORIES } from "../types/notificationPreferences";

const STORAGE_KEY = "emerion-dashboard.notification-preferences.v1";
export const NOTIFICATION_PREFERENCES_CHANGED_EVENT = "emerion-dashboard:notification-preferences-changed";

export interface NotificationPreferences {
  enabledCategories: NotificationCategory[];
}

function isNotificationCategory(value: string): value is NotificationCategory {
  return ALL_NOTIFICATION_CATEGORIES.includes(value as NotificationCategory);
}

function normalizeCategories(categories: NotificationCategory[]): NotificationCategory[] {
  const unique = new Set<NotificationCategory>();
  for (const category of categories) {
    if (isNotificationCategory(category)) unique.add(category);
  }

  if (unique.size === 0) return [...ALL_NOTIFICATION_CATEGORIES];

  return ALL_NOTIFICATION_CATEGORIES.filter((category) => unique.has(category));
}

export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === "undefined") {
    return { enabledCategories: [...ALL_NOTIFICATION_CATEGORIES] };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { enabledCategories: [...ALL_NOTIFICATION_CATEGORIES] };

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { enabledCategories: [...ALL_NOTIFICATION_CATEGORIES] };
    }

    const candidate = (parsed as { enabledCategories?: unknown }).enabledCategories;
    if (!Array.isArray(candidate)) {
      return { enabledCategories: [...ALL_NOTIFICATION_CATEGORIES] };
    }

    const sanitized = candidate.filter((item): item is NotificationCategory => typeof item === "string" && isNotificationCategory(item));

    return { enabledCategories: normalizeCategories(sanitized) };
  } catch {
    return { enabledCategories: [...ALL_NOTIFICATION_CATEGORIES] };
  }
}

export function saveNotificationPreferences(preferences: NotificationPreferences): NotificationPreferences {
  const normalized: NotificationPreferences = {
    enabledCategories: normalizeCategories(preferences.enabledCategories),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(
      new CustomEvent<NotificationPreferences>(NOTIFICATION_PREFERENCES_CHANGED_EVENT, { detail: normalized })
    );
  }

  return normalized;
}
