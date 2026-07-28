import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import {
  cancelDelivery,
  endDelivery,
  startDelivery,
} from "@api/delivery-actions";

import { fetchDeliveryDetails, fetchDeliveryHistory } from "@api/delivery-history";
import { Delivery } from "@interfaces/delivery";
import { FastData } from "@interfaces/fast";
import { transformDeliveryDetails, transformDeliveryList } from "@transformers/delivery";
import { transformDeliveryEvent } from "@transformers/delivery-actions";
import { getCurrentLocation } from "@utils/location";
import { getStorage } from "@utils/storage";

interface DeliveryMeta {
  ready: boolean;
  current: FastData<Delivery | null>;
  start: () => Promise<void>;
  end: () => Promise<void>;
  cancel: () => Promise<void>;
}

interface ProviderProps {
  children: ComponentChildren;
  ride_uuid?: string | null;
}

const DeliveryContext = createContext<DeliveryMeta | null>(null);

export function DeliveryProvider({
  children,
  ride_uuid = null,
}: ProviderProps) {
  const storageKey = `fastdata::delivery::${ride_uuid}`;
  const [ready, setReady] = useState(false);

  const [current, setCurrent] = useState<FastData<Delivery | null>>({
    stale: true,
    data: getStorage(storageKey) || null,
  });

  const start = useCallback(async () => {
    setReady(false);
    let latitude: number;
    let longitude: number;
    let friendlyName: string;

    try {
      const locData = await getCurrentLocation();
      latitude = locData.latitude;
      longitude = locData.longitude;
      friendlyName = locData.friendlyName;
    } catch (error) {
      alert("Failed to get current location. Please try again.");
      setReady(true);
      return;
    }

    try {
      const data = transformDeliveryEvent(
        await startDelivery(
          ride_uuid!,
          friendlyName,
          `${latitude},${longitude}`,
        )
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to start delivery"
        );
      }
    } catch (error) {
      alert("Failed to start delivery. Please try again.");
    }

    setReady(true);
  }, []);

  const end = useCallback(async () => {
    setReady(false);
    let latitude: number;
    let longitude: number;
    let friendlyName: string;

    try {
      const locData = await getCurrentLocation();
      latitude = locData.latitude;
      longitude = locData.longitude;
      friendlyName = locData.friendlyName;
    } catch (error) {
      alert("Failed to get current location. Please try again.");
      setReady(true);
      return;
    }

    try {
      const data = transformDeliveryEvent(
        await endDelivery(
          ride_uuid!,
          friendlyName,
          `${latitude},${longitude}`,
        )
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to end delivery"
        );
      }
    } catch (error) {
      alert("Failed to end delivery. Please try again.");
    }

    setReady(true);
  }, []);

  const cancel = useCallback(async () => {
    setReady(false);

    try {
      const data = transformDeliveryEvent(
        await cancelDelivery(ride_uuid!)
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to cancel delivery"
        );
      }
    } catch (error) {
      alert("Failed to cancel delivery. Please try again.");
    }

    setReady(true);
  }, []);

  const loadLatest = useCallback(async () => {
    try {
      const deliveries = transformDeliveryList(
        await fetchDeliveryHistory()
      );

      const latestDelivery = deliveries[0] || null;
      localStorage.setItem(storageKey, JSON.stringify(latestDelivery));
    } catch (error) {
      localStorage.setItem(storageKey, JSON.stringify(null));
    }

    setCurrent({
      stale: false,
      data: getStorage(storageKey) || null,
    });

    setReady(true);
  }, []);

  const load = useCallback(async () => {
    if (!ride_uuid) {
      await loadLatest();
      return;
    }

    try {
      const delivery = transformDeliveryDetails(
        await fetchDeliveryDetails(ride_uuid)
      );

      localStorage.setItem(storageKey, JSON.stringify(delivery));

      setCurrent({
        stale: false,
        data: delivery,
      });
    } catch (error) {
      setCurrent({
        stale: false,
        data: null,
      });
    }

    setReady(true);
  }, []);

  useEffect(() => {
    load();
  }, []);

  const value = {
    ready,
    current,
    start,
    end,
    cancel,
  };

  return <DeliveryContext.Provider value={value}>
    {children}
  </DeliveryContext.Provider>
}

export function useDelivery(): DeliveryMeta {
  return useContext(DeliveryContext)!;
}

