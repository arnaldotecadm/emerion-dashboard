import { Link, useParams } from "react-router-dom";
import { useVendedor } from "../hooks/useVendedor";
import { formatCpfCnpj, formatCurrency, formatDate, initialsFrom } from "../utils/format";
import PlaceholderPage from "../components/PlaceholderPage";

const BackLink = () => (
  <Link
    to="/dashboard/vendedores"
    className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
  >
    <span className="material-symbols-outlined text-base">arrow_back</span>
    Voltar para Vendedores
  </Link>
);

/** Read-only detail view for a single vendedor, backed by `GET /api/v1/vendedores/:id`. */
function VendedorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vendedor, loading, error, notFound } = useVendedor(id);

  if (notFound) {
    return (
      <div>
        <BackLink />
        <PlaceholderPage
          icon="person_search"
          title="Vendedor não encontrado"
          description="Não foi possível localizar este vendedor. Volte para a lista de vendedores e tente novamente."
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
          <h3 className="text-lg font-bold text-[#041627]">Não foi possível carregar o vendedor</h3>
          <p className="text-sm text-[#8192a7]">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !vendedor) {
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

  const isActive = vendedor.situacao?.toLowerCase() === "ativo";

  return (
    <div>
      <BackLink />

      {/* Header card: identity + status */}
      <section className="bg-white rounded-xl p-8 shadow-card border border-[#e6e8ea] mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#041627] text-white flex items-center justify-center font-bold text-xl shrink-0">
              {initialsFrom(vendedor.nome)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-[#041627] tracking-tight">{vendedor.nome.trim()}</h2>
                {vendedor.situacao && (
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      isActive ? "bg-emerald-100 text-emerald-700" : "bg-[#eceef0] text-[#44474c]"
                    }`}
                  >
                    {vendedor.situacao}
                  </span>
                )}
              </div>
              {vendedor.apelido && <p className="text-[#8192a7] text-sm mt-1">{vendedor.apelido}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Registration data */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6">
        <h3 className="font-bold text-[#041627] text-lg mb-6">Dados Cadastrais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">ID do Vendedor</p>
            <p className="text-sm font-bold text-[#041627]">{vendedor.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Nome</p>
            <p className="text-sm font-bold text-[#041627]">{vendedor.nome.trim()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Apelido</p>
            <p className="text-sm font-bold text-[#041627]">{vendedor.apelido || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">CPF/CNPJ</p>
            <p className="text-sm font-bold text-[#041627]">
              {vendedor.cpfCnpj ? formatCpfCnpj(vendedor.cpfCnpj) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Telefone</p>
            <p className="text-sm font-bold text-[#041627]">{vendedor.telefone || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Celular</p>
            <p className="text-sm font-bold text-[#041627]">{vendedor.celular || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">E-mail</p>
            <p className="text-sm font-bold text-[#041627]">{vendedor.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Cidade/UF</p>
            <p className="text-sm font-bold text-[#041627]">
              {vendedor.cidade ? `${vendedor.cidade}${vendedor.uf ? `/${vendedor.uf}` : ""}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Saldo</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(vendedor.saldo)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Data de Cadastro</p>
            <p className="text-sm font-bold text-[#041627]">{formatDate(vendedor.dataCadastro)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VendedorDetailPage;
