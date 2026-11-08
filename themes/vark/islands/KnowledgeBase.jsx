/* @aardvark-island {
  "urlProps": ["featured[].href", "articles[].href"],
  "linkProps": ["featured[].href", "articles[].href"],
  "implements": ["KnowledgeBase@1"]
} */
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import {
  Anchor,
  Badge,
  Button,
  Card as MantineCard,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  dispatchTaxonomyFilterChange,
  filterByActiveTags,
  samePath,
  TagBadge,
  tagsFromHash,
  useTagFilter,
} from '@aardvark/islands/tag-cloud';
import { classifyIcon, LazyTablerIcon } from '@aardvark/islands/tabler-icons';
import { sanitizeHref } from '@aardvark/islands/safe-href';
// The English default of each label prop (the banner's, the headings, the empty and count text),
// from _ui_strings.json beside this file (named, so a bundle carries only the tables its islands
// use). The build localizes every label from the same table and passes a prop only when its
// translation differs, so that file is the one place a label's English text changes.
import { KnowledgeBase as LABELS } from './_ui_strings.json';
// Every card here (category buttons, featured questions, the article list) wears the
// {% card %} island's chrome — data-aardvark-card + a sheen span — so the KB gets the
// same hover lift/flash as the rest of the site's cards. Import Card.css directly so
// those rules bundle even on a site that never renders a {% card %}.
import './Card.css';
import './KnowledgeBase.css';

// The knowledge-base landing island: an optional hero banner plus three stacked
// sections sharing one selected-tag state. The selection FILTERS the article list
// only; the category cards reflect it (aria-pressed) but stay fully visible as the
// navigation surface, and the featured list is curated — deliberately unfiltered,
// like a support page's pinned questions.
//   hero       — askMode ('assistant' | 'search', set by the engine from the site
//                config) renders a banner with an "ask your question" field: submit
//                hands the question to the AI assistant (auto-send) or opens the
//                search modal pre-filled. bannerTitle/bannerText/askPlaceholder/
//                askLabel localize it; askMode null (no answer surface, or
//                banner=false) drops the section entirely.
//   featured   — [{ title, href, excerpt, tags }]: the "Top questions", a two-column grid
//                of aardvark-styled cards; each entry's tag badges (filter mode, TagBadge)
//                activate that tag in the article list below AND push a `#tag=<slug>`
//                history entry so back returns.
//   categories — [{ tag, slug, count, icon? }]: a grid of real <button> cards (Mantine
//                Card component="button", wearing Card.css's data-aardvark-card chrome —
//                hover lift + sheen) with aria-pressed and the article count as a small
//                badge; clicking is set-or-clear — a category becomes THE single active
//                tag, and clicking the active one clears the filter. `icon` is an optional
//                Tabler name, lazily loaded via iconCdn (LazyTablerIcon reserves an empty
//                box under SSR; the client fills it). An empty list hides the section.
//   articles   — [{ title, href, excerpt, tags, dateDisplay }]: a stack of the same
//                article cards, filtered any-of by the active tags. While a filter is
//                active the section heading NAMES the active tag(s) (replacing allLabel),
//                a role="status" count rides alongside, and a "Show all" button
//                (showAllLabel) clears — the filter is never a silent state. emptyText
//                shows when nothing matches.
//
// Hash protocol (shared with ArticleList/Changelog): `#tag=<slug>[,<slug>…]`, parsed via
// tagsFromHash + the tagSlugs ({ slug: tag }) map in a mount effect — never during render.
// Tag selections push `#tag=<slug>` (pushState, so back un-filters); clearing strips the
// hash via replaceState. hashchange AND popstate both re-apply, so history traversal
// restores the filter — including back to the unfiltered (hashless) state. An unrelated
// in-page anchor hash never clobbers the selection.
//
// SSR note: `active` seeds empty (useTagFilter), so the build-time prerender bakes all
// three sections unfiltered — identical to the client's first paint.

// "3 articles" / "1 article" — the category-card count line and the filtered status line.
// The singular/plural nouns are parameterized (articleLabel/articlesLabel props) so a
// translated page localizes the count like every other KB label. Exported for unit tests.
export function articleCountLabel(count, one = LABELS.articleLabel, other = LABELS.articlesLabel) {
  return `${count} ${count === 1 ? one : other}`;
}

