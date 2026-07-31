import { User } from "@interfaces/user";

interface RawData {
  data: User
}

export function transformUser(raw: unknown): User {
  const data = (raw as RawData).data;

  return {
    username: data.username,
    phone_number: data.phone_number,
    force_logout: data.force_logout || false,
  };
}

