import { useState } from "preact/hooks";

import { MapPin } from "@attaditya/iconoir-preact";
import { AttributeTable } from "@components/kit/attribute-table";
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
import { mapUrl } from "@utils/location";
import { camelToTitle } from "@utils/string";

interface DeliveryViewProps {
  embedded?: boolean;
}

export function DeliveryView({
  embedded = false
}: DeliveryViewProps) {
  const {
    ready,
    start,
    end,
    current: { stale, data: delivery },
  } = useDelivery();

  if (!ready) {
    return <LoadingView />;
  }

  if (!delivery) {
    return <ErrorView
      code={404}
      message="Delivery not found"
    />;
  }

  const status = delivery.rideStatus || "pending";

  const trip: {
    friendlyName: string | null;
    coords: string | null;
  }[] = [
    ...(!delivery.startCoordinates ? [] : [{
      friendlyName: delivery.startLocation,
      coords: delivery.startCoordinates,
    }]),
    ...(!delivery.endCoordinates ? [] : [{
      friendlyName: delivery.endLocation,
      coords: delivery.endCoordinates,
    }]),
  ];

  return (
    <Container className={useClasses(
      "delivery-view",
      embedded && "delivery-view-embedded",
      {
        "pending": "pending",
        "in_progress": "in-progress",
        "completed": "completed",
        "cancelled": "cancelled",
        "": ""
      }[delivery.rideStatus || ""] as any,
    )}>
      {stale && <Text className={useClasses("delivery-view-stale")}>
        Syncing...
      </Text>}

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
            Delivery Details
          </Heading>

          <AttributeTable
            attributes={[
              {
                name: "Ref No.",
                value: delivery.invoiceNumber,
              },
              {
                name: "Received At",
                value: !delivery.requestedAt ? "Unavailable" : new Date(
                  delivery.requestedAt * 1000
                ).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: embedded ? "numeric" : "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }),
              },
              ...(!delivery.pickedUpAt ? [] : [{
                name: "Started At",
                value: !delivery.pickedUpAt ? "Unavailable" : new Date(
                  delivery.pickedUpAt * 1000
                ).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: embedded ? "numeric" : "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }),
              }]),
              ...(!delivery.droppedAt ? [] : [{
                name: "Dropped At",
                value: !delivery.droppedAt ? "Unavailable" : new Date(
                  delivery.droppedAt * 1000
                ).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: embedded ? "numeric" : "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }),
              }]),
            ]}
          />
        </Container>

        {!!trip.length && <Container
          className={useClasses("delivery-view-container")}
        >
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
                <Text className={useClasses("delivery-view-trip-location")}>
                  {location.friendlyName || "Unknown Location"}
                </Text>

                <Container
                  className={useClasses("delivery-view-trip-coords")}
                >
                  <Text>
                    Lat: {!location.coords
                      ? "(Unavailable)"
                      : location.coords!.split(",")[0]
                    }
                  </Text>

                  <Text>
                    Lng: {!location.coords
                      ? "(Unavailable)"
                      : location.coords!.split(",")[1]
                    }
                  </Text>
                </Container>
              </Container>
            </Container>))}
          </Container>
        </Container>}

        {!!delivery.orderDetails && !embedded && (
          <Container className={useClasses("delivery-view-container")}>
            <Heading
              size="small"
              className={useClasses("delivery-view-subheading")}
            >
              Order Details
            </Heading>

            <AttributeTable
              attributes={Object.keys(
                delivery.orderDetails || {}
              ).map(key => ({
                name: camelToTitle(key),
                value: (delivery.orderDetails as any)[key] || "Unavailable",
              }))}
            />
          </Container>
        )}

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
              title="Start Delivery"
              icon="RocketRegular"
              hoverText="Start"
              disabled={stale ||  status !== "pending"}
              onClick={start}
            />}

            {status === "in_progress" && <Button
              title="Complete Delivery"
              icon="CheckCircleRegular"
              hoverText="Complete"
              disabled={stale || status !== "in_progress"}
              onClick={end}
            />}

            {embedded && <LinkButton
              icon="InfoCircleRegular"
              title="More Details"
              url={`/delivery/${delivery.rideUuid}`}
              urlText="See More"
              newTab={false}
            />}
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

