import { Button } from "@components/ui/interactive/button";
import { Container } from "@components/ui/structure/container";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface CartValueProps {
  qty?: number;
  remove?: () => void;
  increment?: () => void;
  decrement?: () => void;
  maxCapacity?: number;
  containerLess?: boolean;
}

export function CartValue({
  qty = 0,
  remove = () => {},
  increment = () => {},
  decrement = () => {},
  maxCapacity = 10,
  containerLess = false,
}: CartValueProps) {
  if (qty <= 0) {
    return (
      <Container className={useClasses("cart-value")}>
        <Container className={useClasses("cart-value-container")}>
          <Button
            icon="CartPlusRegular"
            hoverIcon="PlusRegular"
            hoverTo={["top"]}
            onClick={increment}
            title="Add to Cart"
          />
        </Container>
      </Container>
    );
  }

  return (
    <Container className={useClasses("cart-value")}>
      <Container className={useClasses(
        !containerLess && "cart-value-container"
      )}>
        <Button
          icon="TrashRegular"
          hoverIcon="TrashRegular"
          hoverTo={["top"]}
          disabled={qty <= 0}
          onClick={remove}
        />

        <Button
          icon="CartMinusRegular"
          hoverIcon="MinusRegular"
          hoverTo={["top"]}
          disabled={qty <= 0}
          onClick={decrement}
        />

        <Text className={useClasses("cart-value-qty")}>
          {qty}
        </Text>

        <Button
          icon="CartPlusRegular"
          hoverIcon="PlusRegular"
          hoverTo={["top"]}
          disabled={qty >= maxCapacity}
          onClick={increment}
        />
      </Container>
    </Container>
  );
}

