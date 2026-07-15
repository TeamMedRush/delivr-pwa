import { Container } from "@components/ui/structure/container";
import { ProfileView } from "@components/view/profile-view";
import { useClasses } from "@styles";
import { PageProps, useRouter } from "@utils/router";

function Layout() {
  return (<>
    <Container className={useClasses("profile-page")}>
      <ProfileView />
    </Container>
  </>);
}

export function ProfilePage({ forwarded } : PageProps) {
  return useRouter(forwarded, Layout, {});
}

