import { backendApi } from "@api/base/backend";

export async function createAccount(
  phone: string,
  username: string,
  password: string,
) {
  const data = await backendApi.callApi(
    "/users/",
    "POST",
    JSON.stringify({
      "phone_number": phone,
      "username": username,
      "password": password,
    })
  );

  return { data };
}

export async function authenticateUser(
  phone: string,
  password: string,
) {
  const data = await backendApi.callApi(
    "/users/auth",
    "POST",
    JSON.stringify({
      "phone_number": phone,
      "password": password,
    })
  );

  return { data };
}

