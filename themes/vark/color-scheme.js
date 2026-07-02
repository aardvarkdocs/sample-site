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

  // The site-wide cross-document @view-transition (theme.css `@view-transition { navigation: auto }`)
  // cross-fades the old page into a snapshot of the new one. Chromium captures that inbound snapshot
  // before this render-blocking script's data-mantine-color-scheme attribute is reflected, so the
  // snapshot is painted from CSS alone — the :root default plus the prefers-color-scheme block in
  // theme.css — i.e. it follows the OS scheme, NOT the reader's stored choice. That mismatches, and
  // visibly flashes, in exactly two situations, so skip the transition for them (the page then swaps
  // like a reload, which never flashes):
  //   1. Same-URL re-navigation — clicking the tab/link for the page you're already on. The crossfade
  //      is pointless there (identical content) and is the most reproducible flash.
  //   2. The reader has overridden their OS scheme (explicit light on a dark OS, or explicit dark on a
  //      light OS): the OS-following inbound snapshot is the OPPOSITE of their choice, so ANY nav
  //      flashes — including the reverse (light→dark) flash the theme.css prefers-color-scheme block
  //      would otherwise introduce for an OS-dark reader who chose light.
  // A reader whose scheme matches their OS keeps the crossfade on genuine page-to-page navigations.
  // Skip on BOTH ends — pageswap from the outgoing document, pagereveal from the incoming one (and a
  // render-blocking <head> script is the only place a pagereveal listener registers early enough).
  // The two sides source NavigationActivation differently ON PURPOSE: PageSwapEvent exposes
  // `.activation`; PageRevealEvent does NOT (only `.viewTransition`), so the incoming side reads
  // `navigation.activation` (and the same-URL test simply no-ops where the Navigation API is absent).
  function sameUrlNav(act) {
    return !!(act && act.from && act.entry && act.from.url === act.entry.url);
  }
  function skipFlashyTransition(vt, act) {
    if (!vt) return;
    var schemeOverridesOS =
      document.documentElement.getAttribute('data-mantine-color-scheme') !== (mql.matches ? 'dark' : 'light');
    if (sameUrlNav(act) || schemeOverridesOS) vt.skipTransition();
  }
  addEventListener('pageswap', function (e) { skipFlashyTransition(e.viewTransition, e.activation); });
  addEventListener('pagereveal', function (e) {
    var nav = typeof navigation !== 'undefined' ? navigation : null;
    skipFlashyTransition(e.viewTransition, nav && nav.activation);
  });

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
    document.querySelectorAll('.aardvark-theme-toggle').forEach(function (btn) {
      // The label names the scheme this click switches TO (the opposite of the current one). The
      // template supplies both, already localized, as data-label-light / data-label-dark (run
      // through t()); fall back to English so a custom theme that omits them still gets a label.
      var label =
        resolved === 'dark'
          ? btn.getAttribute('data-label-light') || 'Switch to light mode'
          : btn.getAttribute('data-label-dark') || 'Switch to dark mode';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  // Small global API so islands that render their OWN color-scheme control (e.g. the AI
  // assistant's in-panel theme button, which hydrates after this render-blocking <head>
  // script has already bound the static .aardvark-theme-toggle buttons) can flip the scheme
  // through the SAME path — reusing the persisted pref + View-Transitions cross-fade instead
  // of duplicating it. Callers read the current scheme off the <html> attribute directly.
  window.aardvarkColorScheme = {
    toggle: function () {
      var resolved = document.documentElement.getAttribute('data-mantine-color-scheme');
      setPref(resolved === 'dark' ? 'light' : 'dark');
    },
  };

  function init() {
    document.querySelectorAll('.aardvark-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.aardvarkColorScheme.toggle();
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
