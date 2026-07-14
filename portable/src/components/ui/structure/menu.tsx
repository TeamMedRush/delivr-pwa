import { ComponentChildren } from "preact";

import { Container } from "@components/ui/structure/container";
import { useClasses } from "@styles";

interface MenuProps {
  position: "top" | "bottom";
  children?: ComponentChildren;
}

export function Menu({
  position,
  children,
}: MenuProps) {
  return (<>
    <Container className={useClasses("menu-sticky")}>
      <Container className={useClasses("menu-container")}>
        <Container className={useClasses("menu", `menu-${position}`)}>
          {children}
        </Container>
      </Container>
    </Container>
  </>);
}

