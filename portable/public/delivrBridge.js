function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

function registerCommCallbacks(callbacks = []) {
  const requestIds = []

  const cleanup = () => {
    for (const requestId of requestIds) {
      delete window.delivrBridgeComm[requestId];
    }
  }

  for (const callback of callbacks) {
    const requestId = generateUniqueId();
    requestIds.push(requestId);

    window.delivrBridgeComm[requestId] = (...args) => {
      if (!window.delivrBridgeComm[requestId])
        return;

      cleanup();

      return callback(...args);
    }
  }

  return requestIds;
}

function addGeolocation() {
  navigator.geolocation.getCurrentPosition = (success, error, options) => {
    const requestIds = registerCommCallbacks([success, error]);
    window.delivrBridge.getLocation(requestIds[0]);
  };
}

function addDelivrBridge() {
  if (!window.delivrBridge?.required())
    return;

  window.delivrBridgeComm = {};
  addGeolocation();
}

addDelivrBridge();

