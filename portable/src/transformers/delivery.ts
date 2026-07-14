import { Delivery } from "@interfaces/delivery";

interface RawData {
  data: any;
}

export function transformDeliveryList(raw: unknown): Delivery[] {
  const data = (raw as RawData).data;

  data.sort((a: Delivery, b: Delivery) => {
    if (a.requested_at === null) return 1;
    if (b.requested_at === null) return -1;
    return b.requested_at - a.requested_at;
  });

  return data;
}

