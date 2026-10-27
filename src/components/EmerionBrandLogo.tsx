interface EmerionBrandLogoProps {
  size?: 'sm' | 'lg';
  subtitleText?: string;
}

const sizes = {
  sm: {
    emblem: 'h-8 w-8',
    title: 'text-base',
    badge: 'text-[9px] px-1.5 py-0.5',
    subtitle: 'text-[9px]',
  },
  lg: {
    emblem: 'h-12 w-12 sm:h-14 sm:w-14',
    title: 'text-xl sm:text-2xl lg:text-3xl',
    badge: 'text-[11px] sm:text-xs px-2.5 py-0.5',
    subtitle: 'text-[10px] sm:text-[11px]',
  },
} satisfies Record<string, Record<string, string>>;

function EmerionBrandLogo({
  size = 'lg',
  subtitleText = 'EXTRAÇÃO UNIVERSAL DE DADOS • CONEXÃO VIA API',
}: EmerionBrandLogoProps) {
  const styles = sizes[size];

  return (
    <div className="flex items-center gap-3 sm:gap-4 select-none">
      <div className="relative shrink-0">
        <div className="absolute -inset-1 rounded-2xl bg-emerald-500/15 blur-md" />
        <div className={`${styles.emblem} relative rounded-xl sm:rounded-2xl border border-emerald-200 bg-gradient-to-b from-card via-emerald-50 to-emerald-100 p-1.5 sm:p-2 shadow-md shadow-emerald-900/10`}>
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="em-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="45%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="em-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <path d="M50 6 L88 26 L88 74 L50 94 L12 74 L12 26 Z" stroke="url(#em-primary)" strokeWidth="3.5" strokeLinejoin="round" strokeOpacity="0.75" />
            <path d="M50 14 L80 31 L80 69 L50 86 L20 69 L20 31 Z" stroke="#059669" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="2 3" />
            <path d="M26 26 H38 V74 H26 Z" fill="url(#em-primary)" />
            <path d="M38 26 H76 L66 38 H38 Z" fill="url(#em-metal)" />
            <path d="M38 44 H62 L69 50 L62 56 H38 Z" fill="url(#em-primary)" />
            <path d="M38 62 H76 L66 74 H38 Z" fill="url(#em-primary)" />
            <circle cx="74" cy="50" r="4.5" fill="#047857" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className={`${styles.title} font-black tracking-tight text-slate-900 uppercase leading-none`}>
            Emerion
          </span>
          <span className={`${styles.badge} rounded-md border border-emerald-200 bg-emerald-50 font-mono font-extrabold tracking-widest text-emerald-800`}>
            Web
          </span>
        </div>
        <div className={`${styles.subtitle} mt-1 flex items-center gap-1.5 font-mono uppercase tracking-wider text-slate-500 font-semibold`}>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
          <span className="truncate">{subtitleText}</span>
        </div>
      </div>
    </div>
  );
}

export default EmerionBrandLogo;
