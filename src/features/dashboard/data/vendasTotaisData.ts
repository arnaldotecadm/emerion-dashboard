/** Mock sales datasets for the "Vendas Totais" detail page, keyed by chart granularity. */
export type Granularity = "dia" | "semana" | "mes";

export interface SalesPoint {
  label: string;
  value: number;
  previousValue: number;
  orders: number;
  variation: number;
}

export interface SalesDataset {
  totalLabel: string;
  total: number;
  previousTotal: number;
  /** Sales target/quota for the period, used by the "Metas vs Realizado" goal card. */
  targetTotal: number;
  points: SalesPoint[];
  /** SVG path (0-1000 x, 0-300 y viewBox) for the current-period line, precomputed for a smooth look. */
  currentPath: string;
  previousPath: string;
  stats: {
    bestLabel: string;
    bestValue: number;
    bestPeriodLabel: string;
    averageLabel: string;
    averageValue: number;
    totalOrders: number;
    averageTicket: number;
  };
}

export const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const VENDAS_DATASETS: Record<Granularity, SalesDataset> = {
  dia: {
    totalLabel: "Total de Vendas nos Últimos 7 Dias",
    total: 612_400,
    previousTotal: 578_900,
    targetTotal: 700_000,
    currentPath: "M0,220 Q80,190 160,205 T320,150 T480,175 T640,110 T800,140 T1000,90",
    previousPath: "M0,235 Q80,225 160,240 T320,210 T480,225 T640,200 T800,215 T1000,190",
    points: [
      { label: "Seg", value: 78_200, previousValue: 74_100, orders: 210, variation: 5.5 },
      { label: "Ter", value: 82_450, previousValue: 79_800, orders: 224, variation: 3.3 },
      { label: "Qua", value: 91_300, previousValue: 85_600, orders: 245, variation: 6.7 },
      { label: "Qui", value: 88_900, previousValue: 90_200, orders: 231, variation: -1.4 },
      { label: "Sex", value: 104_600, previousValue: 96_400, orders: 268, variation: 8.5 },
      { label: "Sáb", value: 96_750, previousValue: 89_300, orders: 251, variation: 8.3 },
      { label: "Dom", value: 70_200, previousValue: 63_500, orders: 178, variation: 10.5 },
    ],
    stats: {
      bestLabel: "Melhor Dia",
      bestValue: 104_600,
      bestPeriodLabel: "Sexta-feira",
      averageLabel: "Média Diária",
      averageValue: 87_486,
      totalOrders: 1_607,
      averageTicket: 381.15,
    },
  },
  semana: {
    totalLabel: "Total de Vendas nas Últimas 8 Semanas",
    total: 1_845_300,
    previousTotal: 1_712_800,
    targetTotal: 2_100_000,
    currentPath: "M0,210 Q100,180 200,200 T400,140 T600,165 T800,100 T1000,120",
    previousPath: "M0,225 Q100,215 200,228 T400,195 T600,205 T800,180 T1000,190",
    points: [
      { label: "Sem 1", value: 198_400, previousValue: 190_200, orders: 512, variation: 4.3 },
      { label: "Sem 2", value: 212_600, previousValue: 205_100, orders: 548, variation: 3.7 },
      { label: "Sem 3", value: 226_900, previousValue: 214_300, orders: 571, variation: 5.9 },
      { label: "Sem 4", value: 241_800, previousValue: 230_500, orders: 602, variation: 4.9 },
      { label: "Sem 5", value: 229_100, previousValue: 235_900, orders: 583, variation: -2.9 },
      { label: "Sem 6", value: 248_500, previousValue: 227_400, orders: 619, variation: 9.3 },
      { label: "Sem 7", value: 258_300, previousValue: 240_100, orders: 640, variation: 7.6 },
      { label: "Sem 8", value: 229_700, previousValue: 169_300, orders: 571, variation: 35.7 },
    ],
    stats: {
      bestLabel: "Melhor Semana",
      bestValue: 258_300,
      bestPeriodLabel: "Semana 7",
      averageLabel: "Média Semanal",
      averageValue: 230_663,
      totalOrders: 4_646,
      averageTicket: 397.15,
    },
  },
  mes: {
    totalLabel: "Total de Vendas no Período",
    total: 4_285_000,
    previousTotal: 3_825_892,
    targetTotal: 5_000_000,
    currentPath: "M0,200 Q100,150 200,180 T400,100 T600,140 T800,60 T1000,80",
    previousPath: "M0,220 Q100,200 200,240 T400,210 T600,230 T800,190 T1000,210",
    points: [
      { label: "Jan", value: 312_400, previousValue: 298_100, orders: 1_120, variation: 4.8 },
      { label: "Fev", value: 328_900, previousValue: 315_600, orders: 1_168, variation: 4.2 },
      { label: "Mar", value: 341_200, previousValue: 320_400, orders: 1_205, variation: 6.5 },
      { label: "Abr", value: 356_800, previousValue: 349_100, orders: 1_248, variation: 2.2 },
      { label: "Mai", value: 372_500, previousValue: 355_900, orders: 1_290, variation: 4.7 },
      { label: "Jun", value: 389_100, previousValue: 361_200, orders: 1_334, variation: 7.7 },
      { label: "Jul", value: 418_900, previousValue: 418_900, orders: 1_540, variation: 0 },
      { label: "Ago", value: 454_200, previousValue: 419_100, orders: 1_710, variation: 8.4 },
      { label: "Set", value: 445_100, previousValue: 454_700, orders: 1_620, variation: -2.1 },
      { label: "Out", value: 512_000, previousValue: 444_500, orders: 1_842, variation: 15.2 },
      { label: "Nov", value: 528_450, previousValue: 512_000, orders: 1_955, variation: 3.2 },
      { label: "Dez", value: 445_450, previousValue: 576_392, orders: 1_488, variation: -22.7 },
    ],
    stats: {
      bestLabel: "Melhor Mês",
      bestValue: 528_450,
      bestPeriodLabel: "Novembro/2023",
      averageLabel: "Média Mensal",
      averageValue: 400_417,
      totalOrders: 17_520,
      averageTicket: 350.11,
    },
  },
};
