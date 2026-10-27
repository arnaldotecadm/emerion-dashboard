import cockpitImg from "../../assets/images/cockpit_executivo_1787559312663.jpg";

const HIGHLIGHTS = [
  { icon: "monitoring", text: "Cockpit executivo com vendas e funil em tempo real" },
  { icon: "inventory", text: "Inteligência de estoque e reposição" },
  { icon: "shield_lock", text: "Acesso protegido por AWS Cognito" },
];

/** Left-hand navy brand panel shown on large screens. */
function LoginBrandPanel() {
  return (
    <aside
      className="relative hidden w-[46%] max-w-[720px] overflow-hidden bg-sidebar text-white lg:flex lg:flex-col"
      data-testid="login-brand-panel"
    >
      <img src={cockpitImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#041627]/95 via-[#041627]/80 to-[#006397]/60" />

      <div className="relative flex flex-1 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-solid text-xl font-bold">E</span>
          <div>
            <p className="text-lg font-semibold leading-6">Emerion Dashboard</p>
            <p className="text-xs font-semibold tracking-wide text-white/60">Brasil Corporate</p>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-semibold leading-tight">
            Decisões comerciais com dados que você confia.
          </h2>
          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map((item, i) => (
              <li
                key={item.icon}
                className="flex items-center gap-4 text-sm text-white/80 opacity-0 animate-[login-rise_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${150 + i * 120}ms` }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
                  <span className="material-symbols-outlined text-[20px] text-[#92ccff]">{item.icon}</span>
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">Plataforma de inteligência comercial para distribuidores.</p>
      </div>
    </aside>
  );
}

export default LoginBrandPanel;
