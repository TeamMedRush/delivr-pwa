import { Delivery } from "@attaditya/iconoir-preact";
import { DeliveryCard } from "@components/kit/delivery-card";
import { Container } from "@components/ui/structure/container";
import { Spinner } from "@components/ui/structure/spinner";
import { Heading } from "@components/ui/text/heading";
import { useHistory } from "@contexts/history";
import { useClasses } from "@styles";

export function HistoryView() {
  const {
    history: { stale, data: history },
  } = useHistory();

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
        {stale && <Spinner />}
        {!!history?.length && history.map(delivery => <DeliveryCard
          key={delivery.rideUuid}
          delivery={delivery}
        />)}
      </Container>
    </Container>
  </>);
}

