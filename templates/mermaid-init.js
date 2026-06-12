// Render ```mermaid fenced blocks into inline SVG, client-side.
//
// The Markdown renderer emits each ```mermaid block as <pre class="mermaid">…source…</pre>.
// This script no-ops unless such a block is present, so diagram-free pages never fetch the
// multi-megabyte mermaid bundle. Diagrams are themed to the active color scheme and
// re-rendered when the header light/dark toggle flips it.
(function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll('pre.mermaid'));
  if (!blocks.length) return;

  // mermaid.run() overwrites each <pre> with its SVG, so stash the source to allow a
  // re-render on a theme change. textContent decodes the HTML entities back to raw source.
  blocks.forEach(function (el) { el.dataset.src = el.textContent; });
  document.documentElement.classList.add('aardvark-mermaid'); // CSS hides source until drawn

  function scheme() {
    return document.documentElement.getAttribute('data-mantine-color-scheme') === 'dark'
      ? 'dark' : 'default';
  }

  function draw() {
    window.mermaid.initialize({ startOnLoad: false, theme: scheme(), securityLevel: 'strict' });
    blocks.forEach(function (el) {
      el.removeAttribute('data-processed'); // allow re-processing on a redraw
      el.textContent = el.dataset.src;      // restore source as text, so it stays escaped
    });
    window.mermaid.run({ nodes: blocks });
  }

  var s = document.createElement('script');
  s.src = '/_aardvark/mermaid.min.js';
  s.onload = function () {
    draw();
    // Track light/dark: redraw so diagram colors follow the page when the user toggles.
    var last = scheme();
    new MutationObserver(function () {
      if (scheme() !== last) { last = scheme(); draw(); }
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mantine-color-scheme'],
    });
  };
  s.onerror = function () {
    // If the bundle can't load, reveal the raw diagram source rather than hiding it forever.
    document.documentElement.classList.remove('aardvark-mermaid');
  };
  document.head.appendChild(s);
})();
