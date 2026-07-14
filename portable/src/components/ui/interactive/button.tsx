import * as iconoir from "@attaditya/iconoir-preact/regular";
import { Clickable } from "@components/ui/interactive/clickable";
import { Container } from "@components/ui/structure/container";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

type Direction = "left" | "right" | "top" | "bottom";

interface ButtonProps {
  icon?: keyof typeof iconoir;
  title?: string;
  hoverText?: string;
  hoverIcon?: keyof typeof iconoir;
  hoverTo?: Direction[];
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  icon,
  title,
  hoverText = "",
  hoverIcon = "ArrowRightRegular",
  hoverTo = ["right"],
  disabled = false,
  onClick = () => {},
}: ButtonProps) {
  const IconComponent = icon ? iconoir[icon] : () => null;
  const HoverIcon = iconoir[hoverIcon];

  return (
    <Clickable onClick={disabled ? (() => {}) : onClick}>
      <Container className={useClasses(
        "button",
        disabled && "button-disabled",
      )}>
        <Container className={useClasses("button-icon-container")}>
          <IconComponent className={useClasses("button-icon")} />

          {title && (
            <Text className={useClasses("button-title")}>
              {title}
            </Text>
          )}
        </Container>

        <Container className={useClasses(
          "button-hover",
          ...(hoverTo.map((dir) => `button-hover-${dir}` as any))
        )}>
          <Text className={useClasses("button-hover-url")}>
            {hoverText}
          </Text>

          <HoverIcon className={useClasses("button-hover-icon")} />
        </Container>
      </Container>
    </Clickable>
  );
}

