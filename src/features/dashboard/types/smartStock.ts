export interface SmartStockItem {
  codigo: string;
  descricao: string;
  origem: string;
  estoqueMinimo: number;
  estoqueAtual: number;
  custoPonderado: number;
  custoUltimaCompra: number;
  markup: number;
  leadTime: number;
}

export interface SmartStockPage {
  data: SmartStockItem[];
  page: number;
  size: number;
}
