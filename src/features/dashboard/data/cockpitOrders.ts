export interface CockpitOrder {
  id: string;
  client: string;
  clientDoc: string;
  seller: string;
  date: string;
  totalValue: number;
  markup: number;
  status: "Aguardando Financeiro" | "Aguardando Estoque" | "Pronto para Faturar" | "Faturado";
  city: string;
  uf: string;
  itemsCount: number;
  paymentTerms: string;
  carrier: string;
  items: { name: string; qty: number; unitPrice: number }[];
}

export const cockpitOrders: CockpitOrder[] = [
  {
    id: "PED-10492",
    client: "MEGA AUDIO & ILUMINACAO LTDA",
    clientDoc: "14.281.902/0001-44",
    seller: "MAX_CESAR",
    date: "2026-08-23",
    totalValue: 48920.5,
    markup: 148.79,
    status: "Aguardando Financeiro",
    city: "São Paulo",
    uf: "SP",
    itemsCount: 14,
    paymentTerms: "28/56/84 DDL",
    carrier: "BRASPRESS LOGISTICA",
    items: [
      { name: "CABO DMX 110 OHMS 2X0.20MM2 AZUL", qty: 1200, unitPrice: 14.8 },
      { name: "CONECTOR XLR 3 PINOS FEMEA LINHA", qty: 400, unitPrice: 22.5 },
      { name: "CABO MICROFONE BALANCEADO 2X0.30MM2 PRETO", qty: 1500, unitPrice: 11.2 },
    ],
  },
  {
    id: "PED-10491",
    client: "DISTRIBUIDORA DE CABOS BRASIL EIRELI",
    clientDoc: "08.921.332/0001-19",
    seller: "FERNANDO_SANTOS",
    date: "2026-08-23",
    totalValue: 32450,
    markup: 139.2,
    status: "Pronto para Faturar",
    city: "Curitiba",
    uf: "PR",
    itemsCount: 8,
    paymentTerms: "30/60 DDL",
    carrier: "JADLOG EXPRESS",
    items: [],
  },
  {
    id: "PED-10490",
    client: "CENTRAL SOM & ACUSTICA PRO",
    clientDoc: "22.109.845/0001-88",
    seller: "MAX_CESAR",
    date: "2026-08-22",
    totalValue: 78300,
    markup: 151.1,
    status: "Aguardando Estoque",
    city: "Belo Horizonte",
    uf: "MG",
    itemsCount: 22,
    paymentTerms: "21/42/63 DDL",
    carrier: "RODONAVES TRANSPORTES",
    items: [],
  },
  {
    id: "PED-10489",
    client: "SHOW TECH INSTRUMENTOS MUSICAIS",
    clientDoc: "03.882.110/0001-92",
    seller: "CAROLINA_MELO",
    date: "2026-08-22",
    totalValue: 18450,
    markup: 146.4,
    status: "Faturado",
    city: "Campinas",
    uf: "SP",
    itemsCount: 6,
    paymentTerms: "À Vista c/ Desc",
    carrier: "TRANSLAGO LOG",
    items: [],
  },
  {
    id: "PED-10488",
    client: "ELETRO COMERCIAL NORDESTE",
    clientDoc: "19.445.670/0001-05",
    seller: "RICARDO_ALMEIDA",
    date: "2026-08-21",
    totalValue: 94120,
    markup: 124.8,
    status: "Aguardando Financeiro",
    city: "Recife",
    uf: "PE",
    itemsCount: 35,
    paymentTerms: "30/60/90 DDL",
    carrier: "PATRUS TRANSPORTES",
    items: [],
  },
  {
    id: "PED-10487",
    client: "SONORIZACAO EVENTOS SUL",
    clientDoc: "31.204.551/0001-63",
    seller: "FERNANDO_SANTOS",
    date: "2026-08-21",
    totalValue: 24300,
    markup: 148,
    status: "Faturado",
    city: "Porto Alegre",
    uf: "RS",
    itemsCount: 9,
    paymentTerms: "14/28 DDL",
    carrier: "BRASPRESS LOGISTICA",
    items: [],
  },
];
