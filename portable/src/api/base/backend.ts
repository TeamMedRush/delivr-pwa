import { ApiCaller } from "@api/base/api-caller";

export const backendApi = new ApiCaller({
  baseApiUrl: (window as any).apiBaseUrl,
  credentials: "include",
  mode: "cors",
  retries: 3,
  defaultHeaders: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${
      localStorage.getItem("apiToken") || "Unauthorized"
    }`,
  },
});

