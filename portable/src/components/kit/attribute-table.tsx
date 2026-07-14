import { Container } from "@components/ui/structure/container";
import { useClasses } from "@styles";

interface AttributeTableProps {
  attributes?: {
    name: string;
    value: string;
  }[];
}

function AttributeRow({ name, value }: { name: string; value: string }) {
  return (<>
    <Container className={useClasses("attribute")}>
      {name}
    </Container>

    <Container className={useClasses("attribute")}>
      {value}
    </Container>
  </>);
}

export function AttributeTable({ attributes = [] }: AttributeTableProps) {
  return (
    <Container className={useClasses("attributes")}>
      {attributes.map((attribute, index) => <AttributeRow
        key={index}
        name={attribute.name}
        value={attribute.value}
      />)}
    </Container>
  );
}

