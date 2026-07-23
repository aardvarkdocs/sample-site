import { forwardRef, useEffect, useState } from 'react';
import {
  CodeHighlight,
  CodeHighlightAdapterProvider,
  createShikiAdapter,
} from '@mantine/code-highlight';
import './CodeBlock.css';

// A runtime, in-browser code block: Shiki tokenizes the source on the client and the
// reader gets a copy button. This is the one thing a flat library tag can't express from
// Markdown — CodeHighlight needs a CodeHighlightAdapterProvider above it carrying a
// highlighter, and Shiki loads its grammars/themes asynchronously (a Promise, not a
// JSON-serialisable prop). So this snippet owns the provider + adapter; the markup is just
// `code` / `language` strings.
//
// Shiki is pulled in lazily inside loadShiki (a dynamic import resolved only in the browser),
// so the heavy WASM tokenizer never lands in the SSR prerender or the top-level page bundle.
// The languages registered up front are the ones the docs actually highlight; an unregistered
// language still renders, just un-tokenized.
const SHIKI_LANGS = [
  'tsx',
  'jsx',
  'ts',
  'js',
  'json',
  'bash',
  'shell',
  'python',
  'html',
  'css',
  'scss',
  'yaml',
  'markdown',
];

// createShikiAdapter calls loadShiki().then(ctx => ctx.codeToHtml(...)). A Shiki highlighter
// instance exposes codeToHtml, so resolve to one with our languages registered. The adapter
// hands codeToHtml its own bundled GitHub light/dark theme objects (keyed off the resolved
// color scheme), so no themes need registering here.
const shikiAdapter = createShikiAdapter(async () => {
  const { createHighlighter } = await import('shiki');
  return createHighlighter({ langs: SHIKI_LANGS, themes: [] });
});

// forwardRef so `attr={...}` reaches the rendered root DOM node. The provider renders only
// context (no element), so the ref goes to CodeHighlight, the outermost DOM node — and, before
// mount, to the placeholder, which is itself the outermost node.
const CodeBlock = forwardRef(function CodeBlock(
  { code = '', language = 'tsx', withCopyButton = true, ...rest },
  ref,
) {
  // The Shiki adapter loads its highlighter in an effect; during the build-time prerender
  // (and the first client paint, before hydration finishes) there is no highlighter yet.
  // Render a plain, un-tokenized <pre> until mounted so the async init never fights SSR, then
  // swap in the live, highlighted CodeHighlight once we're in the browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <pre ref={ref} className="aardvark-codeblock-placeholder" data-language={language}>
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <CodeHighlightAdapterProvider adapter={shikiAdapter}>
      <CodeHighlight ref={ref} code={code} language={language} withCopyButton={withCopyButton} {...rest} />
    </CodeHighlightAdapterProvider>
  );
});

export default CodeBlock;
