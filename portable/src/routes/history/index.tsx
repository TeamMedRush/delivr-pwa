import { Container } from "@components/ui/structure/container";
import { HistoryView } from "@components/view/history-view";
import { HistoryProvider } from "@contexts/history";
import { useClasses } from "@styles";
import { LayoutProps, PageProps, useRouter } from "@utils/router";

function Layout({ dynamic }: LayoutProps) {
  const page = dynamic ? parseInt(dynamic) : 1;

  return (<>
    <Container className={useClasses('history-page')}>
      <HistoryProvider page={page}>
        <HistoryView />
      </HistoryProvider>
    </Container>
  </>);
}

export function HistoryPage({ forwarded } : PageProps) {
  return useRouter(forwarded, Layout, {});
}

