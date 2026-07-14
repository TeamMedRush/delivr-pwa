import { ApiCaller } from "@api/base/api-caller";

const baseApiUrl = (window as any).apiBaseUrl;
const apiToken = localStorage.getItem("apiToken") || "Unauthorized";

export const backendApi = new ApiCaller({
  baseApiUrl,
  credentials: "include",
  mode: "cors",
  retries: 3,
  defaultHeaders: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiToken}`,
    "Accept": "application/json",
  },
});

