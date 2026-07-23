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
    // Keep a collapsed branch's sub-links out of the tab order + a11y tree. The collapse is a CSS
    // grid-clip (0fr) + overflow:hidden — NOT display:none — so the zero-height links would otherwise
    // stay focusable (Tab lands on invisible links). `inert` handles that on modern engines (and the
    // drawer focus-trap keys off the attribute); the theme.scss `visibility:hidden` on a collapsed
    // subtree is the cross-browser backstop for engines without inert. inert doesn't affect the animation.
    var sub = branch.querySelector(':scope > .aardvark-nav-subtree-wrap');
    if (sub) { if (open) sub.removeAttribute('inert'); else sub.setAttribute('inert', ''); }
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
    // Set the initial `inert` state on every branch's subtree (the restore loop above only touched
    // remembered branches; server-rendered-open active-trail branches stay focusable, default-
    // collapsed ones become inert) so collapsed sub-links aren't tabbable on load.
    nav.querySelectorAll('.aardvark-nav-branch').forEach(function (branch) {
      var sub = branch.querySelector(':scope > .aardvark-nav-subtree-wrap');
      if (sub && !branch.classList.contains('aardvark-open')) sub.setAttribute('inert', '');
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

    // Taxonomy tag links (`#tag=<slug>` fragments): highlight the entry matching the
    // current hash. Fragment links never get the server-side aardvark-active (they're
    // filter state, not a page), so this mirrors the hash — set by clicking the link
    // itself (hashchange), by a listing island's category/badge toggles (they dispatch
    // a synthetic hashchange after pushState/replaceState, which fires no event of its
    // own), and by back/forward (popstate). `#tag=a,b` multi-selects mark every listed
    // slug's entry.
    var tagLinks = nav.querySelectorAll('a[href*="#tag="]');
    if (tagLinks.length) {
      // location.hash keeps percent-encoding while the href attribute carries the raw
      // slug — decode BOTH sides so a non-ASCII tag slug ("café") still matches. Trim first,
      // mirroring _tagCloud.jsx's tagsFromHash (`part.trim()` before decode), so a hand-mangled
      // `#tag=a, b` highlights the same entry the island filters. Fail closed on bad %-encoding.
      var decodeSlug = function (s) {
        var t = String(s).trim();
        try { return decodeURIComponent(t); } catch (e) { return t; }
      };
      // Compare pathnames ignoring a trailing slash — a `/foo` tag-link href must still match the
      // page served at `/foo/` (mirrors hovercard.js's normalize() for the same known mismatch), or
      // the sidebar highlight/aria-current would silently never apply for that page.
      var samePath = function (a, b) {
        var strip = function (p) { return (p || '').replace(/\/+$/, '') || '/'; };
        return strip(a) === strip(b);
      };
      var applyTagHighlight = function (selected) {
        tagLinks.forEach(function (a) {
          var href = a.getAttribute('href') || '';
          var slug = decodeSlug(href.slice(href.indexOf('#tag=') + 5));
          // The hash filter belongs to THIS page: a page carrying two taxonomy
          // groups (or a group pointing at another listing) must not light a
          // same-slug tag from the other listing. `a.pathname` resolves a bare
          // `#tag=` href to the current page, so listing-page links still match.
          var samePage = samePath(a.pathname, window.location.pathname);
          var on = samePage && selected.indexOf(slug) !== -1;
          var li = a.closest('li');
          if (li) li.classList.toggle('aardvark-active', on);
          // aria-current names THE current item — at most one per set — so it only
          // applies to a single-tag selection. A multi-select (#tag=a,b, reachable
          // through the islands' badges) keeps the visual highlight on every
          // selected entry but drops the attribute rather than claiming several
          // "current" locations.
          if (on && selected.length === 1) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      };
      var syncTagHighlight = function () {
        var hash = window.location.hash || '';
        // Match the listing islands (_tagCloud.jsx / KnowledgeBase.jsx): an unrelated in-page
        // anchor (a TOC/#heading link) is NOT filter state — the islands keep the filter active
        // across it, so the sidebar highlight must stay too, or it would lie while the list
        // stays filtered. Only a `#tag=…` hash, or NO hash, is authoritative.
        if (hash && hash.indexOf('#tag=') !== 0) return;
        var m = /^#tag=(.+)$/.exec(hash);
        applyTagHighlight(m ? m[1].split(',').map(decodeSlug) : []);
      };
      // Explicit listing-island interactions carry authoritative filter state. This is
      // distinct from hashchange because Clear preserves an unrelated heading hash: the
      // hash-derived synchronizer must ignore that hash, while this event must remove the
      // now-stale tag highlight.
      var syncExplicitTagHighlight = function (event) {
        var slugs = event && event.detail && event.detail.slugs;
        if (!Array.isArray(slugs)) return;
        applyTagHighlight(slugs.map(decodeSlug));
      };
      window.addEventListener('hashchange', syncTagHighlight);
      window.addEventListener('popstate', syncTagHighlight);
      window.addEventListener('aardvark-taxonomy-filter-change', syncExplicitTagHighlight);
      syncTagHighlight();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
