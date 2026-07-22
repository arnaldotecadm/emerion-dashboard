import { useEffect, useState } from "react";
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

/** Safety cap on how many order pages are aggregated client-side, to bound request volume. */
const MAX_ORDER_PAGES = 20;
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

/**
 * Aggregates real data from the customers, products, customer-orders and
 * vendedores endpoints into the summary metrics and rankings shown on the
 * "Visão Geral" dashboard. Order totals are summed client-side across pages
 * (capped at `MAX_ORDER_PAGES`) since the ERP backend doesn't expose a
 * dedicated aggregation endpoint yet.
 */
export function useDashboardOverview(): UseDashboardOverviewResult {
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

        // Aggregate order totals per customer, paging through the customer-orders
        // endpoint up to MAX_ORDER_PAGES to bound the number of requests.
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
            sumTotres += order.totres;
            ordersSampled += 1;

            const existing = perCliente.get(order.codCli);
            if (existing) {
              existing.total += order.totres;
              existing.count += 1;
            } else {
              perCliente.set(order.codCli, { total: order.totres, count: 1 });
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
