import { useState } from "preact/hooks";

import { Input } from "@components/ui/interactive/input";
import { LinkButton } from "@components/ui/interactive/link-button";
import { Container } from "@components/ui/structure/container";
import { useClasses } from "@styles";

export function SearchBar() {
  const [query, setQuery] = useState("");

  return (<>
    <Container className={useClasses("search-bar")}>
      <Input
        placeholder="Search..."
        containerClassName={useClasses("search-bar-input")}
        defaultValue={query}
        onInput={(val) => setQuery(val)}
      />

      <LinkButton
        title=""
        urlText=""
        newTab={false}
        url={`/search?q=${query}`}
        icon="SearchRegular"
        disabled={!query.trim()}
      />
    </Container>
  </>);
}

