import { Container } from "@components/ui/structure/container";
import { NewDeliveryView } from "@components/view/new-delivery-view";
import { useClasses } from "@styles";
import { PageProps, useRouter } from "@utils/router";

function Layout() {
  return (<>
    <Container className={useClasses('new-delivery-page')}>
      <NewDeliveryView />
    </Container>
  </>);
}

export function NewDeliveryPage({ forwarded } : PageProps) {
  return useRouter(forwarded, Layout, {});
}

