import { useMemo } from "react";
import { useNotificationPreferences } from "../hooks/useNotificationPreferences";
import {
  ALL_NOTIFICATION_CATEGORIES,
  NOTIFICATION_PREFERENCE_OPTIONS,
} from "../types/notificationPreferences";

/** Notification preferences used to control which categories are shown to the user. */
function ConfiguracoesPage() {
  const { enabledCategories, isCategoryEnabled, toggleCategory, enableAll } = useNotificationPreferences();
  const allEnabled = enabledCategories.length === ALL_NOTIFICATION_CATEGORIES.length;

  const selectedSummary = useMemo(() => {
    if (enabledCategories.length === 0) return "Nenhum tipo selecionado.";
    if (allEnabled) return "Todos os tipos de notificação estão habilitados.";
    return `${enabledCategories.length} de ${ALL_NOTIFICATION_CATEGORIES.length} tipos habilitados.`;
  }, [allEnabled, enabledCategories.length]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-[#041627] tracking-tight">Configurações</h2>
        <p className="text-[#8192a7] mt-1">
          Escolha quais notificações devem aparecer para você no Dashboard.
        </p>
      </header>

      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e6e8ea] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#041627]">Preferências de notificações</h3>
            <p className="text-sm text-[#8192a7] mt-1">{selectedSummary}</p>
          </div>
          {!allEnabled && (
            <button
              type="button"
              onClick={enableAll}
              className="self-start sm:self-auto px-3 py-2 text-xs font-semibold text-[#006397] border border-[#006397] rounded-lg hover:bg-[#006397]/5 transition-colors"
            >
              Habilitar todos
            </button>
          )}
        </div>

        <div className="divide-y divide-[#eceef0]">
          {NOTIFICATION_PREFERENCE_OPTIONS.map((option) => {
            const checked = isCategoryEnabled(option.category);
            return (
              <label
                key={option.category}
                className="px-6 py-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#f7f9fb] transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[#191c1e]">{option.label}</p>
                  <p className="text-xs text-[#8192a7] mt-1">{option.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(option.category)}
                  className="mt-0.5 h-4 w-4 rounded border-[#c4c6cd] text-[#006397] focus:ring-[#006397]"
                />
              </label>
            );
          })}
        </div>

        <div className="px-6 py-4 bg-[#f7f9fb] border-t border-[#e6e8ea]">
          <p className="text-xs text-[#8192a7]">
            As preferências são aplicadas às notificações exibidas no Dashboard para este navegador.
          </p>
        </div>
      </section>
    </div>
  );
}

export default ConfiguracoesPage;
