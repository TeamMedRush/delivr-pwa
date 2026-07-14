import { Navbar } from "@components/block/navbar";
import { Container } from "@components/ui/structure/container";
import { ContentFrame } from "@components/ui/structure/content-frame";
import { Top } from "@components/ui/structure/top";
import { HomeView } from "@components/view/home-view";
import { ErrorView } from "@components/view/not-found-view";
import { DeliveryProvider } from "@contexts/delivery";
import { AuthPage } from "@routes/auth";
import { DeliveryPage } from "@routes/delivery";
import { HistoryPage } from "@routes/history";
import { NewDeliveryPage } from "@routes/new-delivery";
import { useForwarded } from "@utils/path";
import { type LayoutProps, useRouter } from "@utils/router";

function Layout({
  forwarded = [],
  dynamic = "",
  children
}: LayoutProps) {
  let path = "";

  if (dynamic)
    path = `/${dynamic}`;

  if (forwarded?.length)
    path += `/${forwarded?.join('/')}`;

  return (<>
    <Container attributes={{ id: "main" }}>
      <ContentFrame>
        <Top />
        <Navbar path={path} />

        {!!children ? children : (
          !dynamic
            ? <DeliveryProvider><HomeView /></DeliveryProvider>
            : <ErrorView
              code={404}
              message={`Can't reach: ${path}`}
            />
        )}
      </ContentFrame>
    </Container>
  </>);
}

export function IndexPage() {
  return useRouter(useForwarded(), Layout, {
    "auth": AuthPage,
    "delivery": DeliveryPage,
    "history": HistoryPage,
    "new-delivery": NewDeliveryPage,
  });
}

