interface SellerProgress {
  initials: string;
  name: string;
  value: string;
  goalPct: number;
  medal?: "gold" | "silver" | "bronze";
}

const SELLERS: SellerProgress[] = [
  { initials: "JS", name: "João Silva", value: "R$ 450k", goalPct: 95, medal: "gold" },
  { initials: "AM", name: "Ana Maria", value: "R$ 412k", goalPct: 88, medal: "silver" },
  { initials: "RC", name: "Ricardo Costa", value: "R$ 385k", goalPct: 82, medal: "bronze" },
  { initials: "PL", name: "Patrícia Lima", value: "R$ 290k", goalPct: 65 },
];

const MEDAL_CLASS: Record<string, string> = {
  gold: "text-yellow-500",
  silver: "text-[#8192a7]",
  bronze: "text-orange-400",
};

/** Compact leaderboard of top sellers for the period, with quota progress bars. */
function TopSellersLeaderboard() {
  return (
    <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#041627]">Top Vendedores</h3>
        <span className="text-[10px] font-bold text-[#8192a7] uppercase tracking-widest">Performance Global</span>
      </div>
      <div className="space-y-4">
        {SELLERS.map((seller) => (
          <div key={seller.name} className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  seller.medal ? "bg-[#cce5ff] text-[#006397]" : "bg-[#eceef0] text-[#8192a7]"
                }`}
              >
                {seller.initials}
              </div>
              {seller.medal && (
                <span
                  className={`material-symbols-outlined absolute -top-1 -right-1 text-lg ${MEDAL_CLASS[seller.medal]}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  military_tech
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-bold ${seller.medal ? "text-[#041627]" : "text-[#44474c]"}`}>
                  {seller.name}
                </span>
                <span className={`text-xs font-bold ${seller.medal ? "text-[#006397]" : "text-[#8192a7]"}`}>
                  {seller.value}
                </span>
              </div>
              <div className="w-full bg-[#f7f9fb] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${seller.medal ? "bg-[#18a659]" : "bg-[#006397]/40"}`}
                  style={{ width: `${seller.goalPct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopSellersLeaderboard;
