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
import { mapPathUrl, mapPointUrl } from "@utils/location";
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
    if (stale)
      return <LoadingView />;

    return <ErrorView
      code={404}
      message="Delivery not found"
    />;
  }

  const status = delivery.rideStatus || "pending";

  const trip: {
    friendlyName: string | null;
    latitude: number | null;
    longitude: number | null;
  }[] = [
    ...(!(delivery.startLatitude && delivery.startLongitude) ? [] : [{
      friendlyName: delivery.startLocation,
      latitude: delivery.startLatitude,
      longitude: delivery.startLongitude,
    }]),
    ...(!(delivery.endLatitude && delivery.endLongitude) ? [] : [{
      friendlyName: delivery.endLocation,
      latitude: delivery.endLatitude,
      longitude: delivery.endLongitude,
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
                    Lat: {!location.latitude
                      ? "(Unavailable)"
                      : location.latitude
                    }
                  </Text>

                  <Text>
                    Lng: {!location.longitude
                      ? "(Unavailable)"
                      : location.longitude
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
              ).filter(
                key => [
                  !!(delivery.orderDetails as any)[key],
                  key !== "latitude",
                  key !== "longitude",
                ].every(p => !!p)
              ).map(key => ({
                name: camelToTitle(key),
                value: (delivery.orderDetails as any)[key] || "Unavailable",
              }))}
            />
          </Container>
        )}

        {[
          (
            delivery.orderDetails?.latitude &&
            delivery.orderDetails?.longitude
          ),
          status === "pending",
          status === "in_progress",
          embedded,
        ].some(p => !!p) && (
          <Container className={useClasses("delivery-view-container")}>
            <Heading
              size="small"
              className={useClasses("delivery-view-subheading")}
            >
              Actions
            </Heading>

            <Container className={useClasses("delivery-view-actions")}>
              {(
                delivery.orderDetails?.latitude &&
                delivery.orderDetails?.longitude
              ) && <LinkButton
                icon="MapRegular"
                title="Check Delivery Route"
                urlText="Open in Maps"

                url={mapPointUrl(
                  delivery.orderDetails?.latitude,
                  delivery.orderDetails?.longitude,
                )}
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
        )}
      </Container>
    </Container>
  );
}

