// Mobile slide-out drawer. The hamburger (.aardvark-nav-burger) toggles the left off-canvas
// sidebar — the SAME <nav class="aardvark-sidebar"> element, repositioned by CSS at <=760px, so
// nav.js keeps working and nav_html is never duplicated. On mobile the drawer also hosts the
// header's secondary actions (language picker + topButtons), relocated here and moved back to the
// header above the breakpoint. CSS owns the no-JS state (drawer closed, overlay hidden); this only
// enhances, in the style of nav.js / tabs.js.
(function () {
  var MQ = '(max-width: 760px)';
  var OPEN_CLASS = 'aardvark-drawer-open';
  var FOCUSABLE =
    'a[href], button:not([disabled]), select, input, textarea, [tabindex]:not([tabindex="-1"])';

  function init() {
    var btn = document.querySelector('.aardvark-nav-burger');
    var drawer = document.getElementById('aardvark-drawer'); // the reused .aardvark-sidebar
    var overlay = document.querySelector('.aardvark-drawer-overlay');
    var header = document.querySelector('.aardvark-header');
    if (!btn || !drawer || !overlay) return;

    var actionsSlot = drawer.querySelector('.aardvark-drawer-actions');
    var tabsSlot = drawer.querySelector('.aardvark-drawer-tabs');
    var mql = window.matchMedia(MQ);
    var lastFocus = null;
    drawer.setAttribute('tabindex', '-1');

    // Record each relocatable node with the drawer slot it moves into on mobile (and back to its
    // recorded home on desktop). All are config-conditional, so absent nodes are skipped.
    var movables = [];
    function record(node, slot) {
      if (node && slot) movables.push({ node: node, parent: node.parentNode, next: node.nextSibling, slot: slot });
    }
    record(document.querySelector('.aardvark-tabbar .aardvark-tabs'), tabsSlot); // section tabs → top of drawer
    // Record the header actions in their HEADER DOM ORDER (lang select → theme toggle → top buttons).
    // toHeader() restores via each node's recorded m.next sibling, so order is preserved regardless,
    // but keeping these calls in DOM order makes that invariant obvious — don't reorder them.
    record(document.getElementById('aardvark-lang-select'), actionsSlot);
    record(header ? header.querySelector('.aardvark-theme-toggle') : null, actionsSlot);
    record(header ? header.querySelector('.aardvark-top-buttons') : null, actionsSlot);

    // If the drawer would be empty — no nav links and nothing relocatable — there's nothing to open;
    // hide the trigger and bail. Inline style beats the mobile display:inline-flex rule; emptiness is
    // page-static, so it holds across resizes.
    if (!drawer.querySelector('a[href]') && !movables.length) {
      btn.style.display = 'none';
      return;
    }

    // Flag which control groups JS actually relocated, one class per drawer slot, so the mobile CSS
    // hides each group only once its members have somewhere to go. The two slots are independent: a
    // custom theme override could ship one (.aardvark-drawer-tabs or .aardvark-drawer-actions) without
    // the other, so a single shared flag would either leave an emptied tabbar visible or hide header
    // controls that were never relocated. Keyed off the recorded movables (record() only enqueues a
    // node when its slot exists), so each class is set iff that slot received content. Without JS — or
    // on the bail path — neither is set and every control stays reachable in place.
    if (movables.some(function (m) { return m.slot === actionsSlot; }))
      document.body.classList.add('aardvark-drawer-has-actions');
    if (movables.some(function (m) { return m.slot === tabsSlot; }))
      document.body.classList.add('aardvark-drawer-has-tabs');

    function toDrawer() {
      // Skip the move when the node is already in its slot (mirrors toHeader()'s guard): mql.change
      // fires only on breakpoint crossings so toDrawer/toHeader already alternate, but the explicit
      // check makes the no-op case obvious and avoids a pointless re-append.
      movables.forEach(function (m) {
        if (m.node.parentNode !== m.slot) m.slot.appendChild(m.node);
        m.slot.hidden = false;
      });
    }
    function toHeader() {
      // Restore each node to its recorded spot, iterating in REVERSE record order so that by the time
      // we place a node its recorded `next` sibling is already back in the parent — letting insertBefore
      // pin the exact original position. (Forward order would, for a movable whose `next` is itself a
      // not-yet-restored movable, fall back to appendChild; that still preserves these controls' RELATIVE
      // order, but would drop them after any non-movable element ever added past this cluster. Reverse is
      // robust to that.) Guard the reference sibling: if it's no longer a child of the parent, fall back
      // to appendChild so insertBefore can't throw NotFoundError.
      for (var i = movables.length - 1; i >= 0; i--) {
        var m = movables[i];
        if (m.next && m.next.parentNode === m.parent) m.parent.insertBefore(m.node, m.next);
        else m.parent.appendChild(m.node);
      }
      if (actionsSlot) actionsSlot.hidden = true;
      if (tabsSlot) tabsSlot.hidden = true;
    }
    // The closed drawer's a11y state depends on the breakpoint: on mobile it's an off-canvas panel
    // that must leave the a11y tree + tab order (aria-hidden + inert); on desktop it's the visible
    // sticky sidebar and must stay reachable. open()/close() manage this while toggling, but
    // syncPlacement (init + every breakpoint crossing) must (re)assert it — otherwise a mobile→desktop
    // resize strands stale inert on the desktop sidebar (close() early-returns when never opened, so
    // it can't clear them), and a desktop→mobile resize leaves the off-screen drawer focusable.
    function applyClosedA11y() {
      if (mql.matches && !isOpen()) {
        drawer.setAttribute('aria-hidden', 'true');
        drawer.setAttribute('inert', '');
      } else if (!mql.matches) {
        drawer.removeAttribute('aria-hidden');
        drawer.removeAttribute('inert');
      }
    }
    function syncPlacement() {
      if (mql.matches) {
        toDrawer();
      } else {
        close();
        toHeader();
      }
      applyClosedA11y();
    }

    function isOpen() { return document.body.classList.contains(OPEN_CLASS); }

    // Scroll-lock. iOS Safari ignores body{overflow:hidden}, so pin the body with position:fixed and
    // offset it by the saved scroll position on BOTH axes — vertically, and horizontally for a
    // sideways-scrollable page (wide table / code block) — so the page neither jumps while locked nor
    // loses its X position on unlock. Restore both axes on close.
    var scrollY = 0, scrollX = 0;
    function lockScroll() {
      scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = -scrollY + 'px';
      document.body.style.left = -scrollX + 'px';
      document.body.style.width = '100%';
    }
    function unlockScroll() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      window.scrollTo(scrollX, scrollY);
    }

    // Modal semantics: while the drawer is open, take the rest of the page out of the a11y tree so a
    // screen-reader virtual cursor (NVDA/JAWS/VoiceOver arrow keys) can't wander into the content
    // behind the overlay — the Tab focus trap alone doesn't stop browse-mode navigation. Walk from the
    // drawer up to <body>, inerting every sibling except the overlay; record what we changed (skipping
    // anything already inert/aria-hidden) so close() restores exactly.
    var bgInerted = [];
    function setBackgroundInert(on) {
      if (on) {
        bgInerted = [];
        var node = drawer;
        while (node && node !== document.body && node.parentNode) {
          var kids = node.parentNode.children;
          for (var i = 0; i < kids.length; i++) {
            var sib = kids[i];
            if (sib === node || sib === overlay || sib.id === 'aardvark-live') continue;
            if (sib.hasAttribute('inert') || sib.getAttribute('aria-hidden') === 'true') continue;
            sib.setAttribute('inert', '');
            sib.setAttribute('aria-hidden', 'true');
            bgInerted.push(sib);
          }
          node = node.parentNode;
        }
      } else {
        bgInerted.forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
        bgInerted = [];
      }
    }

    function open() {
      if (isOpen()) return;
      lastFocus = document.activeElement;
      document.body.classList.add(OPEN_CLASS);
      lockScroll();
      btn.setAttribute('aria-expanded', 'true');
      drawer.removeAttribute('aria-hidden');
      drawer.removeAttribute('inert');
      // Modal dialog semantics while open: the reused <nav> stops being a navigation landmark and
      // becomes a focus-trapped dialog (announced as such by AT, and so the relocated language/CTA
      // controls read as dialog content, not as items inside the doc-nav landmark).
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      setBackgroundInert(true); // take the rest of the page out of the a11y tree (modal semantics)
      (drawer.querySelector(FOCUSABLE) || drawer).focus(); // focus into drawer
      // Bubble phase (not capture) so widgets inside the drawer get keys first; see onKeydown.
      document.addEventListener('keydown', onKeydown);
    }
    function close() {
      if (!isOpen()) return;
      document.body.classList.remove(OPEN_CLASS);
      unlockScroll();
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      drawer.removeAttribute('role'); // back to the plain navigation landmark
      drawer.removeAttribute('aria-modal');
      setBackgroundInert(false);
      document.removeEventListener('keydown', onKeydown);
      // Restore focus to the opener, but only if it's still visible: a mobile→desktop resize closes
      // the drawer while the hamburger is now display:none, which would be an invalid focus target.
      if (lastFocus && lastFocus.focus && lastFocus.offsetParent !== null) lastFocus.focus();
    }
    function toggle() { isOpen() ? close() : open(); }

    function onKeydown(e) {
      // Listen in the bubble phase and bail if a widget inside the drawer already handled the key by
      // calling preventDefault (e.g. a custom dropdown/overlay), so we don't also close the drawer.
      // (A native control that consumes Escape WITHOUT preventDefault — e.g. a <select> closing its
      // own dropdown — isn't caught here, so Escape may still close the drawer then; acceptable edge.)
      if (e.defaultPrevented) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      // Exclude focusables inside an [inert] subtree: nav.js marks collapsed nav branches inert, but
      // they collapse via CSS grid-clip (not display:none) so their links keep offsetParent !== null
      // and would otherwise pass this filter — yet .focus() on an inert element is a no-op, which would
      // freeze the wrap on the first/last element.
      var items = Array.prototype.filter.call(
        drawer.querySelectorAll(FOCUSABLE),
        function (el) { return (el.offsetParent !== null || el === document.activeElement) && !el.closest('[inert]'); }
      );
      if (!items.length) { e.preventDefault(); drawer.focus(); return; }
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    btn.addEventListener('click', toggle);
    overlay.addEventListener('click', close);
    // In-drawer close control: a keyboard-reachable dismiss (the hamburger is inert while the dialog
    // is open, and the overlay click isn't keyboard-accessible). It's the drawer's first focusable,
    // so open() lands focus on it.
    var closeBtn = drawer.querySelector('.aardvark-drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a[href]')) close(); // close when a nav link is followed
    });

    if (mql.addEventListener) mql.addEventListener('change', syncPlacement);
    else if (mql.addListener) mql.addListener(syncPlacement); // Safari < 14

    syncPlacement(); // sets initial placement + closed-state a11y via applyClosedA11y()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
