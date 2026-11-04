import { forwardRef } from 'react';
import { CopyButton as MantineCopyButton, ActionIcon, Group, Paper, ScrollArea, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconClipboard } from '@tabler/icons-react';
import './Prompt.css';

// The island behind the built-in {% prompt %} tag (prompt.md). It
// renders a copyable AI-prompt block: a header bar (an optional title on the left; a "PROMPT"
// language pill + icon-only actions on the right, exactly like an on-page code block's header) over
// the verbatim prompt text in a scrollable surface. Each action is an ActionIcon with a Tooltip that
// names it — a copy button plus one "Open in …" deep-link per configured action that pre-fills the
// prompt in that tool. Mirrors Mintlify's Prompt component.
//
// The prompt text rides the JSON `text` prop verbatim (the macro deliberately keeps it out of the
// page's Markdown pass), so the deep links can be built from the exact string here. Each deep link
// URL-encodes the whole prompt into that tool's "new chat with this prompt" endpoint:
//
//   chatgpt  -> https://chatgpt.com/?q=<encoded>
//   claude   -> https://claude.ai/new?q=<encoded>
//   cursor   -> cursor://anysphere.cursor-deeplink/prompt?text=<encoded>
//
// `copy` is not a link — it's the Mantine CopyButton (a render-prop component that a build-time
// macro can't author), so this island supplies the button that copies `text` and confirms.
//
// forwardRef so `attr={…}` reaches the rendered root DOM node — Paper forwards its ref to its own
// root. SSR-safe: pure composition of @mantine/core primitives + inline SVG icons, no effects/
// window, so the prerender bakes the same markup the client produces (the deep-link hrefs are
// derived synchronously from the text).

