import { createContext, createElement, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchCustomerByExternalId, fetchCustomers } from "../services/customerService";
import { fetchProducts } from "../services/productService";
import { fetchCustomerOrders } from "../services/customerOrderService";
import { fetchVendedores } from "../services/vendedorService";
import type { Vendedor } from "../types/vendedor";

/** Aggregated ranking row for a single customer, built from summing order totals per `codCli`. */
export interface TopCustomerRow {
  codCli: string;
  nome: string;
  totalPedidos: number;
  faturamento: number;
}

/** The overview samples one order page; full aggregation belongs in the API. */
const MAX_ORDER_PAGES = 1;
const ORDER_PAGE_SIZE = 100;
const VENDEDOR_PAGE_SIZE = 100;
const TOP_N = 5;

export interface UseDashboardOverviewResult {
  loading: boolean;
  error: string | null;
  totalClientes: number;
  totalProdutos: number;
  totalPedidos: number;
  totalVendedores: number;
  /** Sum of `totres` across the aggregated orders (see `isPartial`). */
  totalVendas: number;
  /** Average `totres` across the aggregated orders. */
  ticketMedio: number;
  /** True when there were more order pages than `MAX_ORDER_PAGES` allowed us to fetch. */
  isPartial: boolean;
  topClientes: TopCustomerRow[];
  topVendedores: Vendedor[];
}

const DashboardOverviewContext = createContext<UseDashboardOverviewResult | null>(null);

/**
 * Aggregates real data from the customers, products, customer-orders and
 * vendedores endpoints into the summary metrics and rankings shown on the
 * "Visão Geral" dashboard. Order totals are sampled from the first page since
 * the ERP backend doesn't expose a dedicated aggregation endpoint yet.
 */
function useDashboardOverviewData(): UseDashboardOverviewResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Omit<UseDashboardOverviewResult, "loading" | "error">>({
    totalClientes: 0,
    totalProdutos: 0,
    totalPedidos: 0,
    totalVendedores: 0,
    totalVendas: 0,
    ticketMedio: 0,
    isPartial: false,
    topClientes: [],
    topVendedores: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [customersCountPage, productsPage, vendedoresPage] = await Promise.all([
          fetchCustomers(0, 1),
          fetchProducts(0, 1),
          fetchVendedores(0, VENDEDOR_PAGE_SIZE),
        ]);

        // Aggregate the first order page only. Paging through the full order
        // collection on the homepage creates a burst of requests and is not a
        // suitable substitute for a backend aggregation endpoint.
        const perCliente = new Map<string, { total: number; count: number }>();
        let totalPedidos = 0;
        let sumTotres = 0;
        let ordersSampled = 0;
        let isPartial = false;

        let page = 0;
        for (; page < MAX_ORDER_PAGES; page++) {
          const ordersPage = await fetchCustomerOrders(page, ORDER_PAGE_SIZE);
          totalPedidos = ordersPage.pagination.total;

          for (const order of ordersPage.data) {
            sumTotres += order.totalPedidoSemImpostos ?? 0;
            ordersSampled += 1;

            const codigoCliente = String(order.codigoCliente ?? "");
            const existing = perCliente.get(codigoCliente);
            if (existing) {
              existing.total += order.totalPedidoSemImpostos ?? 0;
              existing.count += 1;
            } else {
              perCliente.set(codigoCliente, { total: order.totalPedidoSemImpostos ?? 0, count: 1 });
            }
          }

          if (page + 1 >= ordersPage.pagination.totalPages) {
            break;
          }
        }
        isPartial = totalPedidos > ordersSampled;

        const topClienteEntries = Array.from(perCliente.entries())
          .sort((a, b) => b[1].total - a[1].total)
          .slice(0, TOP_N);

        // Resolve each top customer's display name individually via the
        // by-external-id lookup, rather than paging through the full
        // customer list just to build a name map.
        const topClientes: TopCustomerRow[] = await Promise.all(
          topClienteEntries.map(async ([codCli, stats]) => {
            const nome = await fetchCustomerByExternalId(codCli)
              .then((customer) => customer.nomeFantasia.trim())
              .catch(() => codCli);

            return { codCli, nome, totalPedidos: stats.count, faturamento: stats.total };
          })
        );

        const topVendedores = [...vendedoresPage.data]
          .sort((a, b) => (b.saldo ?? 0) - (a.saldo ?? 0))
          .slice(0, TOP_N);

        if (!cancelled) {
          setResult({
            totalClientes: customersCountPage.pagination.total,
            totalProdutos: productsPage.pagination.total,
            totalPedidos,
            totalVendedores: vendedoresPage.pagination.total,
            totalVendas: sumTotres,
            ticketMedio: ordersSampled > 0 ? sumTotres / ordersSampled : 0,
            isPartial,
            topClientes,
            topVendedores,
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
  }, []);

  return { loading, error, ...result };
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
