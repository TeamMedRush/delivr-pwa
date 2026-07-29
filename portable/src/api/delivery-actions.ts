import { backendApi } from "@api/base/backend";

export async function createDelivery(
  invoice: string,
) {
  const data = await backendApi.callApi(
    "/deliveries/events",
    "POST",
    JSON.stringify({
      "invoice_number": invoice,
    })
  );

  return { data };
}

export async function startDelivery(
  rideUuid: string,
  location: {
    friendlyName: string;
    latitude: number;
    longitude: number;
  }
) {
  const data = await backendApi.callApi(
    `/deliveries/events/${rideUuid}/start`,
    "PATCH",
    JSON.stringify({
      "friendly_name": location.friendlyName,
      "start_latitude": location.latitude,
      "start_longitude": location.longitude,
      "start_location": `${location.latitude},${location.longitude}`,
    })
  );

  return { data };
}

export async function endDelivery(
  rideUuid: string,
  location: {
    friendlyName: string;
    latitude: number;
    longitude: number;
  },
) {
  const data = await backendApi.callApi(
    `/deliveries/events/${rideUuid}/end`,
    "PATCH",
    JSON.stringify({
      "friendly_name": location.friendlyName,
      "end_latitude": location.latitude,
      "end_longitude": location.longitude,
      "end_location": `${location.latitude},${location.longitude}`,
    })
  );

  return { data };
}

export async function cancelDelivery(
  rideUuid: string,
) {
  const data = await backendApi.callApi(
    `/deliveries/events/${rideUuid}/cancel`,
    "PATCH",
  );

  return { data };
}

