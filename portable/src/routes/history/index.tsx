import { Container } from "@components/ui/structure/container";
import { HistoryView } from "@components/view/history-view";
import { DeliveryProvider } from "@contexts/delivery";
import { useClasses } from "@styles";
import { LayoutProps, PageProps, useRouter } from "@utils/router";

function Layout({ dynamic }: LayoutProps) {
  return (<>
    <Container className={useClasses('history-page')}>
      <DeliveryProvider>
        <HistoryView />
      </DeliveryProvider>
    </Container>
  </>);
}

export function HistoryPage({ forwarded } : PageProps) {
  return useRouter(forwarded, Layout, {});
}

