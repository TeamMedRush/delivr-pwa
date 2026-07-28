import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { fetchDeliveryDetails, fetchDeliveryHistory } from "@api/delivery-history";
import { Delivery } from "@interfaces/delivery";
import { FastData } from "@interfaces/fast";
import { transformDeliveryList } from "@transformers/delivery";
import { getStorage } from "@utils/storage";

interface Meta {
  ready: boolean;
  history: FastData<Delivery[]>;
}

interface ProviderProps {
  children: ComponentChildren;
  page?: number;
}

const Context = createContext<Meta | null>(null);

export function HistoryProvider({ children }: ProviderProps) {
  const storageKey = `fastdata::history`;
  const [ready, setReady] = useState(false);

  const [history, setHistory] = useState<FastData<Delivery[]>>({
    stale: true,
    data: getStorage(storageKey) || [],
  });

  const load = useCallback(async () => {
    const deliveries = transformDeliveryList(
      await fetchDeliveryHistory()
    );

    localStorage.setItem(storageKey, JSON.stringify(deliveries));

    setHistory({
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
    history,
  };

  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export function useHistory(): Meta {
  return useContext(Context)!;
}

