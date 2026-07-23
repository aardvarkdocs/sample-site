// Navigate to the selected documentation version when the header version picker changes.
// The <option> value is the fully-resolved target URL — the equivalent page in that version
// (same logical path, same language) if it exists, else that version's home — computed at build
// time from the version index, so this is just "navigate to the value" like language-switcher.js.
(function () {
  var select = document.getElementById("aardvark-version-select");
  if (!select) return;
  select.addEventListener("change", function () {
    var value = select.value;
    if (!value) return;
    // Resolve the (build-time-generated, root-relative) value against the current origin and
    // navigate only when the result is same-origin. Comparing URL.origin is a recognized sanitizer:
    // it rejects off-origin targets and any javascript:/data: scheme (whose parsed origin is opaque,
    // never === the page origin), so a crafted value can't redirect off-site or execute script.
    var dest;
    try {
      dest = new URL(value, window.location.origin);
    } catch (e) {
      return;
    }
    if (dest.origin === window.location.origin && dest.href !== window.location.href) {
      window.location.assign(dest.href);
    }
  });
})();
