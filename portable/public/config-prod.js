window.apiBaseUrl = "https://delivr-be.attaditya.space";

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

