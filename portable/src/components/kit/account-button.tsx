import { MenuButton } from "@components/ui/interactive/menu-button";

export function AccountButton() {
  const goToAccountPage = () => {
    window.location.href = "/auth";
  }

  return (<>
    <MenuButton
      onClick={goToAccountPage}
      icon="PeopleTagRegular"
    />
  </>);
}

