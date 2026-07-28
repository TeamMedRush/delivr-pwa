import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { Image } from "@components/ui/structure/image";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { DeliveryView } from "@components/view/delivery-view";
import { DeliveryProvider } from "@contexts/delivery";
import { useClasses } from "@styles";

export function HomeView() {
  if (localStorage.getItem("apiToken") === null) {
    window.location.href = "/auth";
  }

  return (<>
    <Container className={useClasses('home-view')}>
      <Container
        className={useClasses("home-view-header")}
      >
        <Image
          src="/logo.png"
          alt="Delivr Logo"
          className={useClasses("home-view-logo")}
        />
      </Container>

      <Container className={useClasses("home-view-content")}>
        <DeliveryProvider>
          <DeliveryView embedded />
        </DeliveryProvider>

        <LinkButton
          icon="PlusRegular"
          title="New Delivery"
          url="/new-delivery"
          newTab={false}
        />
      </Container>

      <Container className={useClasses("home-view-content")}>
        <Heading size="medium">
          Active Deliveries
        </Heading>

        <Text>
          This section is work in progress.
        </Text>
      </Container>

      <Container className={useClasses("home-view-content")}>
        <Heading size="medium">
          Delivery History
        </Heading>

        <LinkButton
          icon="ClockRegular"
          title="See All"
          url="/history"
          newTab={false}
        />
      </Container>
    </Container>
  </>);
}

