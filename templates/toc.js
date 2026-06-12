// Scrollspy for the "On this page" TOC. As the reader scrolls, the link whose
// section currently sits at the top of the viewport gets the .aardvark-active class.
// When the active section jumps by more than one (fast scroll or an anchor
// click), the highlight *runs* through the intervening links one step at a time
// rather than teleporting. Progressive enhancement: with no JS the TOC is still
// working anchors.

// Header reading-progress bar: a thin accent line under the sticky header that
// fills L->R as the reader moves down the page. Created here (no markup needed) so
// it works on every page, including those with no TOC; the look + reduced-motion
// handling live in theme.css (.aardvark-reading-progress). Runs in its own IIFE
// before the TOC logic, which early-returns on pages without a TOC.
(function () {
  var header = document.querySelector('.aardvark-header');
  if (!header) return;
  var bar = document.createElement('div');
  bar.className = 'aardvark-reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  header.appendChild(bar);
  var ticking = false;
  function update() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var frac = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = 'scaleX(' + frac.toFixed(4) + ')';
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

(function () {
  var panel = document.querySelector('.aardvark-toc-panel');
  var toc = panel && panel.querySelector('.aardvark-toc');
  if (!toc) return;

  // Pair each TOC link with the heading it points at, in document order.
  var entries = [];
  toc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var id = decodeURIComponent(link.hash.slice(1));
    var heading = id && document.getElementById(id);
    if (heading) entries.push({ link: link, heading: heading });
  });
  if (!entries.length) return;

  var STEP_MS = 70;          // dwell per link while "running" toward the target
  var activeIndex = -1;      // link currently carrying .aardvark-active (-1 = none yet)
  var targetIndex = -1;      // link the scroll position says should be active
  var stepTimer = null;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  function setActiveIndex(i) {
    if (i === activeIndex) return;
    if (entries[activeIndex]) {
      entries[activeIndex].link.classList.remove('aardvark-active');
      entries[activeIndex].link.removeAttribute('aria-current');
    }
    activeIndex = i;
    if (entries[activeIndex]) {
      entries[activeIndex].link.classList.add('aardvark-active');
      // Expose the current section to assistive tech (not just the CSS class).
      // "location" is the ARIA token for the current item within a navigational
      // environment — the right fit for a scrollspy TOC (vs generic "true").
      entries[activeIndex].link.setAttribute('aria-current', 'location');
      keepInView(entries[activeIndex].link);
    }
  }

  // Move one link toward the target, then schedule the next move until we
  // arrive. Reads targetIndex live, so a target that shifts mid-run (kept
  // scrolling, or reversed direction) is followed without restarting.
  function step() {
    stepTimer = null;
    if (activeIndex === targetIndex) return;
    setActiveIndex(activeIndex + (activeIndex < targetIndex ? 1 : -1));
    if (activeIndex !== targetIndex) stepTimer = setTimeout(step, STEP_MS);
  }

  function goToTarget(i) {
    targetIndex = i;
    // First activation, or reduced-motion: snap straight there, no run-up.
    if (activeIndex === -1 || (reduceMotion && reduceMotion.matches)) {
      if (stepTimer !== null) { clearTimeout(stepTimer); stepTimer = null; }
      setActiveIndex(i);
    } else if (stepTimer === null && activeIndex !== targetIndex) {
      step();
    }
  }

  // Scroll the (independently scrollable) TOC panel so the active link stays
  // visible, without ever nudging the page itself.
  function keepInView(link) {
    var l = link.getBoundingClientRect();
    var p = panel.getBoundingClientRect();
    if (l.top < p.top) panel.scrollTop -= p.top - l.top;
    else if (l.bottom > p.bottom) panel.scrollTop += l.bottom - p.bottom;
  }

  // The "you are reading here" line, just below the sticky header/tab bar.
  function triggerLine() {
    var s = getComputedStyle(document.documentElement);
    var header = parseInt(s.getPropertyValue('--aardvark-header-h'), 10) || 0;
    var tabbar = parseInt(s.getPropertyValue('--aardvark-tabbar-h'), 10) || 0;
    return header + tabbar + 24;
  }

  function update() {
    var line = triggerLine();
    var idx = 0;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].heading.getBoundingClientRect().top <= line) idx = i;
      else break;
    }
    // A short final section may never reach the line; once the page is scrolled
    // to the bottom, the last heading is the one being read.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      idx = entries.length - 1;
    }
    goToTarget(idx);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      update();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
