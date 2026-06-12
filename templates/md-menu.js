// Behavior for the top-of-content "Open" page menu (.aardvark-md-menu): toggle the
// dropdown and copy the page's raw Markdown to the clipboard. Progressive enhancement —
// open state is driven solely by the .aardvark-open class (no :hover/:focus-within in the
// CSS), so a click reliably toggles it closed. Without JS the menu stays shut; its links
// are still reachable via the page's .md URL (and llms.txt). See theme.render_markdown_menu.
(function () {
  function trigger(menu) {
    // The caret button that opens the dropdown (the "View in Markdown" primary is a plain link).
    return menu.querySelector('.aardvark-md-menu-toggle');
  }
  function items(menu) {
    return Array.prototype.slice.call(menu.querySelectorAll('.aardvark-md-menu-item'));
  }
  function close(menu) {
    menu.classList.remove('aardvark-open');
    var t = trigger(menu);
    if (t) t.setAttribute('aria-expanded', 'false');
  }
  function closeAll(except) {
    document.querySelectorAll('.aardvark-md-menu.aardvark-open').forEach(function (menu) {
      if (menu !== except) close(menu);
    });
  }
  function open(menu) {
    closeAll(menu);
    menu.classList.add('aardvark-open');
    var t = trigger(menu);
    if (t) t.setAttribute('aria-expanded', 'true');
  }

  // Fetch the page's .md and copy it to the clipboard, with a transient label swap. The
  // .md is same-origin (no CORS); fetching on demand avoids inlining it into every page.
  function copy(btn) {
    var label = btn.querySelector('.aardvark-md-menu-item-label') || btn;
    var original = label.textContent;
    function flash(text) {
      label.textContent = text;
      setTimeout(function () { label.textContent = original; }, 1500);
    }
    if (!navigator.clipboard) { flash('Copy unavailable'); return; }
    fetch(btn.getAttribute('data-aardvark-copy-md'))
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) { return navigator.clipboard.writeText(text); })
      .then(function () { flash(btn.getAttribute('data-copied') || 'Copied'); })
      .catch(function () { flash('Copy failed'); });
  }

  function initMenu(menu) {
    var t = trigger(menu);
    if (!t) return;

    t.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (menu.classList.contains('aardvark-open')) close(menu);
      else open(menu);
    });
    t.addEventListener('keydown', function (e) {
      // Open + move focus to the first item on Down/Enter/Space (the ARIA menu-button
      // pattern). preventDefault suppresses the redundant Enter/Space click that would
      // immediately toggle the menu shut; stopPropagation keeps this Down from also reaching
      // the menu's roving handler below (which would otherwise bump focus to the 2nd item).
      if (e.key === 'ArrowDown' || e.key === 'Down' ||
          e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        e.stopPropagation();
        open(menu);
        var it = items(menu);
        if (it[0]) it[0].focus();
      }
    });

    menu.querySelectorAll('[data-aardvark-copy-md]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        copy(btn);
      });
    });

    // Roving focus + Escape within the open dropdown.
    menu.addEventListener('keydown', function (e) {
      var it = items(menu);
      if (!it.length) return;
      var idx = it.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        e.preventDefault();
        it[idx < 0 ? 0 : (idx + 1) % it.length].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        e.preventDefault();
        it[idx < 0 ? it.length - 1 : (idx - 1 + it.length) % it.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        it[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        it[it.length - 1].focus();
      } else if (e.key === 'Escape') {
        close(menu);
        t.focus();
      }
    });

    // Close when focus leaves the menu entirely (keyboard tab-away).
    menu.addEventListener('focusout', function (e) {
      if (!menu.contains(e.relatedTarget)) close(menu);
    });
  }

  function init() {
    document.querySelectorAll('.aardvark-md-menu').forEach(initMenu);
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.aardvark-md-menu')) closeAll(null);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
