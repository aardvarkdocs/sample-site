---
title: "Taxonomy"
description: "The built-in taxonomy tag — turn tagged member pages into a changelog timeline, a knowledge-base grid, or a blog article list, with tag filtering, per-page tag navigation, and an RSS feed for changelog and article listings. Front-matter schema, options, and live examples."
---

# Taxonomy

A **built-in** tag that renders a listing of **member pages** — real pages in your content
tree that opt into a named taxonomy through front matter — in one of three shapes: a
**changelog** timeline, a **knowledge base** of categorized questions, or a **blog**-style
article list. Because the members are ordinary pages, every entry has its own URL and its
own Markdown body — and, unless it opts out with `noindex: true`, its own place in search
and `llms.txt`. This site's **changelog** entries do opt out: they're stealthed
(`nav: false` + `noindex: true`), and the changelog listing folds their body text into its
own search record, so it stays findable there. That fold is specific to the changelog type —
**blog** and **knowledge-base** members are ordinarily their own search landings, so a
listing there carries only their teaser; marking such a member `noindex: true` drops its
body from search rather than recovering it through the listing. The listing is assembled at
build time from their front matter. This site uses all three: the
[Changelog](/changelog/) tab, the [Support](/support/) knowledge base, and the
[Blog](/blog/) are each one `{% raw %}{% taxonomy %}{% endraw %}` tag over a folder of
member articles. Changelog and article listings also publish an **RSS feed** (pass
`feed=false` to opt out); knowledge-base listings do not.

## Usage

Two halves: member pages declare their membership in front matter, and one listing page
renders the tag. A member joins a taxonomy with a `taxonomy:` entry:

```yaml
---
title: Faster dev-loop rebuilds
date: 2026-05-28 09:15
taxonomy:
  - name: changes
    tags: [build, performance]
---
```

and the listing page — the one page marked `listing: true` — renders all members:

{% raw %}
```aardvark
{% taxonomy name="changes" type="changelog" wide %}
```
{% endraw %}

