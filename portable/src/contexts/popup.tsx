import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { PopupView } from "@components/view/popup-view";

interface PopupEvent {
  type: "alert";
  resolve: () => void;

  data: {
    message: string;
    type: "info" | "success" | "error";
    title?: string;
  };
}

interface Meta {
  active: boolean;
  currentEvent: PopupEvent | null;

  alert: (
    message: string,
    type?: "info" | "success" | "error",
    title?: string,
  ) => Promise<void>;
}

interface ProviderProps {
  children: ComponentChildren;
}

const Context = createContext<Meta | null>(null);

export function PopupProvider({ children }: ProviderProps) {
  const [active, setActive] = useState(false);
  const [eventQueue, setEventQueue] = useState<PopupEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<PopupEvent | null>(null);

  const alert = useCallback(async (
    message: string,
    type: "info" | "success" | "error" = "info",
    title?: string,
  ) => {
    return new Promise<void>((resolve) => {
      const event: PopupEvent = {
        type: "alert",
        data: { message, type, title },
        resolve: () => {
          resolve();
          setEventQueue(prev => [...prev.slice(1)]);
          setActive(false);
        },
      };

      setEventQueue(prev => [...prev, event]);
    });
  }, []);

  useEffect(() => {
    if (!eventQueue.length)
      return;

    setCurrentEvent(eventQueue[0]);
    setActive(true);
  }, [eventQueue]);

  const value = {
    active,
    currentEvent,
    alert,
  };

  return <Context.Provider value={value}>
    {children}
    <PopupView />
  </Context.Provider>
}

export function usePopup(): Meta {
  return useContext(Context)!;
}

