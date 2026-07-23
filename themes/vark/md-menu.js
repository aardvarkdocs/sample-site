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

  // Copy a LITERAL string (e.g. the MCP endpoint) to the clipboard, with the same transient label
  // swap as copy() above. Unlike copy() this does NOT fetch — the value is in the attribute. A
  // leading "/" is resolved against location.origin ONLY when the button opts in via
  // data-aardvark-copy-abs, so a root-relative endpoint (no baseUrl) is copied as an absolute URL
  // the user can paste into a Claude connector or `claude mcp add`. The opt-in (mirroring the setup
  // page's data-abs guard) means a future copy-text value that starts with "/" but must be copied
  // verbatim (e.g. a slash-command) is never silently absolutized.
  function copyText(btn) {
    var label = btn.querySelector('.aardvark-md-menu-item-label') || btn;
    var original = label.textContent;
    function flash(text) {
      label.textContent = text;
      setTimeout(function () { label.textContent = original; }, 1500);
    }
    if (!navigator.clipboard) { flash('Copy unavailable'); return; }
    var value = btn.getAttribute('data-aardvark-copy-text') || '';
    if (btn.hasAttribute('data-aardvark-copy-abs') && value.charAt(0) === '/') {
      value = location.origin + value;
    }
    navigator.clipboard.writeText(value)
      .then(function () { flash(btn.getAttribute('data-copied') || 'Copied'); })
      .catch(function () { flash('Copy failed'); });
  }

  // Install the assistant PWA. pwa.js stashes the browser's deferred beforeinstallprompt on
  // window.__aardvarkInstallPrompt (Chrome/Edge/Android); fire it here, inside the click handler, so
  // the install dialog runs on a user gesture. With no captured prompt (already installed, or a
  // browser without one — iOS Safari, Firefox), fall back to opening the standalone assistant page,
  // which carries manual "Add to Home Screen" guidance. Only present when the PWA was built.
  function installApp(btn) {
    var deferred = window.__aardvarkInstallPrompt;
    if (deferred && typeof deferred.prompt === 'function') {
      // Clear the shared global synchronously BEFORE prompt(), mirroring pwa.js / the assistant
      // island's contract: a beforeinstallprompt event is single-use (prompt() may be called once,
      // accept or dismiss), so nulling it first stops a rapid second click — or the island re-reading
      // the global — from calling prompt() on the spent event. It reappears only when the browser
      // fires a fresh beforeinstallprompt. try/catch + .catch swallow a sync/async throw on a spent
      // event either way (a no-op). The button returns on the FIRST fresh prompt.
      window.__aardvarkInstallPrompt = null;
      try {
        Promise.resolve(deferred.prompt()).catch(function () {});
      } catch (err) { /* already spent — ignore */ }
      return;
    }
    // The target is a build-time attribute (already carries the deploy base path when set); fall
    // back to the standalone assistant page under the same base path (window.__aardvarkBase, "" at
    // the origin root). Navigate only to a genuine same-origin path ("/…", but not protocol-relative
    // "//host"), so a non-path value can never redirect off-origin.
    var fallback = (window.__aardvarkBase || '') + '/_assistant/';
    var target = btn.getAttribute('data-aardvark-install-app') || fallback;
    if (target.charAt(0) !== '/' || target.charAt(1) === '/') target = fallback;
    window.location.href = target;
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

    menu.querySelectorAll('[data-aardvark-copy-text]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        copyText(btn);
      });
    });

    menu.querySelectorAll('[data-aardvark-install-app]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        installApp(btn);
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
