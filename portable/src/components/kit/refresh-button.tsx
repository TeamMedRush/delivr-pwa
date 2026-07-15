import { useCallback } from "preact/hooks";

import { MenuButton } from "@components/ui/interactive/menu-button";

export function RefreshButton() {
  const goToPrevPage = useCallback(() => {
    window.location.reload();
  }, []);

  return (<>
    <MenuButton
      icon="RefreshRegular"
      onClick={goToPrevPage}
    />
  </>);
}

