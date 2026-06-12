// Dropdown behavior for the horizontal tab bar (.aardvark-tabbar). Clicking a tab
// that has children toggles its menu; CSS :hover/:focus-within provide a
// no-JS fallback, so this only enhances (click-to-open, outside-click, Escape).
(function () {
  function close(menu) {
    menu.classList.remove('aardvark-open');
    var trigger = menu.querySelector('.aardvark-tab-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function closeAll(except) {
    document.querySelectorAll('.aardvark-tab-menu.aardvark-open').forEach(function (menu) {
      if (menu !== except) close(menu);
    });
  }

  function toggle(menu) {
    var open = menu.classList.toggle('aardvark-open');
    var trigger = menu.querySelector('.aardvark-tab-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) closeAll(menu);
  }

  function init() {
    document.querySelectorAll('.aardvark-tab-menu .aardvark-tab-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggle(trigger.closest('.aardvark-tab-menu'));
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.aardvark-tab-menu')) closeAll(null);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var openTrigger = document.querySelector('.aardvark-tab-menu.aardvark-open .aardvark-tab-trigger');
      closeAll(null);
      if (openTrigger) openTrigger.focus();
    });

    initUnderline();
  }

  // A single accent bar under the tab row that glides to the hovered/focused
  // top-level tab and settles on the active one. Progressive enhancement: the bar
  // and the .aardvark-tabs-enhanced class are added here, so without JS the per-tab
  // border-bottom (theme.css) keeps marking the active tab instead.
  function faceOf(li) {
    // The clickable face of a top-level tab: a link, or a dropdown's trigger button.
    return li ? li.querySelector(':scope > a, :scope > .aardvark-tab-trigger') : null;
  }

  function initUnderline() {
    var bar = document.querySelector('.aardvark-tabbar');
    var list = bar && bar.querySelector('.aardvark-tabs');
    if (!list) return;
    var tabs = list.querySelectorAll(':scope > .aardvark-tab');
    if (!tabs.length) return;
    var underline = document.createElement('span');
    underline.className = 'aardvark-tab-underline';
    underline.setAttribute('aria-hidden', 'true');
    bar.appendChild(underline);
    list.classList.add('aardvark-tabs-enhanced');

    var placed = false;
    function moveTo(li) {
      var face = faceOf(li);
      if (!face) { underline.style.opacity = '0'; return; }
      var fr = face.getBoundingClientRect();
      var x = fr.left - bar.getBoundingClientRect().left;
      var w = fr.width;
      if (!placed) {
        // Place under the active tab on load without sliding in from the edge:
        // disable the transition for this first positioning, then re-enable it.
        underline.style.transition = 'none';
        underline.style.transform = 'translateX(' + x + 'px)';
        underline.style.width = w + 'px';
        underline.style.opacity = '1';
        void underline.offsetWidth;
        underline.style.transition = '';
        placed = true;
      } else {
        underline.style.transform = 'translateX(' + x + 'px)';
        underline.style.width = w + 'px';
        underline.style.opacity = '1';
      }
    }
    function settle() {
      // Resolve the active tab lazily so a dynamically-changed active class is honored.
      var activeLi = list.querySelector(':scope > .aardvark-tab.aardvark-active');
      if (activeLi) moveTo(activeLi);
      else underline.style.opacity = '0';
    }

    settle();
    tabs.forEach(function (li) {
      var face = faceOf(li);
      if (!face) return;
      li.addEventListener('mouseenter', function () { moveTo(li); });
      face.addEventListener('focus', function () { moveTo(li); });
    });
    list.addEventListener('mouseleave', settle);
    list.addEventListener('focusout', function (e) {
      if (!list.contains(e.relatedTarget)) settle();
    });
    window.addEventListener('resize', settle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
