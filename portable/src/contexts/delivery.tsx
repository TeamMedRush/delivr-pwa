import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import {
  cancelDelivery,
  endDelivery,
  startDelivery,
} from "@api/delivery-actions";

import { fetchDeliveryDetails } from "@api/delivery-history";
import { usePopup } from "@contexts/popup";
import { Delivery } from "@interfaces/delivery";
import { FastData } from "@interfaces/fast";
import { transformDeliveryDetails } from "@transformers/delivery";
import { transformDeliveryEvent } from "@transformers/delivery-actions";
import { trackError } from "@utils/analytics";
import { getCurrentLocation } from "@utils/location";
import { checkStorage, getStorage, setStorage } from "@utils/storage";

interface DeliveryMeta {
  ready: boolean;
  current: FastData<Delivery | null>;
  start: () => Promise<void>;
  end: () => Promise<void>;
  cancel: () => Promise<void>;
}

interface ProviderProps {
  children: ComponentChildren;
  ride_uuid?: string;
}

const DeliveryContext = createContext<DeliveryMeta | null>(null);

export function DeliveryProvider({
  children,
  ride_uuid = "latest",
}: ProviderProps) {
  const storageKey = `fastdata::delivery::${ride_uuid}`;
  const { alert } = usePopup();
  const [ready, setReady] = useState(checkStorage(storageKey));

  const [current, setCurrent] = useState<FastData<Delivery | null>>({
    stale: true,
    data: getStorage<Delivery>(storageKey) || null,
  });

  const load = useCallback(async () => {
    try {
      const delivery = transformDeliveryDetails(
        await fetchDeliveryDetails(ride_uuid)
      );

      setStorage<Delivery | null>(storageKey, delivery);

      setCurrent({
        stale: false,
        data: delivery,
      });
    } catch (error: Error | any) {
      setCurrent({
        stale: false,
        data: null,
      });

      console.error("Error loading delivery:", error);
      trackError(error);
    }

    setReady(true);
  }, []);

  const start = useCallback(async () => {
    setReady(false);
    let latitude: number;
    let longitude: number;
    let accuracy: number;
    let friendlyName: string;

    try {
      const locData = await getCurrentLocation();
      latitude = locData.latitude;
      longitude = locData.longitude;
      accuracy = locData.accuracy;
      friendlyName = locData.friendlyName;
    } catch (error: Error | any) {
      alert(
        "Failed to get current location. Please try again.",
        "error",
        "GPS Error"
      );

      setReady(true);
      console.error("Error getting current location:", error);
      trackError(error);
      return;
    }

    try {
      const data = transformDeliveryEvent(
        await startDelivery(
          current.data!.rideUuid!,
          {
            friendlyName,
            latitude,
            longitude,
            accuracy,
          },
        )
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to start delivery"
        );
      }
    } catch (error: Error | any) {
      alert(
        "Failed to start delivery. Please try again.",
        "error",
      );

      console.error("Error starting delivery:", error);
      trackError(error);
    }

    await load();
  }, [current.data?.rideUuid]);

  const end = useCallback(async () => {
    setReady(false);
    let latitude: number;
    let longitude: number;
    let accuracy: number;
    let friendlyName: string;

    try {
      const locData = await getCurrentLocation();
      latitude = locData.latitude;
      longitude = locData.longitude;
      accuracy = locData.accuracy;
      friendlyName = locData.friendlyName;
    } catch (error: Error | any) {
      alert(
        "Failed to get current location. Please try again.",
        "error",
        "GPS Error"
      );

      setReady(true);
      console.error("Error getting current location:", error);
      trackError(error);
      return;
    }

    try {
      const data = transformDeliveryEvent(
        await endDelivery(
          current.data!.rideUuid!,
          {
            friendlyName,
            latitude,
            longitude,
            accuracy,
          },
        )
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to end delivery"
        );
      }
    } catch (error: Error | any) {
      alert(
        "Failed to end delivery. Please try again.",
        "error",
      );

      console.error("Error ending delivery:", error);
      trackError(error);
    }

    await load();
  }, [current.data?.rideUuid]);

  const cancel = useCallback(async () => {
    setReady(false);

    try {
      const data = transformDeliveryEvent(
        await cancelDelivery(current.data!.rideUuid!)
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to cancel delivery"
        );
      }
    } catch (error: Error | any) {
      alert(
        "Failed to cancel delivery. Please try again.",
        "error",
      );

      console.error("Error canceling delivery:", error);
      trackError(error);
    }

    await load();
  }, [current.data?.rideUuid]);

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

