export interface ConsultaDiariaProduct {
  codigoGrupo: string;
  codigoSubGrupo: string;
  codigoProduto: string;
  descricaoItemLiberacao: string;
  totalSeparado: number;
}

export interface ConsultaDiariaCustomer {
  codigoCliente: number;
  nomeFantasia: string;
  totalLiberadoComImpostos: number;
}

export interface ConsultaDiariaState {
  uf: string;
  amount: number;
  representationPercentage: number;
}

export interface ConsultaDiariaSalesperson {
  codigoVendedor: number;
  nomeVendedor: string;
  clientesResponsaveis: number;
  clientesComCompra: number;
  representationPercentage: number;
}

export interface ConsultaDiariaSalespersonTotal {
  codigoVendedor: number;
  nomeVendedor: string;
  totalFaturado: number;
  totalComissao: number;
  totalDespesas: number;
  custosTotais: number;
  totalIcms: number;
  totalSemNota: number;
}

export interface ConsultaDiaria {
  topSoldItems: ConsultaDiariaProduct[];
  topCustomers: ConsultaDiariaCustomer[];
  salesByUf: ConsultaDiariaState[];
  salespeople: ConsultaDiariaSalesperson[];
  salespersonTotals: ConsultaDiariaSalespersonTotal[];
}
