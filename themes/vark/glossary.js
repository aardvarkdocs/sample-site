// Hover definition cards for public glossary terms. On hover over — or keyboard focus
// of — a term/acronym marked `public` in definitions.yaml (rendered by markdown._glossarize
// as a dotted-underline <span class="aardvark-glossary-term">), a small floating card shows
// the term (with its acronym) and its definition. The data rides on the span's data-*
// attributes, so there is no manifest to fetch. The card reuses the link-preview hovercard
// styling (.aardvark-hovercard*). Progressive enhancement: with no JS the dotted underline
// just has no card. Modeled on hovercard.js, with an immediate-on-focus tweak for
// screen readers (see onOver).
(function () {
  // Skip touch / no-hover devices; on hover-capable devices the card responds to both
  // pointer hover and keyboard focus (the term span carries tabindex="0").
  if (!(window.matchMedia && window.matchMedia('(hover: hover)').matches)) return;

  var SHOW_MS = 350; // hover dwell before the card appears (intent, not a twitch)
  var HIDE_MS = 200; // grace period so the pointer can travel term -> card
  var GAP = 8;       // space between the term and the card
  var EDGE = 8;      // viewport margin when clamping/flipping

  var card, titleEl, descEl;
  var wantTerm = null;   // term the pointer/focus is currently intent on
  var shownTerm = null;  // term the visible card belongs to
  var showTimer = null, hideTimer = null;

  function render(el) {
    titleEl.textContent = el.getAttribute('data-aardvark-glossary-title') || '';
    var desc = (el.getAttribute('data-aardvark-glossary-def') || '').trim();
    descEl.textContent = desc;
    descEl.hidden = !desc;
  }

  // Place the card below the term, flipping above when it would overflow the bottom, and
  // clamp horizontally. Coordinates are viewport-relative (position: fixed).
  function position(el) {
    var r = el.getBoundingClientRect();
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

  function showFor(el) {
    if (el !== wantTerm) return;          // pointer moved on before the dwell elapsed
    render(el);
    position(el);                         // measure + place before revealing
    card.classList.add('aardvark-hovercard-visible');
    if (shownTerm && shownTerm !== el) shownTerm.removeAttribute('aria-describedby');
    shownTerm = el;
    el.setAttribute('aria-describedby', card.id);
  }

  function hide() {
    clearTimeout(showTimer); showTimer = null;
    wantTerm = null;
    clearTimeout(hideTimer); hideTimer = null;
    card.classList.remove('aardvark-hovercard-visible');
    if (shownTerm) shownTerm.removeAttribute('aria-describedby');
    shownTerm = null;
  }

  function scheduleHide() { clearTimeout(hideTimer); hideTimer = setTimeout(hide, HIDE_MS); }
  function cancelHide() { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }

  function onOver(e) {
    var el = e.target && e.target.closest && e.target.closest('.aardvark-glossary-term');
    if (!el) return;
    cancelHide();
    if (el === shownTerm) return;         // already showing this one
    wantTerm = el;
    clearTimeout(showTimer);
    // Keyboard focus is already intentional, and the card's definition is announced via
    // the aria-describedby set in showFor() — which must be attached at focus time for a
    // screen reader to read it. So show immediately on focus; keep the dwell for pointer
    // hover only (intent detection, avoids a flash while sweeping across text).
    if (e.type === 'focusin') showFor(el);
    else showTimer = setTimeout(function () { showFor(el); }, SHOW_MS);
  }

  function onOut(e) {
    var el = e.target && e.target.closest && e.target.closest('.aardvark-glossary-term');
    if (!el) return;
    if (e.relatedTarget && el.contains(e.relatedTarget)) return; // moved within the term
    if (el === wantTerm) { clearTimeout(showTimer); wantTerm = null; }
    if (el === shownTerm) scheduleHide();
  }

  // A focus-driven card is kept pinned to its (focused) term; a hover card — or a pending
  // hover show — is dismissed on scroll/resize so it can't drift to a stale position.
  function onViewportChange() {
    var active = document.activeElement;
    if (shownTerm && shownTerm === active) { position(shownTerm); return; }
    if (wantTerm && wantTerm === active) return;
    hide();
  }

  card = document.createElement('div');
  card.className = 'aardvark-hovercard';   // reuse the link-preview card styling
  card.id = 'aardvark-glossarycard';       // distinct id (hovercard.js owns aardvark-hovercard)
  card.setAttribute('role', 'tooltip');
  titleEl = document.createElement('div');
  titleEl.className = 'aardvark-hovercard-title';
  descEl = document.createElement('div');
  descEl.className = 'aardvark-hovercard-desc';
  card.appendChild(titleEl);
  card.appendChild(descEl);
  document.body.appendChild(card);

  // Keep the card open while the pointer is inside it (so it doesn't vanish as you reach it).
  card.addEventListener('mouseenter', cancelHide);
  card.addEventListener('mouseleave', scheduleHide);

  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);
  // Keyboard parity: tabbing to a term shows the card and blurring hides it (focusin/focusout
  // bubble, so delegation works); the SHOW_MS dwell debounces tabbing straight through.
  document.addEventListener('focusin', onOver);
  document.addEventListener('focusout', onOut);
  // Escape dismisses the card without moving focus (AGENTS.md: "Escape closes overlays").
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && shownTerm) hide(); });
  window.addEventListener('scroll', onViewportChange, { passive: true });
  window.addEventListener('resize', onViewportChange);
})();
