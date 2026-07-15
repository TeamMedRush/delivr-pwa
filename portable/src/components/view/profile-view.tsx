import { useState } from "preact/hooks";

import { User } from "@attaditya/iconoir-preact";
import { Button } from "@components/ui/interactive/button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { LoadingView } from "@components/view/loading-view";
import { useUser } from "@contexts/user";
import { useClasses } from "@styles";

export function ProfileView() {
  const { ready, authenticated, user, logout } = useUser();

  if (!ready) {
    return <LoadingView />;
  }

  if (ready && !authenticated) {
    window.location.href = "/auth";
  }

  return (<>
    <Container className={useClasses('profile-view')}>
      <Container className={useClasses("profile-view-header")}>
        <Container className={useClasses("profile-view-header-icon")}>
          <User />
        </Container>

        <Heading size="max">
          Profile
        </Heading>
      </Container>

      <Container className={useClasses("profile-view-content")}>
        <Container className={useClasses("profile-view-info")}>
          <Container className={useClasses("profile-view-info-item")}>
            <Heading size="small">
              Username
            </Heading>

            <Text>
              {user?.username}
            </Text>
          </Container>

          <Container className={useClasses("profile-view-info-item")}>
            <Heading size="small">
              Phone Number
            </Heading>

            <Text>
              {user?.phone_number}
            </Text>
          </Container>
        </Container>

        <Container
          className={useClasses("profile-view-filler")}
          children={null}
        />

        <Container className={useClasses("profile-view-footer")}>
          <Button
            title="Log Out"
            icon="LogOutRegular"
            onClick={logout}
          />
        </Container>
      </Container>
    </Container>
  </>);
}

