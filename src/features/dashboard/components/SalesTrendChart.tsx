/** Line chart card showing sales vs. quotes trend (static illustrative visualization). */
function SalesTrendChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-[#041627]">Tendência de Vendas e Orçamentos</h3>
        <div className="flex bg-[#eceef0] rounded-lg p-1">
          <button className="px-3 py-1 bg-white rounded shadow-sm text-xs font-semibold">Mês</button>
          <button className="px-3 py-1 text-xs text-[#44474c]">Trimestre</button>
        </div>
      </div>
      <div className="flex-grow flex items-end gap-4 pb-4">
        <div className="flex-grow h-full border-b border-l border-[#c4c6cd] relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path
              d="M0 180 Q 50 150 100 160 T 200 120 T 300 140 T 400 90 T 500 110 T 600 70"
              fill="none"
              stroke="#006397"
              strokeWidth="3"
            />
            <path
              d="M0 200 Q 50 180 100 190 T 200 160 T 300 180 T 400 140 T 500 160 T 600 130"
              fill="none"
              stroke="#8192a7"
              strokeDasharray="4"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute bottom-2 left-2 flex gap-4 text-[10px] text-[#44474c] font-bold">
            <span>JAN</span>
            <span>FEV</span>
            <span>MAR</span>
            <span>ABR</span>
            <span>MAI</span>
            <span>JUN</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#006397] rounded-full" />
          <span className="text-xs">Vendas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#8192a7] rounded-full border-2 border-dashed border-white" />
          <span className="text-xs">Orçamentos</span>
        </div>
      </div>
    </div>
  );
}

export default SalesTrendChart;
