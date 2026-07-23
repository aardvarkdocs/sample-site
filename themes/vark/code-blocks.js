// Progressive enhancement for content code blocks: a copy button and a download
// button revealed on hover/focus in the top-right corner. The <pre> is styled by
// theme.css, so a no-JS page still shows clean, readable code; this only layers on
// the two actions. Mirrors tables.js — wrap the rendered element, add hover-revealed
// controls, guard against double-processing, and skip island-owned DOM. Mermaid and
// Markdeep diagrams (<pre class="mermaid">/<pre class="markdeep">, no <code> child) are skipped.
(function () {
  // language-* class -> download file extension; anything unmapped falls back to txt.
  var EXT = {
    python: 'py', py: 'py', javascript: 'js', js: 'js', jsx: 'jsx',
    typescript: 'ts', ts: 'ts', tsx: 'tsx', json: 'json', yaml: 'yml', yml: 'yml',
    bash: 'sh', sh: 'sh', shell: 'sh', console: 'sh', zsh: 'sh', html: 'html',
    css: 'css', scss: 'scss', sql: 'sql', go: 'go', rust: 'rs', rs: 'rs',
    java: 'java', c: 'c', cpp: 'cpp', 'c++': 'cpp', csharp: 'cs', cs: 'cs', 'c#': 'cs',
    ruby: 'rb', rb: 'rb', php: 'php', kotlin: 'kt', swift: 'swift', toml: 'toml',
    xml: 'xml', md: 'md', markdown: 'md', diff: 'diff', dockerfile: 'dockerfile',
    text: 'txt', plaintext: 'txt'
  };

  // Pretty labels for the header language pill; unmapped languages fall back to UPPERCASE.
  var LANG_LABEL = {
    python: 'Python', py: 'Python', javascript: 'JavaScript', js: 'JavaScript', jsx: 'JSX',
    typescript: 'TypeScript', ts: 'TypeScript', tsx: 'TSX', json: 'JSON', yaml: 'YAML', yml: 'YAML',
    bash: 'Bash', sh: 'Shell', shell: 'Shell', console: 'Shell', zsh: 'Shell', html: 'HTML',
    css: 'CSS', scss: 'SCSS', sql: 'SQL', go: 'Go', rust: 'Rust', rs: 'Rust', java: 'Java',
    c: 'C', cpp: 'C++', 'c++': 'C++', csharp: 'C#', cs: 'C#', 'c#': 'C#', ruby: 'Ruby', rb: 'Ruby',
    php: 'PHP', kotlin: 'Kotlin', swift: 'Swift', toml: 'TOML', xml: 'XML', md: 'Markdown',
    markdown: 'Markdown', diff: 'Diff', dockerfile: 'Dockerfile', text: 'Text', plaintext: 'Text'
  };

  // Tabler icons (MIT) — visually consistent with @tabler/icons-react in the islands.
  // Built as DOM nodes via createElementNS (not innerHTML) so the buttons still render under a
  // strict `require-trusted-types-for 'script'` CSP — where innerHTML would throw — and to match
  // tables.js's no-innerHTML construction. setIcon() swaps a fresh clone into a button.
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svgIcon() {
    var svg = document.createElementNS(SVGNS, 'svg');
    var attrs = { viewBox: '0 0 24 24', width: '16', height: '16', fill: 'none',
      stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      'aria-hidden': 'true' };   // decorative — the button's aria-label is the accessible name
    for (var k in attrs) svg.setAttribute(k, attrs[k]);
    for (var i = 0; i < arguments.length; i++) {
      var path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('d', arguments[i]);
      svg.appendChild(path);
    }
    return svg;
  }
  var ICON_COPY = svgIcon('M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z', 'M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2');
  var ICON_CHECK = svgIcon('M5 12l5 5l10 -10');
  var ICON_DOWNLOAD = svgIcon('M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2', 'M7 11l5 5l5 -5', 'M12 4l0 12');

  // Replace a button's icon without innerHTML (Trusted-Types safe); clone so each button owns its node.
  function setIcon(btn, icon) {
    while (btn.firstChild) btn.removeChild(btn.firstChild);
    btn.appendChild(icon.cloneNode(true));
  }

  // The clean source to copy/download. Two kinds of <pre> carry it on data-aardvark-code: a
  // twoslash block (stamped by the build) so the type text the rich hover markup hides inside it
  // never lands on the clipboard, and a decorated fence (the diff-stripped source) since its
  // per-line spans hold no inter-line newlines. Any other block falls back to the rendered text.
  function codeText(pre, code) {
    var raw = pre.getAttribute('data-aardvark-code');
    return raw != null ? raw : code.textContent;
  }

  function langExt(pre, code) {
    // Twoslash blocks are Shiki-rendered: the <pre> has no language-* class, so the build
    // stamps the source language on data-aardvark-lang for the download extension.
    var attr = pre.getAttribute('data-aardvark-lang');
    if (attr && EXT[attr.toLowerCase()]) return EXT[attr.toLowerCase()];
    var m = (code.className || '').match(/language-([\w+#.-]+)/);
    return (m && EXT[m[1].toLowerCase()]) || 'txt';
  }

  // The source language token (lowercased) for the header pill, or '' if unknown — same two
  // sources as langExt (the build's data-aardvark-lang, else the language-* class), but the
  // raw name rather than a download extension.
  function codeLang(pre, code) {
    var attr = pre.getAttribute('data-aardvark-lang');
    if (attr) return attr.toLowerCase();
    var m = (code.className || '').match(/language-([\w+#.-]+)/);
    return m ? m[1].toLowerCase() : '';
  }

  function copy(text, btn) {
    var ok = function () {
      btn.classList.add('aardvark-code-copied');
      setIcon(btn, ICON_CHECK);
      clearTimeout(btn._resetTimer);
      btn._resetTimer = setTimeout(function () {
        btn.classList.remove('aardvark-code-copied');
        setIcon(btn, ICON_COPY);
      }, 1500);
      // Announce via the shared ARIA live region (in default.html, also used by tables.js) so
      // screen-reader users get confirmation, not just the visual checkmark. Clear then set
      // on a later tick so an identical repeat copy still re-announces (mirrors tables.js).
      var live = document.getElementById('aardvark-live');
      if (live) { live.textContent = ''; setTimeout(function () { live.textContent = 'Copied to clipboard'; }, 50); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { legacyCopy(text, ok); });
    } else {
      legacyCopy(text, ok);
    }
  }

  // navigator.clipboard is unavailable outside secure contexts (e.g. plain http, file://),
  // so fall back to a throwaway off-screen textarea + execCommand for those pages.
  function legacyCopy(text, ok) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';   // fixed + off-screen; top pinned too, the conventional off-screen pattern
    // ta.select() steals focus; without restoring it, removeChild drops focus to <body>, so
    // :focus-within stops matching and the actions (with the checkmark) fade out before a
    // keyboard user sees the confirmation. Save and restore the previously-focused element.
    var prev = document.activeElement;
    document.body.appendChild(ta);
    ta.select();
    // Guard only the execCommand call: it returns false (rather than throwing) when the copy
    // fails, so capture the result and call ok() *outside* the try — otherwise an error thrown
    // inside ok() would be miscaught here and silently treated as a clipboard failure. The
    // cleanup runs unconditionally (ok() doesn't need the textarea), and restoring focus before
    // ok() means :focus-within already matches when the checkmark appears.
    var succeeded = false;
    try { succeeded = !!document.execCommand('copy'); } catch (e) { /* clipboard blocked — give up quietly */ }
    document.body.removeChild(ta);
    if (prev && prev.focus) prev.focus();
    if (succeeded) ok();
  }

  function download(text, ext) {
    var url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = 'snippet.' + ext;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // a.click() queues the download synchronously, so the only hazard is revoking within this
    // same turn; deferring to a later macrotask is enough. A short 1s delay clears that with
    // ample margin and frees the (tiny) blob promptly rather than holding it for many seconds.
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function button(label, icon, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'aardvark-code-btn';
    b.setAttribute('aria-label', label);
    b.title = label;
    setIcon(b, icon);
    b.addEventListener('click', onClick);
    return b;
  }

  // The collapse cap, read from the --aardvark-collapse-max custom property so theme.css is the
  // single source of truth (its .aardvark-code-collapsed max-height uses the same var — no manual
  // sync). theme.css is a render-blocking <link>, so it's applied before this deferred script runs
  // and getComputedStyle sees the value; the || 260 fallback covers the edge where it isn't. The
  // cap is measured against the WRAPPER's natural height (header + code), so a card that exceeds it
  // gets a toggle.
  var COLLAPSED_MAX = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--aardvark-collapse-max'), 10) || 260;

  // An `expandable` fence ships its full code; we collapse it to a capped, faded height with
  // a Show more / Show less toggle. Done client-side on purpose — a no-JS page just shows the
  // whole block. A card already shorter than the cap gets no toggle (nothing to expand).
  function makeExpandable(wrap) {
    if (wrap._aardvarkExpand) return;
    // Hidden at load (inside a closed <details>, an inactive CSS tab/accordion, display:none, …)
    // measures 0. Don't latch — observe the wrapper and retry once it gains a real height, however
    // it's later revealed. A ResizeObserver fires when the element goes from unrendered (size 0) to
    // shown, so this covers every hidden-container case uniformly without hunting the DOM for a
    // specific one — a closed <details>, a tab panel, an accordion are all the same to it.
    if (wrap.scrollHeight === 0) {
      // Known bound: if the block is removed while still hidden (never revealed — e.g. an SPA
      // soft-navigation away from a never-opened <details>), this observer isn't eagerly
      // disconnected and is reclaimed only on page unload. Harmless for the full-reload static-site
      // model this theme targets (every navigation is a full teardown); a future SPA host should
      // disconnect observers on soft navigation rather than accumulate one per never-revealed block.
      if (!wrap._aardvarkRetryObserver && typeof ResizeObserver !== 'undefined') {
        wrap._aardvarkRetryObserver = new ResizeObserver(function () { makeExpandable(wrap); });
        wrap._aardvarkRetryObserver.observe(wrap);
      }
      return;
    }
    // Measurable now — disconnect the retry observer (if any). Its job is done; left attached it
    // would re-fire on the collapse-clip resize below, and its closure would keep pinning `wrap`
    // after the block is set up or removed from the DOM (e.g. SPA nav).
    if (wrap._aardvarkRetryObserver) {
      wrap._aardvarkRetryObserver.disconnect();
      wrap._aardvarkRetryObserver = null;
    }
    if (wrap.scrollHeight <= COLLAPSED_MAX + 8) return;  // whole card fits the cap — no toggle
    wrap._aardvarkExpand = true;  // a toggle is needed — latch only now, so a block that merely
                                  // fits the cap can still be retried if it later grows past it
    wrap.classList.add('aardvark-code-collapsed');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'aardvark-code-expand-btn';
    btn.textContent = 'Show more';
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var collapsed = wrap.classList.toggle('aardvark-code-collapsed');
      btn.textContent = collapsed ? 'Show more' : 'Show less';
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
    // Insert the toggle as a sibling AFTER the card, not inside it. The card has overflow:hidden
    // (rounded corners + the collapse clip), which would trap a sticky child; as a sibling the
    // pill can use position:sticky to pin to the viewport bottom while a long expanded block
    // scrolls, instead of stranding off-screen at the card's bottom.
    if (wrap.parentNode) wrap.parentNode.insertBefore(btn, wrap.nextSibling);
  }

  function enhance(pre) {
    if (pre.classList.contains('aardvark-code-enhanced')) return;
    if (pre.classList.contains('mermaid')) return;
    if (pre.classList.contains('markdeep')) return;
    // Twoslash renders extra .shiki <pre> blocks for its ^? query / type displays; only the
    // root block is stamped with data-aardvark-code. Enhance the root block and ordinary
    // (Pygments) blocks, but not those type displays — a copy button on a type signature is noise.
    if (pre.classList.contains('shiki') && !pre.hasAttribute('data-aardvark-code')) return;
    var code = pre.querySelector('code');
    if (!code) return;                                  // no code child (e.g. mermaid) — skip
    if (pre.closest('[data-aardvark-island]')) return;  // React-owned DOM — leave alone
    if (pre.closest('.twoslash-popup-container')) return;  // a twoslash type-hint popup, not a copyable block

    // The actions are a sibling of <pre> inside a relatively-positioned wrapper (not a
    // child of <pre>), so the <pre>'s overflow-x:auto can't clip them and they stay
    // pinned top-right when wide code scrolls horizontally. A decorated fence (title /
    // line numbers / diff / …) already ships its own .aardvark-code-block wrapper from the
    // build — reuse it so the buttons land in that card and we don't double-wrap; a plain
    // fence has none, so create one as before.
    var wrap = pre.closest('.aardvark-code-block');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'aardvark-code-block';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
    }
    // The actions are per-wrapper. closest() can share one wrapper across multiple <pre>s (author
    // raw HTML, or a future multi-pre card), so guard on the wrapper too: a second <pre> mustn't
    // append an overlapping second Copy/Download pair. Stamp it before returning anyway — sharing
    // the wrapper's existing pair, that <pre> IS done, so the O(1) line-1 class guard skips it on
    // later scans (SPA / MutationObserver) instead of repeating the closest() walk every time.
    if (wrap._aardvarkEnhanced) {
      pre.classList.add('aardvark-code-enhanced');
      return;
    }
    wrap._aardvarkEnhanced = true;
    // The first <pre> claims the wrapper above; stamp it too — after the guard, so it doesn't
    // short-circuit before adding the pair.
    pre.classList.add('aardvark-code-enhanced');

    var ext = langExt(pre, code);
    var actions = document.createElement('div');
    actions.className = 'aardvark-code-actions';
    actions.appendChild(button('Copy code', ICON_COPY, function (e) { copy(codeText(pre, code), e.currentTarget); }));
    actions.appendChild(button('Download code', ICON_DOWNLOAD, function () { download(codeText(pre, code), ext); }));

    // Mount the actions in a persistent header bar — filename/title on the left, a language pill
    // and the copy/download buttons on the right — rather than floating them over the code. A
    // decorated fence with a `title` already ships a server-rendered .aardvark-code-header; reuse
    // it. Otherwise synthesize one and add .aardvark-code-framed so the wrapper owns the border
    // and the bar sits flush atop a square-topped <pre> (see theme.css). The bar reads with no JS
    // too — but it only exists once this enhancer runs, which is also what adds the buttons.
    var header = wrap.querySelector(':scope > .aardvark-code-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'aardvark-code-header';
      wrap.insertBefore(header, pre);
      if (!wrap.classList.contains('aardvark-code-decorated')) wrap.classList.add('aardvark-code-framed');
    }
    var tools = document.createElement('div');
    tools.className = 'aardvark-code-tools';
    var langName = codeLang(pre, code);
    if (langName) {
      var pill = document.createElement('span');
      pill.className = 'aardvark-code-lang';
      pill.textContent = LANG_LABEL[langName] || langName.toUpperCase();
      tools.appendChild(pill);
    }
    tools.appendChild(actions);
    header.appendChild(tools);

    // A decorated block may opt into collapse-by-default; set it up after the actions exist
    // so the toggle button is appended last (it floats at the bottom, the actions top-right).
    if (wrap.classList.contains('aardvark-code-expandable')) makeExpandable(wrap);
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.aardvark-content pre'), enhance);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
