import { useAsset } from "@assets";
import { Container } from "@components/ui/structure/container";
import { useClasses } from "@styles";

export function Parallax() {
  return (
    <Container
      className={useClasses("parallax")}
      children={null}

      attributes={{
        "img-l-src": `url("${useAsset("parallax-l.svg")}")`,
        "img-d-src": `url("${useAsset("parallax-d.svg")}")`,
      }}
    />
  )
}

