import { nominatimApi } from "@api/base/nominatim";

export async function fetchLocationFriendlyName(
  latitude: number,
  longitude: number,
) {
  const data = await nominatimApi.callApi(
    [
      "/reverse",
      "?format=jsonv2",
      `&lat=${latitude}`,
      `&lon=${longitude}`,
      "&zoom=18",
      "&addressdetails=1",
      "&layer=address",
    ].join(""),
    "GET",
    undefined,
    {},
    {
      lsCached: true,
      lsCacheTTL: 4 * 60 * 1000,
    },
  );

  return { data };
}

