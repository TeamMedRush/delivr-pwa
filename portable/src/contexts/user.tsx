import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { authenticateUser, createAccount } from "@api/auth";
import { ApiError } from "@api/base/api-caller";
import { fetchProfile } from "@api/profile";
import { usePopup } from "@contexts/popup";
import { User } from "@interfaces/user";
import {
  transformUserAuthenticated,
  transformUserCreate,
} from "@transformers/auth";

import { transformUser } from "@transformers/user";
import { trackError } from "@utils/analytics";
import { checkStorage, clearStorage, setStorage } from "@utils/storage";

interface UserMeta {
  ready: boolean;
  authenticating: boolean;
  authenticated: boolean;
  user: User | null;

  register: (
    phoneNumber: string,
    username: string,
    password: string,
  ) => Promise<void>;

  login: (
    phoneNumber: string,
    password: string,
  ) => Promise<void>;

  logout: () => Promise<void>;
}

interface ProviderProps {
  children: ComponentChildren;
}

const UserContext = createContext<UserMeta | null>(null);

export function UserProvider({ children }: ProviderProps) {
  const { alert } = usePopup();
  const [ready, setReady] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(async () => {
    clearStorage();
    setAuthenticating(false);
    setAuthenticated(false);
    setUser(null);
  }, []);

  const login = useCallback(async (
    phoneNumber: string,
    password: string,
  ) => {
    setAuthenticating(true);

    try {
      const data = transformUserAuthenticated(
        await authenticateUser(phoneNumber, password)
      );

      if (!data.success) {
        throw new Error("Authentication failed");
      }

      setStorage<string>("apiToken", data.accessToken);
      setAuthenticated(true);
    } catch (error: Error | any) {
      alert(
        "Please check your credentials and try again.",
        "error",
        "Login failed"
      );

      console.error("Error during login:", error);
      trackError(error);
      return;
    } finally {
      setAuthenticating(false);
    }
  }, []);

  const register = useCallback(async (
    phoneNumber: string,
    username: string,
    password: string,
  ) => {
    setAuthenticating(true);

    try {
      const data = transformUserCreate(
        await createAccount(phoneNumber, username, password)
      );

      if (!data.success) {
        throw new Error("Account creation failed");
      }

      await login(phoneNumber, password);
    } catch (error: Error | any) {
      alert(
        "Please check your credentials and try again.",
        "error",
        "Registration failed"
      );

      console.error("Error during registration:", error);
      trackError(error);
    } finally {
      setAuthenticating(false);
    }
  }, []);

  const load = useCallback(async () => {
    if (!checkStorage("apiToken")) {
      setAuthenticated(false);
      setAuthenticating(false);
      setReady(true);
    }

    try {
      const data = transformUser(
        await fetchProfile()
      );

      setUser(data);
      setAuthenticated(true);
    } catch (error: ApiError | any) {
      setAuthenticated(false);
      console.error("Error loading user profile:", error);
      trackError(error);

      if (error instanceof ApiError) {
        const apiError: ApiError = error;
        const data = transformUser(apiError);

        if (data.forceLogout) {
          await logout();

          await alert(
            "Your session expired, you have been logged out.",
            "info",
            "Logged out",
          );

          location.href = "/auth"
        }
      }
    }

    setReady(true);
  }, []);

  useEffect(() => {
    load();
  }, []);

  const value = {
    ready,
    authenticating,
    authenticated,
    user,
    register,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>
    {children}
  </UserContext.Provider>
}

export function useUser(): UserMeta {
  return useContext(UserContext)!;
}

