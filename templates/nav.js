// Collapsible left-nav tree (.aardvark-sidebar .aardvark-nav). The current page's ancestor
// branches are rendered open server-side, so with no JS the active section is
// already expanded and usable; this only enhances. Clicking a branch's caret
// toggles its subtree (to "peek in") without navigating — the branch label is a
// normal link and is never intercepted. Open/closed state persists across pages.
(function () {
  var KEY = 'aardvark-nav-open';

  function readState() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeState(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function remember(branch, open) {
    var link = branch.querySelector(':scope > .aardvark-nav-branch-row > .aardvark-nav-branch-link');
    var key = link && link.getAttribute('href');
    if (!key) return;
    var state = readState();
    state[key] = open;
    writeState(state);
  }

  function setOpen(branch, open) {
    branch.classList.toggle('aardvark-open', open);
    var btn = branch.querySelector(':scope > .aardvark-nav-branch-row > .aardvark-nav-toggle');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function init() {
    var nav = document.querySelector('.aardvark-sidebar .aardvark-nav');
    if (!nav) return;

    // Re-apply remembered state, but never collapse the active trail (that would hide the
    // current page). This runs with nav transitions suppressed (the CSS gates them behind
    // .aardvark-nav-ready), so a remembered-open branch is restored instantly instead of
    // re-running its unfurl animation on every page load.
    var state = readState();
    nav.querySelectorAll('.aardvark-nav-branch').forEach(function (branch) {
      var link = branch.querySelector(':scope > .aardvark-nav-branch-row > .aardvark-nav-branch-link');
      var key = link && link.getAttribute('href');
      if (key && Object.prototype.hasOwnProperty.call(state, key)
          && !branch.classList.contains('aardvark-active-trail')) {
        setOpen(branch, !!state[key]);
      }
    });
    // Commit the restored state with a forced reflow, THEN arm transitions — so the restore
    // above never animates, but later user toggles do.
    void nav.offsetHeight;
    nav.classList.add('aardvark-nav-ready');

    // Caret toggles the branch; the label link is left alone so it navigates.
    nav.querySelectorAll('.aardvark-nav-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var branch = btn.closest('.aardvark-nav-branch');
        var open = !branch.classList.contains('aardvark-open');
        setOpen(branch, open);
        remember(branch, open);
      });
      // Tree-style keys: Right opens, Left closes (Enter/Space already toggle).
      btn.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var branch = btn.closest('.aardvark-nav-branch');
        var open = e.key === 'ArrowRight';
        setOpen(branch, open);
        remember(branch, open);
      });
    });

    // Keep the active item visible inside the (independently scrollable) sidebar,
    // nudging only the panel — never the page. No-op if it can't scroll yet.
    var active = nav.querySelector('.aardvark-nav-item.aardvark-active a, .aardvark-nav-branch-link.aardvark-active');
    var panel = document.querySelector('.aardvark-sidebar');
    if (active && panel && panel.scrollHeight > panel.clientHeight) {
      var a = active.getBoundingClientRect();
      var p = panel.getBoundingClientRect();
      if (a.top < p.top) panel.scrollTop -= (p.top - a.top + 8);
      else if (a.bottom > p.bottom) panel.scrollTop += (a.bottom - p.bottom + 8);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
