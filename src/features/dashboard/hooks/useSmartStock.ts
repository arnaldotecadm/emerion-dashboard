import { useCallback, useEffect, useState, useTransition } from "react";
import { fetchSmartStock } from "../services/smartStockService";
import type { SmartStockPage } from "../types/smartStock";

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
const API_PAGE_SIZE = 100;

export interface UseSmartStockResult {
  data: SmartStockPage | null;
  loading: boolean;
  error: string | null;
  page: number;
  size: PageSize;
  hasNextPage: boolean;
  setPage: (page: number) => void;
  setSize: (size: PageSize) => void;
}

/** Loads the smart-stock table in pages no larger than the endpoint's 100-row cap. */
export function useSmartStock(): UseSmartStockResult {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState<PageSize>(PAGE_SIZE_OPTIONS[0]);
  const [data, setData] = useState<SmartStockPage | null>(null);
  const [errorState, setErrorState] = useState<{ page: number; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const firstRecordIndex = page * size;
  const apiPage = Math.floor(firstRecordIndex / API_PAGE_SIZE);
  const pageOffset = firstRecordIndex % API_PAGE_SIZE;

  useEffect(() => {
    let cancelled = false;

    fetchSmartStock(apiPage, API_PAGE_SIZE)
      .then((items) => {
        if (!cancelled) {
          setData({ data: items, page: apiPage, size: API_PAGE_SIZE });
          setErrorState(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setErrorState({
            page: apiPage,
            message: err instanceof Error ? err.message : "Não foi possível carregar o estoque inteligente.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiPage]);

  const setPageInTransition = useCallback((nextPage: number) => {
    if (nextPage < 0 || nextPage === page) return;
    startTransition(() => setPage(nextPage));
  }, [page]);

  const setSizeAndResetPage = useCallback((nextSize: PageSize) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  const currentPageError = errorState?.page === apiPage ? errorState.message : null;
  const currentBatch = data?.page === apiPage ? data : null;
  const visibleItems = currentBatch?.data.slice(pageOffset, pageOffset + size) ?? null;
  const currentPageData =
    currentBatch && visibleItems
      ? { data: visibleItems, page, size }
      : null;

  return {
    data: currentPageData,
    loading: isPending || (!currentPageData && !currentPageError),
    error: currentPageError,
    page,
    size,
    hasNextPage: (visibleItems?.length ?? 0) === size,
    setPage: setPageInTransition,
    setSize: setSizeAndResetPage,
  };
}
