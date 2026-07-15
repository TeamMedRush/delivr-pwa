import { UserAuthenticated, UserCreated } from "@interfaces/auth";

interface UserCreatedRawData {
  data: {
    success: boolean;
    username: string;
  }
}

interface UserAuthenticatedRawData {
  data: {
    success: boolean;
    username: string;
    access_token: string;
  }
}

export function transformUserCreate(raw: unknown): UserCreated {
  const data = (raw as UserCreatedRawData).data;

  return {
    success: data.success,
    username: data.username,
  };
}

export function transformUserAuthenticated(raw: unknown): UserAuthenticated {
  const data = (raw as UserAuthenticatedRawData).data;

  return {
    success: data.success,
    username: data.username,
    accessToken: data.access_token,
  };
}

