import { AuthView } from "@components/view/auth-view";
import { LayoutProps, PageProps, useRouter } from "@utils/router";

function Layout({ dynamic }: LayoutProps) {
  return (<>
    <AuthView
      mode={({
        "in": "in",
        "up": "up",
      }[dynamic || ""] || "unknown") as "in" | "up" | "unknown"}
    />
  </>);
}

export function AuthPage({ forwarded } : PageProps) {
  return useRouter(forwarded, Layout, {});
}

