// Dropdown behavior for the horizontal tab bar (.aardvark-tabbar). Clicking a tab
// that has children toggles its menu; CSS :hover/:focus-within provide a
// no-JS fallback, so this only enhances (click-to-open, outside-click, Escape).
// On mobile the whole tab list is relocated into the nav drawer (drawer.js), where the
// dropdowns expand inline (theme.css) — so this script needs no mobile-specific positioning.
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
