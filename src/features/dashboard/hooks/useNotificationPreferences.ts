import { useCallback, useEffect, useMemo, useState } from "react";
import type { NotificationCategory } from "../types/notification";
import { ALL_NOTIFICATION_CATEGORIES } from "../types/notificationPreferences";
import {
  getNotificationPreferences,
  NOTIFICATION_PREFERENCES_CHANGED_EVENT,
  saveNotificationPreferences,
} from "../services/notificationPreferenceService";

export interface UseNotificationPreferencesResult {
  enabledCategories: NotificationCategory[];
  isCategoryEnabled: (category: NotificationCategory) => boolean;
  toggleCategory: (category: NotificationCategory) => void;
  enableAll: () => void;
}

export function useNotificationPreferences(): UseNotificationPreferencesResult {
  const [enabledCategories, setEnabledCategories] = useState<NotificationCategory[]>(
    () => getNotificationPreferences().enabledCategories
  );

  useEffect(() => {
    const syncPreferences = () => setEnabledCategories(getNotificationPreferences().enabledCategories);
    const syncFromEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ enabledCategories?: NotificationCategory[] }>).detail;
      if (detail?.enabledCategories) {
        setEnabledCategories(detail.enabledCategories);
        return;
      }

      syncPreferences();
    };

    window.addEventListener("storage", syncPreferences);
    window.addEventListener(NOTIFICATION_PREFERENCES_CHANGED_EVENT, syncFromEvent as EventListener);
    return () => {
      window.removeEventListener("storage", syncPreferences);
      window.removeEventListener(NOTIFICATION_PREFERENCES_CHANGED_EVENT, syncFromEvent as EventListener);
    };
  }, []);

  const enabledSet = useMemo(() => new Set(enabledCategories), [enabledCategories]);

  const toggleCategory = useCallback((category: NotificationCategory) => {
    setEnabledCategories((previous) => {
      const hasCategory = previous.includes(category);
      const next = hasCategory ? previous.filter((item) => item !== category) : [...previous, category];
      return saveNotificationPreferences({ enabledCategories: next }).enabledCategories;
    });
  }, []);

  const enableAll = useCallback(() => {
    setEnabledCategories(saveNotificationPreferences({ enabledCategories: ALL_NOTIFICATION_CATEGORIES }).enabledCategories);
  }, []);

  const isCategoryEnabled = useCallback((category: NotificationCategory) => enabledSet.has(category), [enabledSet]);

  return { enabledCategories, isCategoryEnabled, toggleCategory, enableAll };
}
