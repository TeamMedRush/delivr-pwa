import { useCallback } from "preact/hooks";

import { MenuButton } from "@components/ui/interactive/menu-button";

interface BackButtonProps {
  path?: string;
}

export function BackButton({ path = "/" }: BackButtonProps) {
  const goToPrevPage = useCallback(() => {
    if (!(["", "/"].includes(path)))
    window.history.back();
  }, []);

  return (<>
    <MenuButton
      icon="ArrowLeftRegular"
      disabled={["", "/"].includes(path)}
      onClick={goToPrevPage}
    />
  </>);
}

