/**
 * Mock data for the "Clientes" (Customer Management) area — a strictly read-only view for managers.
 * `CLIENTES_DIRECTORY` is the single source of truth; the various dashboard panels (top clients,
 * delinquency risk, credit utilization) are all derived from it so figures never contradict
 * each other. The company has no customer "segment" taxonomy (retail/wholesale/industry), so no
 * such field exists on the model.
 */

export const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export interface ClienteKpi {
  icon: string;
  label: string;
  value: string;
  hint: string;
  trend?: { label: string; positive: boolean };
  progress?: number;
  danger?: boolean;
}

export const CLIENTES_KPIS: ClienteKpi[] = [
  {
    icon: "person_check",
    label: "Clientes Ativos",
    value: "1.284",
    hint: "vs. mês anterior (1.209)",
    trend: { label: "+6.2%", positive: true },
  },
  {
    icon: "payments",
    label: "Ticket Médio Mensal",
    value: "R$ 3.240,00",
    hint: "+2.4% no último trimestre",
    trend: { label: "+2.4%", positive: true },
  },
  {
    icon: "error",
    label: "Inadimplência",
    value: "4.8%",
    hint: "Meta estipulada: < 3.0%",
    danger: true,
  },
  {
    icon: "credit_card",
    label: "Limite de Crédito Total",
    value: "68%",
    hint: "R$ 1,2M / R$ 1,8M utilizado",
    progress: 68,
  },
];

export type ClienteStatus = "Ativo" | "Inativo" | "Risco";

export interface RecentOrder {
  date: string;
  value: number;
  status: "Faturado" | "Pendente" | "Cancelado";
}

export interface ClienteRow {
  id: string;
  initials: string;
  name: string;
  city: string;
  monthlyRevenue: number;
  trendPct: number;
  creditLimit: number;
  utilizedPct: number;
  lastPurchase: string;
  status: ClienteStatus;
  vip?: boolean;
  /** Days since the oldest overdue invoice; only present for accounts with payment issues. */
  daysOverdue?: number;
  contact?: { name: string; email: string; phone: string };
  recentOrders?: RecentOrder[];
}

/** Derives Alto/Médio risk severity from days overdue — 30+ days is treated as a high-severity account. */
export const riskLevelFor = (daysOverdue: number): "Alto" | "Médio" => (daysOverdue >= 30 ? "Alto" : "Médio");

const DEFAULT_ORDERS: RecentOrder[] = [
  { date: "01 Nov 2023", value: 18_200, status: "Faturado" },
  { date: "12 Out 2023", value: 22_450, status: "Faturado" },
  { date: "28 Set 2023", value: 9_800, status: "Faturado" },
];

