import { DeliveryEvent, DeliveryStatus } from "@interfaces/delivery";

interface RawData {
  data: {
    success: boolean;
    reason: string | null;
    ride_uuid: string | null;
    ride_status: string | null;
    location: string | null;
    coordinates: string | null;
    event_time: number | null;
  };
}

export function transformDeliveryEvent(raw: unknown): DeliveryEvent {
  const data = (raw as RawData).data;

  return {
    success: data.success,
    reason: data.reason,
    rideUuid: data.ride_uuid,
    rideStatus: data.ride_status as DeliveryStatus,
    location: data.location,
    coordinates: data.coordinates,
    eventTime: data.event_time,
  };
}

