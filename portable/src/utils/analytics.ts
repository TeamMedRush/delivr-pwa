declare const mixpanel: {
  track: (
    eventName: string,
    properties?: {
      [key: string]: any;
    },
  ) => void;
};

export function trackError(
  error: Error,
  eventName: string = "handled_error"
) {
  mixpanel.track(eventName, {
    message: error.message,
    source: error?.name,
    stack: error?.stack,
  });
}

export function trackEvent(
  eventName: string,
  properties?: {
    [key: string]: any;
  },
) {
  mixpanel.track(eventName, properties);
}

