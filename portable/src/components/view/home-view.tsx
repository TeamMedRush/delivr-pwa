import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { Image } from "@components/ui/structure/image";
import { Heading } from "@components/ui/text/heading";
import { DeliveryView } from "@components/view/delivery-view";
import { HistoryView } from "@components/view/history-view";
import { DeliveryProvider } from "@contexts/delivery";
import { HistoryProvider } from "@contexts/history";
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
          urlText="Create Delivery"
          newTab={false}
        />
      </Container>

      <Container className={useClasses("home-view-content")}>
        <Heading size="medium">
          Pending
        </Heading>

        <HistoryProvider mode="incomplete">
          <HistoryView embedded />
        </HistoryProvider>
      </Container>

      <Container className={useClasses("home-view-content")}>
        <Heading size="medium">
          History
        </Heading>

        <HistoryProvider mode="all" limit={5}>
          <HistoryView embedded />
        </HistoryProvider>

        <LinkButton
          icon="ClockRegular"
          title="See All"
          url="/history"
          urlText="View History"
          newTab={false}
        />
      </Container>
    </Container>
  </>);
}

