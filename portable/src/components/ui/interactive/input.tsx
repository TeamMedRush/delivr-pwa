import { ComponentChildren } from "preact";

import { Container } from "@components/ui/structure/container";
import { useClasses } from "@styles";

interface InputProps {
  leftChildren?: ComponentChildren;
  rightChildren?: ComponentChildren;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: "text" | "password" | "email" | "number" | "tel";
  onInput?: (value: string) => void;
}

export function Input({
  leftChildren = null,
  rightChildren = null,
  placeholder = "",
  className = "",
  containerClassName = "",
  defaultValue = "",
  inputType = "text",
  onInput = () => {},
}: InputProps) {
  return (
    <Container
      className={useClasses("input-container") + " " + containerClassName}
    >
      {leftChildren}
      <input
        className={useClasses("input") + " " + className}
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={inputType}
        onInput={(e) => onInput((e.target as HTMLInputElement).value)}
      />

      {rightChildren}
    </Container>
  );
}

