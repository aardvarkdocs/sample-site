---
title: Password protection
description: Encrypt a directory of pages at build time and have readers unlock them in
  the browser with a password — no server or auth provider required.
menu: docs
weight: 57
icon: fa-solid fa-lock
---

# Password protection

aardvark builds a fully static site, so there's no server to check a login. The `protected`
option instead **encrypts** every page under a directory at build time and ships an opaque
blob plus a small loader page. Readers unlock it in the browser with a password; the
plaintext is never published.

It's real encryption — **AES‑256‑GCM**, with the key derived from your password via
**PBKDF2** (SHA‑256, 600,000 iterations). The only thing standing between a visitor and the
content is the password, so choose a strong one.

**Try it live:** this site has a demo at **[/secretpage/](/secretpage/)** — open it and unlock
it with the password `secret!` (shared on purpose, since it's just a demo). View source first
if you like: you'll find only an encrypted blob until you enter the password.

## Configuration

Add a `protected` list to `aardvark.config.yaml`. Each entry names a content‑relative
directory and the **environment variable** that holds its password at build time — you
never put the password itself in the config:

```yaml
protected:
  - path: internal            # encrypts content/internal/**.md
    passwordEnv: DOCS_INTERNAL_PW
  - path: partners/secret     # a second area with its own password
    passwordEnv: PARTNERS_PW
```

You can protect any number of directories, each with a different password. The directory is
matched on whole path segments, so `internal` protects `internal/` but not `internal-notes/`.
If you nest entries (`internal` and `internal/secret`), pages use the **most specific**
match's password.

## Building

Set the password in the environment (a local, git‑ignored `.env` works — `vark build` and
`vark dev` load it automatically) and build as usual:

```bash
export DOCS_INTERNAL_PW='a strong passphrase'
vark build
```

If a protected directory's environment variable is **unset or empty**, the build **fails**
rather than risk publishing the pages unencrypted — nothing is written and your previous
build stays in place.

## What readers see

Visiting a protected page shows a password box. On the correct password the real page is
decrypted and rendered in place — fully interactive, exactly as if it had loaded normally.
The password is remembered for the rest of the browser‑tab session, so other protected pages
in the same area open without re‑prompting. After three wrong guesses the box stops asking;
because the attempt count is saved in your browser, reloading the page won't reset it — to try
again, clear the site's saved data in your browser.

On a multilingual site, a directory and all its translations share one password (protection
is matched on the language‑agnostic source path), so unlocking, say, `/en/internal/` in a tab
also unlocks `/fr/internal/` — same content, same password.

Decryption uses the browser's WebCrypto API, which requires a **secure context**: the page
must be served over **HTTPS** (or `localhost`). Over a `file://` path or plain HTTP on a LAN
address the reader gets a "secure connection required" message instead of the prompt.

The decrypted page is rendered with `document.write`, so a site that sets a strict
**Trusted Types** policy (`Content-Security-Policy: require-trusted-types-for 'script'`) will
block the unlock — don't apply that CSP to protected pages.

A separate concern is a **nonce-based CSP** (`Content-Security-Policy: script-src 'nonce-…'`).
A static-only deploy can't serve a real one — a nonce baked into a fixed `_headers` file is the
same on every request, so it's guessable and non-functional. It works only behind a dynamic edge
layer (Cloudflare Pages middleware/Worker, a Netlify Edge Function) that mints a fresh nonce per
request and stamps it onto the loader's own script tag. In that setup aardvark automatically
propagates the loader's nonce onto the revived island module scripts, so they mount; without the
propagation those scripts would be silently CSP-blocked. (A `'strict-dynamic'` policy needs no
nonce on the island scripts — they're created by the already-trusted loader and inherit its trust.)

## What stays private — and what doesn't

Protected pages are kept out of every discovery surface aardvark emits: the **sitemap**,
**on‑site search index**, **`llms.txt` / `llms-full.txt`**, **hover cards**, **Open Graph
cards**, **RSS feeds**, and their plaintext **`.md` siblings**. Search engines and the AI
assistant never see their contents.

Two things are *not* encrypted, so don't rely on them being secret:

- **The URL.** The loader page lives at the page's normal address, so the path itself is
  discoverable. The *content* is encrypted; the location isn't.
- **Navigation labels.** If a protected page appears in your sidebar or is linked from a
  public page, its title/link text is ordinary chrome and remains visible. Keep secrets in
  the page body, not in titles or filenames.

## Security notes

- **The password is the whole defense — make it strong.** The page key is derived with
  PBKDF2 (SHA‑256, 600,000 iterations — the OWASP 2023 minimum). Anyone can download the `.enc`
  blob and try passwords
  offline on fast hardware, so a short or dictionary password can be cracked. Use a long,
  random passphrase, and treat this as protection for low‑to‑moderate‑sensitivity content —
  not a substitute for server‑side authentication on truly sensitive data.
- **The unlock is cached in the browser for the tab session.** After a successful unlock the
  *derived key* — not your password — is stored in `sessionStorage` (and cleared when the tab
  closes), so other protected pages in the same area open instantly without re‑prompting. Like
  anything in web storage it is readable by JavaScript on your own origin, but it is only the
  key for that one area (it can't recover your password or unlock anything re‑encrypted later).
  Even so, don't combine protected pages with untrusted third‑party scripts.
- **At build time the password is a normal build secret.** It's read from its env var and lives in
  the build process's memory (and environment) for that run — readers never receive it (only the
  derived key and ciphertext ship). Treat the env var like any deploy secret: keep it out of shell
  history and CI logs, and prefer your platform's secret store over a checked‑in value.
- **Encrypted blobs are served `no-store`.** Each rebuild mints a fresh salt, so the `.enc`
  payload changes — but the cached key (above) would still decrypt a *stale* blob carrying the
  old salt, silently showing outdated content in an open tab. To prevent that, aardvark adds a
  `Cache-Control: no-store` rule for `/*.enc` to the generated `_headers` file, so the browser and
  CDN always fetch the current blob (a rotated salt then re‑prompts instead). The `_headers` file is
  honored by **Cloudflare Pages** and **Netlify**, whose `*` wildcard also matches across `/` so the
  rule reaches nested directories. Other targets — **Vercel** (`vercel.json` headers), a plain
  **nginx**/Apache config, or any **self‑host** — don't read `_headers`, so add an equivalent
  `Cache-Control: no-store` on `.enc` files there yourself. A few hosts — notably **GitHub Pages** —
  expose *no* custom-header mechanism at all, so you can't set `no-store` there; that's still safe
  (the blobs are encrypted), but after you rotate a password an already-unlocked reader keeps seeing
  the old content until their cached copy expires or they close the tab. Skipping the header is never
  a confidentiality risk — only a staleness one.
