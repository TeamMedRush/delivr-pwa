import { Cycling, Delivery } from "@attaditya/iconoir-preact";
import { DeliveryCard } from "@components/kit/delivery-card";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { useDelivery } from "@contexts/delivery";
import { useClasses } from "@styles";

export function HistoryView() {
  const { ready, history } = useDelivery();

  return (<>
    <Container className={useClasses('history-view')}>
      <Container className={useClasses("history-view-header")}>
        <Container className={useClasses("history-view-header-icon")}>
          <Delivery />
        </Container>

        <Heading size="max">
          Deliveries
        </Heading>
      </Container>

      <Container className={useClasses("history-view-content")}>
        {!ready && <Container className={useClasses("history-view-loading")}>
          <Cycling className={useClasses("history-view-loading-spinner")} />
        </Container>}

        {ready && !!history?.length && history.map(delivery => <DeliveryCard
          key={delivery.ride_uuid}
          delivery={delivery}
        />)}
      </Container>
    </Container>
  </>);
}

