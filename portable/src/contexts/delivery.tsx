import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { fetchDeliveryHistory } from "@api/delivery-history";
import { Delivery } from "@interfaces/delivery";
import { transformDeliveryList } from "@transformers/delivery";

interface DeliveryMeta {
  ready: boolean;
  history: Delivery[];
  latest: Delivery | null;
}

interface ProviderProps {
  children: ComponentChildren;
}

const DeliveryContext = createContext<DeliveryMeta | null>(null);

export function DeliveryProvider({ children }: ProviderProps) {
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<Delivery[]>([]);
  const [latest, setLatest] = useState<Delivery | null>(null);

  const load = useCallback(async () => {
    const data = transformDeliveryList(
      await fetchDeliveryHistory()
    );

    setHistory(data);
    setLatest(data[0] || null);
    setReady(true);
  }, []);

  useEffect(() => {
    load();
  }, []);

  const value = {
    ready,
    history,
    latest,
  };

  return <DeliveryContext.Provider value={value}>
    {children}
  </DeliveryContext.Provider>
}

export function useDelivery(): DeliveryMeta {
  return useContext(DeliveryContext)!;
}

