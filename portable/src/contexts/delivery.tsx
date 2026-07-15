import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { fetchDeliveryDetails, fetchDeliveryHistory } from "@api/delivery-history";
import { Delivery } from "@interfaces/delivery";
import { transformDeliveryDetails, transformDeliveryList } from "@transformers/delivery";

interface DeliveryMeta {
  ready: boolean;
  history: Delivery[];
  latest: Delivery | null;
  getDeliveryDetails: (ride_uuid: string) => Promise<Delivery | null>;
}

interface ProviderProps {
  children: ComponentChildren;
}

const DeliveryContext = createContext<DeliveryMeta | null>(null);

export function DeliveryProvider({ children }: ProviderProps) {
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<Delivery[]>([]);
  const [latest, setLatest] = useState<Delivery | null>(null);

  const getDeliveryDetails = useCallback(async (ride_uuid: string) => {
    const existing = history.filter(
      (item) => item.ride_uuid === ride_uuid
    )[0];

    if (existing)
      return existing;

    return transformDeliveryDetails(
      await fetchDeliveryDetails(ride_uuid)
    );
  }, [history]);

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
    getDeliveryDetails,
  };

  return <DeliveryContext.Provider value={value}>
    {children}
  </DeliveryContext.Provider>
}

export function useDelivery(): DeliveryMeta {
  return useContext(DeliveryContext)!;
}

