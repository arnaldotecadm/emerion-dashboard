import VendedoresDirectoryTable from "../components/VendedoresDirectoryTable";

/** "Vendedores" — sales team directory, backed by the ERP backend's `GET /api/v1/vendedores` endpoint. */
function VendedoresPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#041627] tracking-tight">Vendedores</h2>
          <p className="text-[#8192a7] mt-1">Consulte a equipe de vendas cadastrada no ERP.</p>
        </div>
      </div>

      <VendedoresDirectoryTable />
    </div>
  );
}

export default VendedoresPage;
