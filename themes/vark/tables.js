// Progressive enhancement for content tables: click-to-sort column headers and a
// hover/focus-revealed search box that filters rows by text. The accent header and
// zebra striping are pure CSS (theme.css), so a no-JS table still reads as a styled,
// striped table; this only layers on the interactivity. Tables with fewer than two
// body rows are left alone — there's nothing to sort or filter.
(function () {
  var MIN_ROWS = 2;
  var searchSeq = 0; // page-scoped, so each table's filter box gets a unique accessible name

  // A column sorts numerically only when every non-empty cell is a clean number
  // (tolerating thousands separators, a leading currency sign, a trailing %), so a
  // "3 days" / "config ai.model" column falls back to text rather than mis-sorting.
  // KEEP IN SYNC with asNumber in islands/builtins/ApiReference.jsx — the React island
  // can't import this file (it isn't part of the esbuild bundle), so the regex is duped.
  function asNumber(text) {
    var cleaned = text.replace(/[,\s]/g, '').replace(/^[$£€]/, '').replace(/%$/, '');
    if (cleaned === '' || !/^[+-]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
    return parseFloat(cleaned);
  }

  function cellText(row, index) {
    var cell = row.cells[index];
    return cell ? (cell.textContent || '').trim() : '';
  }

  function columnIsNumeric(rows, index) {
    var sawNumber = false;
    for (var i = 0; i < rows.length; i++) {
      var text = cellText(rows[i].row, index);
      if (text === '') continue;
      if (asNumber(text) === null) return false;
      sawNumber = true;
    }
    return sawNumber;
  }

  function enhance(table, opts) {
    // `opts.sort` / `opts.filter` gate the two interactive features per page (set from
    // the .aardvark-content data attributes in init). The wrapper, horizontal scroll
    // and zebra striping below are unconditional — they're pure styling, not chrome.
    opts = opts || { sort: true, filter: true };
    if (table.classList.contains('aardvark-table-enhanced')) return;
    // Tables rendered inside a React island (e.g. the OpenAPI reference) are owned
    // and re-rendered by React — DOM-enhancing them here would fight hydration. Such
    // components provide their own sortable headers, so skip them.
    if (table.closest('[data-aardvark-island]')) return;
    var thead = table.tHead;
    var tbody = table.tBodies[0];
    if (!thead || !tbody) return;
    var headerRow = thead.rows[thead.rows.length - 1];
    var ths = headerRow ? Array.prototype.slice.call(headerRow.cells) : [];
    var bodyRows = Array.prototype.slice.call(tbody.rows);
    // Below the threshold the static CSS styling is enough — skip the chrome.
    if (!ths.length || bodyRows.length < MIN_ROWS) return;

    table.classList.add('aardvark-table-enhanced', 'aardvark-js');

    // Cache each row with its lowercased text once; content never changes, and
    // sorting only reorders these same nodes, so the cache stays valid.
    var rows = bodyRows.map(function (row) {
      return { row: row, text: (row.textContent || '').toLowerCase() };
    });

    var wrap = document.createElement('div');
    wrap.className = 'aardvark-table-wrap';
    table.parentNode.insertBefore(wrap, table);

    // The empty-state row belongs to the filter chrome; with filtering off it stays
    // null, and sortBy then appends (insertBefore(frag, null)) instead of keeping it last.
    var emptyRow = null;
    var input = null;
    var live = null;

    if (opts.filter) {
      var searchBox = document.createElement('div');
      searchBox.className = 'aardvark-table-search';
      input = document.createElement('input');
      input.type = 'search';
      input.className = 'aardvark-table-search-input';
      input.placeholder = 'Search table…';
      // Unique, meaningful accessible name: the first column header plus a page
      // sequence number, so multiple tables' filter boxes are distinguishable in a
      // screen-reader controls list (first-column headers can repeat across tables).
      searchSeq += 1;
      var firstHeader = ths[0] ? ths[0].textContent.trim() : '';
      input.setAttribute('aria-label', firstHeader ? 'Search by ' + firstHeader + ', table ' + searchSeq : 'Search table ' + searchSeq);
      searchBox.appendChild(input);

      // Empty-state row kept inside <tbody> (a full-width colspan cell) rather than a
      // sibling div: when a filter clears the table the "No matching rows" message then
      // stays within the table frame, aligned under the header, instead of below it.
      emptyRow = document.createElement('tr');
      emptyRow.className = 'aardvark-table-empty';
      var emptyCell = document.createElement('td');
      emptyCell.colSpan = ths.length;
      emptyCell.textContent = 'No matching rows';
      emptyRow.appendChild(emptyCell);
      emptyRow.hidden = true;
      tbody.appendChild(emptyRow);
      // Screen-reader feedback goes through a single shared live region in the static
      // layout (default.html). Shared (not per-table) on purpose: a region injected here
      // would be missed by some AT (notably NVDA), which only register live regions
      // present at page load. The empty row above is purely visual. Each table announces
      // on its own empty/non-empty transition (see applyFilter), forcing a fresh change
      // on the shared region so a second table reaching the empty state still announces.
      // `live` may be null on a custom template without the region — announces no-op then.
      live = document.getElementById('aardvark-live');

      wrap.appendChild(searchBox);
    }
    // The table lives in an inner scroll container so a wide table scrolls
    // horizontally within the wrapper instead of overflowing the page. Overflow must
    // NOT go on .aardvark-table-wrap itself — that's the search box's positioned
    // ancestor, and overflow there would clip the box floating above the table.
    var scroller = document.createElement('div');
    scroller.className = 'aardvark-table-scroll';
    scroller.appendChild(table);
    wrap.appendChild(scroller);

    // Zebra over the *visible* rows, in their current (possibly sorted) DOM order,
    // so the stripe pattern survives both filtering and sorting. Returns the count
    // of visible rows for the empty-state check.
    function restripe() {
      var visible = 0;
      Array.prototype.forEach.call(tbody.rows, function (tr) {
        if (tr === emptyRow || tr.hidden) return;
        tr.classList.toggle('aardvark-alt', visible % 2 === 1);
        visible++;
      });
      return visible;
    }

    if (opts.filter) {
      var wasEmpty = false; // this table's last-announced empty state — avoids per-keystroke churn
      var applyFilter = function () {
        var query = input.value.trim().toLowerCase();
        wrap.classList.toggle('aardvark-has-query', query.length > 0);
        rows.forEach(function (r) {
          r.row.hidden = query !== '' && r.text.indexOf(query) === -1;
        });
        var visible = restripe();
        var isEmpty = query !== '' && visible === 0;
        emptyRow.hidden = !isEmpty;
        // Announce only on this table's empty/non-empty transition (the per-table flag
        // avoids re-announcing every keystroke). Entering empty, clear the shared region
        // and set the message on a later tick: a same-tick re-set of identical text can be
        // coalesced away by AT, dropping the announcement when another table already left
        // "No matching rows" there. The deferred guard skips a stale set if this table has
        // since left the empty state.
        if (live && isEmpty !== wasEmpty) {
          wasEmpty = isEmpty;
          live.textContent = '';
          if (isEmpty) setTimeout(function () { if (wasEmpty) live.textContent = 'No matching rows'; }, 50);
        }
      };

      input.addEventListener('input', applyFilter);
    }

    if (opts.sort) {
      var sortIndex = -1;
      var sortDir = 0; // 0 = unsorted; toggles to 1 (ascending) / -1 (descending) on click
      var numericCols = {}; // index -> bool; a column's type is fixed once its content is, so cache it

      var sortBy = function (index) {
        if (numericCols[index] === undefined) numericCols[index] = columnIsNumeric(rows, index);
        var numeric = numericCols[index];
        sortDir = sortIndex === index && sortDir === 1 ? -1 : 1;
        sortIndex = index;

        var ordered = rows.slice().sort(function (a, b) {
          var av = cellText(a.row, index);
          var bv = cellText(b.row, index);
          if (numeric) {
            var an = asNumber(av);
            var bn = asNumber(bv);
            if (an === null && bn === null) return 0;
            if (an === null) return 1; // empties sort last regardless of direction
            if (bn === null) return -1;
            return (an - bn) * sortDir;
          }
          return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' }) * sortDir;
        });

        var frag = document.createDocumentFragment();
        ordered.forEach(function (r) { frag.appendChild(r.row); });
        tbody.insertBefore(frag, emptyRow); // keep the empty-state row last

        ths.forEach(function (th, i) {
          th.setAttribute('aria-sort', i === index ? (sortDir === 1 ? 'ascending' : 'descending') : 'none');
        });
        restripe();
      };

      // Each header becomes a real <button> (native focus + Enter/Space) inside the
      // <th>, which keeps its columnheader role and carries aria-sort for assistive tech.
      ths.forEach(function (th, index) {
        th.classList.add('aardvark-th-sortable');
        th.setAttribute('aria-sort', 'none');
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'aardvark-th-button';
        while (th.firstChild) button.appendChild(th.firstChild);
        var caret = document.createElement('span');
        caret.className = 'aardvark-th-caret';
        caret.setAttribute('aria-hidden', 'true');
        button.appendChild(caret);
        th.appendChild(button);
        button.addEventListener('click', function () { sortBy(index); });
      });
    }

    // Paint the initial zebra now — `.aardvark-js` has already suppressed the
    // static nth-child striping, so without this the table would start unstriped.
    restripe();
  }

  function init() {
    // Page-level switches live as data-* attributes on the content wrapper (set from
    // front-matter / site config in default.html); absent attribute = feature on.
    var content = document.querySelector('.aardvark-content');
    var opts = {
      sort: !content || content.getAttribute('data-aardvark-table-sort') !== 'off',
      filter: !content || content.getAttribute('data-aardvark-table-filter') !== 'off'
    };
    Array.prototype.forEach.call(document.querySelectorAll('.aardvark-content table'), function (table) {
      enhance(table, opts);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
