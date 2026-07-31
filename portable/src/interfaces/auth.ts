export interface UserCreated {
  success: boolean;
  username: string;
}

export interface UserAuthenticated {
  success: boolean;
  username: string;
  accessToken: string;
}

