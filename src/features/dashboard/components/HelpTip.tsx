import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Tooltip from "../../../components/Tooltip";

/** Maps each dashboard route to a short, page-specific tip for the help popover. */
const PAGE_TIPS: Record<string, string> = {
  "/dashboard": "Clique nos cartões de KPI para abrir o detalhamento da métrica correspondente.",
  "/dashboard/vendas": "Alterne entre as visualizações por dia, semana e mês para acompanhar a evolução das vendas no período selecionado.",
  "/dashboard/pedidos": "Aqui você poderá acompanhar o status dos pedidos, faturamento e histórico completo assim que esta área estiver disponível.",
  "/dashboard/clientes": "Acompanhe o risco de inadimplência, limites de crédito e o ranking dos clientes que mais geram receita.",
  "/dashboard/vendedores": "Aqui você poderá acompanhar o desempenho da equipe de vendas, metas e comissões assim que esta área estiver disponível.",
  "/dashboard/notificacoes": "Abra uma notificação para ver os detalhes completos e a referência relacionada.",
  "/dashboard/configuracoes": "Aqui você poderá ajustar preferências do workspace, integrações e permissões de equipe assim que esta área estiver disponível.",
  "/dashboard/conta": "Atualize seus dados de perfil e preferências de notificação nesta página.",
};

const DEFAULT_TIP =
  "Use o menu lateral para navegar entre as áreas do Emerion Dashboard.";

const CLIENTE_DETAIL_TIP =
  "Consulte os dados cadastrais deste cliente, como CNPJ/CPF, inscrição estadual e regime tributário. Esta visão é somente leitura.";

/** Resolves the help tip for the current route, including the dynamic "/dashboard/clientes/:id" detail page. */
function resolveTip(pathname: string): string {
  if (pathname in PAGE_TIPS) return PAGE_TIPS[pathname];
  if (/^\/dashboard\/clientes\/.+$/.test(pathname)) return CLIENTE_DETAIL_TIP;
  return DEFAULT_TIP;
}

/** Top-right help button that shows a short tip about the page currently open. */
function HelpTip() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const tip = resolveTip(location.pathname);

  useEffect(() => {
    // Close the tip whenever the user navigates to a different page.
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <Tooltip label="Ajuda">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 text-[#44474c] hover:bg-[#eceef0] rounded-full transition-colors"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Ajuda"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
      </Tooltip>

      {open && (
        <div
          role="dialog"
          className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-popover border border-[#e6e8ea] overflow-hidden z-50 p-4"
        >
          <div className="flex items-center gap-2 mb-2 text-[#006397]">
            <span className="material-symbols-outlined text-lg">lightbulb</span>
            <h3 className="text-sm font-semibold">Dica desta página</h3>
          </div>
          <p className="text-xs text-[#44474c] leading-relaxed">{tip}</p>
        </div>
      )}
    </div>
  );
}

export default HelpTip;
