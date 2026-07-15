window.apiBaseUrl = "http://localhost:8000";

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

