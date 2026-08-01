import { useCallback, useEffect, useState } from "preact/hooks";

import { MenuButton } from "@components/ui/interactive/menu-button";
import { getStorage, setStorage } from "@utils/storage";

function bubbleAnimation(callback: () => void) {
  const bubble = document.createElement("div");
  bubble.className = "theme-bubble";
  document.body.appendChild(bubble);

  setTimeout(() => {
    callback();
  }, 1000);

  setTimeout(() => {
    bubble.remove();
  }, 1500);
}

export function ThemeButton() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light";

      bubbleAnimation(() => {
        setStorage<string>("theme", newTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
      });

      return newTheme;
    });
  }, []);

  useEffect(() => {
    const savedTheme = getStorage<string>("theme") ?? (
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches ? "dark" : "light"
    );

    document.documentElement.classList.add(savedTheme);
    setTheme(savedTheme);
  }, []);

  return (<>
    <MenuButton
      onClick={() => toggleTheme()}

      icon={
        theme === "light"
          ? "SunLightRegular"
          : "HalfMoonRegular"
      }
    />
  </>);
}

