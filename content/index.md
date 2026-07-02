---
title: Why Aardvark?
navtitle: Why Aardvark?
description: aardvark is the Mantine-powered static site generator — Markdown in, fast
  static HTML out, with built-in search, OpenAPI, llms.txt, and one-binary deploys.
icon: fa-solid fa-circle-question
menu: why
weight: 1
mode: uncapped
survey: false
pageFeedback: false
lastModified: false
editPage: false
reportIssue: false
---

<div class="wa">

<style>
/* Literal colours only — CSS var()/color-mix break xhtml2pdf (the whole-site PDF), so do not convert this block to CSS variables. */
.wa *{box-sizing:border-box;}
.wa-container{max-width:1100px;margin:0 auto;padding:0 32px;}
/* text-decoration uses !important: these buttons are <a>s inside .aardvark-content, where the theme underlines prose links with a more specific selector. */
.wa-btn{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;padding:11px 18px;border-radius:8px;text-decoration:none !important;cursor:pointer;border:1px solid transparent;transition:background-color .15s ease,transform .05s ease;}
.wa-btn:active{transform:translateY(.5px);}
.wa-btn--on-violet{background:#ffffff;color:#6741d9;}
.wa-btn--on-violet:hover{background:#f1edff;}
.wa-btn--solid{background:#7048e8;color:#ffffff;}
.wa-btn--solid:hover{background:#6741d9;}
.wa-hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#7048e8,#9775fa);color:#ffffff;text-align:center;padding:96px 24px 104px;}
.wa-hero__wave{position:absolute;inset:0;background:url("/diamond-wave-bg.svg") right center/cover no-repeat;opacity:.14;pointer-events:none;}
.wa-hero__glow{position:absolute;left:50%;top:-30%;width:760px;height:760px;transform:translateX(-50%);background:radial-gradient(circle,rgba(255,255,255,.28),transparent 60%);pointer-events:none;}
.wa-hero__inner{position:relative;max-width:760px;margin:0 auto;}
.wa-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.04em;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.32);color:#ffffff;padding:5px 12px;border-radius:999px;margin-bottom:24px;}
.wa-hero h1{font-size:3.6rem;line-height:1.05;font-weight:800;letter-spacing:-.02em;margin:0 0 18px;color:#ffffff;}
.wa-hero .wa-sub{font-size:1.25rem;line-height:1.55;opacity:.94;max-width:600px;margin:0 auto 32px;}
.wa-hero .aardvark-lead{display:none;}
.wa-cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.wa-terminal{position:relative;max-width:620px;margin:48px auto 0;background:#1a1430;border:1px solid #3a2f5c;border-radius:12px;box-shadow:0 24px 60px rgba(40,20,90,.45);text-align:left;overflow:hidden;}
.wa-terminal__bar{display:flex;align-items:center;gap:7px;padding:11px 14px;border-bottom:1px solid #2c2348;}
.wa-terminal__dot{width:11px;height:11px;border-radius:999px;}
.wa-terminal__title{margin-left:8px;font-size:12px;color:#8a7fb8;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
.wa-terminal pre{margin:0;padding:18px 20px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:14px;line-height:1.7;color:#e7e1ff;background:#1a1430;border:0;border-radius:0;overflow-x:auto;}
.wa-terminal .c-dim{color:#8a7fb8;}
.wa-terminal .c-cmd{color:#ffffff;}
.wa-terminal .c-ok{color:#63e6be;}
.wa-terminal .c-mut{color:#b9a8ff;}
.wa-strip{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;padding:28px 24px;border-bottom:1px solid #e8e6f0;background:#f5f3ff;}
.wa-chip{display:inline-flex;align-items:center;font-size:13px;font-weight:600;color:#7048e8;background:#ece7fd;border-radius:999px;padding:6px 14px;}
.wa-section{padding:80px 0;}
.wa-section-head{text-align:center;max-width:640px;margin:0 auto 44px;}
.wa-kicker{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7048e8;}
.wa-section-head h2{font-size:2.2rem;font-weight:800;letter-spacing:-.01em;margin:10px 0 12px;}
.wa-section-head p{font-size:1.1rem;color:#6b7280;margin:0;}
.wa-features{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.wa-feature{background:#ffffff;border:1px solid #e8e6f0;border-radius:8px;padding:24px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.06);}
.wa-feature__ico{width:42px;height:42px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:#ece7fd;color:#7048e8;font-size:19px;margin-bottom:14px;}
.wa-feature h3{font-size:1.05rem;font-weight:600;margin:0 0 6px;}
.wa-feature p{font-size:14px;color:#6b7280;margin:0;line-height:1.55;}
.wa-showcase{background:#f5f3ff;}
.wa-split{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;}
.wa-split h2{font-size:1.9rem;font-weight:800;letter-spacing:-.01em;margin:8px 0 14px;}
.wa-split p{font-size:1.05rem;color:#6b7280;margin:0 0 18px;}
.wa-checklist{list-style:none;margin:0 0 24px;padding:0;display:flex;flex-direction:column;gap:10px;}
.wa-checklist li{display:flex;align-items:center;gap:10px;font-size:15px;}
.wa-checklist i{color:#0ca678;}
.wa-code{background:#ffffff;border:1px solid #e8e6f0;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.06);}
.wa-code__bar{display:flex;border-bottom:1px solid #e8e6f0;}
.wa-code__tab{padding:10px 16px;font-size:13px;font-weight:600;color:#6b7280;border-bottom:2px solid transparent;}
.wa-code__tab.is-on{color:#7048e8;border-bottom-color:#7048e8;}
.wa-code pre{margin:0;padding:18px 20px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13.5px;line-height:1.7;overflow-x:auto;color:#1a1b1e;}
.wa-code .t-cm{color:#a0a1a7;}
.wa-code .t-kw{color:#a626a4;}
:root[data-mantine-color-scheme="dark"] .wa-strip{background:#221d33;border-bottom-color:#2f2a3d;}
:root[data-mantine-color-scheme="dark"] .wa-chip{color:#a78bfa;background:#2c2640;}
:root[data-mantine-color-scheme="dark"] .wa-kicker{color:#a78bfa;}
:root[data-mantine-color-scheme="dark"] .wa-code__tab.is-on{color:#a78bfa;border-bottom-color:#a78bfa;}
:root[data-mantine-color-scheme="dark"] .wa-section-head p,:root[data-mantine-color-scheme="dark"] .wa-split p,:root[data-mantine-color-scheme="dark"] .wa-feature p,:root[data-mantine-color-scheme="dark"] .wa-code__tab{color:#909296;}
:root[data-mantine-color-scheme="dark"] .wa-feature,:root[data-mantine-color-scheme="dark"] .wa-code{background:#141517;border-color:#2f2a3d;}
:root[data-mantine-color-scheme="dark"] .wa-feature__ico{background:#2c2640;color:#a78bfa;}
:root[data-mantine-color-scheme="dark"] .wa-feature h3,:root[data-mantine-color-scheme="dark"] .wa-code pre{color:#c9c9c9;}
:root[data-mantine-color-scheme="dark"] .wa-showcase{background:#221d33;}
:root[data-mantine-color-scheme="dark"] .wa-code{border-color:#2f2a3d;}
:root[data-mantine-color-scheme="dark"] .wa-code__bar{border-bottom-color:#2f2a3d;}
:root[data-mantine-color-scheme="dark"] .wa-code .t-cm{color:#5c6370;}
:root[data-mantine-color-scheme="dark"] .wa-code .t-kw{color:#c678dd;}
@media (max-width:900px){.wa-features{grid-template-columns:repeat(2,1fr);}}
@media (max-width:860px){.wa-split{grid-template-columns:1fr;gap:28px;}}
@media (max-width:600px){.wa-features{grid-template-columns:1fr;}.wa-hero h1{font-size:2.6rem;}}
@media (prefers-reduced-motion: reduce){.wa-btn{transition:none;}.wa-btn:active{transform:none;}}
/* --- gradient hero word (PDF note: xhtml2pdf can't clip a gradient to text, so it flattens the gradient to its first stop as a solid box behind the word; the literal `color` below is chosen to stay legible on that box) --- */
.wa-grad{color:#0a5c4a;background:linear-gradient(92deg,#63e6be,#22d3ee);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 2px 12px rgba(8,40,46,.4));}
/* --- proof stats --- */
.wa-stats{display:flex;flex-wrap:wrap;justify-content:center;gap:18px 56px;padding:44px 24px;max-width:1000px;margin:0 auto;}
.wa-stat{text-align:center;min-width:120px;}
.wa-stat__n{display:block;font-size:2.5rem;font-weight:800;letter-spacing:-.02em;color:#7048e8;line-height:1;}
.wa-stat__l{display:block;font-size:13px;font-weight:600;color:#6b7280;margin-top:8px;}
/* --- logo marquee (pills; scrolling handled by the built-in marquee tag) --- */
.wa-logo{flex:0 0 auto;display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 30px;font-size:15px;font-weight:600;color:#586174;white-space:nowrap;}
/* Explicit 24x24 (every logo is a square 0 0 24 24 SVG) so the row reserves each logo's box
   BEFORE the SVG loads. With width:auto the pills are zero-width until each image loads, and
   the marquee's translate distance is a % of total content width — so logos loading in would
   reflow the row and make the scroll visibly jump. Fixed dimensions keep the loop steady. */
.wa-logo img{width:24px;height:24px;opacity:.58;filter:grayscale(1);}
/* gap='0' on the marquee tags below gives padding-only spacing between pills; the seam fix
   itself lives in the marquee macro, which renders the body inline so pills are direct flex
   children of the repeating row. */
.wa-marquee-head{text-align:center;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7048e8;margin:6px 0 16px;}
/* --- free / pay-as-you-go line --- */
.wa-payline{max-width:660px;margin:36px auto 4px;text-align:center;}
.wa-payline p{font-size:1.05rem;line-height:1.6;color:#4b5563;margin:0;}
.wa-payline strong{color:#1a1b1e;}
:root[data-mantine-color-scheme="dark"] .wa-stat__n{color:#a78bfa;}
:root[data-mantine-color-scheme="dark"] .wa-stat__l,:root[data-mantine-color-scheme="dark"] .wa-payline p{color:#909296;}
:root[data-mantine-color-scheme="dark"] .wa-payline strong{color:#e7e1ff;}
:root[data-mantine-color-scheme="dark"] .wa-logo{color:#9aa0aa;}
:root[data-mantine-color-scheme="dark"] .wa-logo img{filter:grayscale(1) invert(1);opacity:.72;}
:root[data-mantine-color-scheme="dark"] .wa-marquee-head{color:#a78bfa;}
</style>

<section class="wa-hero">
<div class="wa-hero__glow"></div>
<div class="wa-hero__wave"></div>
<div class="wa-hero__inner">
<span class="wa-eyebrow"><i aria-hidden="true" class="fa-solid fa-bolt"></i> Markdown in · agent-ready out</span>
<h1>The <span class="wa-grad">first word</span> in documentation</h1>
<p class="wa-sub">aardvark is a Mantine-powered static site generator. Author in Markdown, build to fast static HTML with interactive React islands.</p>
<div class="wa-cta-row">
<a class="wa-btn wa-btn--on-violet" href="/getting-started/quickstart/">Get started <i aria-hidden="true" class="fa-solid fa-arrow-right"></i></a>
</div>
<div class="wa-terminal">
<div class="wa-terminal__bar">
<span class="wa-terminal__dot" style="background:#ff5f57"></span>
<span class="wa-terminal__dot" style="background:#febc2e"></span>
<span class="wa-terminal__dot" style="background:#28c840"></span>
<span class="wa-terminal__title">zsh — my-docs</span>
</div>
<pre><span class="c-dim">$</span> <span class="c-cmd">vark new my-docs</span>
<span class="c-mut">  scaffolded project</span>
<span class="c-dim">$</span> <span class="c-cmd">vark dev --port 8000</span>
<span class="c-ok">  built 24 pages · serving http://127.0.0.1:8000</span>
<span class="c-ok">  live-reload ready</span></pre>
</div>
</div>
</section>

<div class="wa-strip">
<span class="wa-chip">⌘K search</span>
<span class="wa-chip">OpenAPI</span>
<span class="wa-chip">sitemap.xml</span>
<span class="wa-chip">llms.txt</span>
<span class="wa-chip">OG cards</span>
<span class="wa-chip">i18n</span>
<span class="wa-chip">dark mode</span>
</div>

<div class="wa-stats">
<div class="wa-stat"><span class="wa-stat__n">45+</span><span class="wa-stat__l">built-in components</span></div>
<div class="wa-stat"><span class="wa-stat__n">16</span><span class="wa-stat__l">analytics integrations</span></div>
<div class="wa-stat"><span class="wa-stat__n">300+</span><span class="wa-stat__l">AI models, every major lab</span></div>
<div class="wa-stat"><span class="wa-stat__n">1</span><span class="wa-stat__l">binary to deploy</span></div>
</div>

<section class="wa-section" id="features">
<div class="wa-container">
<div class="wa-section-head">
<div class="wa-kicker">Batteries included</div>
<h2>Everything a docs site needs</h2>
<p>From templating to search to deploy — the parts you'd otherwise wire together yourself, built in.</p>
</div>
<div class="wa-features">
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-brands fa-markdown"></i></div><h3>Markdown in, HTML out</h3><p>Author in Markdown, build to fast static HTML — pretty URLs, a TOC, and a clean default theme.</p></div>
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-solid fa-code"></i></div><h3>Real Python templating</h3><p>Logic lives in template tags and is actual Python — pull from JSON, YAML, and CSV data files.</p></div>
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-solid fa-file-export"></i></div><h3>Generate any file</h3><p>Build-time Python emits whole page sets — or any downloadable file: CSV, JSON, YAML, even binaries.</p></div>
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-solid fa-magnifying-glass"></i></div><h3>Built-in ⌘K search</h3><p>A full-text search index and a fast command-palette modal ship with every build.</p></div>
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-solid fa-plug"></i></div><h3>OpenAPI try-it</h3><p>Drop in a spec and get interactive "try it now" reference pages.</p></div>
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-solid fa-box"></i></div><h3>Ships as one binary</h3><p>Compile the whole tool to a single executable with Nuitka. Node only at build time.</p></div>
</div>
</div>
</section>

<section class="wa-section" id="integrations">
<div class="wa-container">
<div class="wa-section-head">
<div class="wa-kicker">Plug into your stack</div>
<h2>Works with the tools you already use</h2>
<p>Drop-in analytics and integrations — 16 platforms, each switched on with one config block. No script tags to hand-roll, no consent plumbing to wire.</p>
</div>
</div>
{% marquee duration=22000 fadeEdges=true gap='0' attr={'role': 'img', 'aria-label': 'Supported integrations: Google Analytics, Google Tag Manager, Plausible, Fathom, Microsoft Clarity, PostHog, Mixpanel, Amplitude, Heap, Hotjar, LogRocket, Pirsch, Segment, Clearbit, Hightouch, and Adobe Analytics'} %}
<span class="wa-logo"><img src="/logos/integrations/googleanalytics.svg" alt="">Google Analytics</span>
<span class="wa-logo"><img src="/logos/integrations/amplitude.svg" alt="">Amplitude</span>
<span class="wa-logo"><img src="/logos/integrations/posthog.svg" alt="">PostHog</span>
<span class="wa-logo"><img src="/logos/integrations/segment.svg" alt="">Segment</span>
<span class="wa-logo"><img src="/logos/integrations/mixpanel.svg" alt="">Mixpanel</span>
<span class="wa-logo"><img src="/logos/integrations/microsoftclarity.svg" alt="">Microsoft Clarity</span>
<span class="wa-logo"><img src="/logos/integrations/plausible.svg" alt="">Plausible</span>
<span class="wa-logo"><img src="/logos/integrations/heap.svg" alt="">Heap</span>
<span class="wa-logo"><img src="/logos/integrations/hotjar.svg" alt="">Hotjar</span>
<span class="wa-logo"><img src="/logos/integrations/logrocket.svg" alt="">LogRocket</span>
<span class="wa-logo"><img src="/logos/integrations/googletagmanager.svg" alt="">Google Tag Manager</span>
<span class="wa-logo"><img src="/logos/integrations/clearbit.svg" alt="">Clearbit</span>
<span class="wa-logo"><img src="/logos/integrations/fathom.svg" alt="">Fathom</span>
<span class="wa-logo"><img src="/logos/integrations/hightouch.svg" alt="">Hightouch</span>
<span class="wa-logo"><img src="/logos/integrations/adobe.svg" alt="">Adobe Analytics</span>
<span class="wa-logo"><img src="/logos/integrations/pirsch.svg" alt="">Pirsch</span>
{% endMarquee %}
</section>

<section class="wa-section wa-showcase">
<div class="wa-container">
<div class="wa-split">
<div>
<div class="wa-kicker">Author once</div>
<h2>Markdown that does more</h2>
<p>Write content the way you always have — then reach for real Python: inline in a page, or in a generator script that emits whole page sets and downloadable files.</p>
<ul class="wa-checklist">
<li><i aria-hidden="true" class="fa-solid fa-check"></i> Loop and template with <code>{% raw %}{% %}{% endraw %}</code> Python tags</li>
<li><i aria-hidden="true" class="fa-solid fa-check"></i> Pull from JSON, YAML, and CSV data files</li>
<li><i aria-hidden="true" class="fa-solid fa-check"></i> Emit CSV, JSON, YAML — or any file — from a generator</li>
</ul>
<a class="wa-btn wa-btn--solid" href="/generators/">Read the build-time Python guide <i aria-hidden="true" class="fa-solid fa-arrow-right"></i></a>
</div>
<div class="wa-code">
<div class="wa-code__bar"><span class="wa-code__tab is-on">page.md</span></div>
<pre><span class="t-cm">---
title: Pricing
---</span>
<span class="t-kw">#</span> Pricing
There are {% raw %}{% data.products.count %}{% endraw %} plans.
{% raw %}{% component('Button', children='Start free') %}{% endraw %}</pre>
</div>
</div>
</div>
</section>

<section class="wa-section" id="ai">
<div class="wa-container">
<div class="wa-section-head">
<div class="wa-kicker">AI, built in</div>
<h2>An assistant your readers can install</h2>
<p>Ship a docs assistant that adds to the home screen, answers from your own content, and reads what readers hand it — backed by hundreds of models and billed only when it runs.</p>
</div>
<div class="wa-features">
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-solid fa-mobile-screen-button"></i></div><h3>Installable assistant</h3><p>A progressive web app — readers add it to a phone or desktop and launch straight into full-screen chat. No app store.</p></div>
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-solid fa-paperclip"></i></div><h3>Multimodal questions</h3><p>Attach images, PDFs, and text or code — by paperclip, drag-and-drop, or paste — and ask about them in context.</p></div>
<div class="wa-feature"><div class="wa-feature__ico"><i aria-hidden="true" class="fa-solid fa-bolt"></i></div><h3>Instant, no-backend search</h3><p>⌘K scores a prebuilt index right in the browser — no Algolia, no crawler, no server to keep running.</p></div>
</div>
<div class="wa-payline">
<p><strong>Free to use.</strong> aardvark builds a plain static site you can host anywhere — Netlify, Vercel, S3, or your own box. You only pay for AI, and only when it runs: <strong>pay-as-you-go</strong>, metered per token through the cloud gateway.</p>
</div>
<div class="wa-marquee-head">300+ models, from every major lab</div>
</div>
{% marquee direction='right' duration=16500 fadeEdges=true gap='0' attr={'role': 'img', 'aria-label': 'Models from every major lab: OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, xAI, Qwen, Cohere, Perplexity, Microsoft, Amazon, and more'} %}
<span class="wa-logo"><img src="/logos/ai-labs/openai.svg" alt="">OpenAI</span>
<span class="wa-logo"><img src="/logos/ai-labs/anthropic.svg" alt="">Anthropic</span>
<span class="wa-logo"><img src="/logos/ai-labs/google.svg" alt="">Google</span>
<span class="wa-logo"><img src="/logos/ai-labs/xai.svg" alt="">xAI</span>
<span class="wa-logo"><img src="/logos/ai-labs/meta.svg" alt="">Meta</span>
<span class="wa-logo"><img src="/logos/ai-labs/mistral.svg" alt="">Mistral AI</span>
<span class="wa-logo"><img src="/logos/ai-labs/deepseek.svg" alt="">DeepSeek</span>
<span class="wa-logo"><img src="/logos/ai-labs/cohere.svg" alt="">Cohere</span>
<span class="wa-logo"><img src="/logos/ai-labs/qwen.svg" alt="">Qwen</span>
<span class="wa-logo"><img src="/logos/ai-labs/perplexity.svg" alt="">Perplexity</span>
<span class="wa-logo"><img src="/logos/ai-labs/microsoft.svg" alt="">Microsoft</span>
<span class="wa-logo"><img src="/logos/ai-labs/amazon.svg" alt="">Amazon</span>
{% endMarquee %}
</section>

</div>
