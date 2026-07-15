import { backendApi } from "@api/base/backend";

export async function fetchProfile() {
  const data = await backendApi.callApi(
    "/users/me",
    "GET",
    undefined,
    {},
    {
      lsCached: true,
      lsCacheTTL: 60 * 1000,
    },
  );

  return { data };
}