const KnowledgeBase = forwardRef(function KnowledgeBase(
  {
    featured = [],
    categories = [],
    articles = [],
    tagSlugs = null,
    iconCdn = null,
    askMode = null,
    bannerTitle = LABELS.bannerTitle,
    bannerText = LABELS.bannerText,
    askPlaceholder = LABELS.askPlaceholder,
    askLabel = LABELS.askLabel,
    topLabel = LABELS.topLabel,
    categoriesLabel = LABELS.categoriesLabel,
    allLabel = LABELS.allLabel,
    showAllLabel = LABELS.showAllLabel,
    emptyText = LABELS.emptyText,
    articleLabel = LABELS.articleLabel,
    articlesLabel = LABELS.articlesLabel,
    ...rest
  },
  ref,
) {
  const { active, setActive } = useTagFilter();
  // The "All articles" section — the scroll target for genuine `#tag=` navigations.
  const articlesRef = useRef(null);
  // Set true by applyActive whenever the filter changes to a non-empty set; the
  // post-commit effect below reads + clears it to scroll AFTER the filtered list has
  // rendered (see the note there).
  const scrollAfterFilter = useRef(false);
  // Synchronous mirror of `active` (the useSyncedTagFilter pattern): selectTag's
  // set-or-clear decision must read the value the PREVIOUS click wrote, not the
  // render closure — two rapid clicks on the active category before a re-render
  // would otherwise re-select instead of clearing.
  const activeRef = useRef([]);
  // One-shot guard: when selectTag switches to an orphan (unslugged) tag it strips a
  // stale `#tag=` hash and fires a synthetic hashchange for hash-driven subscribers —
  // but our OWN apply() listener must not then re-derive active=[] from the now-empty
  // hash and revert the click. Set right before that dispatch, consumed by the next
  // apply() (dispatchEvent is synchronous, so nothing can interleave).
  const skipNextHashApply = useRef(false);
  // The ONE place the filter changes — every trigger (category card, tag badge,
  // sidebar/rail link, inline link, deep link, history) routes through here. When the
  // filter becomes non-empty, arm the scroll: showing the filtered list is the single
  // uniform response to applying a `#tag=` filter from any context. Clearing (next
  // empty) never scrolls. A no-op re-apply of the same tags doesn't re-arm.
  const applyActive = (next) => {
    const cur = activeRef.current;
    const changed = next.length !== cur.length || next.some((t, i) => t !== cur[i]);
    activeRef.current = next;
    if (changed && next.length > 0) scrollAfterFilter.current = true;
    setActive(next);
  };
  // The hero banner's ask field (uncontrolled — the value only matters on submit).
  const askRef = useRef(null);

  // Hand the typed question to whichever answer surface the site has: the AI
  // assistant (`aardvark-ai-ask`, the same event the Search modal's "Ask AI" row
  // fires — an in-page gesture, so auto-send is fine) or the search modal, opened
  // pre-filled (`aardvark-search-open`). The engine only sets askMode when the
  // matching island is on the page, so the event always has a listener.
  const submitAsk = (ev) => {
    ev.preventDefault();
    const q = (askRef.current?.value || '').trim();
    if (!q) return;
    if (askMode === 'assistant') {
      window.dispatchEvent(
        new CustomEvent('aardvark-ai-ask', {
          detail: { prompt: q, send: true, entry: { kind: 'kb', query: q } },
        }),
      );
    } else {
      window.dispatchEvent(new CustomEvent('aardvark-search-open', { detail: { query: q } }));
    }
  };

  // Invert { slug: tag } once so clicks can write slugs into the hash (Python owns slugging).
  const slugForTag = useMemo(() => {
    // Null-proto: an author tag named "constructor"/"__proto__" must not resolve to an
    // inherited Object.prototype member.
    const map = Object.create(null);
    if (tagSlugs) for (const [slug, tag] of Object.entries(tagSlugs)) map[tag] = slug;
    return map;
  }, [tagSlugs]);

  // Clear the filter outright: the articles heading's "Show all" affordance, and the
  // clear half of selectTag's set-or-clear (replaceState strips the hash).
  const clearFilter = () => {
    applyActive([]);
    if (typeof window === 'undefined') return;
    // Strip ONLY a `#tag=` filter hash — an unrelated in-page anchor the reader
    // navigated to (the hash listener keeps the filter active across such anchors) is
    // preserved, so "Show all" doesn't erase their heading deep link.
    const hash = window.location.hash;
    const keep = hash && !hash.startsWith('#tag=') ? hash : '';
    window.history.replaceState(null, '', window.location.pathname + window.location.search + keep);
    // The dedicated event carries the authoritative empty selection even when Clear
    // preserved an unrelated heading hash. Keep the synthetic hashchange as well to
    // preserve existing cross-island sync for authoritative `#tag=` / empty hashes.
    dispatchTaxonomyFilterChange([]);
    window.dispatchEvent(new Event('hashchange'));
  };

  // Set-or-clear single-tag selection, shared by the category cards and the featured/article
  // tag badges: selecting a tag makes it THE active filter (pushState so back un-filters);
  // re-selecting the only active tag clears.
  const selectTag = (tag) => {
    const cur = activeRef.current; // NOT the render closure — see applyActive
    if (cur.length === 1 && cur[0] === tag) {
      clearFilter();
      return;
    }
    applyActive([tag]);
    if (typeof window === 'undefined') return;
    const slug = slugForTag[tag];
    // Only touch the hash — and only then fire the synthetic hashchange — when the tag has
    // a slug. If it doesn't (a tagFilter-scoped KB, or a featured/articles tag absent from
    // the site-wide tagSlugs map), firing hashchange without changing the hash would make
    // the mount effect re-derive `active` from the UNCHANGED hash and revert the
    // applyActive([tag]) above — the click would appear to do nothing. The in-memory filter
    // still applies; it just isn't reflected in a (missing) `#tag=` deep link.
    if (slug) {
      window.history.pushState(null, '', `#tag=${slug}`);
      dispatchTaxonomyFilterChange([slug]);
      window.dispatchEvent(new Event('hashchange')); // see clearFilter
    } else {
      // The orphan tag has no slug, so it can't be written to the hash — but a STALE
      // `#tag=` from a PRIOR slugged selection would now misrepresent the active filter:
      // reload / copy-share / Back-Forward would restore the OLD tag, and nav.js could
      // keep highlighting it. Strip that `#tag=` hash (the whole hash IS the tag filter
      // here, so there's no in-page anchor to preserve, unlike clearFilter) WITHOUT
      // touching `active` — the orphan filter stays applied in memory. The dedicated
      // event drops nav.js's stale highlight; the guarded synthetic hashchange notifies
      // hash-driven subscribers without letting our own apply() revert the orphan click.
      if (window.location.hash.startsWith('#tag=')) {
        skipNextHashApply.current = true;
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        );
        dispatchTaxonomyFilterChange([]);
        window.dispatchEvent(new Event('hashchange'));
      } else {
        // An orphan cannot correspond to a sidebar tag link. Clear any prior highlight
        // explicitly even when the current URL is an unrelated heading hash (which the
        // hash-derived nav synchronizer intentionally treats as non-authoritative).
        dispatchTaxonomyFilterChange([]);
      }
    }
  };

  const scrollToArticles = () => {
    const el = articlesRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.scrollIntoView({ block: 'start' }); // instant
      return;
    }
    const before = window.scrollY;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Some environments (a browser/OS "reduce motion" or smooth-scroll off, some
    // embedded webviews) silently no-op a smooth scroll. If the viewport hasn't begun
    // moving shortly after, force an instant scroll so the list is shown regardless —
    // a real smooth scroll has moved well past this threshold by now.
    window.setTimeout(() => {
      // Bail if the reader cleared the filter within the 250 ms window: the list has
      // collapsed back and a fallback scroll would be a jarring snap to nothing. Only
      // finish the scroll while a filter is still active (what armed this in the first
      // place).
      if (
        activeRef.current.length > 0 &&
        articlesRef.current &&
        Math.abs(window.scrollY - before) < 4
      ) {
        articlesRef.current.scrollIntoView({ block: 'start' });
      }
    }, 250);
  };
  // Scroll AFTER the filtered list commits, not in the event handler: a
  // scrollIntoView({smooth}) fired in the same task as setActive is cancelled at
  // ~zero progress by the immediate layout collapse (a 27-card list shrinking to 3)
  // — empirically, the viewport never moved. This post-commit effect scrolls against
  // settled layout when applyActive armed the flag.
  useEffect(() => {
    if (!scrollAfterFilter.current) return;
    scrollAfterFilter.current = false;
    scrollToArticles();
  }, [active]);

  useEffect(() => {
    if (!tagSlugs) return undefined;
    // ONE uniform rule, no per-trigger special cases: applying a `#tag=` filter shows
    // the filtered article list (applyActive arms the post-commit scroll whenever the
    // active set CHANGES to non-empty) — whether it arrived via a sidebar/rail link,
    // a category card, an inline link, a deep link, or history traversal. The only
    // extra listener handles the no-event case: re-clicking a `#tag=` anchor whose
    // hash is ALREADY current navigates nowhere (no hashchange fires), but the reader
    // still asked to see the list — scroll directly. It watches the whole document,
    // so every `#tag=` link behaves identically regardless of where it lives.
    const onClick = (ev) => {
      const a =
        ev.target && ev.target.closest ? ev.target.closest('a[href*="#tag="]') : null;
      // samePath ignores a trailing-slash mismatch (`/support` href vs `/support/` page), so a
      // re-click still scrolls on hosts that omit the trailing slash — same as nav.js.
      if (!a || !samePath(a.pathname, window.location.pathname)) return;
      if (a.hash === window.location.hash) scrollToArticles();
    };
    const apply = () => {
      if (skipNextHashApply.current) {
        // One-shot: selectTag just stripped a stale `#tag=` hash for an orphan tag and
        // notified hash-driven subscribers. Re-deriving `active` from the now-empty hash
        // would revert that click, so consume the guard and leave state untouched.
        skipNextHashApply.current = false;
        return;
      }
      const hash = window.location.hash;
      if (hash && !hash.startsWith('#tag=')) return;
      // tagsFromHash only resolves slugs present in the taxonomy's slug map, so a
      // phantom slug can't activate anything. A REAL tag absent from this payload
      // (a tagFilter=-scoped KB) still activates and shows the honest empty state —
      // the same contract as Changelog/ArticleList — instead of a leftnav/rail link
      // silently doing nothing. CLAMP to the first tag: the KB category filter is
      // single-select (selectTag only ever sets [tag], and category cards read
      // aria-pressed as "this category IS the active tag"), but tagsFromHash returns
      // several for a `#tag=a,b` hash (crafted, or reached via history / an external
      // link) — a multi-tag any-of state isn't a shape this component represents.
      applyActive(tagsFromHash(hash, tagSlugs).slice(0, 1));
    };
    apply();
    window.addEventListener('hashchange', apply);
    window.addEventListener('popstate', apply);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('hashchange', apply);
      window.removeEventListener('popstate', apply);
      document.removeEventListener('click', onClick, true);
    };
  }, [tagSlugs, setActive]);

  const shown = useMemo(() => filterByActiveTags(articles, active), [articles, active]);

  const tagRow = (tags) =>
    (tags || []).length > 0 ? (
      <Group gap={6} mt={4} className="aardvark-kb-tags">
        {tags.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            size="xs"
            variant="outline"
            className="aardvark-kb-tag"
            active={active.includes(tag)}
            onToggle={selectTag}
          />
        ))}
      </Group>
    ) : null;

  // One article entry as an aardvark-styled card (featured and the flat list share it).
  // The title anchor is the card's single stretched link (aardvark-card-link ::after from
  // Card.css); the tag badges ride above the overlay inside .aardvark-card-content. An
  // unsafe href degrades to plain text (never a javascript:/data: anchor — React does not
  // block those) and the card stays inert.
  const entryCard = (a, extraClass) => {
    const safe = sanitizeHref(a.href);
    return (
      // Key by permalink (title fallback) — stable across filtering, so a surviving
      // card never remounts.
      <MantineCard
        key={a.href || a.title}
        withBorder
        radius="md"
        padding="lg"
        className={extraClass}
        data-aardvark-card=""
        data-clickable={safe ? '' : undefined}
      >
        <span className="aardvark-card-sheen" aria-hidden="true" />
        <Group gap="xs" align="baseline" className="aardvark-kb-article-head">
          {safe ? (
            <Anchor href={safe} className="aardvark-kb-article-title aardvark-card-link">
              {a.title}
            </Anchor>
          ) : (
            <Text component="span" fw={600} className="aardvark-kb-article-title">
              {a.title}
            </Text>
          )}
          {a.dateDisplay && (
            <Text size="xs" c="dimmed" className="aardvark-kb-article-date">
              {a.dateDisplay}
            </Text>
          )}
        </Group>
        {a.excerpt && (
          <Text size="sm" c="dimmed" className="aardvark-kb-excerpt">
            {a.excerpt}
          </Text>
        )}
        <div className="aardvark-card-content">{tagRow(a.tags)}</div>
      </MantineCard>
    );
  };

  return (
    <div ref={ref} {...rest} data-aardvark-kb="">
      {askMode && (
        <section className="aardvark-kb-hero">
          <Title order={2} className="aardvark-kb-hero-title">
            {bannerTitle}
          </Title>
          {bannerText && (
            <Text className="aardvark-kb-hero-text" size="sm">
              {bannerText}
            </Text>
          )}
          <form className="aardvark-kb-hero-form" onSubmit={submitAsk}>
            <TextInput
              ref={askRef}
              type="text"
              name="question"
              size="md"
              radius="xl"
              className="aardvark-kb-hero-input"
              placeholder={askPlaceholder}
              aria-label={askPlaceholder}
            />
            {/* variant="white": white surface + accent text — the home hero's on-violet
                button treatment, legible on the gradient in both schemes. */}
            <Button
              type="submit"
              size="md"
              radius="xl"
              variant="white"
              className="aardvark-kb-hero-submit"
            >
              {askLabel}
            </Button>
          </form>
        </section>
      )}

      {featured.length > 0 && (
        <section className="aardvark-kb-featured">
          <Title order={2} className="aardvark-kb-heading">
            {topLabel}
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className="aardvark-kb-featured-grid">
            {featured.map((f) => entryCard(f, 'aardvark-kb-featured-card'))}
          </SimpleGrid>
        </section>
      )}

      {categories.length > 0 && (
        <section className="aardvark-kb-categories">
          <Title order={2} className="aardvark-kb-heading">
            {categoriesLabel}
          </Title>
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
            {categories.map((c) => (
              // A real <button> (not a linky div) wearing the Aardvark card chrome:
              // toggling a filter is an in-page action, aria-pressed announces its state,
              // and Card.css's data-aardvark-card hover (lift + sheen) makes it feel like
              // every other card on the site.
              <MantineCard
                key={c.slug || c.tag}
                component="button"
                type="button"
                withBorder
                radius="md"
                padding="lg"
                className="aardvark-kb-category"
                data-aardvark-card=""
                data-clickable=""
                aria-pressed={active.includes(c.tag)}
                data-active={active.includes(c.tag) ? '' : undefined}
                onClick={() => selectTag(c.tag)}
              >
                <span className="aardvark-card-sheen" aria-hidden="true" />
                {c.icon && classifyIcon(c.icon) === 'tabler' && (
                  <LazyTablerIcon
                    name={c.icon}
                    iconCdn={iconCdn || undefined}
                    className="aardvark-kb-category-icon"
                  />
                )}
                {/* component="span": this Card is a real <button>, whose content model is
                    phrasing content — Text (default <p>) and Badge (default <div>) would be
                    reparented OUT of the button by the HTML parser, desyncing SSR from
                    hydration. As spans they're valid inside the button and, as flex-column
                    children of the Card, still stack exactly the same. */}
                <Text component="span" fw={600} className="aardvark-kb-category-label">
                  {c.tag}
                </Text>
                {c.count != null && (
                  // The article count as a small badge (not parenthetical/dimmed prose).
                  <Badge
                    component="span"
                    size="sm"
                    variant="light"
                    radius="sm"
                    className="aardvark-kb-category-count"
                  >
                    {articleCountLabel(c.count, articleLabel, articlesLabel)}
                  </Badge>
                )}
              </MantineCard>
            ))}
          </SimpleGrid>
        </section>
      )}

      <section className="aardvark-kb-articles" ref={articlesRef}>
        {/* While a filter is active the heading NAMES it (the active tag(s) replace
            "All articles"), the count rides alongside as the AT status line, and a
            "Show all" affordance clears — so a leftnav/category filter is never a
            silent state the reader has to infer from the cards' badges. */}
        <Group gap="sm" align="baseline" className="aardvark-kb-articles-head">
          <Title order={2} className="aardvark-kb-heading">
            {active.length > 0 ? active.join(' · ') : allLabel}
          </Title>
          {active.length > 0 && (
            <>
              {/* Announce the filtered result count to AT without stealing focus. */}
              <Text role="status" size="sm" c="dimmed" className="aardvark-kb-status">
                {articleCountLabel(shown.length, articleLabel, articlesLabel)}
              </Text>
              <Anchor
                component="button"
                type="button"
                size="sm"
                className="aardvark-kb-clear"
                onClick={clearFilter}
              >
                {showAllLabel}
              </Anchor>
            </>
          )}
        </Group>
        {shown.length === 0 ? (
          <Text c="dimmed" py="md" className="aardvark-kb-empty">
            {emptyText}
          </Text>
        ) : (
          <Stack gap="md" className="aardvark-kb-list">
            {shown.map((a) => entryCard(a, 'aardvark-kb-article'))}
          </Stack>
        )}
      </section>
    </div>
  );
});

export default KnowledgeBase;
