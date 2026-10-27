import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { formatCurrency, formatDate } from "../utils/format";
import PlaceholderPage from "../components/PlaceholderPage";

const BackLink = () => (
  <Link
    to="/dashboard/produtos"
    className="text-fg-muted hover:text-accent flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
  >
    <span className="material-symbols-outlined text-base">arrow_back</span>
    Voltar para Produtos
  </Link>
);

/** Read-only detail view for a single product, backed by `GET /api/v1/products/:id`. */
function ProdutoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: produto, loading, error, notFound } = useProduct(id);

  if (notFound) {
    return (
      <div>
        <BackLink />
        <PlaceholderPage
          icon="inventory_2"
          title="Produto não encontrado"
          description="Não foi possível localizar este produto. Volte para a lista de produtos e tente novamente."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <BackLink />
        <div className="bg-card rounded-xl shadow-card border border-line p-10 flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-4xl text-danger-fg">error</span>
          <h3 className="text-lg font-bold text-fg-strong">Não foi possível carregar o produto</h3>
          <p className="text-sm text-fg-subtle">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !produto) {
    return (
      <div>
        <BackLink />
        <div className="bg-card rounded-xl p-8 shadow-card border border-line mb-8 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-2 shrink-0" />
            <div className="space-y-2">
              <div className="h-5 w-48 bg-surface-2 rounded-full" />
              <div className="h-3 w-32 bg-surface-2 rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-card p-6 rounded-xl shadow-card border border-line animate-pulse">
              <div className="h-3 w-20 bg-surface-2 rounded-full mb-3" />
              <div className="h-5 w-28 bg-surface-2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isDiscontinued = produto.descontinuado;

  return (
    <div>
      <BackLink />

      {/* Header card: identity */}
      <section className="bg-card rounded-xl p-8 shadow-card border border-line mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-ink-solid text-white flex items-center justify-center font-bold text-xl shrink-0">
              <span className="material-symbols-outlined text-3xl">inventory_2</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-fg-strong tracking-tight">{produto.nome}</h2>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    isDiscontinued ? "bg-danger-soft text-danger-ink" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {isDiscontinued ? "Descontinuado" : "Ativo"}
                </span>
              </div>
              <p className="text-fg-subtle text-sm mt-1">Código {produto.externalId}</p>
            </div>
          </div>
        </div>
      </section>

      {isDiscontinued && (
        <section className="p-5 rounded-xl border mb-8 flex items-center gap-4 bg-danger-soft border-danger-line">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-danger-solid text-white">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-danger-ink">Produto descontinuado</h4>
            <p className="text-xs text-danger-ink">
              Este item está marcado como descontinuado e pode não estar disponível para novos pedidos.
            </p>
          </div>
        </section>
      )}

      {/* Registration data */}
      <section className="bg-card rounded-xl shadow-card border border-line p-6 mb-6">
        <h3 className="font-bold text-fg-strong text-lg mb-6">Dados Cadastrais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Código</p>
            <p className="text-sm font-bold text-fg-strong">{produto.externalId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Nome</p>
            <p className="text-sm font-bold text-fg-strong">{produto.nome}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Descrição Reduzida</p>
            <p className="text-sm font-bold text-fg-strong">{produto.descricaoReduzida || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">CNPJ Empresa</p>
            <p className="text-sm font-bold text-fg-strong">{produto.cnpjEmpresa || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Referência Interna</p>
            <p className="text-sm font-bold text-fg-strong">{produto.referenciaInterna || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Marca</p>
            <p className="text-sm font-bold text-fg-strong">{produto.marca || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Categoria</p>
            <p className="text-sm font-bold text-fg-strong">{produto.categoria || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Tipo</p>
            <p className="text-sm font-bold text-fg-strong">{produto.tipo || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Unidade</p>
            <p className="text-sm font-bold text-fg-strong">{produto.unidade || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Preço</p>
            <p className="text-sm font-bold text-fg-strong">{formatCurrency(produto.preco)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Cadastrado em</p>
            <p className="text-sm font-bold text-fg-strong">{formatDate(produto.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Atualizado em</p>
            <p className="text-sm font-bold text-fg-strong">{formatDate(produto.updatedAt)}</p>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl shadow-card border border-line p-6 mb-6">
        <h3 className="font-bold text-fg-strong text-lg mb-6">Fiscal e Logística</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">NCM</p>
            <p className="text-sm font-bold text-fg-strong">{produto.ncm || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">CEST</p>
            <p className="text-sm font-bold text-fg-strong">{produto.cest || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Origem do Produto</p>
            <p className="text-sm font-bold text-fg-strong">{produto.origemProduto || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Peso Líquido</p>
            <p className="text-sm font-bold text-fg-strong">{produto.pesoLiquido ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Peso Bruto</p>
            <p className="text-sm font-bold text-fg-strong">{produto.pesoBruto ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Código de Barras</p>
            <p className="text-sm font-bold text-fg-strong">{produto.codigoBarras || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">
              Código de Barras Próprio
            </p>
            <p className="text-sm font-bold text-fg-strong">{produto.codigoBarrasProprio || "—"}</p>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl shadow-card border border-line p-6">
        <h3 className="font-bold text-fg-strong text-lg mb-6">Tabela de Preços</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Preço 1</p>
            <p className="text-sm font-bold text-fg-strong">{formatCurrency(produto.preco)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Preço 2</p>
            <p className="text-sm font-bold text-fg-strong">{formatCurrency(produto.preco2)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Preço 3</p>
            <p className="text-sm font-bold text-fg-strong">{formatCurrency(produto.preco3)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Preço 4</p>
            <p className="text-sm font-bold text-fg-strong">{formatCurrency(produto.preco4)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Preço 5</p>
            <p className="text-sm font-bold text-fg-strong">{formatCurrency(produto.preco5)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProdutoDetailPage;
