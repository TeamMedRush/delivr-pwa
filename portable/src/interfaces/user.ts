export interface User {
  success: boolean;
  forceLogout: boolean;
  username: string | null;
  phoneNumber: string | null;
  swapToken: string | null;
}