The member's **body** is the entry's content — for `type="changelog"` it renders inline in
the timeline exactly as `{% raw %}{% changelog %}{% endraw %}` renders a YAML entry's
description, so a data-file changelog can convert to member articles with an identical
rendered result. (Island components in a member body are suppressed in the inline listing
view — they render only on the member's own page.) Relative links in a member body are
rebased onto the member's own URL, so they resolve the same inline as on the article page;
on a [versioned](/versioning/) site, a root-absolute link in an older version's listing is
rewritten to that version's equivalent page when one exists — the same in-version rule the
member's own page follows — so the inline view never bounces a reader to the latest docs.

## Front matter

### Member pages

Each entry in a page's `taxonomy:` list joins one taxonomy. `name` is required; everything
else is optional:

| Key | Effect |
| --- | --- |
| `name` | The taxonomy this page joins (**required**). `taxonomyName` is accepted as an alias — prefer `name`. |
| `tags` | Labels for this entry — a list (`[a, b]`) or a comma-separated string (`"a, b"`). These drive the filter cloud, KB categories, and `tagFilter`, and are listed at the bottom of the member's own page as links into the listing's filtered view. |
| `listing` | `true` marks this page as the taxonomy's canonical listing page (the one carrying the `{% raw %}{% taxonomy %}{% endraw %}` tag). |
| `leftnav` | `true` shows a taxonomy tag navigation in this page's left sidebar (a non-clickable section heading over the tag links). `dates` instead shows a **month-grouped member archive** — the articles themselves, newest first, under "June 2026"-style headings — replacing the menu's alphabetical entries (this site's [Blog](/blog/) does this). |
| `articleCount` | `true` adds per-tag article counts to those labels (as small badge pills). |
| `tagCloud` | `true` shows the taxonomy's tag cloud in this page's right rail. Not available on wide/full-mode pages (they have no right rail). |
| `featured` | `true` flags a knowledge-base entry as a **top question**, surfaced above the categories. `topQuestion` is accepted as an alias. |
| `authorName` | Blog byline shown on the article card **and at the top of the article page itself** (avatar + name + publish date, tucked under the title — the page's bottom date line then keeps only "Last modified"). A **dated** member without an author still gets the date-only byline — this site's changelog entries show their publish date under the title this way. |
| `authorAvatar` | Avatar image for the byline. Omit it and both bylines fall back to the author's initials. |
| `badgeText` | A badge label on the article card. |

Several **top-level** front-matter keys also feed the entry: `title` (the entry headline),
`date` (`YYYY-MM-DD`, optionally with a time — `2026-05-28 16:30` — the full timestamp
drives the newest-first sort), `description` (the card / KB excerpt text), `version` (a
changelog release badge beside the date), and `image` / `imageAlt` (a blog card cover
image and its alt text — omit `imageAlt` when the cover is decorative).

### The listing page

Give exactly one page `listing: true` for the taxonomy and put the tag in its body. A
changelog- or blog-style listing usually wants a wide layout (`mode: full` or
`mode: wide`) so it can use `wide`.

## Options

| Attribute | Effect |
| --- | --- |
| `name="…"` | The taxonomy to render (**required**) — matches the members' `name`. |
| `type="…"` | The listing shape: `changelog` (timeline), `kb` (knowledge base), or `articles` (blog-style cards; `blog` is an alias). |
| `tagFilter="…"` | Show only members carrying this tag (case-insensitive). A comma-separated value matches members carrying **any** listed tag — unless the whole value exactly matches a single tag whose own name contains a comma (`tagFilter="Plans, seats & hosting"`), which wins. |
| `cardVariant="…"` | Card look for article listings: `horizontal`, `footer` (alias `withfooter`), `background` (alias `image`), `vertical`, or `plain` (alias `grid`). |
| `wide` | Lay the tag cloud out in a sticky right-hand column. **Requires a wide layout mode** — `mode: wide`, `full`, or `uncapped` in the page front matter (see [Modes](/modes/wide/)). |
| `limitEntries=20` | Show at most *N* entries (after the newest-first sort). `limit` is an alias. |
| `limitDays=90` | Changelog type only — show only entries from the last *N* days, counted from the build date. |
| `combineByDay` | Changelog type only — merge all of a day's entries into one timeline entry. The day becomes the atomic item, so the tag cloud / `#tag=` filter then works at day granularity (selecting a tag keeps any day that carries it, showing that day's other entries too). |
| `cols=3` | Column count for article-card grids. |
| `topCount=5` | Knowledge base only — how many featured **top questions** to surface (`topCount=0` drops the section). |
| `emptyText="…"` | The no-matches message, on every listing type. Override it to localize the listing's chrome. |
| `filterLabel=` / `clearLabel=` | Changelog/articles — the tag cloud's "Filter by tag" heading and its "Clear" button. Override to localize. |
| `rssLabel="…"` | Changelog/articles — the RSS link's accessible name and tooltip (default "RSS feed"). Override to localize. |
| `topLabel=` / `categoriesLabel=` / `allLabel=` / `showAllLabel=` | Knowledge base only — the three section headings ("Top questions", "Browse by category", "All articles") and the filtered view's "Show all" clear link (while a filter is active, the articles heading names the active tag instead of `allLabel`). Override to localize. |
| `articleLabel=` / `articlesLabel=` | Knowledge base only — the singular/plural noun in the "N article(s)" count line (category-card counts and the filtered status line). Override to localize the count alongside the headings above. |
| `banner=false` | Knowledge base only — drop the **hero banner**. By default a KB listing opens with a banner holding an "ask your question" field: the question goes to the site's [AI assistant](/ai-assistant/) when one is enabled, else it opens **search** pre-filled. With neither surface enabled the banner drops on its own. |
| `bannerTitle=` / `bannerText=` / `askPlaceholder=` / `askLabel=` | Knowledge base only — the banner's heading (default "How can we help?"), optional subtitle, the ask field's placeholder, and its submit button label. Override to localize. |
| `toc=false` | Changelog type only — don't add per-entry headings to the page's "On this page" list (added by default in a non-wide layout; article and KB listings never contribute TOC entries). |
| `feed=false` | Changelog and article listings only — don't publish an RSS feed (one is emitted for each by default, advertised in the page's `<head>`). KB listings never publish a feed. |
| `attr={…}` | Forward raw HTML attributes onto the rendered root — see [below](#injecting-attributes). |

## A changelog listing

`type="changelog"` reproduces the `{% raw %}{% changelog %}{% endraw %}` timeline — the
same component, fed from member articles instead of a YAML file. This is exactly what the
[Changelog](/changelog/) tab renders (with `wide`); here, capped to the three most recent
entries:

{% raw %}
```aardvark
{% taxonomy name="changes" type="changelog" limitEntries=3 toc=false feed=false %}
```
{% endraw %}

{% taxonomy name="changes" type="changelog" limitEntries=3 toc=false feed=false %}

## A knowledge base

`type="kb"` groups members by tag into categories, with `featured: true` members surfaced
as top questions and each entry's `description` as its excerpt. The [Support](/support/)
tab is one of these; here, filtered to a single category:

{% raw %}
```aardvark
{% taxonomy name="support" type="kb" tagFilter="Included AI" %}
```
{% endraw %}

{% taxonomy name="support" type="kb" tagFilter="Included AI" %}

## An article list

`type="articles"` renders blog-style [article cards](/components/data-display/articlecard/)
— byline, date, badge, cover image, and the `description` as the teaser. The
[Blog](/blog/) tab renders all posts (with `wide`); here, filtered to one tag:

{% raw %}
```aardvark
{% taxonomy name="blog" type="articles" tagFilter="release" feed=false %}
```
{% endraw %}

{% taxonomy name="blog" type="articles" tagFilter="release" feed=false %}

## Traversing a taxonomy yourself

The three listing types are bespoke renderings, but the underlying data is plain and
yours to walk: every `{% raw %}{% %}{% endraw %}` block runs real Python, and two
injected helpers open the taxonomy up — **`taxonomy(name)`** returns the named
taxonomy for the current page's language/version, and **`member_html(member)`**
renders a member's actual body content (see [below](#member-content)). Loop with
`print()` to emit any markdown (or HTML) you like:

{% raw %}
```aardvark
{%
for m in taxonomy("changes").articles:
    print(f"- [{m.title}]({m.url}) — {m.date_display}\n")
%}
```
{% endraw %}

which renders the changelog members as a plain list:

{%
for m in taxonomy("changes").articles:
    print(f"- [{m.title}]({m.url}) — {m.date_display}\n")
%}

The returned object exposes the taxonomy's whole surface:

| Accessor | What you get |
| --- | --- |
| `.articles` | The member pages minus the listing page, sorted newest-first (undated members last) — each with `.title`, `.url`, `.description`, `.tags`, `.date_display`, `.when` (a `datetime` or `None`), `.version`, `.featured`, `.author_name`, `.author_avatar`, `.badge_text`, `.image`. |
| `.members` | The same list including the listing page (`.is_listing` tells them apart). |
| `.by_tag` | `{tag: [members]}` — group by tag, count per tag, build your own category index. |
| `.listing_url` | The canonical listing page's URL. |

An unknown name raises at build time, listing the taxonomies that exist — the same
contract as the directive. Combine with `featured`/`by_tag` for custom surfaces the
built-ins don't cover ("three most recent posts per tag", a by-author archive, …).
Here's this site's real [Support](/support/) taxonomy, grouped by tag:

{% raw %}
```aardvark
{%
for tag, members in sorted(taxonomy("support").by_tag.items()):
    print(f"**{tag}** — {len(members)} article(s)\n")
%}
```
{% endraw %}

{%
for tag, members in sorted(taxonomy("support").by_tag.items()):
    print(f"**{tag}** — {len(members)} article(s)\n")
%}

### Member content

Front matter is only the surface — **`member_html(member)`** renders a member's
actual **body** to HTML, so a loop can reproduce the articles themselves, not just
link to them. The body renders in the *member's* own context (includes and
expressions resolve exactly as on the article page), the leading H1 is stripped so
your loop prints its own headline, and relative links are rebased onto the member's
URL. Island components are suppressed with a build warning — they render only on the
member's own page, the same contract as the inline changelog view. Calling it from
inside a member's own body is rejected (a member embedding other members could
recurse). Here are this site's two most recent release notes, re-rendered in full:

