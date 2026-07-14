import { Cycling } from "@attaditya/iconoir-preact";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { useClasses } from "@styles";

export function LoadingView() {
  return (
    <Container className={useClasses("loading-view-container")}>
      <Container className={useClasses("loading-view-content")}>
        <Container className={useClasses("loading-view-meta")}>
          <Cycling className={useClasses("loading-view-icon")} />
          <Heading
            className={useClasses("loading-view-text")}
            size="large"
          >
            Loading...
          </Heading>
        </Container>
      </Container>
    </Container>
  );
}

