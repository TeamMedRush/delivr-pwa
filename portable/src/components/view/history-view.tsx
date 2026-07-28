import { Delivery } from "@attaditya/iconoir-preact";
import { DeliveryCard } from "@components/kit/delivery-card";
import { Container } from "@components/ui/structure/container";
import { Spinner } from "@components/ui/structure/spinner";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useHistory } from "@contexts/history";
import { useClasses } from "@styles";

interface HistoryViewProps {
  embedded?: boolean;
}

export function HistoryView({
  embedded = false,
}: HistoryViewProps) {
  const {
    current: { stale, data: history },
  } = useHistory();

  return (<>
    <Container className={useClasses('history-view')}>
      {!embedded && (
        <Container className={useClasses("history-view-header")}>
          <Container className={useClasses("history-view-header-icon")}>
            <Delivery />
          </Container>

          <Heading size="max">
            Deliveries
          </Heading>
        </Container>
      )}

      {!history?.length && !stale && (
        <Container className={useClasses("history-view-empty")}>
          <Text>
            No deliveries found
          </Text>
        </Container>
      )}

      <Container className={useClasses(
        "history-view-content",
        embedded && "embedded",
      )}>
        {stale && <Spinner />}
        {!!history?.length && history.map(delivery => <DeliveryCard
          key={delivery.rideUuid}
          delivery={delivery}
        />)}
      </Container>
    </Container>
  </>);
}

