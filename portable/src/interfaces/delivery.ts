export type DeliveryStatus = null
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Delivery {
  rideUuid: string;
  invoiceNumber: string;
  rideStatus: DeliveryStatus;
  requestedAt: number | null;
  startLocation: string | null;
  startCoordinates: string | null;
  pickedUpAt: number | null;
  endLocation: string | null;
  endCoordinates: string | null;
  droppedAt: number | null;
  cancelledAt: number | null;
}

export interface DeliveryEvent {
  success: boolean;
  reason: string | null;
  rideUuid: string | null;
  rideStatus: DeliveryStatus;
  location: string | null;
  coordinates: string | null;
  eventTime: number | null;
}

