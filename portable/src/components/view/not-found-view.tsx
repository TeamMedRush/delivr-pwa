import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface ErrorViewProps {
  code?: number;
  message?: string;
}

export function ErrorView({
  code,
  message,
}: ErrorViewProps) {
  return (
    <Container className={useClasses("error-container")}>
      <Container className={useClasses("error-content")}>
        <Container className={useClasses("error-meta")}>
          <Heading size="max" className={useClasses("error-heading")}>
            Oh no!
          </Heading>

          {code && <Heading
            className={useClasses("error-code")}
            size="large"
          >
            Error {code}
          </Heading>}
        </Container>

        {message && (
          <Text className={useClasses("error-message")}>
            {message}
          </Text>
        )}
      </Container>
    </Container>
  );
}

