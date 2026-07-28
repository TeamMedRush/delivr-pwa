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
  friendlyName: string,
  startLocation: string,
) {
  const data = await backendApi.callApi(
    `/deliveries/events/${rideUuid}/start`,
    "PATCH",
    JSON.stringify({
      "friendly_name": friendlyName,
      "start_location": startLocation,
    })
  );

  return { data };
}

export async function endDelivery(
  rideUuid: string,
  friendlyName: string,
  endLocation: string,
) {
  const data = await backendApi.callApi(
    `/deliveries/events/${rideUuid}/end`,
    "PATCH",
    JSON.stringify({
      "friendly_name": friendlyName,
      "end_location": endLocation,
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

