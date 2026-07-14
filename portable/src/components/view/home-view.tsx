import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { DeliveryView } from "@components/view/delivery-view";
import { HistoryView } from "@components/view/history-view";
import { useDelivery } from "@contexts/delivery";
import { useClasses } from "@styles";

export function HomeView() {
  const { latest } = useDelivery();

  if (localStorage.getItem("apiToken") === null) {
    window.location.href = "/auth";
  }

  return (<>
    <Container className={useClasses('home-view')}>
      <Container
        className={useClasses("home-view-header")}
      >
        <Heading size="large">
          Delivr
        </Heading>
      </Container>

      <Container className={useClasses("home-view-content")}>
        {latest && <DeliveryView
          rider_uuid={latest.ride_uuid}
          embedded
        />}

        <LinkButton
          icon="PlusRegular"
          title="New Delivery"
          url="/new-delivery"
          newTab={false}
        />
      </Container>

      <HistoryView />
    </Container>
  </>);
}

