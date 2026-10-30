interface UnavailableDataNoticeProps {
  icon: string;
  description: string;
  compact?: boolean;
}

/** Reassuring empty state for dashboard metrics that need an enabled data source. */
function UnavailableDataNotice({ icon, description, compact = false }: UnavailableDataNoticeProps) {
  return (
    <div className={`rounded-lg border border-accent/10 bg-accent-solid/5 ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg bg-accent-solid/10 text-accent ${
            compact ? "h-9 w-9" : "h-10 w-10"
          }`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Disponível futuramente</span>
          <p className="mt-1 text-sm font-semibold text-fg-strong">Acompanhamento ainda não disponível</p>
          <p className="mt-1 text-xs leading-relaxed text-fg-subtle">{description}</p>
        </div>
      </div>
      <p className="mt-3 border-t border-accent/10 pt-3 text-xs text-fg-muted">
        Tem interesse? Converse com a equipe responsável para avaliar a ativação.
      </p>
    </div>
  );
}

export default UnavailableDataNotice;
