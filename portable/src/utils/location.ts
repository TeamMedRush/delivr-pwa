import { fetchLocationFriendlyName } from "@api/location";
import { transformLocFriendlyName } from "@transformers/location";
import { trackError } from "@utils/analytics";

const MAP_PLATFORM = "https://www.google.com/maps";

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 7000,
};

export function mapPointUrl(latitude: number, longitude: number): string {
  return [
    MAP_PLATFORM,
    `/dir/?api=1`,
    `&destination=${longitude},${latitude}`,
    `&travelmode=driving`
  ].join("");
}

export function mapPathUrl(origin: string, destination: string): string {
  return [
    MAP_PLATFORM,
    `/dir/?api=1`,
    `&origin=${origin}`,
    `&destination=${destination}`,
    `&travelmode=driving`
  ].join("");
}

export function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
  friendlyName: string;
}> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let friendlyName = "Unknown Location";

      try {
        const data = transformLocFriendlyName(
          await fetchLocationFriendlyName(
            position.coords.latitude,
            position.coords.longitude,
          )
        );

        friendlyName = data.friendlyName;
      } catch (error: Error | any) {
        console.error(
          "Error fetching location friendly name:", error
        );

        trackError(error);
      }

      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        friendlyName,
      });
    },
    (error) => { reject(error); },
    GEO_OPTIONS,
  );
  });
}

