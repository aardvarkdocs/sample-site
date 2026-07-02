/* Crush-aware TOC collapse for the "Ask AI" panel.
 *
 * When the assistant opens it reserves a right gutter (body.aardvark-ai-open ->
 * .aardvark-layout padding-right: --aardvark-ai-w). On all but the widest viewports that
 * gutter squeezes the content column below its max width. Whenever it would, we collapse the
 * right-hand "On this page" TOC and hand its track back to the content -- the content is what
 * the reader came for; the TOC is a secondary aid worth dropping to keep the prose readable.
 * The TOC stays only when the panel fits without squeezing the content (wide viewports) or
 * when there is no reflow room at all (<=1100px, where CSS already overlays the panel
 * full-screen and hides the TOC).
 *
 * Replaces a static @media query whose 1540/1760 breakpoints were hand-derived from the
 * default widths and had to be updated by hand if any default changed (and which mis-served
 * aardvark-mode-toc-only's wider content-max). Here the threshold comes from the LIVE
 * computed widths, so it's correct for every width mode and any theme override, no magic
 * numbers.
 *
 * Decision (V = viewport width; the grid tracks share V - panel gutter A). With the panel
 * open and the TOC present the content track is min(Ccap, V - S - T - A). Collapse the TOC
 * whenever that would fall below the content's max -- i.e. the panel would crush the content:
 *     crush  iff  V - S - T - A < Ccap
 *            iff  V < S + T + A + Ccap
 * Each width mode feeds its own S/Ccap, so the threshold tracks the mode automatically -- e.g.
 * aardvark-mode-toc-only (no sidebar, content-max 1100 -> Ccap ~1180) crushes up to ~1780px:
 * a mode built for a wide content column sheds its TOC sooner to protect that column.
 * Computed analytically (not by measuring .aardvark-main) because padding-right animates
 * over 0.28s on open: a measurement on open would read the still-full mid-transition width
 * and mis-decide. V and the CSS vars are the stable *target* values, so the formula is
 * correct the instant the panel opens -- letting us toggle the class synchronously in the
 * same frame the gutter starts animating (no stutter).
 *
 * Loop-safe: we OBSERVE body's class (the island's only signal) and WRITE a class onto
 * .aardvark-layout -- a different element, so the observer never sees its own write. The
 * natural TOC width T is read from :root, which neither a mode nor the crush class ever
 * rewrites (crush sets --aardvark-toc-w:0 on .aardvark-layout), so the read can't feed back.
 * S/Ccap/A are read from .aardvark-layout -- the element the CSS resolves them against, so a
 * theme override scoped there is honoured (mode-aware; modes set those vars there, crush does
 * not -- only T, which is why T alone comes from :root). An equality guard means a no-op
 * decision writes nothing.
 */
(function () {
  var layout = document.querySelector('.aardvark-layout');
  if (!layout) return;

  var CRUSH = 'aardvark-ai-crush-toc';
  var rootStyle = getComputedStyle(document.documentElement);

  function px(style, name) {
    // getComputedStyle returns a custom property's raw token, NOT a resolved length, so a
    // non-px override like "2rem" would parseFloat to 2 (wrong magnitude). Trust px only;
    // anything else (incl. content-max:none, or a missing var) -> NaN, and decide() bails to
    // keep the TOC. The default theme declares every width var in px, so this is the fast path.
    var v = style.getPropertyValue(name).trim();
    return v.slice(-2) === 'px' ? parseFloat(v) : NaN;
  }

  // Whether this page can ever collapse its TOC. Every input is server-rendered page structure,
  // present when this defer script parses and unchanged at runtime (an @view-transition
  // navigation reloads the document and re-runs this), so resolve once -- no per-frame walk:
  //  - width modes that hide the TOC outright (mode class on .aardvark-layout, {% layout_class %});
  //  - API-reference pages, whose middle track is reset to 1fr (uncapped, so "restore to cap" is
  //    a meaningless premise). Gate on the island MOUNT POINT (the server always emits
  //    `<div data-aardvark-island="ApiReference">`, even with islands.ssr off) -- NOT the
  //    island-rendered `.aardvark-api` container, which isn't in the DOM yet at parse time when
  //    SSR is off and which the body-class observer wouldn't notice appearing later.
  var canCrush =
    !layout.classList.contains('aardvark-mode-wide') &&
    !layout.classList.contains('aardvark-mode-full') &&
    !layout.classList.contains('aardvark-mode-uncapped') &&
    !layout.querySelector('[data-aardvark-island="ApiReference"]');

  function decide() {
    if (!canCrush) return false;
    if (!document.body.classList.contains('aardvark-ai-open')) return false;
    // <=1100px: CSS overlays the panel full-screen (no reflow room) and already hides the TOC,
    // so leave that regime to CSS. Gate on window.innerWidth, NOT documentElement.clientWidth:
    // the @media (max-width:1100px) rule measures the scrollbar-INCLUSIVE viewport (like
    // innerWidth), whereas clientWidth excludes a classic scrollbar. Using clientWidth here would
    // bail ~15px too early on a classic-scrollbar platform, leaving a band just above 1100 where
    // the overlay hasn't engaged but the JS already gave up -- content squeezed, nothing helping.
    if (window.innerWidth <= 1100) return false;

    var ls = getComputedStyle(layout);
    var Ccap = px(ls, '--aardvark-content-max') + 2 * px(ls, '--aardvark-main-pad-x');
    var S = px(ls, '--aardvark-sidebar-w');          // mode-aware (0 in toc-only)
    var A = px(ls, '--aardvark-ai-w');               // read at the consumer; matches padding-right
    var T = px(rootStyle, '--aardvark-toc-w');       // from :root: crush zeroes it on the layout
    // Any non-px / missing width var (incl. content-max:none) -> no reliable threshold; keep TOC.
    if (!(Ccap > 0) || !isFinite(S) || !isFinite(T) || !isFinite(A)) return false;

    // The grid tracks live in the layout's content box, which excludes the scrollbar -- so the
    // crush math uses clientWidth (the real width the content track divides), not innerWidth.
    var V = document.documentElement.clientWidth;
    // Crush iff the open panel + the TOC would leave the content below its max width.
    return V - S - T - A < Ccap;
  }

  // Toggle the crush class; the equality guard skips redundant writes (and redundant transitions).
  // Animation lives entirely in CSS (the .aardvark-layout transition); we never touch inline styles
  // here -- doing so could snap an in-flight panel-open animation if a resize landed mid-open.
  function apply() {
    var crush = decide();
    if (crush !== layout.classList.contains(CRUSH)) {
      layout.classList.toggle(CRUSH, crush);
    }
  }

  // Open/close: synchronous in the observer microtask so the change lands the SAME frame the panel
  // gutter starts animating (a rAF defer would desync the content reflow from the panel slide).
  new MutationObserver(apply).observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Resize: band membership changes with no class mutation. rAF-throttled (toc.js pattern).
  var ticking = false;
  window.addEventListener('resize', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; apply(); });
  }, { passive: true });

  apply(); // baseline (no-op while the panel is closed)
})();
