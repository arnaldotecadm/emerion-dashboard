import { createContext, createElement, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchDashboardTopTrends } from "../services/dashboardService";
import type { CustomerOrderBy, DashboardTopTrend } from "../types/dashboardTopTrends";

export interface UseDashboardOverviewResult {
  loading: boolean;
  error: string | null;
  totalClientes: number;
  totalPedidos: number;
  totalVendedores: number;
  totalVendas: number;
  ticketMedio: number;
  topClientes: DashboardTopTrend[];
  topVendedores: DashboardTopTrend[];
  customerOrderBy: CustomerOrderBy;
  setCustomerOrderBy: (orderBy: CustomerOrderBy) => void;
}

const DashboardOverviewContext = createContext<UseDashboardOverviewResult | null>(null);

/**
 * Loads the summary metrics and rankings displayed on the "Visão Geral"
 * dashboard from the ERP's aggregated dashboard endpoint.
 */
function useDashboardOverviewData(): UseDashboardOverviewResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerOrderBy, setCustomerOrderBy] = useState<CustomerOrderBy>("TOTALFATURADO");
  const [result, setResult] = useState<
    Omit<UseDashboardOverviewResult, "loading" | "error" | "customerOrderBy" | "setCustomerOrderBy">
  >({
    totalClientes: 0,
    totalPedidos: 0,
    totalVendedores: 0,
    totalVendas: 0,
    ticketMedio: 0,
    topClientes: [],
    topVendedores: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const dashboardData = await fetchDashboardTopTrends(customerOrderBy);

        if (!cancelled) {
          setResult({
            totalClientes: dashboardData.quantidadeClientes,
            totalPedidos: dashboardData.quantidadePedidos,
            totalVendedores: dashboardData.quantidadeVendedores,
            totalVendas: dashboardData.totalFaturado,
            ticketMedio: dashboardData.ticketMedio,
            topClientes: dashboardData.topCustomers,
            topVendedores: dashboardData.topVendedores,
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar os dados do painel.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [customerOrderBy]);

  return { loading, error, ...result, customerOrderBy, setCustomerOrderBy };
}

export function DashboardOverviewProvider({ children }: { children: ReactNode }) {
  const value = useDashboardOverviewData();
  return createElement(DashboardOverviewContext.Provider, { value }, children);
}

export function useDashboardOverview(): UseDashboardOverviewResult {
  const value = useContext(DashboardOverviewContext);
  if (!value) {
    throw new Error("useDashboardOverview must be used within DashboardOverviewProvider");
  }
  return value;
}