{% raw %}
```aardvark
{%
for m in taxonomy("changes").articles[:2]:
    print(f"\n#### {m.title} — {m.date_display}\n")
    print(member_html(m))
%}
```
{% endraw %}

{%
for m in taxonomy("changes").articles[:2]:
    print(f"\n#### {m.title} — {m.date_display}\n")
    print(member_html(m))
%}

## CSS Selectors

Each listing shape renders its own class-name family — target the article list, the
knowledge base, the tag cloud, and the changelog timeline through their prefixes:

{% raw %}
```css
.aardvark-articlelist-*   /* article-list layout and cards */
.aardvark-kb-*            /* knowledge-base categories, top questions, entries */
.aardvark-tagcloud-*      /* the tag cloud (listing column or right rail) */
.aardvark-changelog-*     /* the changelog timeline (same parts as {% changelog %}) */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the
rendered listing root:

{% taxonomy name="changes" type="changelog" limitEntries=2 toc=false feed=false attr={'data-analytics': 'release-feed', 'aria-label': 'Changelog'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% taxonomy name="changes" type="changelog" limitEntries=2 toc=false feed=false attr={'data-analytics': 'release-feed', 'aria-label': 'Changelog'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'taxonomy', name='changes', type='changelog', limitEntries=2,
          toc=False, feed=False,
          attr={'data-analytics': 'release-feed', 'aria-label': 'Changelog'})
```
{% endAccordionSection %}
{% endAccordion %}
