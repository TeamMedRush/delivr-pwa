import { StatusIcon } from "@components/kit/status-icon";
import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { Delivery } from "@interfaces/delivery";
import { useClasses } from "@styles";

interface DeliveryCardProps {
  delivery: Delivery
}

export function DeliveryCard({ delivery }: DeliveryCardProps) {
  return (<>
    <Container className={useClasses("delivery-card")}>
      <Container className={useClasses("delivery-card-status")}>
        <StatusIcon
          status={delivery.rideStatus || "pending"}
          className={useClasses("delivery-card-status-icon")}
        />
      </Container>

      <Container className={useClasses("delivery-card-content")}>
        <Heading
          size="small"
          className={useClasses("delivery-card-name")}
        >
          {delivery.invoiceNumber}
        </Heading>

        <Text >
          {!!delivery.requestedAt && new Date(
            delivery.requestedAt * 1000
          ).toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}

          {!delivery.requestedAt && "Delivery"}
        </Text>
      </Container>

      <Container className={useClasses("delivery-card-actions")}>
        <LinkButton
          icon="ArrowRightRegular"
          url={`/delivery/${delivery.rideUuid}`}
          urlText=""
          title=""
          newTab={false}
        />
      </Container>
    </Container>
  </>);
}

