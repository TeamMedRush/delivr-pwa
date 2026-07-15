// capacitor-polyfill.js

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  const Geolocation = window.Capacitor.Plugins.Geolocation;

  navigator.geolocation.getCurrentPosition = async (success, error, options) => {
    try {
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
});

