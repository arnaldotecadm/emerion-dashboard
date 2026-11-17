import { createContext, createElement, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getDefaultDateRange } from "../utils/dateRange";
import type { DateRange } from "../utils/dateRange";

const START_DATE_STORAGE_KEY = "emerion-dashboard-start-date";
const END_DATE_STORAGE_KEY = "emerion-dashboard-end-date";

interface DashboardDateRangeValue extends DateRange {
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
}

const DashboardDateRangeContext = createContext<DashboardDateRangeValue | null>(null);

function isDateOrEmpty(value: string | null): value is string {
  return value === "" || (value !== null && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function getInitialDateRange(): DateRange {
  const startDate = localStorage.getItem(START_DATE_STORAGE_KEY);
  const endDate = localStorage.getItem(END_DATE_STORAGE_KEY);
  if (isDateOrEmpty(startDate) && isDateOrEmpty(endDate) && (!startDate || !endDate || startDate <= endDate)) {
    return { startDate, endDate };
  }
  return getDefaultDateRange();
}

export function DashboardDateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState(getInitialDateRange);

  useEffect(() => {
    localStorage.setItem(START_DATE_STORAGE_KEY, dateRange.startDate);
    localStorage.setItem(END_DATE_STORAGE_KEY, dateRange.endDate);
  }, [dateRange]);

  const setStartDate = useCallback((startDate: string) => {
    setDateRange((current) => ({ ...current, startDate }));
  }, []);

  const setEndDate = useCallback((endDate: string) => {
    setDateRange((current) => ({ ...current, endDate }));
  }, []);

  return createElement(
    DashboardDateRangeContext.Provider,
    { value: { ...dateRange, setStartDate, setEndDate } },
    children
  );
}

export function useDashboardDateRange(): DashboardDateRangeValue {
  const context = useContext(DashboardDateRangeContext);
  if (!context) {
    throw new Error("useDashboardDateRange must be used within DashboardDateRangeProvider");
  }
  return context;
}
