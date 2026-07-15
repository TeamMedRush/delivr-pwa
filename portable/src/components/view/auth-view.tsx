import { useCallback, useState } from "preact/hooks";

import { authenticateUser, createAccount } from "@api/auth";
import { Form } from "@components/kit/form";
import { Button } from "@components/ui/interactive/button";
import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { LoadingView } from "@components/view/loading-view";
import { useUser } from "@contexts/user";
import { useClasses } from "@styles";

interface AuthViewProps {
  mode?: "in" | "up" | "unknown";
}

export function AuthView({
  mode = "unknown",
}: AuthViewProps) {
  const { ready, authenticated } = useUser();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = useCallback(async () => {
    setLoading(true);

    const { data }: {
      data: any;
    } = await authenticateUser(phoneNumber, password);

    if (data.success) {
      localStorage.setItem("apiToken", data.access_token);
      window.location.href = "/";
    } else {
      alert("Login failed. Please check your credentials and try again.");
    }

    setLoading(false);
  }, [phoneNumber, password]);

  const handleSignUp = useCallback(async () => {
    setLoading(true);

    const { data }: {
      data: any;
    } = await createAccount(phoneNumber, username, password);

    if (!data.success) {
      alert("Account creation failed. Please check your details and try again.");
      setLoading(false);
      return;
    }

    await handleLogin();
    setLoading(false);
  }, [username, phoneNumber, password, confirmPassword]);

  const fields: {
    [key: string]: {
      label: string;
      type: "text" | "password" | "email" | "number" | "tel";
      updateValue?: (value: string) => void;
    }[]
  } = {
    "in": [
      {
        label: "Phone Number",
        type: "tel",
        updateValue: setPhoneNumber,
      },
      {
        label: "Password",
        type: "password",
        updateValue: setPassword,
      }
    ],
    "up": [
      {
        label: "Username",
        type: "text",
        updateValue: setUsername,
      },
      {
        label: "Phone Number",
        type: "tel",
        updateValue: setPhoneNumber,
      },
      {
        label: "Password",
        type: "password",
        updateValue: setPassword,
      },
      {
        label: "Confirm Password",
        type: "password",
        updateValue: setConfirmPassword,
      }
    ],
  };

  if (!ready || loading) {
    return <LoadingView />;
  }

  if (ready && authenticated) {
    window.location.href = "/profile";
  }

  return (
    <Container className={useClasses("auth-view")}>
      <Heading size="medium">
        Let's bring you ready!
      </Heading>

      <Form
        fields={fields[mode] || []}
      />

      {(["in", "up"].includes(mode)) && (
        <Container className={useClasses("auth-options")}>
          {(mode === "in") && (
            <Button
              onClick={handleLogin}
              hoverText="Sign in to your account"
              title="Login"
              icon="PineTreeRegular"
              disabled={!phoneNumber || !password}
            />
          )}

          {(mode === "up") && (
            <Button
              onClick={handleSignUp}
              hoverText="Create a new account"
              title="Create Account"
              icon="FlowerRegular"
              disabled={
                !phoneNumber || !password || !confirmPassword || (
                  password !== confirmPassword
                )
              }
            />
          )}
        </Container>
      )}

      {(mode === "unknown") && (
        <Container className={useClasses("auth-options")}>
          <LinkButton
            newTab={false}
            url="/auth/in"
            urlText="Sign in to your account"
            title="I'm an existing user!"
            icon="PineTreeRegular"
          />

          <LinkButton
            newTab={false}
            url="/auth/up"
            urlText="Create a new account"
            title="I'm a new user!"
            icon="FlowerRegular"
          />
        </Container>
      )}
    </Container>
  );
}

