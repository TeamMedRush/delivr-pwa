import { ComponentChildren } from "preact";

import { useClasses } from "@styles";

interface ClickableProps {
  onClick?: () => void;
  onEventClick?: (event: MouseEvent) => void;
  className?: string;
  children: ComponentChildren;
}

export function Clickable({
  onClick,
  onEventClick,
  className,
  children,
}: ClickableProps) {
  return <span
    className={useClasses("clickable") + " " + className}

    onClick={(event) => {
      onClick?.();
      onEventClick?.(event);
    }}
  >
    {children}
  </span>;
}

