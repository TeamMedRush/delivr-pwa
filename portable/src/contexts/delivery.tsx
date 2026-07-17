import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import {
  cancelDelivery,
  endDelivery,
  startDelivery,
} from "@api/delivery-actions";

import {
  fetchDeliveryDetails,
  fetchDeliveryHistory,
} from "@api/delivery-history";

import { Delivery } from "@interfaces/delivery";
import {
  transformDeliveryDetails,
  transformDeliveryList,
} from "@transformers/delivery";

import { transformDeliveryEvent } from "@transformers/delivery-actions";
import { getCurrentLocation } from "@utils/location";

interface DeliveryMeta {
  ready: boolean;
  history: Delivery[];
  latest: Delivery | null;
  getDeliveryDetails: (ride_uuid: string) => Promise<Delivery | null>;

  start: (
    ride_uuid: string,
    start_callback: () => void,
    finish_callback: () => void,
  ) => Promise<void>;

  end: (
    ride_uuid: string,
    start_callback: () => void,
    finish_callback: () => void,
  ) => Promise<void>;

  cancel: (
    ride_uuid: string,
    start_callback: () => void,
    finish_callback: () => void,
  ) => Promise<void>;
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
      (item) => item.rideUuid === ride_uuid
    )[0];

    if (existing)
      return existing;

    return transformDeliveryDetails(
      await fetchDeliveryDetails(ride_uuid)
    );
  }, [history]);

  const start = useCallback(async (
    ride_uuid: string,
    start_callback: () => void,
    finish_callback: () => void,
  ) => {
    start_callback();

    const {
      latitude,
      longitude,
      friendlyName,
    } = await getCurrentLocation();

    try {
      const data = transformDeliveryEvent(
        await startDelivery(
          ride_uuid,
          friendlyName,
          `${latitude},${longitude}`,
        )
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to start delivery"
        );
      }

      setHistory((prev) => prev.map((item) => {
        if (item.rideUuid === ride_uuid) {
          return {
            ...item,
            rideStatus: data.rideStatus,
            pickedUpAt: data.eventTime,
            startLocation: data.location,
            startCoordinates: data.coordinates,
          };
        }

        return item;
      }));
    } catch (error) {
      alert("Failed to start delivery. Please try again.");
    }

    finish_callback();
  }, []);

  const end = useCallback(async (
    ride_uuid: string,
    start_callback: () => void,
    finish_callback: () => void,
  ) => {
    start_callback();

    const {
      latitude,
      longitude,
      friendlyName,
    } = await getCurrentLocation();

    try {
      const data = transformDeliveryEvent(
        await endDelivery(
          ride_uuid,
          friendlyName,
          `${latitude},${longitude}`,
        )
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to end delivery"
        );
      }

      setHistory((prev) => prev.map((item) => {
        if (item.rideUuid === ride_uuid) {
          return {
            ...item,
            rideStatus: data.rideStatus,
            droppedAt: data.eventTime,
            endLocation: data.location,
            endCoordinates: data.coordinates,
          };
        }

        return item;
      }));
    } catch (error) {
      alert("Failed to end delivery. Please try again.");
    }

    finish_callback();
  }, []);

  const cancel = useCallback(async (
    ride_uuid: string,
    start_callback: () => void,
    finish_callback: () => void,
  ) => {
    start_callback();

    try {
      const data = transformDeliveryEvent(
        await cancelDelivery(ride_uuid)
      );

      if (!data.success) {
        throw new Error(
          data.reason || "Failed to cancel delivery"
        );
      }

      setHistory((prev) => prev.map((item) => {
        if (item.rideUuid === ride_uuid) {
          return {
            ...item,
            rideStatus: data.rideStatus,
            cancelledAt: data.eventTime,
          };
        }

        return item;
      }));
    } catch (error) {
      alert("Failed to cancel delivery. Please try again.");
    }

    finish_callback();
  }, []);

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

