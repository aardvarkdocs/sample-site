// Navigate to the selected language's equivalent page when the header
// language picker changes. The <option> value is the fully-resolved target URL
// (the equivalent page in that language, or that language's home).
(function () {
  var select = document.getElementById("aardvark-lang-select");
  if (!select) return;
  select.addEventListener("change", function () {
    var url = select.value;
    // The value is a build-time-generated root-relative URL. Navigate only when it is a
    // genuine same-origin path ("/…", but not protocol-relative "//host"), rejecting any
    // "javascript:" / absolute / protocol-relative value that could redirect off-origin.
    if (url && url !== location.pathname && url.charAt(0) === '/' && url.charAt(1) !== '/') {
      location.href = url;
    }
  });
})();
