import { Delivery } from "@interfaces/delivery";

interface DeliveryListRawData {
  data: Delivery[];
}

interface DeliveryDetailsRawData {
  data: Delivery;
}

export function transformDeliveryList(raw: unknown): Delivery[] {
  const data = (raw as DeliveryListRawData).data;

  data.sort((a: Delivery, b: Delivery) => {
    if (a.requested_at === null) return 1;
    if (b.requested_at === null) return -1;
    return b.requested_at - a.requested_at;
  });

  return data;
}

export function transformDeliveryDetails(raw: unknown): Delivery | null {
  const data = (raw as DeliveryDetailsRawData).data;

  return data || null;
}

