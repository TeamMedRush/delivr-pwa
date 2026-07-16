import { Delivery, DeliveryStatus } from "@interfaces/delivery";

interface RawDelivery {
  ride_uuid: string;
  invoice_number: string;
  ride_status: DeliveryStatus;
  requested_at: number | null;
  start_location: string | null;
  start_coordinates: string | null;
  picked_up_at: number | null;
  end_location: string | null;
  end_coordinates: string | null;
  dropped_at: number | null;
  cancelled_at: number | null;
}

interface DeliveryListRawData {
  data: RawDelivery[];
}

interface DeliveryDetailsRawData {
  data: RawDelivery | null;
}

function transformDelivery(raw: RawDelivery): Delivery {
  return {
    rideUuid: raw.ride_uuid,
    invoiceNumber: raw.invoice_number,
    rideStatus: raw.ride_status,
    requestedAt: raw.requested_at,
    startLocation: raw.start_location,
    startCoordinates: raw.start_coordinates,
    pickedUpAt: raw.picked_up_at,
    endLocation: raw.end_location,
    endCoordinates: raw.end_coordinates,
    droppedAt: raw.dropped_at,
    cancelledAt: raw.cancelled_at,
  };
}

export function transformDeliveryList(raw: unknown): Delivery[] {
  const data = (raw as DeliveryListRawData).data;

  data.sort((a: RawDelivery, b: RawDelivery) => {
    if (a.requested_at === null) return 1;
    if (b.requested_at === null) return -1;
    return b.requested_at - a.requested_at;
  });

  return data.map(transformDelivery);
}

export function transformDeliveryDetails(raw: unknown): Delivery | null {
  const data = (raw as DeliveryDetailsRawData).data;

  return data ? transformDelivery(data) : null;
}

