// Wikipedia-style preview cards for in-content internal links. On hover over — or
// keyboard focus of — a link to another page in this site, a small floating card
// shows that page's title, a short description, and its nav breadcrumb. The data
// comes from the build-time manifest at /_aardvark/page-cards.json (see
// generate/pagecards.py). Progressive enhancement: with no JS the links just work.
(function () {
  // Skip touch / no-hover devices; on hover-capable devices the card responds to
  // both pointer hover and keyboard focus (see the focusin/focusout listeners).
  if (!(window.matchMedia && window.matchMedia('(hover: hover)').matches)) return;

  var SHOW_MS = 350; // hover dwell before the card appears (intent, not a twitch)
  var HIDE_MS = 200; // grace period so the pointer can travel link -> card
  var GAP = 8;       // space between the link and the card
  var EDGE = 8;      // viewport margin when clamping/flipping

  var card, titleEl, descEl, crumbEl;
  var dataPromise = null;     // memoized fetch of the manifest
  var wantLink = null;        // link the pointer/focus is currently intent on
  var shownLink = null;       // link the visible card belongs to
  var showTimer = null, hideTimer = null;

  // Trailing-slash-insensitive path key, also used for the manifest urls so a link
  // to `/foo` matches the page `/foo/`. Strips query/hash; root stays "/".
  function normalize(path) {
    try { path = decodeURI(path); } catch (e) { /* leave as-is */ }
    path = path.replace(/[?#].*$/, '').replace(/\/+$/, '');
    return path || '/';
  }

  // The manifest key for a link, or null if it shouldn't get a card: off-site,
  // non-http(s) (mailto:, etc.), or a link to the page we're already on.
  function linkKey(link) {
    var url;
    try { url = new URL(link.href); } catch (e) { return null; }
    if (url.origin !== location.origin) return null;
    var key = normalize(url.pathname);
    if (key === normalize(location.pathname)) return null;
    return key;
  }

  function load() {
    if (!dataPromise) {
      dataPromise = fetch('/_aardvark/page-cards.json')
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (records) {
          var map = new Map();
          (records || []).forEach(function (rec) { map.set(normalize(rec.url), rec); });
          return map;
        })
        .catch(function () { return new Map(); });
    }
    return dataPromise;
  }

  function render(rec) {
    titleEl.textContent = rec.title || '';
    var desc = (rec.description || '').trim();
    descEl.textContent = desc;
    descEl.hidden = !desc;
    // Drop the last crumb — it's this page's own title, already shown above.
    var trail = (rec.breadcrumb || []).slice(0, -1).join(' › ');
    crumbEl.textContent = trail;
    crumbEl.hidden = !trail;
  }

  // Place the card below the link, flipping above when it would overflow the
  // bottom, and clamp horizontally. Coordinates are viewport-relative (position:
  // fixed), so getBoundingClientRect values are used directly.
  function position(link) {
    var r = link.getBoundingClientRect();
    var cw = card.offsetWidth, ch = card.offsetHeight;
    var top = r.bottom + GAP;
    if (top + ch > window.innerHeight - EDGE && r.top - GAP - ch > EDGE) {
      top = r.top - GAP - ch;
    }
    var left = r.left;
    if (left + cw > window.innerWidth - EDGE) left = window.innerWidth - EDGE - cw;
    if (left < EDGE) left = EDGE;
    card.style.top = Math.round(top) + 'px';
    card.style.left = Math.round(left) + 'px';
  }

  function showFor(link, key) {
    load().then(function (map) {
      if (link !== wantLink) return;        // pointer moved on before we were ready
      var rec = map.get(key);
      if (!rec) return;                     // link target isn't a known page
      render(rec);
      position(link);                       // measure + place before revealing
      card.classList.add('aardvark-hovercard-visible');
      // Associate the tooltip with its trigger for screen readers. Clear the
      // previous link first when moving card->card without an intervening hide().
      if (shownLink && shownLink !== link) shownLink.removeAttribute('aria-describedby');
      shownLink = link;
      link.setAttribute('aria-describedby', card.id);
    });
  }

  function hide() {
    // Also cancel a pending show: a scroll/resize during the hover-dwell window
    // must not let showFor() fire afterward and anchor the card to the link's
    // now-scrolled (possibly off-screen) position.
    clearTimeout(showTimer);
    showTimer = null;
    wantLink = null;
    clearTimeout(hideTimer);
    hideTimer = null;
    card.classList.remove('aardvark-hovercard-visible');
    if (shownLink) shownLink.removeAttribute('aria-describedby');
    shownLink = null;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_MS);
  }

  function cancelHide() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  // `:not(.aardvark-card-link)` skips a {% card %}'s whole-card link: its ::after overlay
  // covers the entire card, so without this every hover anywhere on a link card would pop a
  // preview on top of the card itself.
  function onOver(e) {
    var link = e.target && e.target.closest && e.target.closest('.aardvark-content a[href]:not(.aardvark-card-link)');
    if (!link) return;
    var key = linkKey(link);
    if (!key) return;
    cancelHide();
    if (link === shownLink) return;         // already showing this one
    wantLink = link;
    clearTimeout(showTimer);
    showTimer = setTimeout(function () { showFor(link, key); }, SHOW_MS);
  }

  function onOut(e) {
    var src = e.target;
    if (!src || !src.closest) return;
    var link = src.closest('.aardvark-content a[href]:not(.aardvark-card-link)');
    // A move whose destination is still inside the SAME {% card %} — a body link -> the card's
    // excluded stretched-link overlay anchor, or overlay -> title/body text — isn't a real "leave":
    // the excluded overlay's onOver never re-cancels a hide, so we must not START one for an in-card
    // move. (hostCard is named so it doesn't shadow the module-level `card`, the hovercard element.)
    var hostCard = src.closest('[data-aardvark-card]');
    var stayingInCard = hostCard && e.relatedTarget && hostCard.contains(e.relatedTarget);
    if (link) {
      if (e.relatedTarget && link.contains(e.relatedTarget)) return; // moved within the link itself
      // Cancel a PENDING show whenever the pointer leaves the link — even when staying in the card.
      // This must NOT be gated by stayingInCard: sliding from a body link onto nearby card text (or
      // the overlay) still ends the dwell, and a leftover timer would pop a phantom preview ~350ms
      // later over content the reader never hovered as a link.
      if (link === wantLink) { clearTimeout(showTimer); wantLink = null; }
      // A SHOWN card is dismissed only on a real leave — keep it up while the pointer is still on
      // the same card (the excluded overlay's onOver couldn't re-show it once hidden).
      if (link === shownLink && !stayingInCard) scheduleHide();
      return;
    }
    // No previewable link under the pointer (the excluded whole-card overlay anchor, or plain card
    // chrome). An in-card move isn't a leave. On a real leave, dismiss a shown preview only when it
    // belongs to THIS card OR is orphaned — its link isn't in any card (e.g. a prose-link preview
    // kept alive by crossing into this card, the case that left it stuck before). A preview owned by
    // a DIFFERENT card is left alone: exiting an unrelated card must not dismiss it. (Gating on
    // hostCard also avoids firing on hovercard-internal moves, where hostCard is null.)
    if (stayingInCard) return;
    if (hostCard && shownLink && (hostCard.contains(shownLink) || !shownLink.closest('[data-aardvark-card]'))) {
      scheduleHide();
    }
  }

  // Scroll/resize handler. A focus-driven card (its link is the focused element) is
  // kept pinned to that link — focusing a link often scrolls it into view — and a
  // pending focus show is left alone so it positions correctly once that scroll
  // settles. A hover card (or a hover-pending show, where the link isn't focused)
  // is instead dismissed/cancelled, so it can't drift or pop at a stale, possibly
  // off-screen position.
  function onViewportChange() {
    var active = document.activeElement;
    if (shownLink && shownLink === active) { position(shownLink); return; }
    if (wantLink && wantLink === active) return;
    hide();
  }

  card = document.createElement('div');
  card.className = 'aardvark-hovercard';
  card.id = 'aardvark-hovercard';
  card.setAttribute('role', 'tooltip');
  titleEl = document.createElement('div');
  titleEl.className = 'aardvark-hovercard-title';
  descEl = document.createElement('div');
  descEl.className = 'aardvark-hovercard-desc';
  crumbEl = document.createElement('div');
  crumbEl.className = 'aardvark-hovercard-crumb';
  card.appendChild(titleEl);
  card.appendChild(descEl);
  card.appendChild(crumbEl);
  document.body.appendChild(card);

  // Keep the card open while the pointer is inside it (so links in it are usable,
  // and it doesn't vanish as you reach for it).
  card.addEventListener('mouseenter', cancelHide);
  card.addEventListener('mouseleave', scheduleHide);

  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);
  // Keyboard parity: tabbing to a link shows the card and blurring hides it,
  // reusing the same show/hide path (focusin/focusout bubble, so delegation works).
  // The SHOW_MS dwell doubles as debounce so tabbing straight through links — each
  // focusout cancels the pending show — doesn't flash a card at every stop.
  document.addEventListener('focusin', onOver);
  document.addEventListener('focusout', onOut);
  window.addEventListener('scroll', onViewportChange, { passive: true });
  window.addEventListener('resize', onViewportChange);
})();
