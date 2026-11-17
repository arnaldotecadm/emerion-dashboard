export interface DateRange {
  startDate: string;
  endDate: string;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultDateRange(): DateRange {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return { startDate: formatDate(startOfMonth), endDate: formatDate(today) };
}

export function formatDateRangeLabel({ startDate, endDate }: DateRange): string {
  const formatLabelDate = (date: string) => {
    if (!date) return "—";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };
  return `${formatLabelDate(startDate)} a ${formatLabelDate(endDate)}`;
}
