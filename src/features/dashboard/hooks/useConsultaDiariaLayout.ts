import { useEffect, useState } from "react";

export type ConsultaDiariaWidgetId = "products" | "states" | "customers" | "portfolio" | "sellerDaily";
export type ConsultaDiariaColumnSpan = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ConsultaDiariaWidgetHeight = number;

export interface ConsultaDiariaWidgetLayout {
  id: ConsultaDiariaWidgetId;
  columnSpan: ConsultaDiariaColumnSpan;
  height: ConsultaDiariaWidgetHeight;
}

const STORAGE_KEY = "emerion-consulta-diaria-layout";
const COLUMN_SPANS: ConsultaDiariaColumnSpan[] = [4, 5, 6, 7, 8, 9, 10, 11, 12];
const MIN_WIDGET_HEIGHT = 280;
const MAX_WIDGET_HEIGHT = 720;
const DEFAULT_LAYOUT: ConsultaDiariaWidgetLayout[] = [
  { id: "products", columnSpan: 8, height: 420 },
  { id: "states", columnSpan: 4, height: 420 },
  { id: "customers", columnSpan: 8, height: 420 },
  { id: "portfolio", columnSpan: 4, height: 420 },
  { id: "sellerDaily", columnSpan: 12, height: 420 },
];

function isWidgetLayout(value: unknown): value is ConsultaDiariaWidgetLayout[] {
  if (!Array.isArray(value) || value.length !== DEFAULT_LAYOUT.length) return false;
  const knownIds = DEFAULT_LAYOUT.map(({ id }) => id);
  const seenIds = new Set<string>();

  return value.every((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("id" in item) ||
      !("columnSpan" in item) ||
      !("height" in item) ||
      typeof item.id !== "string" ||
      !knownIds.includes(item.id as ConsultaDiariaWidgetId) ||
      seenIds.has(item.id) ||
      !COLUMN_SPANS.includes(item.columnSpan as ConsultaDiariaColumnSpan) ||
      typeof item.height !== "number" ||
      item.height < MIN_WIDGET_HEIGHT ||
      item.height > MAX_WIDGET_HEIGHT
    ) {
      return false;
    }

    seenIds.add(item.id);
    return true;
  });
}

function getInitialLayout(): ConsultaDiariaWidgetLayout[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_LAYOUT.map((widget) => ({ ...widget }));

  try {
    const parsed: unknown = JSON.parse(stored);
    return isWidgetLayout(parsed) ? parsed : DEFAULT_LAYOUT.map((widget) => ({ ...widget }));
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return DEFAULT_LAYOUT.map((widget) => ({ ...widget }));
    }
    throw error;
  }
}

export function reorderConsultaDiariaWidgets(
  widgets: ConsultaDiariaWidgetLayout[],
  sourceId: string,
  targetId: ConsultaDiariaWidgetId
): ConsultaDiariaWidgetLayout[] {
  if (sourceId === targetId) return widgets;

  const sourceIndex = widgets.findIndex((widget) => widget.id === sourceId);
  const targetIndex = widgets.findIndex((widget) => widget.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return widgets;

  const next = [...widgets];
  const [movedWidget] = next.splice(sourceIndex, 1);
  const insertionIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  next.splice(insertionIndex, 0, movedWidget);
  return next;
}

export function useConsultaDiariaLayout() {
  const [widgets, setWidgets] = useState(getInitialLayout);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  function moveWidgetBefore(sourceId: string, targetId: ConsultaDiariaWidgetId) {
    setWidgets((current) => reorderConsultaDiariaWidgets(current, sourceId, targetId));
  }

  function resizeWidget(id: ConsultaDiariaWidgetId, changes: Partial<Omit<ConsultaDiariaWidgetLayout, "id">>) {
    setWidgets((current) =>
      current.map((widget) => (widget.id === id ? { ...widget, ...changes } : widget))
    );
  }

  function resetLayout() {
    setWidgets(DEFAULT_LAYOUT.map((widget) => ({ ...widget })));
  }

  return { widgets, moveWidgetBefore, resizeWidget, resetLayout };
}
