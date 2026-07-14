import type { ReactNode } from "react";

export interface TooltipProps {
  label: string;
  children: ReactNode;
  /** Horizontal alignment of the tooltip relative to the trigger. Defaults to "center". */
  align?: "left" | "center" | "right";
}

const ALIGN_CLASSES: Record<NonNullable<TooltipProps["align"]>, string> = {
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
  right: "right-0",
};

/**
 * Small hover/focus label shown below an icon-only control, so users know
 * what the control does without needing to click it first.
 */
function Tooltip({ label, children, align = "center" }: TooltipProps) {
  return (
    <span className="relative inline-flex group/tooltip">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded-md bg-[#191c1e] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 scale-95 transition-all duration-150 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:scale-100 z-50 ${ALIGN_CLASSES[align]}`}
      >
        {label}
      </span>
    </span>
  );
}

export default Tooltip;
