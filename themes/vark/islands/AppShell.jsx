import { forwardRef } from 'react';
import { AppShell as MantineAppShell } from '@mantine/core';
import './AppShell.css';

// The island behind the built-in {% appshell %} tag (appshell.md). AppShell is a page-level layout
// primitive: it positions a header, navbar, aside, and footer around a main content area, sizing
// each region with the `header` / `navbar` / `aside` / `footer` config objects. Those nested
// objects (and the sub-component regions <MantineAppShell.Header>/<MantineAppShell.Navbar>/…) can't
// ride the flat component('AppShell') JSON props channel, so the assembly lives here.
//
// Region content arrives as already-rendered Markdown strings (header/navbar/aside/footer
// props); the block body is the <MantineAppShell.Main> content. A region is only rendered when its
// content is provided, and its size config is only added when the region exists — so a
// header-less shell doesn't reserve header height. Every other prop ({...rest}: padding,
// layout, withBorder, zIndex, …) flows straight to Mantine <MantineAppShell>. forwardRef carries an
// optional attr={...} to the root.
//
// `withBorder` defaults to true in Mantine; we don't override it. SSR-safe: pure composition.
//
// Containment: Mantine AppShell positions its header/navbar/aside/footer with `position: fixed`
// against the VIEWPORT — it's built to be the page root. Dropped into a docs page (which has its
// own header + sidebar) it would escape its content slot, cover the site chrome, and stay there
// on scroll with no way to dismiss it. So we render it inside a bounded `.aardvark-appshell-demo`
// frame whose CSS `transform` re-roots those fixed regions to the frame (and clips them to a set
// height) — a self-contained preview that can never take over the page. `height` sizes the frame;
// the forwarded ref + attr={} land on the frame (the island's root DOM node). See the co-located CSS.
//
// dangerouslySetInnerHTML: the region strings are RAW author-supplied template params injected
// as-is — they are NOT run through the Markdown renderer (appshell.md passes them straight to
// these props), same as the Splitter island's first/second. Same trust level as the page itself.
// Only the block body (Main) is Markdown — it comes through as React children, not raw HTML.
const AppShell = forwardRef(function AppShell(
  {
    header,
    navbar,
    aside,
    footer,
    headerHeight,
    navbarWidth,
    asideWidth,
    footerHeight,
    height,
    children,
    ...rest
  },
  ref,
) {
  const config = {};
  if (header) config.header = { height: headerHeight ?? 60 };
  if (navbar) {
    config.navbar = { width: navbarWidth ?? 250, breakpoint: 'sm' };
  }
  if (aside) {
    config.aside = { width: asideWidth ?? 250, breakpoint: 'md' };
  }
  if (footer) config.footer = { height: footerHeight ?? 60 };

  const frameStyle =
    height == null ? undefined : { height: typeof height === 'number' ? `${height}px` : height };

  return (
    <div ref={ref} className="aardvark-appshell-demo" style={frameStyle}>
      <MantineAppShell {...config} {...rest}>
        {header && (
          <MantineAppShell.Header p="sm" dangerouslySetInnerHTML={{ __html: header }} />
        )}
        {navbar && (
          <MantineAppShell.Navbar p="sm" dangerouslySetInnerHTML={{ __html: navbar }} />
        )}
        {aside && (
          <MantineAppShell.Aside p="sm" dangerouslySetInnerHTML={{ __html: aside }} />
        )}
        <MantineAppShell.Main>{children}</MantineAppShell.Main>
        {footer && (
          <MantineAppShell.Footer p="sm" dangerouslySetInnerHTML={{ __html: footer }} />
        )}
      </MantineAppShell>
    </div>
  );
});

export default AppShell;
