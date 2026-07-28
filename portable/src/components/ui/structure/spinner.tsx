import { Cycling } from "@attaditya/iconoir-preact";
import { Container } from "@components/ui/structure/container";
import { useClasses } from "@styles";

export function Spinner() {
  return (
    <Container className={useClasses("loading")}>
      <Cycling className={useClasses("loading-spinner")} />
    </Container>
  )
}

