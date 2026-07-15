import { useNavigate } from "react-router-dom";
import { CREDIT_USAGE } from "../data/clientesData";

/** Colors the utilization bar/label by severity: critical (>=95%), warning (>=85%), normal otherwise. */
function usageColor(pct: number) {
  if (pct >= 95) return { bar: "bg-[#ba1a1a]", text: "text-[#ba1a1a]" };
  if (pct >= 85) return { bar: "bg-orange-500", text: "text-orange-600" };
  return { bar: "bg-[#006397]", text: "text-[#44474c]" };
}

/** Compact list of clients closest to (or exceeding) their approved credit limit; opens the client's detail page. */
function CreditUtilizationPanel() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea] h-full">
      <h3 className="font-bold text-[#041627] text-lg mb-4">Limite de Crédito por Cliente</h3>
      <div className="space-y-4">
        {CREDIT_USAGE.map((item) => {
          const color = usageColor(item.utilizedPct);
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/dashboard/clientes/${item.id}`)}
              className="w-full text-left group"
            >
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-[#041627] group-hover:text-[#006397] transition-colors">
                  {item.name}
                </span>
                <span className={`font-bold ${color.text}`}>{item.utilizedPct}%</span>
              </div>
              <div className="w-full bg-[#eceef0] h-2 rounded-full">
                <div className={`h-full rounded-full ${color.bar}`} style={{ width: `${item.utilizedPct}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CreditUtilizationPanel;
