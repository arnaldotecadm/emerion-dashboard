import type { ReactNode } from "react";
import { getPresentationModeEnabled } from "../utils/presentationMasking";

function PresentationText({
  children,
  className,
  alwaysVisible = false,
}: {
  children: ReactNode;
  className?: string;
  alwaysVisible?: boolean;
}) {
  const isPlaceholder = children === "—";
  const shouldBlur = getPresentationModeEnabled() && !alwaysVisible && !isPlaceholder;
  const classes = [className, shouldBlur && "presentation-text-blurred"].filter(Boolean).join(" ");

  return <span className={classes || undefined}>{children}</span>;
}

export default PresentationText;
