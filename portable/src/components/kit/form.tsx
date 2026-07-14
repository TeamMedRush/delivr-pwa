import { Input } from "@components/ui/interactive/input";
import { Container } from "@components/ui/structure/container";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface AuthFormProps {
  fields?: {
    label: string;
    type: "text" | "password" | "email" | "number" | "tel";
    updateValue?: (value: string) => void;
  }[];
}

export function Form({ fields = [] }: AuthFormProps) {
  return (<Container className={useClasses("auth-form")}>
    {fields.map((field, index) => (
      <Container key={index} className={useClasses("auth-form-field")}>
        <Text className={useClasses("auth-form-label")}>
          {field.label}
        </Text>

        <Input
          className={useClasses("auth-form-input")}
          inputType={field.type}

          onInput={(value) => {
            field.updateValue && field.updateValue(value);
          }}
        />
      </Container>
    ))}
  </Container>);
}

