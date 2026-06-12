// Announcement banner dismissal: the current banner's id is on <html> as `data-aardvark-banner`.
// Loaded synchronously in <head> (only when a banner is present) so an already-dismissed banner
// is hidden before first paint — via `data-aardvark-banner-hidden`, which theme.css keys off —
// with no flash. The × button records the dismissal. The id is a hash of the banner text, so a
// new announcement gets a new id and shows again even for visitors who dismissed the old one.
(function () {
  var el = document.documentElement;
  var id = el.getAttribute('data-aardvark-banner');
  if (!id) return;
  // Key the dismissal by the banner's id (a hash of its text), NOT a single shared slot: the
  // site-wide banner and a page's own banner then track dismissal independently, so closing
  // one never resurfaces the other. A new announcement => new id => shows again.
  var KEY = 'aardvark-banner-' + id;

  function hide() {
    el.setAttribute('data-aardvark-banner-hidden', '');
  }

  function dismissed() {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  // Run immediately, before the body paints.
  if (dismissed()) hide();

  function init() {
    var btn = document.querySelector('.aardvark-banner-close');
    if (!btn) return;
    btn.addEventListener('click', function () {
      try {
        localStorage.setItem(KEY, '1');
      } catch (e) {}
      hide();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
