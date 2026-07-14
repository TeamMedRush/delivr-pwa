import { MenuButton } from "@components/ui/interactive/menu-button";

export function HistoryButton() {
  const goToHistoryPage = () => {
    window.location.href = "/history";
  }

  return (<>
    <MenuButton
      onClick={goToHistoryPage}
      icon="DeliveryRegular"
    />
  </>);
}