// The deep-link brand marks, inlined as currentColor <svg> so each takes the neutral action-icon
// colour. Each identifies its target tool: the OpenAI mark for ChatGPT, the Claude sunburst for
// Claude (the product the link opens — not Anthropic's corporate "A"), and the Cursor cube. All are
// single-color CC0 marks from the same open icon set (Simple Icons) the homepage marquee draws from,
// each a 0 0 24 24 single-path glyph where `size` sets the box.
function OpenAiGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}
function ClaudeGlyph({ size = 16 }) {
  // The CLAUDE product mark (the "sunburst") — the right logo for an "Open in Claude" deep link,
  // not Anthropic's corporate "A". Single-color path from the CC0 Simple Icons set, rendered in
  // currentColor to match the neutral treatment of the OpenAI / Cursor glyphs beside it. The mark is
  // radial and fills its 24×24 box, so (unlike the wide-short "A") it holds up at 16px as-is.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}
function CursorGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

// The deep-link builders, keyed by action name. `copy` is handled separately (it's a button, not a
// link). Each entry is metadata for one "Open in …" anchor: its visible label (the tooltip text),
// its icon, and a `href(text)` that URL-encodes the prompt into that tool's prompt-prefill endpoint.
// encodeURIComponent escapes everything unsafe in a query value (spaces, newlines, &, #, etc.), so
// multi-line prompts survive.
const DEEP_LINKS = {
  __proto__: null, // null-proto: an author-controlled key (a bad `actions` token) can't resolve to an inherited Object.prototype member
  chatgpt: {
    label: 'Open in ChatGPT',
    Icon: OpenAiGlyph,
    href: (text) => `https://chatgpt.com/?q=${encodeURIComponent(text)}`,
    external: true,
  },
  claude: {
    label: 'Open in Claude',
    Icon: ClaudeGlyph,
    href: (text) => `https://claude.ai/new?q=${encodeURIComponent(text)}`,
    external: true,
  },
  cursor: {
    // Cursor's app deep link (cursor:// scheme) — opens the desktop app with the prompt prefilled.
    // Not http(s), so no target=_blank / rel (those are meaningless for a custom-scheme URL).
    label: 'Open in Cursor',
    Icon: CursorGlyph,
    href: (text) => `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(text)}`,
    external: false,
  },
};

const Prompt = forwardRef(function Prompt(
  { text = '', title, actions = ['copy', 'chatgpt', 'claude', 'cursor'], ...rest },
  ref,
) {
  // Normalize the action list: coerce to an array (a lone string from a scalar author value becomes
  // one action), lowercase/trim each, and keep only ones we know — an unknown action is dropped
  // rather than rendered as a dead button. `copy` is always meaningful; the rest must be in
  // DEEP_LINKS. De-duplicate while preserving author order.
  const requested = Array.isArray(actions) ? actions : actions ? [actions] : [];
  const seen = new Set();
  const resolved = [];
  for (const raw of requested) {
    const key = String(raw).trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    if (key === 'copy' || DEEP_LINKS[key]) {
      seen.add(key);
      resolved.push(key);
    }
  }
  // Empty/all-unknown actions still leave a usable block: fall back to a copy button so the prompt
  // is never a dead, un-actionable box.
  if (resolved.length === 0) resolved.push('copy');

  // Render the buttons in the author's `actions` order (the docs promise "in the order you list
  // them"), so `actions="chatgpt, copy"` really shows ChatGPT before Copy. Mapping over `resolved` —
  // rather than a fixed copy-then-links layout — keeps that promise; `copy` becomes the
  // MantineCopyButton, every other key a deep-link <ActionIcon component="a">. Each is icon-only with
  // a Tooltip that names it (and an aria-label so the icon buttons stay accessible).
  const actionButtons = resolved.map((key) => {
    if (key === 'copy') {
      return (
        <MantineCopyButton key="copy" value={text} timeout={1500}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? 'Copied' : 'Copy prompt'}
              withArrow
              events={{ hover: true, focus: true, touch: true }}
            >
              <ActionIcon
                color={copied ? 'teal' : undefined}
                variant={copied ? 'light' : 'default'}
                size="md"
                onClick={copy}
                aria-label={copied ? 'Prompt copied' : 'Copy prompt'}
                className="aardvark-prompt-action"
              >
                {copied ? <IconCheck size={16} /> : <IconClipboard size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </MantineCopyButton>
      );
    }
    const link = DEEP_LINKS[key];
    const Icon = link.Icon;
    return (
      <Tooltip key={key} label={link.label} withArrow events={{ hover: true, focus: true, touch: true }}>
        <ActionIcon
          component="a"
          href={link.href(text)}
          // http(s) tools open in a new tab (and get the security rel); the cursor:// scheme hands
          // off to the desktop app in place, so no target/rel there.
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          variant="default"
          size="md"
          aria-label={link.label}
          className="aardvark-prompt-action"
        >
          <Icon size={16} />
        </ActionIcon>
      </Tooltip>
    );
  });

  return (
    <Paper
      ref={ref}
      // Spread author props FIRST so a stray className can't clobber the scoped `aardvark-prompt`
      // class the CSS keys off — matching ApiField/Panel/ExamplePanel.
      {...rest}
      withBorder
      radius="md"
      className="aardvark-prompt"
    >
      <div className="aardvark-prompt-head">
        {title ? (
          <Text component="span" className="aardvark-prompt-title">
            {title}
          </Text>
        ) : null}
        {/* The trailing tools cluster: a "PROMPT" language pill then the icon actions — the same
            right-aligned layout an on-page code block's header uses (see theme code-blocks.js). */}
        <div className="aardvark-prompt-tools">
          <span className="aardvark-prompt-lang">Prompt</span>
          <Group gap={6} className="aardvark-prompt-actions" wrap="nowrap">
            {actionButtons}
          </Group>
        </div>
      </div>
      <ScrollArea.Autosize mah={360} type="auto" className="aardvark-prompt-body">
        {/* The prompt is preformatted text (whitespace, line breaks, and any code are significant),
            so render it in a <pre> that preserves it verbatim — never Markdown. The text lives in a
            nested <code>, NOT directly in the <pre>: the HTML parser strips a single newline right
            after a <pre> open tag, so a prompt beginning with a newline would hydrate-mismatch
            (React #418) between the SSR markup and the client render. Nesting in <code> sidesteps
            that quirk (the strip rule is <pre>-only) — the same pattern GitFolder/TreeFile use. */}
        <pre className="aardvark-prompt-text">
          <code>{text}</code>
        </pre>
      </ScrollArea.Autosize>
    </Paper>
  );
});

export default Prompt;
