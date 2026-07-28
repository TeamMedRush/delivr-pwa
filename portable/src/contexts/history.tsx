import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import {
  fetchDeliveryHistory,
  fetchIncompleteDeliveries,
} from "@api/delivery-history";

import { Delivery } from "@interfaces/delivery";
import { FastData } from "@interfaces/fast";
import { transformDeliveryList } from "@transformers/delivery";
import { getStorage } from "@utils/storage";

interface Meta {
  ready: boolean;
  current: FastData<Delivery[]>;
}

interface ProviderProps {
  children: ComponentChildren;
  page?: number;
  mode?: "all" | "incomplete";
}

const Context = createContext<Meta | null>(null);

export function HistoryProvider({
  children,
  mode = "all",
}: ProviderProps) {
  const storageKey = `fastdata::history::${mode}`;
  const [ready, setReady] = useState(false);

  const [current, setCurrent] = useState<FastData<Delivery[]>>({
    stale: true,
    data: getStorage(storageKey) || [],
  });

  const load = useCallback(async () => {
    const api = {
      "all": fetchDeliveryHistory,
      "incomplete": fetchIncompleteDeliveries,
    }

    const deliveries = transformDeliveryList(await api[mode]());
    localStorage.setItem(storageKey, JSON.stringify(deliveries));

    setCurrent({
      stale: false,
      data: deliveries,
    });

    setReady(true);
  }, []);

  useEffect(() => {
    load();
  }, []);

  const value = {
    ready,
    current,
  };

  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export function useHistory(): Meta {
  return useContext(Context)!;
}

