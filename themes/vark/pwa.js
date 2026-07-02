// Installable-assistant glue. Captures the browser's install offer so the assistant's empty-state
// "Install app" button can fire it later — the beforeinstallprompt event can arrive before the
// islands bundle hydrates, so we stash it on window and re-broadcast a custom event the island
// listens for. Chrome/Edge/Android only; iOS has no equivalent (there the button shows manual
// "Add to Home Screen" steps). There is intentionally NO service worker: the app installs from the
// manifest + icons alone, and a service worker on a docs site risks serving stale pages.
(function () {
  if (typeof window === 'undefined') return;
  window.__aardvarkInstallPrompt = window.__aardvarkInstallPrompt || null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); // suppress Chrome's mini-infobar; we offer install in-context instead
    window.__aardvarkInstallPrompt = e;
    window.dispatchEvent(new Event('aardvark:installable'));
  });
  window.addEventListener('appinstalled', function () {
    window.__aardvarkInstallPrompt = null;
    window.dispatchEvent(new Event('aardvark:installed'));
  });
})();
