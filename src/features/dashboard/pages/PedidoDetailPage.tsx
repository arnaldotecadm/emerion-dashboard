import { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCustomerOrder } from "../hooks/useCustomerOrder";
import { useCustomerByExternalId } from "../hooks/useCustomerByExternalId";
import { useProductsByExternalId } from "../hooks/useProductsByExternalId";
import { useVendedorByExternalId } from "../hooks/useVendedorByExternalId";
import { formatCpfCnpj, formatCurrency, formatDate, formatPercent } from "../utils/format";
import PlaceholderPage from "../components/PlaceholderPage";

const BackLink = () => (
  <Link
    to="/dashboard/pedidos"
    className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
  >
    <span className="material-symbols-outlined text-base">arrow_back</span>
    Voltar para Pedidos
  </Link>
);

/** Small label/value pair used within the item's expanded fiscal detail panel. */
const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-semibold text-[#8192a7] mb-0.5 uppercase tracking-wider">{label}</p>
    <p className="text-xs font-semibold text-[#041627]">{value}</p>
  </div>
);

/** Read-only detail view for a single customer order, backed by `GET /api/v1/customer-orders/:id`. */
function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pedido, loading, error, notFound } = useCustomerOrder(id);
  const { data: cliente, loading: clienteLoading } = useCustomerByExternalId(pedido?.codCli);
  const { data: vendedor, loading: vendedorLoading } = useVendedorByExternalId(pedido?.vendedorExternalId ?? undefined);
  const productIds = useProductsByExternalId(pedido?.itens.map((item) => item.produto) ?? []);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setExpandedItems((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (notFound) {
    return (
      <div>
        <BackLink />
        <PlaceholderPage
          icon="receipt_long"
          title="Pedido não encontrado"
          description="Não foi possível localizar este pedido. Volte para a lista de pedidos e tente novamente."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <BackLink />
        <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-10 flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-4xl text-[#ba1a1a]">error</span>
          <h3 className="text-lg font-bold text-[#041627]">Não foi possível carregar o pedido</h3>
          <p className="text-sm text-[#8192a7]">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !pedido) {
    return (
      <div>
        <BackLink />
        <div className="bg-white rounded-xl p-8 shadow-card border border-[#e6e8ea] mb-8 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#eceef0] shrink-0" />
            <div className="space-y-2">
              <div className="h-5 w-48 bg-[#eceef0] rounded-full" />
              <div className="h-3 w-32 bg-[#eceef0] rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea] animate-pulse">
              <div className="h-3 w-20 bg-[#eceef0] rounded-full mb-3" />
              <div className="h-5 w-28 bg-[#eceef0] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink />

      {/* Header card: identity + status */}
      <section className="bg-white rounded-xl p-8 shadow-card border border-[#e6e8ea] mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#041627] text-white flex items-center justify-center font-bold text-xl shrink-0">
              <span className="material-symbols-outlined text-3xl">receipt_long</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-[#041627] tracking-tight">
                  Pedido #{pedido.nronfe ?? pedido.externalId}
                </h2>
                {pedido.sitres && (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#006397]/10 text-[#006397]">
                    {pedido.sitres}
                  </span>
                )}
              </div>
              <p className="text-[#8192a7] text-sm mt-1">
                Cliente{" "}
                {clienteLoading ? (
                  "carregando..."
                ) : cliente ? (
                  <Link to={`/dashboard/clientes/${cliente.id}`} className="text-[#006397] hover:underline">
                    {cliente.nomeFantasia.trim()}
                  </Link>
                ) : (
                  pedido.codCli
                )}{" "}
                · {formatDate(pedido.dteres)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order data */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 mb-6">
        <h3 className="font-bold text-[#041627] text-lg mb-6">Dados do Pedido</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Número do Pedido</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.externalId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Cliente (codCli)</p>
            <p className="text-sm font-bold text-[#041627]">
              {clienteLoading ? (
                "Carregando..."
              ) : cliente ? (
                <Link to={`/dashboard/clientes/${cliente.id}`} className="text-[#006397] hover:underline">
                  {cliente.nomeFantasia.trim()} ({pedido.codCli})
                </Link>
              ) : (
                pedido.codCli
              )}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">CNPJ da Empresa</p>
            <p className="text-sm font-bold text-[#041627]">
              {pedido.cnpjEmpresa ? formatCpfCnpj(pedido.cnpjEmpresa) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">CPF/CNPJ do Cliente</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.cpfCnpj ? formatCpfCnpj(pedido.cpfCnpj) : "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">NF-e</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.nronfe || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Data</p>
            <p className="text-sm font-bold text-[#041627]">{formatDate(pedido.dteres)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Status</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.sitres || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Total Geral</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.totger)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Total do Pedido</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.totres)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Total IPI</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.totipi)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Total Substituição</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.totsub)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Total Desc./Acréscimo</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.totdescinc)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Total de Frete</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.totfrt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Total de Seguro</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.totseg)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">
              Outras Despesas
            </p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.totoutdesp)}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 mb-8">
        <h3 className="font-bold text-[#041627] text-lg mb-6">Comercial e Logística</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Vendedor</p>
            <p className="text-sm font-bold text-[#041627]">
              {!pedido.vendedorExternalId ? (
                "—"
              ) : vendedorLoading ? (
                "Carregando..."
              ) : vendedor ? (
                <Link to={`/dashboard/vendedores/${vendedor.id}`} className="text-[#006397] hover:underline">
                  {vendedor.nome.trim()} ({pedido.vendedorExternalId})
                </Link>
              ) : (
                pedido.vendedorExternalId
              )}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Atendente</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.atendenteCod || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">
              Data Entrega Prevista
            </p>
            <p className="text-sm font-bold text-[#041627]">{formatDate(pedido.dataEntregaPrevista)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">
              Código Transportadora
            </p>
            <p className="text-sm font-bold text-[#041627]">{pedido.codigoTransportadora || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Linha Reserva</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.linhaReserva || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Pedido Anterior</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.pedidoAnterior || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">
              Desconto Comercial
            </p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.descontoComercial)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">
              Desconto Regional
            </p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(pedido.descontoRegional)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Regime Tributário</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.regimeTributario || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">
              Nome do Regime Tributário
            </p>
            <p className="text-sm font-bold text-[#041627]">{pedido.nomeRegimeTributario || "—"}</p>
          </div>
        </div>
      </section>

      {/* Order items */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden">
        <div className="p-6 border-b border-[#e6e8ea]">
          <h3 className="font-bold text-[#041627] text-lg">Itens do Pedido</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f7f9fb] border-b border-[#e6e8ea]">
                <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider w-10"></th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">
                  Valor Unitário
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f9fb]">
              {pedido.itens.map((item, index) => {
                const productId = productIds.get(item.produto);
                const isExpanded = expandedItems.has(index);
                return (
                  <Fragment key={`${item.produto}-${index}`}>
                    <tr className="hover:bg-[#f7f9fb] transition-colors">
                      <td
                        onClick={() => toggleItem(index)}
                        className="px-6 py-4 text-[#8192a7] cursor-pointer"
                        aria-label={isExpanded ? "Recolher detalhes do item" : "Expandir detalhes do item"}
                      >
                        <span
                          className={`material-symbols-outlined text-lg transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        >
                          chevron_right
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#041627]">
                        {productId ? (
                          <Link to={`/dashboard/produtos/${productId}`} className="text-[#006397] hover:underline">
                            {item.produto}
                          </Link>
                        ) : (
                          <span title="Produto não encontrado no catálogo cadastrado">{item.produto}</span>
                        )}
                      </td>
                      <td
                        onClick={() => toggleItem(index)}
                        className="px-6 py-4 text-sm text-[#44474c] cursor-pointer"
                      >
                        {item.descricao || "—"}
                      </td>
                      <td onClick={() => toggleItem(index)} className="px-6 py-4 text-sm text-[#44474c] cursor-pointer">
                        {item.quantidade}
                      </td>
                      <td
                        onClick={() => toggleItem(index)}
                        className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap cursor-pointer"
                      >
                        {formatCurrency(item.valorUnitario)}
                      </td>
                      <td
                        onClick={() => toggleItem(index)}
                        className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap cursor-pointer"
                      >
                        {formatCurrency(item.valorTotal)}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-[#f7f9fb]">
                        <td colSpan={6} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">
                                ICMS
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Base" value={formatCurrency(item.icmsBase)} />
                                <DetailField label="Alíquota" value={formatPercent(item.icmsAliquota)} />
                                <DetailField label="Valor" value={formatCurrency(item.icmsValor)} />
                                <DetailField label="Redução de Base" value={formatCurrency(item.icmsReducaoBase)} />
                              </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">
                                ICMS Substituição Tributária
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Base" value={formatCurrency(item.icmsSubstituicaoBase)} />
                                <DetailField
                                  label="Alíquota"
                                  value={formatPercent(item.icmsSubstituicaoAliquota)}
                                />
                                <DetailField label="Valor" value={formatCurrency(item.icmsSubstituicaoValor)} />
                                <DetailField label="Margem" value={formatPercent(item.icmsSubstituicaoMargem)} />
                                <DetailField
                                  label="Redução de Base"
                                  value={formatCurrency(item.icmsSubstituicaoReducaoBase)}
                                />
                              </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">IPI</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Base" value={formatCurrency(item.ipiBase)} />
                                <DetailField label="Alíquota" value={formatPercent(item.ipiAliquota)} />
                                <DetailField label="Valor" value={formatCurrency(item.ipiValor)} />
                                <DetailField label="CST" value={item.ipiCst || "—"} />
                                <DetailField label="Classificação" value={item.ipiClassificacao || "—"} />
                              </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">PIS</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Base" value={formatCurrency(item.pisBase)} />
                                <DetailField label="Alíquota" value={formatPercent(item.pisAliquota)} />
                                <DetailField label="Valor" value={formatCurrency(item.pisValor)} />
                                <DetailField label="CST" value={item.pisCst || "—"} />
                              </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">
                                COFINS
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Base" value={formatCurrency(item.cofinsBase)} />
                                <DetailField label="Alíquota" value={formatPercent(item.cofinsAliquota)} />
                                <DetailField label="Valor" value={formatCurrency(item.cofinsValor)} />
                                <DetailField label="CST" value={item.cofinsCst || "—"} />
                              </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">
                                Valores Adicionais
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Desconto" value={formatCurrency(item.descontoValor)} />
                                <DetailField label="Frete" value={formatCurrency(item.freteValor)} />
                                <DetailField label="Seguro" value={formatCurrency(item.seguroValor)} />
                                <DetailField label="Outras Despesas" value={formatCurrency(item.outrasDespesasValor)} />
                                <DetailField label="Total Tributado" value={formatCurrency(item.totalItemTributado)} />
                                <DetailField label="Tot. Renegociado" value={formatCurrency(item.totRen)} />
                                <DetailField label="Tot. Ge2" value={formatCurrency(item.totGe2)} />
                              </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">
                                Referências
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Cód. Unidade" value={item.codUnd || "—"} />
                                <DetailField label="Cód. CLP" value={item.codClp || "—"} />
                                <DetailField label="Cód. ST1" value={item.codSt1 || "—"} />
                                <DetailField label="Cód. CFO" value={item.codCfo?.trim() || "—"} />
                                <DetailField label="Cód. Cor" value={item.codcor || "—"} />
                                <DetailField label="Cód. Tamanho" value={item.codtam || "—"} />
                                <DetailField label="Referência" value={item.referencia || "—"} />
                                <DetailField
                                  label="Pedido de Compra do Cliente"
                                  value={item.pedidoCompraCliente || "—"}
                                />
                                <DetailField
                                  label="Item do Pedido de Compra"
                                  value={item.itemPedidoCompraCliente?.toString() ?? "—"}
                                />
                                <DetailField label="Seq. Re2" value={item.seqRe2.toString()} />
                                <DetailField label="Nro. Re2" value={item.nroRe2?.toString() ?? "—"} />
                              </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">
                                Quantidades e Pesos
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Qtd. Faturada" value={item.quantidadeFaturada?.toString() ?? "—"} />
                                <DetailField label="Qtd. Separada" value={item.quantidadeSeparada?.toString() ?? "—"} />
                                <DetailField label="Peso Líquido" value={item.pesoLiquido?.toString() ?? "—"} />
                                <DetailField label="Peso Bruto" value={item.pesoBruto?.toString() ?? "—"} />
                              </div>
                            </div>

                            {item.descricaoNFe && (
                              <div className="bg-white rounded-lg border border-[#e6e8ea] p-4 md:col-span-2 xl:col-span-3">
                                <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-2">
                                  Descrição para NF-e
                                </h4>
                                <p className="text-xs text-[#44474c]">{item.descricaoNFe}</p>
                              </div>
                            )}

                            <div className="bg-white rounded-lg border border-[#e6e8ea] p-4">
                              <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">
                                Situação
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <DetailField label="Validado" value={item.flgVal || "—"} />
                                <DetailField label="Pacote" value={item.flgPac || "—"} />
                                <DetailField label="Liberado" value={item.flgLib || "—"} />
                                <DetailField label="Vlu. Re2" value={formatCurrency(item.vluRe2)} />
                                <DetailField label="Dsc. Re2" value={formatCurrency(item.dscRe2)} />
                                <DetailField label="Dsr. Re2" value={formatCurrency(item.dsrRe2)} />
                              </div>
                            </div>

                            {item.observacao && (
                              <div className="bg-white rounded-lg border border-[#e6e8ea] p-4 md:col-span-2 xl:col-span-3">
                                <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-2">
                                  Observação
                                </h4>
                                <p className="text-xs text-[#44474c]">{item.observacao}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}

              {pedido.itens.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#8192a7]">
                    Nenhum item registrado para este pedido.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default PedidoDetailPage;
