// Navigate to the selected language's equivalent page when the header
// language picker changes. The <option> value is the fully-resolved target URL
// (the equivalent page in that language, or that language's home).
(function () {
  var select = document.getElementById("aardvark-lang-select");
  if (!select) return;
  select.addEventListener("change", function () {
    var url = select.value;
    if (url && url !== location.pathname) {
      location.href = url;
    }
  });
})();
