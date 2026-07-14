import * as iconoir from "@attaditya/iconoir-preact/regular";
import {
  ArrowRightRegular,
  ArrowUpRightRegular,
} from "@attaditya/iconoir-preact";

import { Button } from "@components/ui/interactive/button";
import { Link } from "@components/ui/interactive/link";
import { Container } from "@components/ui/structure/container";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface SocialLinkProps {
  icon?: keyof typeof iconoir;
  title?: string;
  url: string;
  urlText?: string;
  newTab?: boolean;
  disabled?: boolean;
}

export function LinkButton({
  icon,
  title,
  url,
  urlText = url,
  newTab = true,
  disabled = false,
}: SocialLinkProps) {
  const refIcon = newTab ? "ArrowUpRightRegular" : "ArrowRightRegular";

  return (
    <Link url={url} newTab={newTab} disabled={disabled}>
      <Button
        icon={icon}
        title={title}
        hoverText={urlText}
        hoverIcon={refIcon}
        disabled={disabled}
      />
    </Link>
  );
}

