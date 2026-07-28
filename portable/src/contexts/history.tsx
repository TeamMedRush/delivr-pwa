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
  older: Delivery[][];
  loadingMore: boolean;
  loadMore: () => Promise<void>;
}

interface ProviderProps {
  children: ComponentChildren;
  limit?: number;
  mode?: "all" | "incomplete";
}

const Context = createContext<Meta | null>(null);

export function HistoryProvider({
  children,
  limit = 50,
  mode = "all",
}: ProviderProps) {
  const storageKey = `fastdata::history::${mode}`;
  const [ready, setReady] = useState(false);
  const [older, setOlder] = useState<Delivery[][]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(limit);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);

    const api = {
      "all": fetchDeliveryHistory,
      "incomplete": fetchIncompleteDeliveries,
    }

    const deliveries = transformDeliveryList(
      await api[mode](limit, offset)
    );

    setOlder(prev => [...prev, deliveries]);
    setOffset(prev => prev + limit);
    setLoadingMore(false);
  }, [offset]);

  const [current, setCurrent] = useState<FastData<Delivery[]>>({
    stale: true,
    data: getStorage(storageKey) || [],
  });

  const load = useCallback(async () => {
    const api = {
      "all": fetchDeliveryHistory,
      "incomplete": fetchIncompleteDeliveries,
    }

    const deliveries = transformDeliveryList(await api[mode](limit));
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
    older,
    loadingMore,
    loadMore,
  };

  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export function useHistory(): Meta {
  return useContext(Context)!;
}

