import OrdersDirectoryTable from "../components/OrdersDirectoryTable";

/** "Pedidos" — order directory, backed by the ERP backend's `GET /api/v1/customer-orders` endpoint. */
function PedidosPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#041627] tracking-tight">Pedidos</h2>
          <p className="text-[#8192a7] mt-1">Acompanhe todos os pedidos de venda registrados no ERP.</p>
        </div>
      </div>

      <OrdersDirectoryTable />
    </div>
  );
}

export default PedidosPage;
