import { Container } from "@components/ui/structure/container";
import { HistoryView } from "@components/view/history-view";
import { HistoryProvider } from "@contexts/history";
import { useClasses } from "@styles";
import { PageProps, useRouter } from "@utils/router";

function Layout() {
  return (<>
    <Container className={useClasses('history-page')}>
      <HistoryProvider mode="all" limit={50}>
        <HistoryView />
      </HistoryProvider>
    </Container>
  </>);
}

export function HistoryPage({ forwarded } : PageProps) {
  return useRouter(forwarded, Layout, {});
}

