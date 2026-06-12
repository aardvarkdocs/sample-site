// Light/dark color scheme: persisted in localStorage and applied as the
// `data-mantine-color-scheme` attribute on <html>. Mantine v7 styles (and this
// theme's CSS) restyle purely from that attribute, so flipping it updates both
// the chrome and the mounted islands. Loaded synchronously in <head> so the
// attribute is set before first paint (no flash).
(function () {
  var KEY = 'aardvark-color-scheme';
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function pref() {
    try {
      return localStorage.getItem(KEY) || 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function resolve(p) {
    if (p === 'dark' || p === 'light') return p;
    return mql.matches ? 'dark' : 'light';
  }

  function apply(p) {
    document.documentElement.setAttribute('data-mantine-color-scheme', resolve(p));
  }

  // Run immediately, before the body paints — no animation on the initial scheme.
  apply(pref());

  // Record the reader's platform here too — this is the one script that runs in
  // <head> before first paint. The search keycap ships both modifiers and theme.css
  // shows ⌘ on Apple / Ctrl elsewhere off this attribute, so the right key paints
  // immediately instead of flashing Ctrl then swapping to ⌘ once the island hydrates.
  // The keycap has no other platform probe, so keep this render-blocking in <head>
  // (don't defer/async it or drop it from a custom theme) — without it the keycap
  // stays on its Ctrl default. Dark mode already needs this script, so it's a hard dep.
  try {
    var apple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent || '');
    document.documentElement.setAttribute('data-aardvark-platform', apple ? 'mac' : 'other');
  } catch (e) {}

  // Cross-fade the scheme change with the View Transitions API: the browser snapshots
  // the page, runs apply() to flip the scheme, then cross-fades old -> new on the
  // compositor (see ::view-transition rules in theme.css). No page-wide per-element
  // transition, so nothing is clobbered, there's no recalc storm, and no first-paint
  // flash. Falls back to an instant switch where unsupported or under reduced motion.
  // startViewTransition's callback is async, so work that must run AFTER the scheme
  // flips (e.g. updateButtons) is threaded through `afterApply` and invoked there.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function applyAnimated(p, afterApply) {
    if (!document.startViewTransition || reduceMotion.matches) {
      apply(p);
      if (afterApply) afterApply();
      return;
    }
    document.startViewTransition(function () { apply(p); if (afterApply) afterApply(); });
  }

  function setPref(p) {
    try {
      localStorage.setItem(KEY, p);
    } catch (e) {}
    applyAnimated(p, updateButtons);
  }

  function updateButtons() {
    var resolved = document.documentElement.getAttribute('data-mantine-color-scheme');
    var label = resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('.aardvark-theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  function init() {
    document.querySelectorAll('.aardvark-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var resolved = document.documentElement.getAttribute('data-mantine-color-scheme');
        setPref(resolved === 'dark' ? 'light' : 'dark');
      });
    });
    updateButtons();
    // Follow OS changes only while the user hasn't made an explicit choice.
    mql.addEventListener('change', function () {
      if (pref() === 'auto') applyAnimated('auto', updateButtons);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
