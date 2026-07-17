import { ApiCaller } from "@api/base/api-caller";

export const nominatimApi = new ApiCaller({
  baseApiUrl: "https://nominatim.openstreetmap.org",
  lsCached: true,
  lsCacheTTL: 7 * 24 * 60 * 60 * 1000,
  retries: 0,
  defaultHeaders: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

