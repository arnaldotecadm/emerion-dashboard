import { useNavigate } from "react-router-dom";
import { RISK_ITEMS, riskLevelFor } from "../data/clientesData";

const LEVEL_STYLES: Record<string, { badge: string; icon: string; iconWrap: string }> = {
  Alto: {
    badge: "bg-[#ffdad6] text-[#93000a]",
    icon: "warning",
    iconWrap: "bg-[#ffdad6] text-[#ba1a1a] border-[#ffb4ab]",
  },
  Médio: {
    badge: "bg-orange-100 text-orange-700",
    icon: "schedule",
    iconWrap: "bg-orange-50 text-orange-600 border-orange-100",
  },
};

/** Panel listing customers at delinquency risk, ranked by days overdue; each row opens the client's detail page. */
function DelinquencyRiskPanel() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] flex flex-col h-full">
      <div className="p-6 border-b border-[#e6e8ea]">
        <h3 className="font-bold text-[#041627] text-lg flex items-center gap-2">
          Risco de Inadimplência
          <span className="w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse" />
        </h3>
      </div>
      <div className="p-6 space-y-5 flex-1">
        {RISK_ITEMS.map((item) => {
          const level = riskLevelFor(item.daysOverdue ?? 0);
          const style = LEVEL_STYLES[level];
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/dashboard/clientes/${item.id}`)}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${style.iconWrap}`}
                >
                  <span className="material-symbols-outlined text-lg">{style.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#041627] group-hover:text-[#006397] transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#8192a7]">Vencido há {item.daysOverdue} dias</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${style.badge}`}>{level}</span>
            </div>
          );
        })}
      </div>
      <a
        href="#todos-clientes"
        className="p-4 text-center border-t border-[#e6e8ea] text-[#006397] text-sm font-bold hover:bg-[#f7f9fb] transition-all rounded-b-xl"
      >
        Ver todos os riscos
      </a>
    </div>
  );
}

export default DelinquencyRiskPanel;
