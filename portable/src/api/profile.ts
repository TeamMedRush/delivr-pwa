import { backendApi } from "@api/base/backend";

export async function fetchProfile() {
  const data = await backendApi.callApi("/users/me", "GET");

  return { data };
}

