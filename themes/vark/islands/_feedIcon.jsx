import { ActionIcon } from '@mantine/core';
import { IconRss } from '@tabler/icons-react';

// The feed link the listing islands (Changelog, ArticleList) render, shared so the two cannot
// drift: an RSS icon — no label, just a discoverable link to the feed (top-right toolbar so it
// never collides with the timeline/grid or the cloud column). Both the accessible name
// (aria-label) and the hover tooltip (title) carry the island's already-translated rssLabel.
//
// Class names arrive as FULL literals rather than a prefix, matching TagCloudBox next door, so
// every `aardvark-<island>-toolbar` / `-feed` name stays greppable in the island that emits it.
// `href` is already sanitizeHref'd by the caller — sanitization stays at the call site, one
// convention with no exceptions — and a rejected URL arrives as null, which renders nothing.
//
// Underscore prefix = shared helper module, not a mountable island (aardvark skips `_*.jsx`
// when registering islands; it still stages the file so sibling imports resolve).
export function FeedIcon({ href, label, className, toolbarClassName }) {
  if (!href) return null;
  return (
    <div className={toolbarClassName}>
      <ActionIcon
        component="a"
        href={href}
        variant="subtle"
        radius="xl"
        className={className}
        aria-label={label}
        title={label}
      >
        <IconRss size={18} />
      </ActionIcon>
    </div>
  );
}
