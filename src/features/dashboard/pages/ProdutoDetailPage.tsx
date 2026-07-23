import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { formatCurrency, formatDate } from "../utils/format";
import PlaceholderPage from "../components/PlaceholderPage";

const BackLink = () => (
  <Link
    to="/dashboard/produtos"
    className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
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
        <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-10 flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-4xl text-[#ba1a1a]">error</span>
          <h3 className="text-lg font-bold text-[#041627]">Não foi possível carregar o produto</h3>
          <p className="text-sm text-[#8192a7]">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !produto) {
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

      {/* Header card: identity */}
      <section className="bg-white rounded-xl p-8 shadow-card border border-[#e6e8ea] mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#041627] text-white flex items-center justify-center font-bold text-xl shrink-0">
              <span className="material-symbols-outlined text-3xl">inventory_2</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#041627] tracking-tight">{produto.nome}</h2>
              <p className="text-[#8192a7] text-sm mt-1">Codigo {produto.externalId}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration data */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6">
        <h3 className="font-bold text-[#041627] text-lg mb-6">Dados Cadastrais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Codigo</p>
            <p className="text-sm font-bold text-[#041627]">{produto.externalId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Nome</p>
            <p className="text-sm font-bold text-[#041627]">{produto.nome}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Preço</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(produto.preco)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Cadastrado em</p>
            <p className="text-sm font-bold text-[#041627]">{formatDate(produto.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Atualizado em</p>
            <p className="text-sm font-bold text-[#041627]">{formatDate(produto.updatedAt)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProdutoDetailPage;
