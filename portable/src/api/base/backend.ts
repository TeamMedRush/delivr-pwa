import { ApiCaller } from "@api/base/api-caller";
import { getStorage } from "@utils/storage";

export const backendApi = new ApiCaller({
  baseApiUrl: (window as any).apiBaseUrl,
  credentials: "include",
  mode: "cors",
  retries: 3,
  defaultHeaders: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${
      getStorage<string>("apiToken") || "Unauthorized"
    }`,
  },
});

