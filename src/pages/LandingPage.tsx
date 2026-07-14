import logo from "../assets/emerion-logo.svg";

interface LandingPageProps {
  /** Triggers the Cognito hosted UI sign-in redirect. */
  onSignIn: () => void;
}

const FEATURES = [
  {
    icon: "inventory_2",
    title: "Inventory Management",
    description:
      "Real-time tracking of stock levels, warehouse locations, and movement across all your global centers.",
  },
  {
    icon: "account_balance_wallet",
    title: "Financial Reporting",
    description:
      "Generate comprehensive financial statements and track KPIs instantly with automated audit-ready reports.",
  },
  {
    icon: "shopping_cart_checkout",
    title: "Order Processing",
    description:
      "Streamline your sales cycle from quote to fulfillment with ease, including automated logistics integration.",
  },
  {
    icon: "groups",
    title: "Team Collaboration",
    description:
      "Empower your workforce with shared workspaces and real-time communication tools directly within the ERP.",
  },
];

/**
 * Public marketing home page shown to unauthenticated visitors.
 * "Sign In" actions delegate to the Cognito hosted UI via `onSignIn`.
 */
function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <div className="font-body bg-white text-neutral-900 min-h-screen w-full">
      <nav className="flex justify-between items-center px-6 lg:px-12 py-4 w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <img alt="Emerion Dashboard Logo" className="h-8 w-8 object-contain" src={logo} />
          <span className="text-xl font-headline font-bold tracking-tight text-neutral-900">
            Emerion Dashboard
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            className="text-neutral-600 font-body text-sm font-medium tracking-tight hover:text-primary transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-neutral-600 font-body text-sm font-medium tracking-tight hover:text-primary transition-colors"
            href="#pricing"
          >
            Pricing
          </a>
          <a
            className="text-neutral-600 font-body text-sm font-medium tracking-tight hover:text-primary transition-colors"
            href="#about"
          >
            About
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onSignIn}
            className="px-5 py-2 rounded-md bg-primary text-white font-label font-semibold text-sm hover:bg-primary-700 transition-all shadow-md shadow-primary/20"
          >
            Sign In
          </button>
        </div>
      </nav>

      <main>
        <section className="relative pt-20 pb-32 overflow-hidden bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Next-Gen ERP Dashboard
                </div>
                <h1 className="text-5xl lg:text-7xl font-headline font-bold text-neutral-900 leading-[1.1] tracking-tight">
                  Manage Your ERP Operations <span className="text-primary">from Anywhere</span>
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed max-w-xl">
                  Seamlessly connect your desktop ERP with our powerful, mobile-responsive
                  management dashboard. Real-time data, anytime, anywhere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={onSignIn}
                    className="px-8 py-4 rounded-lg bg-primary text-white font-label font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    Sign In to Get Started
                  </button>
                </div>
                <div className="flex items-center gap-6 pt-6 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 font-medium">
                    Trusted by <span className="text-neutral-900 font-bold">500+ enterprises</span>{" "}
                    worldwide
                  </p>
                </div>
              </div>
              <div className="relative group">
                <div className="relative glass-card rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
                  <div className="bg-neutral-900 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="mx-auto bg-white/10 px-4 py-0.5 rounded-md text-[10px] text-white/50 font-mono tracking-widest">
                      emerion.dashboard.cloud
                    </div>
                  </div>
                  <div className="p-10 bg-white flex flex-col gap-4">
                    <div className="h-6 w-1/2 rounded bg-neutral-100" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 rounded-xl bg-primary/10" />
                      <div className="h-24 rounded-xl bg-neutral-100" />
                    </div>
                    <div className="h-32 rounded-xl bg-neutral-100" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-10 glass-card p-4 rounded-xl shadow-xl hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-bold">REVENUE GROWTH</p>
                      <p className="text-lg font-bold text-neutral-900">+12.4%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-20">
              <h2 className="text-4xl font-headline font-bold text-neutral-900 tracking-tight mb-6">
                Engineered for Enterprise Efficiency
              </h2>
              <p className="text-xl text-neutral-500">
                Our platform bridges the gap between legacy desktop ERP systems and modern, agile
                business requirements.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-headline font-bold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-500 leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 px-6 lg:px-12 mt-auto bg-neutral-50 border-t border-neutral-200 font-body text-sm text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img alt="Emerion Dashboard Logo" className="h-6 w-6" src={logo} />
            <span className="font-headline font-bold text-lg text-neutral-900">Emerion ERP</span>
          </div>
          <p>© {new Date().getFullYear()} Emerion ERP Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
