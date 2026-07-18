import { fetchLocationFriendlyName } from "@api/location";
import { transformLocFriendlyName } from "@transformers/location";

const MAP_PLATFORM = "https://www.google.com/maps/";

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
};

export function mapUrl(origin: string, destination: string): string {
  return `${MAP_PLATFORM}dir/?api=1&origin=${origin}&destination=${destination}`;
}

export function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
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
      } catch (error) {
        console.error(
          "Error fetching location friendly name:", error
        );
      }

      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        friendlyName,
      });
    },
    (error) => { reject(error); },
    GEO_OPTIONS,
  );
  });
}

