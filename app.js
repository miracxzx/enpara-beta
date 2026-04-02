const screens = document.querySelectorAll("[data-screen]");

function showScreen(screenName) {
  screens.forEach((screen) => {
    screen.classList.toggle(
      "screen--active",
      screen.dataset.screen === screenName,
    );
  });
}

document.querySelectorAll("[data-open-screen]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.openScreen);
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  });
}

if ("caches" in window) {
  window.addEventListener("load", () => {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  });
}
