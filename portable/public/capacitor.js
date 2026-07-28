function addGeolocationPolyfill() {
  const Geolocation = window.Capacitor.Plugins.Geolocation;

  navigator.geolocation.getCurrentPosition = async (success, error, options) => {
    try {
      try {
        await Geolocation.requestPermissions();
      } catch (e) {
        console.warn("Geolocation permission request failed:", e);
      }

      const pos = await Geolocation.getCurrentPosition(options);
      success(pos);
    } catch (e) {
      error?.(e);
    }
  };

  navigator.geolocation.watchPosition = (success, error, options) =>
    Geolocation.watchPosition(options, (pos, err) => {
      if (err) error?.(err);
      else success(pos);
    });

  navigator.geolocation.clearWatch = (id) =>
    Geolocation.clearWatch({ id });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.Capacitor?.isNativePlatform?.())
    return;

  addGeolocationPolyfill();
});

