import { Link, useParams } from "react-router-dom";
import { useCustomer } from "../hooks/useCustomer";
import { formatCpfCnpj, initialsFrom } from "../utils/format";
import PlaceholderPage from "../components/PlaceholderPage";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const BackLink = () => (
  <Link
    to="/dashboard/clientes"
    className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
  >
    <span className="material-symbols-outlined text-base">arrow_back</span>
    Voltar para Clientes
  </Link>
);

/** Read-only detail view for a single customer, backed by `GET /api/v1/customers/:id`. */
function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: cliente, loading, error, notFound } = useCustomer(id);

  if (notFound) {
    return (
      <div>
        <BackLink />
        <PlaceholderPage
          icon="person_search"
          title="Cliente não encontrado"
          description="Não foi possível localizar este cliente. Volte para a lista de clientes e tente novamente."
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
          <h3 className="text-lg font-bold text-[#041627]">Não foi possível carregar o cliente</h3>
          <p className="text-sm text-[#8192a7]">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !cliente) {
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

  const isBlocked = cliente.bloqueado;

  return (
    <div>
      <BackLink />

      {/* Header card: identity + status */}
      <section className="bg-white rounded-xl p-8 shadow-card border border-[#e6e8ea] mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#041627] text-white flex items-center justify-center font-bold text-xl shrink-0">
              {initialsFrom(cliente.nomeFantasia)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-[#041627] tracking-tight">{cliente.nomeFantasia.trim()}</h2>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    isBlocked ? "bg-[#ffdad6] text-[#93000a]" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {isBlocked ? "Bloqueado" : "Ativo"}
                </span>
              </div>
              <p className="text-[#8192a7] text-sm mt-1">{cliente.razaoSocial}</p>
            </div>
          </div>
        </div>
      </section>

      {isBlocked && (
        <section className="p-5 rounded-xl border mb-8 flex items-center gap-4 bg-[#ffdad6] border-[#ffb4ab]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#ba1a1a] text-white">
            <span className="material-symbols-outlined">block</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#93000a]">Cliente bloqueado</h4>
            <p className="text-xs text-[#93000a]">
              Este cliente está com o cadastro bloqueado. Consulte o financeiro antes de liberar novos pedidos.
            </p>
          </div>
        </section>
      )}

      {/* Registration data */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 mb-6">
        <h3 className="font-bold text-[#041627] text-lg mb-6">Dados Cadastrais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Código</p>
            <p className="text-sm font-bold text-[#041627]">{cliente.externalId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Razão Social</p>
            <p className="text-sm font-bold text-[#041627]">{cliente.razaoSocial}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Nome Fantasia</p>
            <p className="text-sm font-bold text-[#041627]">{cliente.nomeFantasia.trim()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">CPF/CNPJ</p>
            <p className="text-sm font-bold text-[#041627]">{formatCpfCnpj(cliente.cpfCnpj)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">
              Inscrição Estadual
            </p>
            <p className="text-sm font-bold text-[#041627]">{cliente.inscricaoEstadual || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">
              Regime Tributário
            </p>
            <p className="text-sm font-bold text-[#041627]">{cliente.regimeTributario || "—"}</p>
          </div>
          {cliente.cnae && (
            <div>
              <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">CNAE</p>
              <p className="text-sm font-bold text-[#041627]">{cliente.cnae}</p>
            </div>
          )}
          {cliente.cnpjEmpresa && (
            <div>
              <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">CNPJ Empresa</p>
              <p className="text-sm font-bold text-[#041627]">{cliente.cnpjEmpresa}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Data de Cadastro</p>
            <p className="text-sm font-bold text-[#041627]">{formatDate(cliente.dataCadastro)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Última Atualização</p>
            <p className="text-sm font-bold text-[#041627]">{formatDate(cliente.dataUltimaAtualizacao)}</p>
          </div>
          {cliente.dataNascimento && (
            <div>
              <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Data de Nascimento</p>
              <p className="text-sm font-bold text-[#041627]">{formatDate(cliente.dataNascimento)}</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 mb-6">
        <h3 className="font-bold text-[#041627] text-lg mb-6">Contato</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">E-mail 1</p>
            <p className="text-sm font-bold text-[#041627]">{cliente.email1 || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">E-mail 2</p>
            <p className="text-sm font-bold text-[#041627]">{cliente.email2 || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Website</p>
            {cliente.website ? (
              <a
                href={cliente.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#006397] hover:underline break-all"
              >
                {cliente.website}
              </a>
            ) : (
              <p className="text-sm font-bold text-[#041627]">—</p>
            )}
          </div>
        </div>
      </section>

      {/* Commercial */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 mb-6">
        <h3 className="font-bold text-[#041627] text-lg mb-6">Informações Comerciais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Limite de Crédito</p>
            <p className="text-sm font-bold text-[#041627]">{formatCurrency(cliente.limiteCredito)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Vendedor</p>
            <p className="text-sm font-bold text-[#041627]">
              {cliente.nomeVendedor
                ? `${cliente.nomeVendedor}${cliente.vendedorExternalId ? ` (${cliente.vendedorExternalId})` : ""}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Tipo de Cliente</p>
            <p className="text-sm font-bold text-[#041627]">{cliente.codigoTipoCliente || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Grupo de Cliente</p>
            <p className="text-sm font-bold text-[#041627]">{cliente.codigoGrupoCliente || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Categoria de Cliente</p>
            <p className="text-sm font-bold text-[#041627]">{cliente.codigoCategoriaCliente || "—"}</p>
          </div>
        </div>
      </section>

      {cliente.observacoes && (
        <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6">
          <h3 className="font-bold text-[#041627] text-lg mb-4">Observações</h3>
          <p className="text-sm text-[#041627] whitespace-pre-wrap">{cliente.observacoes}</p>
        </section>
      )}
    </div>
  );
}

export default ClienteDetailPage;
