import { User } from "@interfaces/user";

interface RawData {
  data: {
    success?: boolean;
    username?: string | null;
    phone_number?: string | null;
    swap_token?: string | null;
    force_logout?: boolean | null;
  }
}

export function transformUser(raw: unknown): User {
  const data = (raw as RawData).data;

  return {
    success: data.success || false,
    username: data.username || null,
    phoneNumber: data.phone_number || null,
    swapToken: data.swap_token || null,
    forceLogout: data.force_logout || false,
  };
}

