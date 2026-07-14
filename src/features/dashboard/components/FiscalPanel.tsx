const STATE_SHARES = [
  { uf: "UF: São Paulo", pct: 42 },
  { uf: "UF: Minas Gerais", pct: 28 },
  { uf: "UF: Paraná", pct: 15 },
];

/** Tax & fiscal summary panel: ICMS base donut and DIFAL/ICMS pending guides. */
function FiscalPanel() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card">
      <h3 className="text-xl font-semibold text-[#041627] mb-6">Painel Fiscal &amp; Tributário</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="relative flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-[16px] border-[#006397] flex items-center justify-center relative">
            <div className="absolute inset-[-16px] rounded-full border-[16px] border-t-[#61de8a] border-r-transparent border-b-transparent border-l-transparent rotate-45" />
            <div className="text-center">
              <span className="block text-xl font-bold">R$ 4M</span>
              <span className="text-[10px] text-[#44474c] uppercase">Base ICMS</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-3 rounded-lg border border-[#c4c6cd] bg-[#f7f9fb]">
            <p className="text-xs font-bold text-[#44474c]">Pendências DIFAL/ICMS</p>
            <p className="text-xl font-bold text-[#ba1a1a]">12 Guias</p>
            <p className="text-[10px] text-[#44474c] mt-1">Vencimento em 48h</p>
          </div>
          <div className="space-y-2">
            {STATE_SHARES.map((state) => (
              <div key={state.uf} className="flex justify-between text-xs">
                <span>{state.uf}</span>
                <span className="font-bold">{state.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiscalPanel;
