import { useTheme } from "./ThemeContext";

/** Sun/moon button that switches between light and dark theme. */
function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      data-testid="theme-toggle-button"
      className={`relative flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent ${className}`}
    >
      <span
        key={theme}
        className="material-symbols-outlined text-[22px] animate-[theme-spin_0.35s_ease-out]"
        aria-hidden="true"
      >
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;
