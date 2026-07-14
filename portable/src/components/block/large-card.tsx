import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { Image } from "@components/ui/structure/image";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

export function LargeCard() {
  return (<>
    <Container className={useClasses("large-card")}>
      <Container className={useClasses("large-card-image-container")}>
        <Image
          src="https://picsum.photos/id/932/720/480"
          className={useClasses("large-card-image")}
        />
      </Container>

      <Container className={useClasses("large-card-content")}>
        <Container className={useClasses("large-card-meta")}>
          <Heading size="small" className={useClasses("large-card-title")}>
            Cattle Feed Pellets
          </Heading>

          <Text className={useClasses("large-card-price")}>
            100 INR
          </Text>
        </Container>

        <Container className={useClasses("large-card-link")}>
          <LinkButton
            url="/product/1"
            urlText=""
            icon="InfoCircleRegular"
            newTab={false}
          />
        </Container>
      </Container>
    </Container>
  </>);
}