export const CLIENTES_DIRECTORY: ClienteRow[] = [
  {
    id: "alimentos-sa",
    initials: "AS",
    name: "Alimentos S/A",
    city: "Ribeirão Preto/SP",
    monthlyRevenue: 142_500,
    trendPct: 12,
    creditLimit: 300_000,
    utilizedPct: 47,
    lastPurchase: "01 Nov 2023",
    status: "Ativo",
    vip: true,
    contact: { name: "Marcos Vieira", email: "marcos.vieira@alimentossa.com.br", phone: "(16) 3222-4410" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "logistica-luz",
    initials: "LL",
    name: "Logística Luz",
    city: "Campinas/SP",
    monthlyRevenue: 118_900,
    trendPct: 8,
    creditLimit: 260_000,
    utilizedPct: 46,
    lastPurchase: "28 Out 2023",
    status: "Ativo",
    vip: true,
    contact: { name: "Camila Duarte", email: "camila.duarte@logisticaluz.com.br", phone: "(19) 3251-7788" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "varejo-modelo",
    initials: "VM",
    name: "Varejo Modelo",
    city: "Salvador/BA",
    monthlyRevenue: 95_200,
    trendPct: 0,
    creditLimit: 200_000,
    utilizedPct: 40,
    lastPurchase: "30 Out 2023",
    status: "Ativo",
    vip: true,
    contact: { name: "Rafael Nunes", email: "rafael.nunes@varejomodelo.com.br", phone: "(71) 3345-9021" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "industria-beta",
    initials: "IB",
    name: "Indústria Beta",
    city: "Joinville/SC",
    monthlyRevenue: 87_400,
    trendPct: -3,
    creditLimit: 850_000,
    utilizedPct: 12,
    lastPurchase: "15 Set 2023",
    status: "Inativo",
    contact: { name: "Eduardo Prado", email: "eduardo.prado@industriabeta.com.br", phone: "(47) 3433-1120" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "agro-comercio-ltda",
    initials: "AC",
    name: "Agro Comércio Ltda",
    city: "Uberlândia/MG",
    monthlyRevenue: 76_100,
    trendPct: 5,
    creditLimit: 220_000,
    utilizedPct: 82,
    lastPurchase: "05 Nov 2023",
    status: "Ativo",
    contact: { name: "Fernanda Melo", email: "fernanda.melo@agrocomercio.com.br", phone: "(34) 3236-5590" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "distribuidora-alianca",
    initials: "DA",
    name: "Distribuidora Aliança",
    city: "São Paulo/SP",
    monthlyRevenue: 68_000,
    trendPct: 4,
    creditLimit: 500_000,
    utilizedPct: 45,
    lastPurchase: "12 Out 2023",
    status: "Ativo",
    contact: { name: "Bruno Castro", email: "bruno.castro@distaalianca.com.br", phone: "(11) 3556-2290" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "auto-pecas-express",
    initials: "AP",
    name: "Auto Peças Express",
    city: "Goiânia/GO",
    monthlyRevenue: 45_000,
    trendPct: 6,
    creditLimit: 160_000,
    utilizedPct: 89,
    lastPurchase: "03 Nov 2023",
    status: "Ativo",
    contact: { name: "Juliana Rocha", email: "juliana.rocha@autopecasexpress.com.br", phone: "(62) 3241-8830" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "varejo-do-sol",
    initials: "VS",
    name: "Varejo do Sol",
    city: "Curitiba/PR",
    monthlyRevenue: 41_000,
    trendPct: -5,
    creditLimit: 150_000,
    utilizedPct: 92,
    lastPurchase: "08 Out 2023",
    status: "Risco",
    daysOverdue: 18,
    contact: { name: "Tiago Ferreira", email: "tiago.ferreira@varejodosol.com.br", phone: "(41) 3022-6671" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "tech-importados",
    initials: "TI",
    name: "Tech Importados",
    city: "Manaus/AM",
    monthlyRevenue: 39_000,
    trendPct: 1,
    creditLimit: 140_000,
    utilizedPct: 85,
    lastPurchase: "25 Set 2023",
    status: "Risco",
    daysOverdue: 12,
    contact: { name: "Larissa Gomes", email: "larissa.gomes@techimportados.com.br", phone: "(92) 3612-4470" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "papelaria-moderna",
    initials: "PM",
    name: "Papelaria Moderna",
    city: "Porto Alegre/RS",
    monthlyRevenue: 31_000,
    trendPct: 2,
    creditLimit: 60_000,
    utilizedPct: 78,
    lastPurchase: "22 Out 2023",
    status: "Ativo",
    contact: { name: "Renata Souza", email: "renata.souza@papelariamoderna.com.br", phone: "(51) 3311-9042" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "mercado-do-povo",
    initials: "MP",
    name: "Mercado do Povo",
    city: "Salvador/BA",
    monthlyRevenue: 27_000,
    trendPct: 1,
    creditLimit: 100_000,
    utilizedPct: 94,
    lastPurchase: "29 Out 2023",
    status: "Risco",
    daysOverdue: 25,
    contact: { name: "Diego Almeida", email: "diego.almeida@mercadodopovo.com.br", phone: "(71) 3288-1156" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "construtora-norte",
    initials: "CN",
    name: "Construtora Norte",
    city: "Recife/PE",
    monthlyRevenue: 54_000,
    trendPct: -2,
    creditLimit: 180_000,
    utilizedPct: 88,
    lastPurchase: "18 Set 2023",
    status: "Risco",
    daysOverdue: 15,
    contact: { name: "Patrícia Lins", email: "patricia.lins@construtoranorte.com.br", phone: "(81) 3427-5563" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "industrias-textil-sa",
    initials: "IT",
    name: "Indústrias Têxtil SA",
    city: "Blumenau/SC",
    monthlyRevenue: 61_000,
    trendPct: 3,
    creditLimit: 400_000,
    utilizedPct: 98,
    lastPurchase: "02 Nov 2023",
    status: "Risco",
    daysOverdue: 33,
    contact: { name: "Roberto Lima", email: "roberto.lima@textilsa.com.br", phone: "(47) 3327-8810" },
    recentOrders: DEFAULT_ORDERS,
  },
  {
    id: "papelaria-central",
    initials: "PC",
    name: "Papelaria Central",
    city: "Fortaleza/CE",
    monthlyRevenue: 18_000,
    trendPct: -10,
    creditLimit: 70_000,
    utilizedPct: 99,
    lastPurchase: "10 Ago 2023",
    status: "Risco",
    daysOverdue: 58,
    contact: { name: "Simone Alves", email: "simone.alves@papelariacentral.com.br", phone: "(85) 3261-7724" },
    recentOrders: DEFAULT_ORDERS,
  },
];

export const CLIENTES_DIRECTORY_TOTAL = 1284;

export const getClienteById = (id: string) => CLIENTES_DIRECTORY.find((cliente) => cliente.id === id);

/** Top 5 clients by monthly revenue, for the "Top Clientes por Receita" ranking. */
export const TOP_CLIENTES = [...CLIENTES_DIRECTORY]
  .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
  .slice(0, 5)
  .map((cliente, index) => ({ ...cliente, rank: index + 1 }));

/** Top 4 accounts with the most overdue days, for the "Risco de Inadimplência" panel. */
export const RISK_ITEMS = CLIENTES_DIRECTORY.filter((cliente) => cliente.daysOverdue !== undefined)
  .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0))
  .slice(0, 4);

/** Top 5 clients by credit-limit utilization, for the "Limite de Crédito por Cliente" panel. */
export const CREDIT_USAGE = [...CLIENTES_DIRECTORY].sort((a, b) => b.utilizedPct - a.utilizedPct).slice(0, 5);

export interface RegionSlice {
  label: string;
  pct: number;
  color: string;
  offset: number;
}

/** Approximate distribution of the full customer base across Brazilian macro-regions. */
export const CLIENT_REGIONS: RegionSlice[] = [
  { label: "Sudeste", pct: 48, color: "#006397", offset: 0 },
  { label: "Sul", pct: 22, color: "#041627", offset: 48 },
  { label: "Nordeste", pct: 18, color: "#7fc2e8", offset: 70 },
  { label: "Centro-Oeste", pct: 8, color: "#c4c6cd", offset: 88 },
  { label: "Norte", pct: 4, color: "#8192a7", offset: 96 },
];

export interface GrowthPoint {
  label: string;
  newClients: number;
  heightPct: number;
}

export const GROWTH_POINTS: GrowthPoint[] = [
  { label: "Jan", newClients: 22, heightPct: 60 },
  { label: "Fev", newClients: 28, heightPct: 75 },
  { label: "Mar", newClients: 25, heightPct: 65 },
  { label: "Abr", newClients: 32, heightPct: 90 },
  { label: "Mai", newClients: 30, heightPct: 80 },
  { label: "Jun", newClients: 42, heightPct: 100 },
];

export const GROWTH_SUMMARY = { net: 128, newTotal: 154, churnTotal: 26 };
