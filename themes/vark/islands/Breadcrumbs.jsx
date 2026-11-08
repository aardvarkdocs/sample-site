/* @aardvark-island {"urlProps": ["items[].href"]} */
import { forwardRef } from 'react';
import { Breadcrumbs as MantineBreadcrumbs, Anchor, Text } from '@mantine/core';
import { sanitizeHref } from '@aardvark/islands/safe-href';

// The island behind the built-in {% breadcrumbs %} tag (breadcrumbs.md). The macro
// parses its `items=` param into a plain [{ label, href? }] list and passes it
// here; we build the real Mantine Breadcrumbs with an <Anchor> per linked crumb and
// a <Text> for the rest.
//
// Building the anchors here in real JSX (rather than handing <a> elements to the
// island as children) is what keeps their hrefs — Aardvark's client render runtime
// reconstructs plain child elements from tagName + innerHTML only, dropping
// attributes (the same reason the site's own breadcrumb trail builds its crumbs in JSX).
//
// The last crumb is rendered as dimmed, non-link text (it's "where you are" — the
// conventional breadcrumb terminal), unless the author explicitly gives it an href.
const Breadcrumbs = forwardRef(function Breadcrumbs(
  { items = [], separator, separatorMargin, ...rest },
  ref,
) {
  if (!items || items.length === 0) return null;
  const crumbs = items.map((item, i) => {
    const isLast = i === items.length - 1;
    // Author hrefs are sanitized (whitelist: http(s) + relative paths) like every other
    // island that renders an author href — sanitizeHref rejects javascript:/data:/…, which
    // React would otherwise pass through verbatim. A rejected href falls back to plain text.
    const safeHref = item.href ? sanitizeHref(item.href) : null;
    if (safeHref && !isLast) {
      return (
        <Anchor key={i} href={safeHref}>
          {item.label}
        </Anchor>
      );
    }
    if (safeHref) {
      // Last crumb but the author gave it an href — honor it as a link.
      return (
        <Anchor key={i} href={safeHref} aria-current="page">
          {item.label}
        </Anchor>
      );
    }
    return (
      <Text key={i} span c={isLast ? 'dimmed' : undefined} aria-current={isLast ? 'page' : undefined}>
        {item.label}
      </Text>
    );
  });
  return (
    <MantineBreadcrumbs
      ref={ref}
      separator={separator}
      separatorMargin={separatorMargin}
      {...rest}
    >
      {crumbs}
    </MantineBreadcrumbs>
  );
});

export default Breadcrumbs;
