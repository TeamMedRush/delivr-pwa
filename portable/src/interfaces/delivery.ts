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

  orderDetails: {
    refId: string | null;
    orderType: string | null;
    address: string | null;
    channel: string | null;
    contactName: string | null;
    contactNo: string | null;
    deliverySlot: string | null;
    deliveryType: string | null;
    latitude: number | null;
    longitude: number | null;
    paymentMode: string | null;
    paymentRemarks: string | null;
    paymentStatus: string | null;
    posSyncRemarks: string | null;
    posSyncStatus: string | null;
  } | null;
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

