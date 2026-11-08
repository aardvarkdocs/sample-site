/* @aardvark-island {
  "urlProps": ["articles[].href", "articles[].image", "articles[].authorAvatar"],
  "imageProps": ["articles[].image", "articles[].authorAvatar"],
  "linkProps": ["articles[].href"],
  "implements": ["ArticleList@1"]
} */
import { forwardRef, useMemo } from 'react';
import { SimpleGrid, Text } from '@mantine/core';
import { collectTags, filterByActiveTags, TagCloudBox, useSyncedTagFilter } from '@aardvark/islands/tag-cloud';
import { FeedIcon } from './_feedIcon';
import { sanitizeHref } from '@aardvark/islands/safe-href';
import { resolveCols } from './_colsLadder';
import ArticleCard from './ArticleCard';
// The English default of each label prop, from _ui_strings.json beside this file (named, so a
// bundle carries only the tables its islands use). The build localizes every label from the same
// table and passes a prop only when its translation differs (or the author set it), so that file
// is the one place a label's English text changes.
import { ArticleList as LABELS } from './_ui_strings.json';
import './ArticleList.css';

// The taxonomy article listing: a responsive grid of ArticleCards with a clickable
// tag-filter cloud, mirroring Changelog's cloud/layout conventions (same shared @aardvark/islands/tag-cloud
// building blocks, same wide/stacked recipe under new class names).
//
// Props (from the directive, JSON-encoded):
//   articles     — [{ title, href, description, image, badge, badgeColor, authorName,
//                  authorAvatar, date, dateDisplay, tags }], pre-sorted in Python. Each is
//                  spread straight into an <ArticleCard variant={cardVariant} />.
//   cardVariant  — the ArticleCard layout for every card in the grid.
//   cols         — a number or Mantine responsive object. A plain number is the DESKTOP count
//                  and steps down on narrow screens; the rungs and the no-cols default come
//                  from the shared _colsLadder helper, the same one CardGrid uses.
//   showTagCloud — false when the directive pre-filtered by tags=, so there's nothing left
//                  to filter and no cloud is drawn.
//   tagSlugs     — optional { slug: tag } map, built at build time from the site taxonomy
//                  so JS never re-implements slugging. When present, a `#tag=a,b` hash
//                  deep-links a pre-filtered view (applied in a mount effect + on
//                  hashchange, never during render), and every filter toggle is reflected
//                  back into the hash via history.replaceState (clear -> the hash is
//                  stripped) so a filtered view is shareable.
//   feedUrl      — relative URL of this listing's RSS feed; renders the same top-right
//                  toolbar icon as Changelog.
//   emptyText    — shown (dimmed) when the active filter matches nothing.
//   wide         — true on a wide-layout page: the cloud sits in a sticky right column;
//                  otherwise it stacks above the grid.
//
// Filtering is multi-select / any-of, exactly like Changelog: with tags active, an article
// shows if it carries ANY active tag; with none active, all show.
//
// SSR note: `active` seeds empty (useTagFilter), so the build-time prerender bakes the
// full, unfiltered grid — identical to the client's first paint. All window/history access
// lives in the mount effect and click handlers.

const ArticleList = forwardRef(function ArticleList(
  {
    articles = [],
    cardVariant = 'horizontal',
    cols = null,
    showTagCloud = true,
    tagSlugs = null,
    feedUrl = null,
    emptyText = LABELS.emptyText,
    // The tag cloud's heading and its Clear button.
    filterLabel = LABELS.filterLabel,
    clearLabel = LABELS.clearLabel,
    // The RSS icon's accessible name + tooltip.
    rssLabel = LABELS.rssLabel,
    wide = false,
    ...rest
  },
  ref,
) {
  const allTags = useMemo(() => collectTags(articles), [articles]);
  // Hash-synced filter state (the `#tag=…` deep-link/toggle/Back lifecycle) — the
  // shared hook, so ArticleList and Changelog can't drift.
  const { active, toggle: toggleTag, clear: clearTags } = useSyncedTagFilter(tagSlugs);

  const shown = useMemo(() => filterByActiveTags(articles, active), [articles, active]);

  const cloud =
    showTagCloud && allTags.length > 0 ? (
      <TagCloudBox
        tags={allTags}
        className="aardvark-articlelist-cloud"
        badgeClassName="aardvark-articlelist-tag"
        title={filterLabel}
        clearLabel={clearLabel}
        active={active}
        onToggle={toggleTag}
        onClear={clearTags}
      />
    ) : null;

  const grid =
    shown.length === 0 ? (
      <Text c="dimmed" py="md" className="aardvark-articlelist-empty">
        {emptyText}
      </Text>
    ) : (
      <SimpleGrid cols={resolveCols(cols)} spacing="lg" className="aardvark-articlelist-grid">
        {shown.map((a) => (
          // Key by permalink (title fallback) — stable across filtering, so a surviving card
          // never remounts; an index into the filtered array would shift.
          <ArticleCard key={a.href || a.title} variant={cardVariant} {...a} />
        ))}
      </SimpleGrid>
    );

  // The cloud stays first in source in both modes. Wide CSS pins the grid/cloud to left/right
  // columns on the same row; stacked/mobile layouts keep the natural filter-before-results flow.
  const twoColumn = wide && cloud != null;
  // Build-generated ("feed.xml"), but routed through sanitizeHref like every other URL
  // this island renders — one convention, no exceptions.
  const safeFeedUrl = feedUrl ? sanitizeHref(feedUrl) : null;
  return (
    <div ref={ref} {...rest} data-aardvark-articlelist="">
      <FeedIcon
        href={safeFeedUrl}
        label={rssLabel}
        toolbarClassName="aardvark-articlelist-toolbar"
        className="aardvark-articlelist-feed"
      />
      <div className={twoColumn ? 'aardvark-articlelist-wide' : 'aardvark-articlelist-stacked'}>
        {/* Cloud FIRST in the DOM (both modes) so the filter precedes the results it filters:
            focus order matches the visual order on narrow (the cloud stacks on top) instead of a
            CSS `order` reshuffle that left keyboard/screen-reader users tabbing through every card
            before the filter. Wide mode moves the cloud to the right column on the shared first
            row (see ArticleList.css). */}
        {cloud}
        <div className="aardvark-articlelist-main">{grid}</div>
      </div>
    </div>
  );
});

export default ArticleList;
