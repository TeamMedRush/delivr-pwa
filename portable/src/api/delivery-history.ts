import { backendApi } from "@api/base/backend";

export async function fetchDeliveryHistory() {
  const data = await backendApi.callApi("/deliveries/", "GET");

  return { data };
}

export async function fetchDeliveryDetails(ride_uuid: string) {
  const data = await backendApi.callApi(
    `/deliveries/${ride_uuid}`,
    "GET"
  );

  return { data };
}

