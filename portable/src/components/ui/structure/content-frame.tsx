import { ComponentChildren } from "preact";

import { Parallax } from "@components/block/parallax";
import { Container } from "@components/ui/structure/container";
import { useClasses } from "@styles";

interface ContentFrameProps {
  children: ComponentChildren;
}

export function ContentFrame({ children }: ContentFrameProps) {
  return (
    <Container className={useClasses("content-full-frame")}>
      <Parallax />
      <Container className={useClasses("content-frame")}>
        {children}
      </Container>
    </Container>
  )
}

