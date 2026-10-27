import ProductsDirectoryTable from "../components/ProductsDirectoryTable";

/** "Produtos" — product catalog, backed by the ERP backend's `GET /api/v1/products` endpoint. */
function ProdutosPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-fg-strong tracking-tight">Produtos</h2>
          <p className="text-fg-subtle mt-1">Consulte o catálogo de produtos cadastrado no ERP.</p>
        </div>
      </div>

      <ProductsDirectoryTable />
    </div>
  );
}

export default ProdutosPage;
