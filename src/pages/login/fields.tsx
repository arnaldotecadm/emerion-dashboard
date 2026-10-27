import { useState, type InputHTMLAttributes, type ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  trailing?: ReactNode;
}

const inputClass =
  "w-full rounded-xl border border-line-strong bg-card py-3 pl-11 pr-11 text-sm text-fg-strong placeholder:text-fg-subtle transition-[border-color,box-shadow] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

/** Labelled input with a leading Material icon. */
export function Field({ label, icon, trailing, id, ...props }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-fg-subtle">
          {icon}
        </span>
        <input id={id} className={inputClass} {...props} />
        {trailing && <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
    </div>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordField(props: Omit<FieldProps, "icon" | "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      {...props}
      icon="lock"
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          data-testid={`${props.id}-visibility-toggle`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-2 hover:text-accent"
        >
          <span className="material-symbols-outlined text-[20px]">{visible ? "visibility_off" : "visibility"}</span>
        </button>
      }
    />
  );
}

export function SubmitButton({ busy, children, testId }: { busy: boolean; children: ReactNode; testId: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      data-testid={testId}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-solid py-3 text-sm font-semibold text-white shadow-card transition-[background-color,transform] hover:bg-accent-solid-hover active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
    >
      {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}

export function FormMessage({ kind, children, testId }: { kind: "error" | "success"; children: ReactNode; testId: string }) {
  const styles =
    kind === "error"
      ? "border-danger-line bg-danger-soft text-danger-ink"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";
  return (
    <div role={kind === "error" ? "alert" : "status"} data-testid={testId} className={`flex gap-2 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <span className="material-symbols-outlined text-[20px]">{kind === "error" ? "error" : "check_circle"}</span>
      <span>{children}</span>
    </div>
  );
}
