// Render ```markdeep fenced blocks into inline SVG diagrams, client-side.
//
// The Markdown renderer emits each ```markdeep block as <pre class="markdeep">…source…</pre>.
// This script no-ops unless such a block is present, so diagram-free pages never fetch the
// Markdeep bundle. Markdeep is loaded in mode:'script' so it exposes its API *without*
// auto-reformatting the whole page; window.markdeep.formatDiagram(src) turns the ASCII source
// into an <svg class="diagram">, which replaces the <pre>. Diagram styling lives in theme.css
// (the svg.diagram slice of Markdeep's stylesheet, re-scoped, plus a dark-mode invert) — we do
// NOT inject markdeep.stylesheet(), whose global body{max-width:680px} rule would clamp the page.
(function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll('pre.markdeep'));
  if (!blocks.length) return;

  document.documentElement.classList.add('aardvark-markdeep'); // CSS hides source until drawn

  // Load Markdeep as a library, not a page processor: mode:'script' suppresses its default
  // behavior of reformatting document.body on load. Must be set before the bundle executes — and
  // locked so a later deferred js_files script can't clobber it during the async load. A
  // non-writable global blocks a wholesale `window.markdeepOptions = {…}` reassignment; Object.freeze
  // wouldn't block that, and freezing the object could break Markdeep if it writes its own defaults.
  try {
    Object.defineProperty(window, 'markdeepOptions', {
      value: { mode: 'script' }, writable: false, configurable: false,
    });
  } catch (e) {
    // Pre-existing non-configurable markdeepOptions (unusual): best-effort set the mode, but never
    // throw — a non-writable or non-object markdeepOptions here would otherwise kill the IIFE before
    // reveal() runs, leaving every diagram permanently hidden.
    try {
      window.markdeepOptions = window.markdeepOptions || {};
      window.markdeepOptions.mode = 'script';
    } catch (_) { /* give up on the mode guard; a revealed page beats a hidden one */ }
  }

  function reveal() { document.documentElement.classList.remove('aardvark-markdeep'); }

  // A stalled bundle request (socket open, but neither a load nor an error event) would otherwise
  // leave the source hidden forever. Reveal after a timeout so readers fall back to the raw ASCII;
  // a later onload still renders the diagrams over it. Cleared once load or error fires.
  var revealTimer = setTimeout(reveal, 8000);

  var s = document.createElement('script');
  s.src = (window.__aardvarkBase || '') + '/_aardvark/markdeep.min.js';
  s.charset = 'utf-8';
  s.onload = function () {
    clearTimeout(revealTimer);
    blocks.forEach(function (el) {
      // Per-block try/catch: one diagram that fails to format shouldn't skip the rest. A failed
      // block keeps its <pre class="markdeep"> and shows as raw ASCII once reveal() runs below.
      try {
        // textContent decodes the escaped HTML entities back to the raw diagram source.
        var wrap = document.createElement('div');
        wrap.className = 'aardvark-markdeep-diagram';
        // Parse Markdeep's SVG string with the correct MIME type so the XML/SVG parser handles
        // namespaced attributes (xlink:href, foreignObject, etc.) correctly. 'text/html' would
        // use the HTML5 foreign-content algorithm and silently mangle XML-namespaced constructs
        // in a future Markdeep version. 'image/svg+xml' is also Trusted-Types-safe (DOMParser
        // bypasses TT for both types). Produces an XMLDocument with no .body — use
        // documentElement instead of body.childNodes.
        var parsed = new DOMParser().parseFromString(
          window.markdeep.formatDiagram(el.textContent), 'image/svg+xml');
        // Defence in depth: formatDiagram() emits only geometric SVG, but DOMParser doesn't strip
        // inline handlers and appendChild would activate them. So if a crafted label or a future
        // Markdeep change ever produced an on* handler or a dangerous-scheme URL, scrub it before
        // the nodes enter the live document. NOTE: only javascript:/vbscript:/data: schemes and
        // on* handlers are stripped; https:// URLs in href/src (e.g. on <use> or <image>) are not
        // blocked here — those are safe for Markdeep 1.19's geometric-only output but would be a
        // cross-origin fetch risk if a future version added external image references.
        // (A no-op on normal diagram output, which carries no on* handlers or such URLs.)
        Array.prototype.slice.call(parsed.querySelectorAll('*')).forEach(function (node) {
          Array.prototype.slice.call(node.attributes).forEach(function (attr) {
            if (/^on/i.test(attr.name) ||
                /^\s*(javascript|vbscript|data):/i.test(attr.value)) {
              node.removeAttribute(attr.name);
            }
          });
        });
        // Strip any <script> elements before moving nodes into the live document.
        // A <script> from a DOMParser document that is appendChild-ed into a live
        // document WILL execute (the "already started" flag is never set in a
        // scripting-disabled DOMParser context). formatDiagram() emits only geometric
        // SVG, so this is a no-op in practice, but it closes the gap for future
        // Markdeep changes or crafted diagram labels.
        Array.prototype.slice.call(parsed.querySelectorAll('script')).forEach(function (scriptEl) {
          scriptEl.parentNode && scriptEl.parentNode.removeChild(scriptEl);
        });
        // image/svg+xml produces an XMLDocument: adopt the root SVG element via importNode
        // (which deep-clones into the live document's namespace). Guard against a parseerror
        // document (malformed SVG) — its documentElement.nodeName is 'parsererror'.
        var svgEl = parsed.documentElement;
        if (svgEl && svgEl.nodeName !== 'parsererror') {
          wrap.appendChild(document.importNode(svgEl, true));
        }
        // Guard against el being removed from the DOM between the initial querySelectorAll
        // and this onload callback (e.g. by another script); replaceChild throws on null.
        if (el.parentNode) { el.parentNode.replaceChild(wrap, el); }
      } catch (e) {
        if (window.console) window.console.error('aardvark-markdeep:', e);
      }
    });
    reveal();
  };
  // If the bundle can't load, reveal the raw diagram source rather than hiding it forever.
  s.onerror = function () { clearTimeout(revealTimer); reveal(); };
  document.head.appendChild(s);
})();
