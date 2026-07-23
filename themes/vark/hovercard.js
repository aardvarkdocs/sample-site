// Wikipedia-style preview cards for in-content internal links. On hover over — or
// keyboard focus of — a link to another page in this site, a floating card splits
// vertically: the target page's OG "unfurl" image on the left, and its breadcrumb,
// title, and a fading excerpt of its content on the right. The data comes from the
// build-time manifest at /_aardvark/page-cards.json (see generate/pagecards.py).
// Suppressed on mobile / narrow viewports (MIN_WIDTH). Progressive enhancement:
// with no JS the links just work.
(function () {
  // Skip touch / no-hover devices; on hover-capable devices the card responds to
  // both pointer hover and keyboard focus (see the focusin/focusout listeners).
  if (!(window.matchMedia && window.matchMedia('(hover: hover)').matches)) return;

  var SHOW_MS = 350; // hover dwell before the card appears (intent, not a twitch)
  var HIDE_MS = 200; // grace period so the pointer can travel link -> card
  var GAP = 8;       // space between the link and the card (keyboard-focus shows)
  var POINTER_GAP = 14; // vertical clearance between the cursor and a pointer-driven card
  var EDGE = 8;      // viewport margin when clamping/flipping
  var MIN_WIDTH = 720; // suppress the preview on mobile / narrow viewports: the large
                       // split image+text card wants room (it's ~680px wide), and
                       // hover intent is a poor fit for touch. Checked live so
                       // resizing a desktop window narrow disables it too.
  var IMG_TIMEOUT_MS = 2000; // if the OG image neither loads nor errors (a TCP-level
                             // stall), reveal the card text-only after this grace
                             // period rather than leave the reader hovering nothing.

  var card, mediaEl, imgEl, bodyEl, titleEl, previewEl, crumbEl;
  var dataPromise = null;     // memoized fetch of the manifest
  var wantLink = null;        // link the pointer/focus is currently intent on
  var shownLink = null;       // link the visible card belongs to
  var showTimer = null, hideTimer = null;
  // Last known pointer position (viewport coords), tracked live so a card revealed
  // after the dwell + image load is placed where the mouse IS, not where it entered.
  var pointerX = 0, pointerY = 0;
  // Whether the current want/show came from the mouse (vs keyboard focus). Pointer
  // shows position against the CURSOR: on a stretched-link card (a blog ArticleCard,
  // whose anchor ::after overlay spans the whole card) the anchor's rect is only the
  // TITLE text, so a rect-anchored card would land across the card body — right where
  // the reader is about to click. Focus shows have no cursor and keep the link rect.
  var pointerShow = false;
  var imgToken = 0;           // bumped per show; stale image loads are ignored (see render)
  var imgTimeoutId = null;    // pending image stall-timeout, cancelled on re-render / hide

  // Trailing-slash-insensitive path key, also used for the manifest urls so a link
  // to `/foo` matches the page `/foo/`. Strips query/hash; root stays "/".
  function normalize(path) {
    try { path = decodeURI(path); } catch (e) { /* leave as-is */ }
    path = path.replace(/[?#].*$/, '').replace(/\/+$/, '');
    return path || '/';
  }

  // Live narrow-viewport check (requirement: off on mobile / narrow windows).
  function tooNarrow() {
    return (window.innerWidth || document.documentElement.clientWidth || 0) < MIN_WIDTH;
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
      dataPromise = fetch((window.__aardvarkBase || '') + '/_aardvark/page-cards.json')
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

  function render(rec, link) {
    // Cancel a prior hover's stall-timeout so its closure (and the link DOM node it
    // captures) is released now instead of lingering for the full grace period.
    clearTimeout(imgTimeoutId);
    imgTimeoutId = null;
    imgEl.onload = imgEl.onerror = null; // drop any no-decode-fallback handlers from a prior render
    // Bump the load epoch up front so an in-flight settle() from a PRIOR hover is
    // invalidated on every path — including the no-image early return below, where
    // an unbumped epoch would let the old decode add has-media to this card.
    var token = ++imgToken;
    // If the card is already visible for a DIFFERENT link (a card->card swap), hide
    // it now: position() is deferred to reveal() (after the image settles), so
    // otherwise it would linger at the old link's spot showing the new content during
    // the load window. It reappears, correctly placed, once the image settles.
    if (shownLink && shownLink !== link) {
      card.classList.remove('aardvark-hovercard-visible');
      shownLink.removeAttribute('aria-describedby');
    }
    // Right column. Breadcrumb is an eyebrow above the title — drop the last crumb,
    // it's this page's own title (shown as the title below).
    var trail = (rec.breadcrumb || []).slice(0, -1).join(' › ');
    crumbEl.textContent = trail;
    crumbEl.hidden = !trail;
    titleEl.textContent = rec.title || '';
    // A generous content "taste" that fades out (the fade is applied in reveal() once
    // we can measure whether it actually overflows). Falls back to the description.
    var text = (rec.preview || rec.description || '').trim();
    previewEl.textContent = text;
    previewEl.hidden = !text;
    previewEl.classList.remove('aardvark-hovercard-faded');
    // Associate the tooltip with the link NOW — before the image starts loading — so a
    // screen reader announces the description without waiting for image decode (reveal()
    // only does the visual show, which is deferred until the image settles). The card's
    // text is set above; aria-describedby pulls it even while the card is
    // visibility:hidden, and hide() tears the association down if the pointer leaves first.
    shownLink = link;
    link.setAttribute('aria-describedby', card.id);
    // Left column: the target page's OG "unfurl" image. Settle the image FIRST and
    // only reveal once we know whether it loads — so the card appears in its final
    // geometry and never reflows after it's on screen. (The dev server renders no OG
    // cards, and a default image can 404; an empty column would otherwise pop in and
    // then collapse a moment later.) The token captured above guards against a newer
    // hover that replaces the image mid-load: a stale settle is ignored. decode()
    // reflects the true load state even when the src is unchanged (e.g. the same
    // default image on two pages), so a repeat of an already-failed URL still resolves.
    card.classList.remove('aardvark-hovercard-has-media');
    var src = rec.image || '';
    if (!src) { imgEl.removeAttribute('src'); reveal(link); return; }
    var settled = false;
    var settle = function (ok) {
      if (settled || token !== imgToken) return;  // first outcome wins; ignore stale shows
      settled = true;
      if (ok) card.classList.add('aardvark-hovercard-has-media');
      reveal(link);
    };
    // In the no-decode fallback (older browsers with fetch but no img.decode), assign
    // the handlers BEFORE src: a cached image can dispatch load/error as soon as src
    // is set, and a handler attached afterward would miss it, leaving the card hidden.
    if (imgEl.decode) {
      imgEl.src = src;
      imgEl.decode().then(function () { settle(true); }, function () { settle(false); });
    } else {
      imgEl.onload = function () { settle(true); };
      imgEl.onerror = function () { settle(false); };
      imgEl.src = src;
      // A cached or unchanged src may not re-fire onload (assigning the same URL is a
      // no-op), so settle synchronously when the image is already loaded. The `settled`
      // latch dedupes against a later onload. (decode(), the common path, handles this.)
      if (imgEl.complete) settle(imgEl.naturalWidth > 0);
    }
    // Fallback for a TCP-level stall (hung connection, no response): decode()/load
    // would stay pending forever and the card would never appear. Reveal text-only
    // after a grace period. The `settled` latch means a late image load afterward is
    // ignored, so it can't pop the column in and reflow an already-shown card. Skip it
    // entirely when settle already ran synchronously above (a cached image on the
    // no-decode path) — reveal() ran before this line, so it couldn't clear the timer.
    if (!settled) imgTimeoutId = setTimeout(function () { settle(false); }, IMG_TIMEOUT_MS);
  }

  // Reveal the card once its geometry is final. `link` is re-checked because the
  // pointer/focus may have moved on (or the card been hidden) while the image loaded.
  function reveal(link) {
    // The image has settled (or we're abandoning this link), so the stall fallback is
    // moot. On the decode/load path the timer is still pending — clearTimeout cancels it,
    // releasing its closure over `link` before expiry; when reveal() was reached BY the
    // stall timer firing, clearTimeout is a harmless no-op and the `= null` below drops
    // the handle. (This timer belongs to the current render: a superseding render would
    // have token-invalidated settle, so reveal() wouldn't run; no-image path: already null.)
    clearTimeout(imgTimeoutId);
    imgTimeoutId = null;
    // Abort if the pointer/focus moved on, OR the link scrolled fully out of view while
    // the image loaded — position() doesn't floor-clamp `top`, so revealing against an
    // above-viewport link (r.bottom <= 0) would place an invisible but still clickable
    // card at a negative top. (Reachable now that a loading hover card is kept through a
    // scroll; a re-hover re-triggers it, or it stays put if the link scrolls back in.)
    var rect = link === wantLink ? link.getBoundingClientRect() : null;
    if (!rect || rect.bottom <= 0 || rect.top >= window.innerHeight) {
      // Drop the eager association (aria-describedby + shownLink) render() set before the
      // card was ever shown — otherwise the card sits hidden but still "owned" by this
      // link (settled latch spent), and a re-hover hits onOver's `link === shownLink`
      // guard and never re-renders. `shownLink === link` is always true here by the token
      // invariant (a newer render() bumps imgToken, so its settle() returns before
      // reveal()); the guard is defensive against that invariant ever being broken.
      if (shownLink === link) { link.removeAttribute('aria-describedby'); shownLink = null; }
      return;
    }
    position(link);                         // measure + place before revealing
    // Fade the body text only when it really overflows its clamp — short blurbs read
    // in full, crisp, with no gradient. Measured now that it's laid out (the card is
    // visibility:hidden, not display:none, so it has dimensions).
    previewEl.classList.toggle(
      'aardvark-hovercard-faded',
      !previewEl.hidden && previewEl.scrollHeight > previewEl.clientHeight + 1
    );
    card.classList.add('aardvark-hovercard-visible');
  }

  // Place the card, then clamp horizontally. Coordinates are viewport-relative
  // (position: fixed). A POINTER-driven show is placed relative to the CURSOR —
  // below it with a clear gap, flipping above when the bottom would overflow — so
  // the point the reader is about to click stays uncovered; the anchor's text rect
  // is a poor proxy for the mouse on wrapped prose links and stretched-link cards.
  // A keyboard-focus show has no cursor and anchors to the link rect as before.
  function position(link) {
    var cw = card.offsetWidth, ch = card.offsetHeight;
    var top, left;
    if (pointerShow) {
      top = pointerY + POINTER_GAP;
      if (top + ch > window.innerHeight - EDGE && pointerY - POINTER_GAP - ch > EDGE) {
        top = pointerY - POINTER_GAP - ch;
      }
      // Slightly left of the cursor: the card reads as a caption for the point under
      // the pointer, and the pointer itself never starts inside the card.
      left = pointerX - 24;
    } else {
      var r = link.getBoundingClientRect();
      top = r.bottom + GAP;
      if (top + ch > window.innerHeight - EDGE && r.top - GAP - ch > EDGE) {
        top = r.top - GAP - ch;
      }
      left = r.left;
    }
    if (left + cw > window.innerWidth - EDGE) left = window.innerWidth - EDGE - cw;
    if (left < EDGE) left = EDGE;
    // Vertical viewport clamp: on a short viewport a below-cursor card that also
    // can't fit above would otherwise hang off the bottom edge, clipping its content.
    // Pull it up to sit within [EDGE, innerHeight-EDGE] (top-edge clamp wins when the
    // card is taller than the viewport, keeping the head reachable).
    if (top + ch > window.innerHeight - EDGE) top = window.innerHeight - EDGE - ch;
    if (top < EDGE) top = EDGE;
    card.style.top = Math.round(top) + 'px';
    card.style.left = Math.round(left) + 'px';
    // On a short viewport the vertical clamp above can pull a pointer-anchored card up over
    // the cursor, where it would swallow the click meant for the hovered link. Make JUST
    // that forced-overlap state click-through so the link stays reachable. Only in pointer
    // mode: the link-anchored card must keep its pointer events so hovering into it (to read
    // it) still cancels the hide.
    var overlapsPointer =
      pointerShow &&
      pointerX >= left && pointerX <= left + cw &&
      pointerY >= top && pointerY <= top + ch;
    card.style.pointerEvents = overlapsPointer ? 'none' : '';
  }

  function showFor(link, key) {
    if (tooNarrow()) return;                // window shrank during the hover dwell
    load().then(function (map) {
      if (link !== wantLink) return;        // pointer moved on before we were ready
      if (tooNarrow()) return;              // ...or while the manifest was fetching
      var rec = map.get(key);
      if (!rec) return;                     // link target isn't a known page
      render(rec, link);                    // sets content + loads the image, then reveals
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
    clearTimeout(imgTimeoutId);
    imgTimeoutId = null;
    imgToken++;   // invalidate any in-flight image settle() so it can't touch a hidden card
    card.classList.remove('aardvark-hovercard-visible');
    card.style.pointerEvents = '';   // clear any force-clamp click-through from the last show

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

  // `:not(.aardvark-card-link):not(.aardvark-articlecard-link)` skips a whole-card
  // stretched link — the {% card %} overlay AND the blog ArticleCard
  // ({% taxonomy type="articles" %}) overlay both span the entire card via an ::after,
  // so without this, hovering anywhere on such a card would pop (and fetch) a preview of
  // the page it already links to, on top of the card itself. `:not(.aardvark-changelog-
  // permalink)` skips the changelog timeline's DATE link for the same reason: the entry's
  // full body already renders inline on the listing, so a member-page preview is redundant
  // and would pop right where the reader clicks the date.
  var _CARD_LINK_SEL =
    '.aardvark-content a[href]:not(.aardvark-card-link):not(.aardvark-articlecard-link)' +
    ':not(.aardvark-changelog-permalink)';

  function onOver(e) {
    // Track the pointer on every hover hop (mouseover carries coordinates; focusin
    // doesn't) — the mousemove listener below keeps it current between hops.
    var fromPointer = e.type === 'mouseover';
    if (fromPointer && typeof e.clientX === 'number') { pointerX = e.clientX; pointerY = e.clientY; }
    var link = e.target && e.target.closest && e.target.closest(_CARD_LINK_SEL);
    if (!link) return;
    if (tooNarrow()) return;                 // suppressed on mobile / narrow viewports
    var key = linkKey(link);
    if (!key) return;
    cancelHide();
    // Mark this link wanted BEFORE the already-shown guard. shownLink is set in render()
    // before the card is visible (for the eager aria association), so the card may still
    // be loading its image; a leave→return during that window nulls wantLink, and reveal()
    // would then abort (link !== wantLink) and the card would never appear. Restoring
    // wantLink here lets the in-flight settle()/reveal() complete.
    wantLink = link;
    // How position() anchors this show: at the cursor for a pointer hover, at the link
    // rect for keyboard focus. A focusin fired BY a click on a still-hovered link must
    // NOT downgrade an active pointer show to rect mode (that would drop the card onto
    // the link text a modifier/new-tab click is aiming at) — so treat a focus on a
    // currently-hovered link as pointer mode too.
    var nextPointerShow = fromPointer || !!(link.matches && link.matches(':hover'));
    var modeChanged = nextPointerShow !== pointerShow;
    pointerShow = nextPointerShow;
    if (link === shownLink) {
      // Already showing/loading this link. If the anchor mode just changed — e.g. the
      // mouse moved onto a keyboard-opened card's link — reposition the VISIBLE card so
      // it follows the cursor instead of staying at the stale rect anchor.
      if (modeChanged && card.classList.contains('aardvark-hovercard-visible')) position(link);
      return;
    }
    clearTimeout(showTimer);
    showTimer = setTimeout(function () { showFor(link, key); }, SHOW_MS);
  }

  function onOut(e) {
    var src = e.target;
    if (!src || !src.closest) return;
    var link = src.closest(_CARD_LINK_SEL);
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
      // A SHOWN card is dismissed on a real leave. Generalized beyond `link === shownLink` so that
      // leaving a DIFFERENT link (e.g. the pointer dwelled toward link B, whose 350ms show is still
      // pending, then bailed to chrome) still tears down a card left visible for link A — the bug
      // where A's preview was stranded because B !== shownLink so no hide was ever armed. The
      // ownership test mirrors the no-link branch below: dismiss only when the shown preview is
      // orphaned (a prose link, in no card) OR belongs to THIS host card; a preview owned by a
      // DIFFERENT card is left alone, so exiting one card's body link never dismisses an unrelated
      // card's preview. As before, keep it up while still on the same card (the excluded overlay's
      // onOver couldn't re-show it once hidden) and while crossing into the hovercard (cancelHide
      // there keeps it alive).
      if (shownLink && !stayingInCard && !(e.relatedTarget && card.contains(e.relatedTarget)) &&
          (!shownLink.closest('[data-aardvark-card]') || (hostCard && hostCard.contains(shownLink)))) {
        scheduleHide();
      }
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
    // A resize down to a narrow/mobile width dismisses any open or pending card.
    if (tooNarrow()) { hide(); return; }
    var active = document.activeElement;
    // Only re-pin a card that's actually VISIBLE for the focused link. A focused card
    // still loading its image (shownLink set eagerly, card hidden) falls through to the
    // wantLink branch below and is left alone — reveal() will position it once shown.
    if (shownLink && shownLink === active && card.classList.contains('aardvark-hovercard-visible')) {
      position(shownLink);
      return;
    }
    if (wantLink && wantLink === active) return;
    // A pointer-hover card still loading its image (shownLink set, not yet visible) has
    // no focused element to match the guards above — keep it rather than dismissing, so a
    // scroll/resize mid-load doesn't cancel it; reveal() positions it against the link's
    // current rect when it shows. (A VISIBLE hover card still falls through to hide()
    // below: it's position:fixed and would drift on scroll, so it's dismissed as before.)
    if (shownLink && !card.classList.contains('aardvark-hovercard-visible')) return;
    hide();
  }

  // Split card: a media column (the OG image) on the left and a text body on the
  // right. `aardvark-hovercard-rich` selects the two-column styling so the plain
  // .aardvark-hovercard reused by glossary.js stays a simple stacked card.
  card = document.createElement('div');
  card.className = 'aardvark-hovercard aardvark-hovercard-rich';
  card.id = 'aardvark-hovercard';
  card.setAttribute('role', 'tooltip');

  mediaEl = document.createElement('div');
  mediaEl.className = 'aardvark-hovercard-media';
  imgEl = document.createElement('img');
  imgEl.className = 'aardvark-hovercard-img';
  imgEl.alt = '';                     // decorative: the title beside it carries the meaning
  imgEl.decoding = 'async';
  mediaEl.appendChild(imgEl);

  bodyEl = document.createElement('div');
  bodyEl.className = 'aardvark-hovercard-body';
  crumbEl = document.createElement('div');
  crumbEl.className = 'aardvark-hovercard-crumb';
  titleEl = document.createElement('div');
  titleEl.className = 'aardvark-hovercard-title';
  previewEl = document.createElement('div');
  previewEl.className = 'aardvark-hovercard-preview';
  // The fading body excerpt is a visual "taste"; keep it out of the tooltip's
  // screen-reader announcement (aria-describedby targets the whole card) so AT users
  // hear the breadcrumb + title, not a paragraph-length dump of the faded-out text.
  previewEl.setAttribute('aria-hidden', 'true');
  bodyEl.appendChild(crumbEl);
  bodyEl.appendChild(titleEl);
  bodyEl.appendChild(previewEl);

  card.appendChild(mediaEl);
  card.appendChild(bodyEl);
  document.body.appendChild(card);

  // Keep the card open while the pointer is inside it (so links in it are usable,
  // and it doesn't vanish as you reach for it).
  card.addEventListener('mouseenter', cancelHide);
  card.addEventListener('mouseleave', scheduleHide);

  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);
  // Keep the pointer position current between hover hops (mouseover only fires per
  // element entered), so a card revealed after the dwell + image load lands where
  // the mouse is NOW. Passive + two assignments — negligible.
  document.addEventListener('mousemove', function (e) {
    pointerX = e.clientX; pointerY = e.clientY;
    // A card force-clamped over the cursor is made click-through (pointerEvents='none' in
    // position()), but position() doesn't re-run on plain mousemove — so once the cursor moves OFF
    // the card, restore its interactivity here. Otherwise it stays permanently click/hover-through
    // for that show and the reader can never hover in (mouseenter → cancelHide can't fire). Only
    // CLEARS the flag when the pointer is outside the card's rect; position() still owns SETTING it
    // on the next reveal/scroll/resize.
    if (card.style.pointerEvents === 'none') {
      var r = card.getBoundingClientRect();
      if (pointerX < r.left || pointerX > r.right || pointerY < r.top || pointerY > r.bottom) {
        card.style.pointerEvents = '';
      }
    }
  }, { passive: true });
  // Keyboard parity: tabbing to a link shows the card and blurring hides it,
  // reusing the same show/hide path (focusin/focusout bubble, so delegation works).
  // The SHOW_MS dwell doubles as debounce so tabbing straight through links — each
  // focusout cancels the pending show — doesn't flash a card at every stop.
  document.addEventListener('focusin', onOver);
  document.addEventListener('focusout', onOut);
  // Escape dismisses the card (parity with the glossary card). hide() clears the
  // visibility, the aria association, and any pending/in-flight load. Capture phase so a
  // modal that swallows Escape (stopImmediatePropagation on a capturing listener) can't
  // strand a still-loading card; we don't stop the event, so the modal still gets it.
  document.addEventListener('keydown', function (e) {
    // shownLink || wantLink: also cancel a card that's still in its dwell or its (first-
    // hover) manifest fetch — wantLink is set but shownLink isn't yet — not just an
    // already-associated/visible one, which would otherwise appear after Escape.
    if (e.key === 'Escape' && (shownLink || wantLink)) hide();
  }, { capture: true });
  window.addEventListener('scroll', onViewportChange, { passive: true });
  window.addEventListener('resize', onViewportChange);
})();
