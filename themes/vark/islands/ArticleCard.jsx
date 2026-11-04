import { forwardRef } from 'react';
import {
  Anchor,
  AspectRatio,
  Avatar,
  BackgroundImage,
  Badge,
  Box,
  Button,
  Card as MantineCard,
  Group,
  Image,
  Text,
  VisuallyHidden,
} from '@mantine/core';
import { sanitizeHref } from '@aardvark/islands/safe-href';
import './ArticleCard.css';

// One article/blog-post card for the taxonomy listing surfaces (ArticleList renders a grid
// of these; authors can also mount one standalone). Each variant is a faithful port of the
// matching mantine.dev article-cards gallery component (ui.mantine.dev/category/article-cards),
// adapted to Aardvark's conventions from Card.jsx: forwardRef + `{...rest}` attr passthrough,
// sanitizeHref on every author-supplied URL (href, image, authorAvatar — React does not block
// javascript: URLs), and the stretched-link pattern — the card root stays a <div> and exactly
// ONE inner anchor (the title) covers the card via ::after, so the a11y tree holds a single
// well-named link (the gallery's like/bookmark/share ActionIcons have no Aardvark equivalent;
// the date takes that footer slot).
//
// `variant` picks a gallery layout (data-variant on the root; ArticleCard.css keys off it):
//   horizontal (default) — gallery ArticleCard: top cover image, gradient badge floating over
//                          its corner, title, 4-line description, footer row with the author
//                          (avatar + name) left and the date right.
//   footer               — gallery ArticleCardFooter: top cover image, outline badge, title,
//                          author block (avatar + name + date), then a border-top footer strip
//                          carrying the description teaser.
//   background           — gallery ArticleCardImage: a tall photo card (background-image),
//                          uppercase category text (the badge slot) + large white title at the
//                          top, an optional white CTA pill pinned at the bottom (a Mantine
//                          Button rendered as an aria-hidden <span> — the single real link
//                          stays the title anchor, exactly like {% card %}'s CTA). With no
//                          (usable) image it falls back to a plain bordered card so text is
//                          never white-on-white.
//   vertical             — gallery ArticleCardVertical: a side-by-side row — image left
//                          (~220px, stacking on small screens), body right with uppercase
//                          category text, title, and a compact avatar + name • date line.
//   plain                — gallery ArticlesCardsGrid item: rounded 16:9 image, small uppercase
//                          date, title. Hover raises the card (scale + shadow + border).
// An unknown variant renders as horizontal (normalizeVariant, exported for tests).
//
// Degradation: no authorName -> the whole author row is hidden (the avatar is ignored); no
// image -> each variant collapses sensibly (background falls back to a bordered card); an
// unsafe href/image/authorAvatar is treated as absent. `date` must be a machine-readable
// string and `dateDisplay` the pre-formatted human label (formatted in Python — never
// toLocaleDateString here, so SSR and client render identically). `tags` is accepted but
// renders nothing on the card — it's the ArticleList/KnowledgeBase filter datum, reserved
// so `{...article}` spreads stay clean.
//
// SSR note: pure composition of @mantine/core primitives — no effects, no window/Date — so
// the build-time prerender bakes the card verbatim.

const VARIANTS = ['horizontal', 'footer', 'background', 'vertical', 'plain'];

// Map an author-supplied variant onto the supported set; anything unknown (typo'd, absent,
// non-string) renders as the horizontal default. Exported for unit tests.
export function normalizeVariant(variant) {
  return VARIANTS.includes(variant) ? variant : 'horizontal';
}

