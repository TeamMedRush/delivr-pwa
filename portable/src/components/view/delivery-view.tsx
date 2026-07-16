import { useState } from "preact/hooks";

import { cancelDelivery, endDelivery, startDelivery } from "@api/delivery-actions";
import { MapPin } from "@attaditya/iconoir-preact";
import { StatusIcon } from "@components/kit/status-icon";
import { Button } from "@components/ui/interactive/button";
import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { LoadingView } from "@components/view/loading-view";
import { ErrorView } from "@components/view/not-found-view";
import { useDelivery } from "@contexts/delivery";
import { useClasses } from "@styles";
import { getCurrentLocation, mapUrl } from "@utils/location";

interface DeliveryViewProps {
  rider_uuid: string;
  embedded?: boolean;
}

export function DeliveryView({
  rider_uuid, embedded = false
}: DeliveryViewProps) {
  const { ready, history } = useDelivery();
  const [loading, setLoading] = useState<boolean>(false);

  const delivery = history.filter(
    (item) => item.ride_uuid === rider_uuid
  )[0];

  const start = async () => {
    setLoading(true);
    const { latitude, longitude } = await getCurrentLocation();

    await startDelivery(
      delivery.ride_uuid,
      "Unknown Location",
      `${latitude},${longitude}`
    );

    window.location.reload();
  }

  const complete = async () => {
    setLoading(true);
    const { latitude, longitude } = await getCurrentLocation();

    await endDelivery(
      delivery.ride_uuid,
      "Unknown Location",
      `${latitude},${longitude}`
    );

    window.location.reload();
  }

  const cancel = async () => {
    setLoading(true);
    await cancelDelivery(delivery.ride_uuid);
    window.location.reload();
  }

  if (ready && !delivery) {
    return (<ErrorView
      code={404}
      message="Delivery not found"
    />);
  }

  if (!ready || loading) {
    return (<LoadingView />);
  }

  const status = delivery.ride_status || "pending";

  const trip: {
    friendlyName: string | null;
    coords: string | null;
  }[] = [
    {
      friendlyName: delivery.start_location,
      coords: delivery.start_coordinates,
    },
    {
      friendlyName: delivery.end_location,
      coords: delivery.end_coordinates,
    },
  ];

  return (
    <Container className={useClasses(
      "delivery-view",
      embedded && "delivery-view-embedded",
    )}>
      <Container className={useClasses("delivery-view-status-container")}>
        <StatusIcon
          status={status}
          className={useClasses("delivery-view-status")}
        />

        <Heading
          size="medium"
          className={useClasses("delivery-view-heading")}
        >
          {status?.replace("_", " ").toUpperCase() || "PENDING"}
        </Heading>
      </Container>

      <Container className={useClasses("delivery-view-content")}>
        <Container className={useClasses("delivery-view-container")}>
          <Heading
            size="small"
            className={useClasses("delivery-view-subheading")}
          >
            Delivery Requested At
          </Heading>

          <Text>
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
          </Text>
        </Container>

        <Container className={useClasses("delivery-view-container")}>
          <Heading
            size="small"
            className={useClasses("delivery-view-subheading")}
          >
            Trip Details
          </Heading>

          <Container className={useClasses("delivery-view-trips")}>
            {trip.map((location, index) => (<Container
              className={useClasses("delivery-view-trip")}
              key={index}
            >
              <Container className={useClasses("delivery-view-trip-icon")}>
                <MapPin />
              </Container>

              <Container className={useClasses("delivery-view-trip-text")}>
                <Text>
                  {location.friendlyName || "Unknown Location"}
                </Text>

                {!location.coords
                  ? "(No coordinates)"
                  : <Container
                    className={useClasses("delivery-view-trip-coords")}
                  >
                    <Text>
                      Lat: {location.coords.split(",")[0]}
                    </Text>

                    <Text>
                      Lng: {location.coords.split(",")[1]}
                    </Text>
                  </Container>
                }
              </Container>
            </Container>))}
          </Container>
        </Container>

        <Container className={useClasses("delivery-view-container")}>
          <Heading
            size="small"
            className={useClasses("delivery-view-subheading")}
          >
            Actions
          </Heading>

          <Container className={useClasses("delivery-view-actions")}>
            {trip.length >= 2 && <LinkButton
              icon="MapRegular"
              urlText="View on Google Maps"
              url={mapUrl(trip[0].coords!, trip[1].coords!)}
              title="Check Delivery Route"
            />}

            {status === "pending" && <Button
              onClick={start}
              title="Start Delivery"
              icon="RocketRegular"
              hoverText="Start"
              disabled={status !== "pending"}
            />}

            {status === "in_progress" && <Button
              onClick={complete}
              title="Complete Delivery"
              icon="CheckCircleRegular"
              hoverText="Complete"
              disabled={status !== "in_progress"}
            />}

            {["pending", "in_progress"].includes(status) && <Button
              onClick={cancel}
              title="Cancel Delivery"
              icon="XmarkCircleRegular"
              hoverText="Cancel"
              disabled={["completed", "cancelled"].includes(status)}
            />}
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

