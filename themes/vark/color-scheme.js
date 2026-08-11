// Light/dark color scheme: persisted in localStorage and applied as the
// `data-mantine-color-scheme` attribute on <html>. Mantine v7 styles (and this
// theme's CSS) restyle purely from that attribute, so flipping it updates both
// the chrome and the mounted islands. Loaded synchronously in <head> so the
// attribute is set before first paint (no flash).
(function () {
  var KEY = 'aardvark-color-scheme';
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  // In-session shadow of the stored pref: localStorage may refuse the write (private
  // browsing, quota) and would then keep reporting the STALE value, so a choice that
  // failed to persist would be reverted by the next OS flip or provider sync.
  var memPref = null;

  // localStorage is a best-effort side channel for that pref, and the three accesses below absorb
  // the browser REFUSING it — nothing else. Touching `window.localStorage` at all throws
  // SecurityError on an opaque origin or when the reader blocks site data (private browsing,
  // "block cookies"); a write throws QuotaExceededError when the origin is out of quota (Safari's
  // private mode reports a 0-byte one), and Firefox surfaces a blocked or corrupt store as
  // NS_ERROR_DOM_QUOTA_REACHED / NS_ERROR_FILE_CORRUPTED. Matched by NAME rather than
  // `instanceof DOMException`, which would both over-match (InvalidStateError is a defect, not a
  // refusal) and under-match a refusal thrown from another realm. Anything else IS a defect — a
  // mistyped key, a renamed API — and is reported instead of hiding as a preference that quietly
  // stops persisting. Reported, never rethrown: this script is render-blocking in <head>, and an
  // escaping throw abandons the rest of it, so `window.aardvarkColorScheme`, the toggle wiring and
  // the view-transition guards would never install — a dead theme toggle and a scheme flash on
  // every navigation. The islands runtime's fallback persist path (client.js, used only when this
  // script is absent) needs the same rule, and cannot share this one: it is concatenated verbatim
  // into the generated bundle entry while this is a separately served theme asset, so neither file
  // can import the other. If a copy grows there, change both together.
  var STORAGE_DENIED_NAMES = [
    'SecurityError',
    'QuotaExceededError',
    'NS_ERROR_DOM_QUOTA_REACHED',
    'NS_ERROR_FILE_CORRUPTED',
  ];
  // Reported once per (message, error name) pair: pref() re-probes storage on every call until
  // the reader picks a scheme, so a persistently broken store would otherwise log the same
  // defect on every island mount and every scheme change. Keyed on the name too — not the
  // message alone — so a second, DIFFERENT defect at an already-reported site still surfaces
  // instead of being consumed by the first one's latch.
  var reported = {};
  function reportUnlessDenied(what, e) {
    if (e && STORAGE_DENIED_NAMES.indexOf(e.name) !== -1) return;
    var key = what + '|' + (e && e.name);
    if (reported[key]) return;
    reported[key] = true;
    if (window.console && console.error) console.error('Aardvark: ' + what, e);
  }
  // The store, or null when it is absent or unreadable — reading the property is itself an access
  // that can throw, and an Android WebView built without DOM storage leaves it null outright.
  function storage() {
    try {
      return window.localStorage || null;
    } catch (e) {
      reportUnlessDenied('could not reach localStorage', e);
      return null;
    }
  }

  function pref() {
    var v = memPref;
    var store = v ? null : storage();
    if (store) {
      try {
        v = store.getItem(KEY);
      } catch (e) {
        // Refused read: fall through to 'auto', which is what a first-time reader gets anyway.
        reportUnlessDenied('could not read the saved color scheme', e);
        v = null;
      }
    }
    // Sanitized on read, not just on write: anything on the page can scribble on localStorage.
    return v === 'light' || v === 'dark' ? v : 'auto';
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
  } catch (e) {
    // No expected failure here, so anything caught is a defect; the keycap just keeps its Ctrl
    // default, which is not worth abandoning the rest of this render-blocking script over.
    if (window.console && console.error) console.error('Aardvark: could not detect the platform', e);
  }

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
  // Applies the CURRENT pref at callback time, never one captured at scheduling time: callers
  // persist first, so a stacked transition settles on the newest choice, not a superseded one.
  function applyAnimated(afterApply) {
    if (!document.startViewTransition || reduceMotion.matches) {
      apply(pref());
      if (afterApply) afterApply();
      return;
    }
    try {
      var vt = document.startViewTransition(function () {
        apply(pref());
        if (afterApply) afterApply();
      });
      // Skipped/interrupted transitions (rapid toggles, a nav mid-fade) reject these: normal
      // shedding, not an error to surface.
      vt.ready.catch(function () {});
      vt.finished.catch(function () {});
    } catch (e) {
      // Synchronous startViewTransition failure: settle instantly instead.
      apply(pref());
      if (afterApply) afterApply();
    }
  }

  // The one persist path: memPref keeps pref() truthful even when the storage write fails.
  function persist(p) {
    memPref = p;
    var store = storage();
    if (!store) return;
    try {
      store.setItem(KEY, p);
    } catch (e) {
      // Refused write: memPref above already keeps pref() truthful, so only durability across a
      // reload is lost — in a browser the reader configured to forget site data.
      reportUnlessDenied('could not save the color scheme', e);
    }
  }

  function setPref(p) {
    persist(p);
    applyAnimated(updateButtons);
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
  // set/clear route Mantine's own setColorScheme/clearColorScheme (a custom snippet may call
  // them) through this one write path; without them such a call flips the attribute but never
  // persists, and the next navigation reverts the reader's choice.
  //
  // Their shared tail: Mantine writes the resolved attribute before calling the manager, so
  // when the visible scheme is already right, just refresh the labels — no no-op animation.
  function settle(p) {
    if (document.documentElement.getAttribute('data-mantine-color-scheme') === resolve(p)) {
      updateButtons();
      return;
    }
    applyAnimated(updateButtons);
  }

  window.aardvarkColorScheme = {
    get: function () {
      return pref();
    },
    resolve: function (p) {
      return resolve(p);
    },
    toggle: function () {
      var resolved = document.documentElement.getAttribute('data-mantine-color-scheme');
      setPref(resolved === 'dark' ? 'light' : 'dark');
    },
    set: function (p) {
      if (p !== 'light' && p !== 'dark' && p !== 'auto') return;
      // No same-pref early return: settle also repairs a lagging or overwritten attribute.
      persist(p);
      settle(p);
    },
    clear: function () {
      memPref = 'auto';
      var store = storage();
      try {
        if (store) store.removeItem(KEY);
      } catch (e) {
        // Refused remove: memPref shadows the stale stored value for the rest of the session.
        reportUnlessDenied('could not clear the saved color scheme', e);
      }
      settle('auto');
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
      if (pref() === 'auto') applyAnimated(updateButtons);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
