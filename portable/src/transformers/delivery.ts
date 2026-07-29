import { Delivery, DeliveryStatus } from "@interfaces/delivery";

interface RawDelivery {
  ride_uuid: string;
  invoice_number: string;
  ride_status: DeliveryStatus;
  requested_at: number | null;
  start_location: string | null;
  start_latitude: number | null;
  start_longitude: number | null;
  picked_up_at: number | null;
  end_location: string | null;
  end_latitude: number | null;
  end_longitude: number | null;
  dropped_at: number | null;
  cancelled_at: number | null;

  order_details: {
    ref_id: string | null;
    order_type: string | null;
    address: string | null;
    channel: string | null;
    contact_name: string | null;
    contact_no: string | null;
    delivery_slot: string | null;
    delivery_type: string | null;
    latitude: number | null;
    longitude: number | null;
    payment_mode: string | null;
    payment_remarks: string | null;
    payment_status: string | null;
    pos_sync_remarks: string | null;
    pos_sync_status: string | null;
  } | null;
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
    startLatitude: raw.start_latitude,
    startLongitude: raw.start_longitude,
    pickedUpAt: raw.picked_up_at,
    endLocation: raw.end_location,
    endLatitude: raw.end_latitude,
    endLongitude: raw.end_longitude,
    droppedAt: raw.dropped_at,
    cancelledAt: raw.cancelled_at,
    orderDetails: !raw.order_details ? null : {
      refId: raw.order_details.ref_id,
      orderType: raw.order_details.order_type,
      address: raw.order_details.address,
      channel: raw.order_details.channel,
      contactName: raw.order_details.contact_name,
      contactNo: raw.order_details.contact_no,
      deliverySlot: raw.order_details.delivery_slot,
      deliveryType: raw.order_details.delivery_type,
      latitude: raw.order_details.latitude,
      longitude: raw.order_details.longitude,
      paymentMode: raw.order_details.payment_mode,
      paymentRemarks: raw.order_details.payment_remarks,
      paymentStatus: raw.order_details.payment_status,
      posSyncRemarks: raw.order_details.pos_sync_remarks,
      posSyncStatus: raw.order_details.pos_sync_status,
    }
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

