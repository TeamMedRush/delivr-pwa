const MAP_PLATFORM = "https://www.google.com/maps/";

export function mapUrl(origin: string, destination: string): string {
  return `${MAP_PLATFORM}dir/?api=1&origin=${origin}&destination=${destination}`;
}

export function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

