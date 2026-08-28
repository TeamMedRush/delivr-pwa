window.onerror = (message, source, lineno, colno, error) => {
  mixpanel.track("unhandled_error", {
    message: String(message),
    source,
    lineno,
    colno,
    stack: error?.stack,
  });
};

window.onunhandledrejection = (event) => {
  mixpanel.track("unhandled_promise_rejection", {
    reason: String(event.reason),
    stack: event.reason?.stack,
  });
};

