import { ComponentChildren } from "preact";

import { Clickable } from "@components/ui/interactive/clickable";

interface LinkProps {
  url: string;
  className?: string;
  newTab?: boolean;
  children: ComponentChildren;
  disabled?: boolean;
}

export function Link({
  url,
  className,
  children,
  newTab = false,
  disabled = false
}: LinkProps) {
  return (
    <Clickable
      className={className}

      onEventClick={(event) => {
        if (disabled)
          return;

        const openInNewTab = [
          newTab,
          event.ctrlKey,
          event.metaKey,
          event.shiftKey,
        ].some(c => !!c);

        if (openInNewTab) {
          window.open(url, "_blank");
        } else {
          window.location.href = url;
        }
      }}
    >
      <a
        href={url}
        onClick={e => e.preventDefault()}
      >
        {children}
      </a>
    </Clickable>
  );
}

