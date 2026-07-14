interface RegionBar {
  region: string;
  billed: number;
  pending: number;
}

const REGIONS: RegionBar[] = [
  { region: "REG. SUL", billed: 180, pending: 60 },
  { region: "REG. SUDESTE", billed: 220, pending: 40 },
  { region: "REG. CENTRO", billed: 140, pending: 30 },
  { region: "REG. NORTE", billed: 110, pending: 80 },
];

/** Bar chart card comparing billed revenue vs. pending orders per region. */
function RegionalBarChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card flex flex-col h-[400px]">
      <h3 className="text-xl font-semibold text-[#041627] mb-6">
        Faturamento vs. Pedidos Pendentes
      </h3>
      <div className="flex-grow flex items-end justify-around gap-2 px-4">
        {REGIONS.map((region) => (
          <div key={region.region} className="w-16 flex flex-col items-center gap-1">
            <div className="w-full bg-[#006397] rounded-t" style={{ height: `${region.billed}px` }} />
            <div
              className="w-full bg-[#92ccff] rounded-b"
              style={{ height: `${region.pending}px` }}
            />
            <span className="text-[10px] mt-2 font-bold">{region.region}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-[#e6e8ea] flex justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#006397] rounded-sm" />
            <span className="text-xs">Faturado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#92ccff] rounded-sm" />
            <span className="text-xs">Pendente</span>
          </div>
        </div>
        <span className="text-xs text-[#041627] font-bold">Total: R$ 4.2M</span>
      </div>
    </div>
  );
}

export default RegionalBarChart;
