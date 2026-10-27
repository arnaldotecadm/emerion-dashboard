import { Link, useParams } from "react-router-dom";
import { useVendedor } from "../hooks/useVendedor";
import { formatCpfCnpj, formatCurrency, formatDate, initialsFrom } from "../utils/format";
import PlaceholderPage from "../components/PlaceholderPage";

const BackLink = () => (
  <Link
    to="/dashboard/vendedores"
    className="text-fg-muted hover:text-accent flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
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
        <div className="bg-card rounded-xl shadow-card border border-line p-10 flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-4xl text-danger-fg">error</span>
          <h3 className="text-lg font-bold text-fg-strong">Não foi possível carregar o vendedor</h3>
          <p className="text-sm text-fg-subtle">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !vendedor) {
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

  const isActive = vendedor.ativo?.toLowerCase() === "sim";

  return (
    <div>
      <BackLink />

      {/* Header card: identity + status */}
      <section className="bg-card rounded-xl p-8 shadow-card border border-line mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-ink-solid text-white flex items-center justify-center font-bold text-xl shrink-0">
              {initialsFrom(vendedor.nome)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-fg-strong tracking-tight">{vendedor.nome.trim()}</h2>
                {vendedor.ativo && (
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      isActive ? "bg-emerald-100 text-emerald-700" : "bg-surface-2 text-fg-muted"
                    }`}
                  >
                    {vendedor.ativo}
                  </span>
                )}
              </div>
              {vendedor.apelido && <p className="text-fg-subtle text-sm mt-1">{vendedor.apelido}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Registration data */}
      <section className="bg-card rounded-xl shadow-card border border-line p-6">
        <h3 className="font-bold text-fg-strong text-lg mb-6">Dados Cadastrais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Codigo</p>
            <p className="text-sm font-bold text-fg-strong">{vendedor.externalId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Nome</p>
            <p className="text-sm font-bold text-fg-strong">{vendedor.nome.trim()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Apelido</p>
            <p className="text-sm font-bold text-fg-strong">{vendedor.apelido || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">CPF/CNPJ</p>
            <p className="text-sm font-bold text-fg-strong">
              {vendedor.cpfCnpj ? formatCpfCnpj(vendedor.cpfCnpj) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Telefone</p>
            <p className="text-sm font-bold text-fg-strong">{vendedor.telefone || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Celular</p>
            <p className="text-sm font-bold text-fg-strong">{vendedor.celular || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">E-mail</p>
            <p className="text-sm font-bold text-fg-strong">{vendedor.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Cidade/UF</p>
            <p className="text-sm font-bold text-fg-strong">
              {vendedor.cidade ? `${vendedor.cidade}${vendedor.uf ? `/${vendedor.uf}` : ""}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Saldo</p>
            <p className="text-sm font-bold text-fg-strong">{formatCurrency(vendedor.saldo)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-subtle mb-1 uppercase tracking-wider">Data de Cadastro</p>
            <p className="text-sm font-bold text-fg-strong">{formatDate(vendedor.dataCadastro)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VendedorDetailPage;
