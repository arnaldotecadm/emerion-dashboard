import { useSyncExternalStore } from "react";

let presentationModeEnabled = import.meta.env.VITE_PRESENTATION_MODE === "true";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPresentationModeEnabled() {
  return presentationModeEnabled;
}

export function setPresentationModeEnabled(enabled: boolean) {
  if (presentationModeEnabled === enabled) return;

  presentationModeEnabled = enabled;
  listeners.forEach((listener) => listener());
}

export function usePresentationModeEnabled() {
  return useSyncExternalStore(subscribe, getPresentationModeEnabled, getPresentationModeEnabled);
}