const ArticleCard = forwardRef(function ArticleCard(props, ref) {
  const {
    title,
    href,
    description,
    image,
    imageAlt = '',
    badge,
    badgeColor,
    authorName,
    authorAvatar,
    date,
    dateDisplay,
    variant = 'horizontal',
    cta,
    // Reserved: the listing islands filter on tags; the card itself never renders them.
    tags: _tags,
    ...rest
  } = props;

  const v = normalizeVariant(variant);
  const safeHref = sanitizeHref(href);
  const safeImage = sanitizeHref(image);
  // The avatar only ever renders inside the author row, so don't bother sanitizing without a name.
  const safeAvatar = authorName ? sanitizeHref(authorAvatar) : undefined;
  const hasTitle = typeof title === 'string' ? Boolean(title.trim()) : Boolean(title);
  // The title is the card's one real link and its accessible name. A bare href must not
  // make a titleless card look clickable when there is no labelled anchor to render.
  const clickable = Boolean(safeHref && hasTitle);
  // Light-on-dark text needs the photo underneath — gate it on the image actually rendering
  // so a background card with a missing/unsafe image never goes white-on-white.
  const imageBg = v === 'background' && Boolean(safeImage);

  // The title as a level-3 HEADING in every variant, so screen-reader heading navigation can
  // discover each article (a bare Anchor/Text left blog-grid titles out of the document outline).
  // The single stretched link lives INSIDE the heading; an unsafe href degrades to plain heading
  // text (no <a> at all). `Box component="h3"` carries no Mantine heading typography of its own —
  // ArticleCard.css sizes `.aardvark-articlecard-title` per variant exactly as before.
  const titleNode = (className) =>
    hasTitle ? (
      <Box component="h3" className={`${className} aardvark-articlecard-title`}>
        {clickable ? (
          <Anchor href={safeHref} underline="never" className="aardvark-articlecard-link">
            {title}
          </Anchor>
        ) : (
          title
        )}
      </Box>
    ) : null;

  // `dateDisplay` is the human-formatted label baked in Python; `date` is the machine form
  // for the <time datetime=…> attribute. Rendering only pre-formatted strings keeps the SSR
  // prerender byte-identical to the client's first paint (no locale drift).
  const timeNode = (extra = {}) =>
    dateDisplay ? (
      <Text
        component="time"
        dateTime={date || undefined}
        size="sm"
        c="dimmed"
        className="aardvark-articlecard-date"
        {...extra}
      >
        {dateDisplay}
      </Text>
    ) : null;

  // The gallery's uppercase "category" caption (background/vertical variants) — the badge
  // slot rendered as text rather than a chip.
  const categoryNode = badge ? (
    <Text size="xs" tt="uppercase" fw={700} className="aardvark-articlecard-category">
      {badge}
    </Text>
  ) : null;

  // Author avatar: decorative (alt="" + aria-hidden) — the adjacent name text IS the
  // accessible label. Without a usable `authorAvatar` (absent, unsafe, or the image fails
  // to load), Mantine falls back to initials derived from `name` in a deterministic color.
  const avatarNode = (size, radius = 'xl') => (
    <Avatar
      src={safeAvatar}
      name={authorName}
      color="initials"
      alt=""
      aria-hidden="true"
      size={size}
      radius={radius}
    />
  );

  // Per-variant chrome + body, each mirroring its ui.mantine.dev source. Media sizing
  // (cover heights, the 220px vertical split, aspect ratios) lives in ArticleCard.css.
  let cardProps = { withBorder: true, padding: 'lg', shadow: 'sm' };
  let children;
  switch (v) {
    case 'footer':
      // ArticleCardFooter: cover, outline badge, title, author block, border-top strip.
      children = (
        <>
          {safeImage && (
            <MantineCard.Section mb="lg" className="aardvark-articlecard-media">
              <Image
                src={safeImage}
                alt={imageAlt}
                h={180}
                className="aardvark-articlecard-img"
              />
            </MantineCard.Section>
          )}
          {badge && (
            <Badge
              color={badgeColor || undefined}
              variant="outline"
              className="aardvark-articlecard-badge"
            >
              {badge}
            </Badge>
          )}
          {titleNode('aardvark-articlecard-title-footer')}
          {authorName && (
            <Group mt="lg" className="aardvark-articlecard-authorrow">
              {avatarNode(38, 'sm')}
              <div>
                <Text fw={500} className="aardvark-articlecard-authorname">
                  {authorName}
                </Text>
                {timeNode({ size: 'xs' })}
              </div>
            </Group>
          )}
          {!authorName && timeNode({ mt: 'lg' })}
          {description && (
            <MantineCard.Section className="aardvark-articlecard-footerrow">
              <Text size="xs" c="dimmed" lineClamp={2} className="aardvark-articlecard-desc">
                {description}
              </Text>
            </MantineCard.Section>
          )}
        </>
      );
      break;
    case 'background':
      if (imageBg) {
        // ArticleCardImage: a tall photo, category + big white title up top, CTA pinned
        // at the bottom. The gallery uses no scrim — the CSS adds a whisper of one so an
        // unlucky bright photo can't wash the title out entirely.
        cardProps = { withBorder: false, padding: 'xl', shadow: 'md' };
        children = (
          <BackgroundImage src={safeImage} radius="md" className="aardvark-articlecard-bg">
            {/* BackgroundImage is CSS-only, so a supplied imageAlt would be silently
                dropped — surface it to assistive tech without role="img" (the container
                also owns the card's interactive title link). */}
            {imageAlt ? <VisuallyHidden>{imageAlt}</VisuallyHidden> : null}
            <div className="aardvark-articlecard-bg-inner">
              <div>
                {categoryNode}
                {titleNode('aardvark-articlecard-bg-title')}
              </div>
              {cta && clickable ? (
                // A decorative mouse affordance, never a second link — a Mantine Button
                // rendered as a pointer-transparent plain <span> (aria-hidden), so clicks
                // land directly on the stretched title link even before hydration.
                // Gated on `clickable`: with no valid href there's no link underneath,
                // so an unclickable, AT-hidden button-styled pill must not render at all.
                <Button
                  component="span"
                  aria-hidden="true"
                  variant="white"
                  color="dark"
                  className="aardvark-articlecard-cta"
                >
                  {cta}
                </Button>
              ) : null}
            </div>
          </BackgroundImage>
        );
      } else {
        // No (usable) image: a plain bordered card on the normal surface — never white text.
        children = (
          <div className="aardvark-articlecard-body">
            {categoryNode}
            {titleNode('aardvark-articlecard-title-plainbg')}
            {description && (
              <Text size="sm" c="dimmed" lineClamp={3} className="aardvark-articlecard-desc">
                {description}
              </Text>
            )}
            {timeNode()}
          </div>
        );
      }
      break;
    case 'vertical':
      // ArticleCardVertical: image left (stacks small), category, title, author • date.
      cardProps = { withBorder: true, padding: 0, shadow: 'sm' };
      children = (
        <div className="aardvark-articlecard-row">
          {safeImage && (
            <Image
              src={safeImage}
              alt={imageAlt}
              className="aardvark-articlecard-img aardvark-articlecard-rowimg"
            />
          )}
          <div className="aardvark-articlecard-body">
            {categoryNode}
            {titleNode('aardvark-articlecard-title-vertical')}
            <Group gap="xs" className="aardvark-articlecard-authorrow">
              {authorName && (
                <Group gap={7}>
                  {avatarNode(20)}
                  <Text size="xs" className="aardvark-articlecard-authorname">
                    {authorName}
                  </Text>
                </Group>
              )}
              {authorName && dateDisplay && (
                <Text span size="xs" opacity={0.8} aria-hidden="true">
                  •
                </Text>
              )}
              {timeNode({ size: 'xs', c: undefined, opacity: 0.8 })}
            </Group>
          </div>
        </div>
      );
      break;
    case 'plain':
      // ArticlesCardsGrid item: rounded 16:9 image, uppercase date, title. The border is
      // transparent until hover (the CSS "raise" recipe).
      cardProps = { withBorder: false, padding: 'md', shadow: 'none' };
      children = (
        <>
          {safeImage && (
            <AspectRatio ratio={1920 / 1080} className="aardvark-articlecard-media">
              <Image
                src={safeImage}
                alt={imageAlt}
                radius="md"
                className="aardvark-articlecard-img"
              />
            </AspectRatio>
          )}
          {timeNode({ size: 'xs', tt: 'uppercase', fw: 500, c: undefined, opacity: 0.85 })}
          {titleNode('aardvark-articlecard-title-grid')}
        </>
      );
      break;
    case 'horizontal':
    default:
      // ArticleCard (the gallery default): cover, floating gradient badge, title,
      // description, author row + date footer.
      children = (
        <>
          {safeImage && (
            <MantineCard.Section className="aardvark-articlecard-media">
              <Image
                src={safeImage}
                alt={imageAlt}
                h={180}
                className="aardvark-articlecard-img"
              />
            </MantineCard.Section>
          )}
          {badge && (
            // The gradient chip floats over the cover's corner (the gallery look) — but
            // only when there IS a cover; on a text card it renders in flow, or it would
            // sit on top of the title.
            <Badge
              className={
                safeImage ? 'aardvark-articlecard-rating' : 'aardvark-articlecard-badge'
              }
              variant={badgeColor ? 'filled' : 'gradient'}
              color={badgeColor || undefined}
              gradient={badgeColor ? undefined : { from: 'indigo', to: 'violet', deg: 145 }}
            >
              {badge}
            </Badge>
          )}
          {titleNode('aardvark-articlecard-title-default')}
          {description && (
            <Text fz="sm" lineClamp={4} opacity={0.9} className="aardvark-articlecard-desc">
              {description}
            </Text>
          )}
          {(authorName || dateDisplay) && (
            <Group justify="space-between" className="aardvark-articlecard-footergroup">
              {authorName ? (
                <Group gap="xs" className="aardvark-articlecard-authorrow">
                  {avatarNode(24)}
                  <Text fz="sm" className="aardvark-articlecard-authorname">
                    {authorName}
                  </Text>
                </Group>
              ) : (
                <span />
              )}
              {timeNode({ size: 'xs' })}
            </Group>
          )}
        </>
      );
      break;
  }

  return (
    <MantineCard
      ref={ref}
      // Author props first, so the island's structural/state attributes below always win
      // (same rationale as Card.jsx).
      {...rest}
      data-aardvark-articlecard=""
      data-variant={v}
      data-clickable={clickable ? '' : undefined}
      data-light-text={imageBg ? '' : undefined}
      radius="md"
      withBorder={cardProps.withBorder}
      padding={cardProps.padding}
      shadow={cardProps.shadow}
    >
      {/* The {% card %} sheen flash (Card.css), self-clipped: this span is its own
          overflow-hidden frame (its ::before is the moving gradient), so the horizontal
          variant's overflow:visible root (the floating badge) never leaks the sweep. */}
      <span className="aardvark-articlecard-sheen" aria-hidden="true" />
      {children}
    </MantineCard>
  );
});

export default ArticleCard;
