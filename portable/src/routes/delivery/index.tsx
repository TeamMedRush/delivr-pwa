import { DeliveryView } from "@components/view/delivery-view";
import { ErrorView } from "@components/view/not-found-view";
import { DeliveryProvider } from "@contexts/delivery";
import { LayoutProps, PageProps, useRouter } from "@utils/router";

function Layout({ dynamic }: LayoutProps) {
  if (!dynamic)
    return (<>
      <ErrorView
        code={404}
        message="Product not available"
      />
    </>);

  return (<>
    <DeliveryProvider>
      <DeliveryView
        rider_uuid={dynamic}
      />
    </DeliveryProvider>
  </>);
}

export function DeliveryPage({ forwarded } : PageProps) {
  return useRouter(forwarded, Layout, {});
}

