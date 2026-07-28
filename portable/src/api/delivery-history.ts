import { backendApi } from "@api/base/backend";

export async function fetchDeliveryHistory() {
  const data = await backendApi.callApi("/deliveries/history", "GET");

  return { data };
}

export async function fetchDeliveryDetails(ride_uuid: string) {
  const data = await backendApi.callApi(
    `/deliveries/history/${ride_uuid}`,
    "GET"
  );

  return { data };
}

export async function fetchIncompleteDeliveries() {
  const data = await backendApi.callApi(
    "/deliveries/history/incomplete",
    "GET",
  );

  return { data };
}

