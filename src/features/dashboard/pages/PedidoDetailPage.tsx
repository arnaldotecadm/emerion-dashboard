import { Link, useParams } from "react-router-dom";
import { useCustomerOrder } from "../hooks/useCustomerOrder";
import { formatCurrency, formatDate } from "../utils/format";
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

/** Read-only detail view for a single customer order, backed by `GET /api/v1/customer-orders/:id`. */
function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pedido, loading, error, notFound } = useCustomerOrder(id);

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
                Cliente {pedido.codCli} · {formatDate(pedido.dteres)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order data */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 mb-8">
        <h3 className="font-bold text-[#041627] text-lg mb-6">Dados do Pedido</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">ID do Pedido</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Cliente (codCli)</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.codCli}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">CNPJ da Empresa</p>
            <p className="text-sm font-bold text-[#041627]">{pedido.cnpjEmpresa || "—"}</p>
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
              {pedido.itens.map((item, index) => (
                <tr key={`${item.produto}-${index}`} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-[#041627]">{item.produto}</td>
                  <td className="px-6 py-4 text-sm text-[#44474c]">{item.descricao || "—"}</td>
                  <td className="px-6 py-4 text-sm text-[#44474c]">{item.quantidade}</td>
                  <td className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap">
                    {formatCurrency(item.valorUnitario)}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap">
                    {formatCurrency(item.valorTotal)}
                  </td>
                </tr>
              ))}

              {pedido.itens.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#8192a7]">
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
