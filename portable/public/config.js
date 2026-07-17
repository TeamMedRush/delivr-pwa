window.apiBaseUrl = "http://localhost:8000";
window.mixpanelToken = "7ffb82a9dbc206ffa97d72c46598eb8e"

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

