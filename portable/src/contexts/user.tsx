import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { authenticateUser, createAccount } from "@api/auth";
import { fetchProfile } from "@api/profile";
import { User } from "@interfaces/user";
import {
  transformUserAuthenticated,
  transformUserCreate,
} from "@transformers/auth";

import { transformUser } from "@transformers/user";

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
  const [ready, setReady] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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

      localStorage.setItem("apiToken", data.accessToken);
      setAuthenticated(true);
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
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
    } catch (error) {
      alert("Account creation failed. Please check your details and try again.");
    } finally {
      setAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.clear();
    setAuthenticated(false);
    setUser(null);
  }, []);

  const load = useCallback(async () => {
    try {
      const data = transformUser(
        await fetchProfile()
      );

      setUser(data);
      setAuthenticated(true);
    } catch (error) {
      setAuthenticated(false);
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

