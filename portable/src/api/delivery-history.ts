import { backendApi } from "@api/base/backend";

export async function fetchDeliveryHistory(
  limit: number = 50,
  offset: number = 0,
) {
  const data = await backendApi.callApi([
    "/deliveries/history",
    `?limit=${limit}`,
    `&offset=${offset}`,
  ].join(""), "GET");

  return { data };
}

export async function fetchDeliveryDetails(ride_uuid: string) {
  const data = await backendApi.callApi(
    `/deliveries/history/${ride_uuid}`,
    "GET"
  );

  return { data };
}

export async function fetchIncompleteDeliveries(
  limit: number = 10000,
  offset: number = 0,
) {
  const data = await backendApi.callApi([
    "/deliveries/history/incomplete",
    `?limit=${limit}&offset=${offset}`,
  ].join(""), "GET");

  return { data };
}

