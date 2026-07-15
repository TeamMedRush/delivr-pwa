window.apiBaseUrl = "https://delivr-be.onrender.com";

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

