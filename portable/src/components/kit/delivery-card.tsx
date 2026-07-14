import { StatusIcon } from "@components/kit/status-icon";
import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
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
          status={delivery.ride_status || "pending"}
          className={useClasses("delivery-card-status-icon")}
        />
      </Container>

      <Container className={useClasses("delivery-card-content")}>
        <Heading
          size="small"
          className={useClasses("delivery-card-name")}
        >
          {!!delivery.requested_at && new Date(
            delivery.requested_at * 1000
          ).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}

          {!delivery.requested_at && "Delivery"}
        </Heading>
      </Container>

      <Container className={useClasses("delivery-card-actions")}>
        <LinkButton
          icon="ArrowRightRegular"
          url={`/delivery/${delivery.ride_uuid}`}
          urlText=""
          title=""
          newTab={false}
        />
      </Container>
    </Container>
  </>);
}

