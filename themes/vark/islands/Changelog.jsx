/* @aardvark-island {
  "urlProps": ["entries[].changes[].url"],
  "linkProps": ["entries[].changes[].url"],
  "implements": ["Changelog@1"]
} */
import { forwardRef, useMemo } from 'react';
import { Anchor, Badge, Group, Stack, Text, Timeline, Title } from '@mantine/core';
import { collectTags, filterByActiveTags, TagBadge, TagCloudBox, useSyncedTagFilter } from '@aardvark/islands/tag-cloud';
import { FeedIcon } from './_feedIcon';
import { sanitizeHref } from '@aardvark/islands/safe-href';
// The English default of each label prop, from _ui_strings.json beside this file (named, so a
// bundle carries only the tables its islands use). The build localizes every label from the same
// table and passes a prop only when its translation differs (or the author set it), so that file
// is the one place a label's English text changes.
import { Changelog as LABELS } from './_ui_strings.json';
import './Changelog.css';

// The island behind the built-in {% changelog %} directive.
// Mantine's Timeline supplies the vertical run of bullets joined by a connecting line.
// Each timeline item is a "group": usually one change, but with the directive's
// `combineByDay` flag a group holds every change from one calendar day. A cloud of tag
// badges filters the timeline; an RSS icon links to the page's generated feed.
//
// Props (all from the directive, JSON-encoded):
//   entries      — groups, sorted newest-first and filtered/limited on the Python side:
//                  [{ date, dateDisplay, tags[], changes: [{ title, version|null,
//                  descriptionHtml, id }] }]. `id` is the change's anchor (TOC + feed
//                  target). A single-change group renders title → date + version → body;
//                  a combined day renders the date once, then each change.
//   wide         — true on a wide-layout page (mode: wide/full/uncapped): the cloud sits in
//                  a sticky right column (laid out by Changelog.css); else above the timeline.
//   showTagCloud — false when the directive's `tags=` already pre-filtered the set, so
//                  there's nothing left to filter and no cloud is drawn.
//   feedUrl      — relative URL of this changelog's RSS feed (e.g. "feed.xml"); the icon
//                  links to it. The page URL ends in `/`, so the relative href resolves.
//   tagSlugs     — optional { slug: tag } map ({% taxonomy %} only). When present, a
//                  `#tag=a,b` location hash pre-selects those filter tags on mount (and on
//                  hashchange), so leftnav/right-rail tag links deep-link a filtered view.
//                  Hash reads happen in an effect — never during render — so the SSR
//                  prerender is untouched.
//
// Each change may also carry a `url` ({% taxonomy %} only): the member article's
// permalink. The DATE renders as the permalink (standard blog practice — the whole entry
// body is already on this page, so linking the title would be a link to more of itself);
// without a url (the YAML-file {% changelog %} case) the date renders exactly as before.
// In a combineByDay group the merged day has no single member to link, so the date stays
// plain there (the RSS feed still carries every member permalink).
//
// Filtering is multi-select / any-of: with one or more tags active, a group shows if it
// carries ANY active tag; with none active, all groups show. Descriptions are rendered to
// HTML at build time (highlighted fenced code included) and injected as-is.
//
// SSR note: this is a pure render with `active` seeded empty, so the build-time prerender
// bakes the full, unfiltered timeline (with the title `id`s the TOC/feed link to) — exactly
// what the client shows on first paint. The client `hydrateRoot`s that baked markup (falling
// back to `createRoot` only when the island wasn't prerendered, as the islands runtime does), and
// the same `id`s are passed as props, so server and first client render match and anchor
// targets stay stable.
const Changelog = forwardRef(function Changelog(
  { entries = [], wide = false, showTagCloud = true, feedUrl = null, tagSlugs = null,
    // The tag cloud's heading and its Clear button.
    filterLabel = LABELS.filterLabel, clearLabel = LABELS.clearLabel,
    // The filter-empty copy.
    emptyText = LABELS.emptyText,
    // The RSS icon's accessible name + tooltip.
    rssLabel = LABELS.rssLabel },
  ref,
) {
  // The filter cloud: the union of every group's tags, in stable sorted order.
  const allTags = useMemo(() => collectTags(entries), [entries]);

  // Hash-synced filter state (the `#tag=…` deep-link/toggle/Back lifecycle) — the
  // shared hook, so Changelog and ArticleList can't drift. Without tagSlugs (a YAML
  // {% changelog %}) the hash is never touched, as before.
  const { active, toggle, clear } = useSyncedTagFilter(tagSlugs);

  const shown = useMemo(() => filterByActiveTags(entries, active), [entries, active]);

  // A clickable tag badge — used both in the cloud and inline under each entry. The
  // keyboard/ARIA behavior lives in the shared TagBadge (filter mode).
  const tagBadge = (tag, { size, variant }) => (
    <TagBadge
      key={tag}
      tag={tag}
      size={size}
      variant={variant}
      className="aardvark-changelog-tag"
      active={active.includes(tag)}
      onToggle={toggle}
    />
  );

  const versionBadge = (version) =>
    version ? (
      <Badge size="sm" radius="sm" variant="filled">
        {version}
      </Badge>
    ) : null;

  // A change sourced from a member article carries its permalink; the DATE links there
  // (standard permalink practice — the entry's full body is already on this page, so a
  // linked title would be a link to more of itself). The url is build-generated
  // (page.url), but gate it through sanitizeHref anyway — the same defense-in-depth
  // every other island applies to URLs it renders; unsafe degrades to the plain date.
  const dateContent = (dateDisplay, c) => {
    const safeUrl = c && c.url ? sanitizeHref(c.url) : undefined;
    return safeUrl ? (
      <Anchor
        href={safeUrl}
        size="sm"
        c="dimmed"
        underline="hover"
        className="aardvark-changelog-permalink"
      >
        {dateDisplay}
      </Anchor>
    ) : (
      <Text size="sm" c="dimmed">
        {dateDisplay}
      </Text>
    );
  };

  // In a COMBINED day the date is shared, so a member's permalink (when the change carries
  // one) attaches to its title instead — the only place the per-member link can live there.
  // A single-change entry keeps the plain title + date-permalink (a linked title there would
  // point at the full body already rendered right below it). Gated through sanitizeHref, the
  // same defense-in-depth as the date link; unsafe/absent → the plain title.
  const titleContent = (c) => {
    const safeUrl = c && c.url ? sanitizeHref(c.url) : undefined;
    return safeUrl ? (
      <Anchor href={safeUrl} c="inherit" underline="hover" className="aardvark-changelog-permalink">
        {c.title}
      </Anchor>
    ) : (
      c.title
    );
  };

  const body = (html) => (
    <div className="aardvark-changelog-body" dangerouslySetInnerHTML={{ __html: html || '' }} />
  );

  const cloud =
    showTagCloud && allTags.length > 0 ? (
      <TagCloudBox
        tags={allTags}
        className="aardvark-changelog-cloud"
        badgeClassName="aardvark-changelog-tag"
        title={filterLabel}
        clearLabel={clearLabel}
        active={active}
        onToggle={toggle}
        onClear={clear}
      />
    ) : null;

  const timeline =
    shown.length === 0 ? (
      <Text c="dimmed" py="md">
        {emptyText}
      </Text>
    ) : (
      <Timeline active={shown.length} bulletSize={18} lineWidth={2}>
        {shown.map((g) => (
          // Key by (date, first title) — stable per group, so filtering never remounts a
          // surviving item. An index into the filtered `shown` array would shift when the
          // visible set changes, churning React's reconciliation.
          <Timeline.Item key={`${g.date}-${g.changes[0].title}`} className="aardvark-changelog-item">
            {g.changes.length === 1 ? (
              // One change: title, then the date (the member permalink, when the change
              // carries one) with its release badge, then the body.
              <>
                <Title order={4} id={g.changes[0].id} className="aardvark-changelog-title">
                  {g.changes[0].title}
                </Title>
                <Group gap="xs" align="center" mt={4} className="aardvark-changelog-meta">
                  {dateContent(g.dateDisplay, g.changes[0])}
                  {versionBadge(g.changes[0].version)}
                </Group>
                {body(g.changes[0].descriptionHtml)}
              </>
            ) : (
              // A combined day: the date once (plain — a merged day has no single member
              // to permalink), then each change (its own title + release badge).
              <>
                <Text size="sm" c="dimmed" className="aardvark-changelog-meta">
                  {g.dateDisplay}
                </Text>
                <Stack gap="md" mt={6} className="aardvark-changelog-changes">
                  {g.changes.map((c, ci) => (
                    // Index key is safe here: a group's changes are fixed and never reordered.
                    <div key={ci} className="aardvark-changelog-change">
                      <Group gap="xs" align="center">
                        <Title order={5} id={c.id} className="aardvark-changelog-title">
                          {titleContent(c)}
                        </Title>
                        {versionBadge(c.version)}
                      </Group>
                      {body(c.descriptionHtml)}
                    </div>
                  ))}
                </Stack>
              </>
            )}
            {(g.tags || []).length > 0 && (
              <Group gap={6} mt="xs">
                {g.tags.map((tag) => tagBadge(tag, { size: 'xs', variant: 'outline' }))}
              </Group>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
    );

  // The cloud renders FIRST in the DOM in both modes (so it reads as the filter before the entries
  // it filters, and keyboard/reading order matches the stacked layout where it sits on top). Wide
  // mode pins it to the RIGHT column on the shared first row (Changelog.css), NOT source order —
  // so `twoColumn` only picks the wrapper className. With the cloud suppressed it's one column.
  const twoColumn = wide && cloud != null;
  // Build-generated ("feed.xml"), but routed through sanitizeHref like every other URL
  // rendered here — one convention, no exceptions. Relative names pass through unchanged.
  const safeFeedUrl = feedUrl ? sanitizeHref(feedUrl) : null;
  return (
    <div ref={ref} data-aardvark-changelog="">
      <FeedIcon
        href={safeFeedUrl}
        label={rssLabel}
        toolbarClassName="aardvark-changelog-toolbar"
        className="aardvark-changelog-feed"
      />
      <div className={twoColumn ? 'aardvark-changelog-wide' : 'aardvark-changelog-stacked'}>
        {/* Cloud FIRST in the DOM (both modes) so it reads as a filter BEFORE the entries it
            filters: focus order then matches the visual order on narrow (the cloud stacks on top)
            instead of relying on a CSS `order` reshuffle that left keyboard/screen-reader users
            tabbing through every entry before reaching the filter. Wide mode moves the cloud into
            the right column on the shared first row (see Changelog.css). */}
        {cloud}
        <div className="aardvark-changelog-timeline">{timeline}</div>
      </div>
    </div>
  );
});

export default Changelog;
