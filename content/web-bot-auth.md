---
description: Publish a Web Bot Auth key directory so your site can identify itself when an
  agent sends signed requests on its behalf.
icon: fa-solid fa-robot
menu: ai
title: Web Bot Auth
weight: 70
---

# Web Bot Auth

[Web Bot Auth](https://datatracker.ietf.org/wg/webbotauth/about/) lets a site identify itself
when an automated agent sends requests on its behalf. The agent signs each request with an
Ed25519 key ([HTTP Message Signatures, RFC 9421](https://www.rfc-editor.org/rfc/rfc9421)) and points a `Signature-Agent` header at a
public **key directory**; the receiving site fetches that directory, looks up the key, and
verifies the signature. Checkers such as [isitagentready.com](https://isitagentready.com) look
for this directory at `/.well-known/http-message-signatures-directory`.

Aardvark **publishes** that directory. It never signs outbound requests itself, so it never
holds a private key — you list your public key(s), and the matching private key lives wherever
your signing agent runs.

## Generate a key

`vark web-bot-auth-keygen` mints an Ed25519 keypair and prints both halves:

```bash
vark web-bot-auth-keygen
```

```text
Generated an Ed25519 keypair for Web Bot Auth.

Private key — store as a secret; your signing agent needs it (NOT recoverable):
  <PRIVATE_KEY>

Public key — add to aardvark.config.yaml:

  webBotAuth:
    keys:
      - <PUBLIC_KEY>

Key ID (JWK thumbprint): <KEY_ID>
```

Store the **private** key as a secret for your agent — Aardvark never persists it, so save it
now. Add the **public** key to your config. For scripting, `vark web-bot-auth-keygen --json`
prints the same three values as `{"privateKey", "x", "kid"}`.

## Configure

```yaml
webBotAuth:
  keys:
    - <PUBLIC_KEY>   # a bare base64url Ed25519 public key
```

Each entry is either a bare public-key string (Aardvark fills in the JWK fields and computes the
`kid` thumbprint) or a full [JWK](https://www.rfc-editor.org/rfc/rfc7517) mapping if you want to
pin `kid`, `alg`, or key-rotation windows (`nbf` / `exp`):

```yaml
webBotAuth:
  keys:
    - kty: OKP
      crv: Ed25519
      x: <PUBLIC_KEY>
      kid: <KEY_ID>     # pin the JWK thumbprint, optional
      alg: EdDSA        # pin the signature algorithm (EdDSA for an Ed25519 key), optional
      nbf: 1712793600   # not-before (Unix time), optional
      exp: 1715385600   # expires, optional — keep old + new keys overlapping when rotating
```

Listing `keys` turns the feature on. `webBotAuth: true` publishes an empty directory (valid, but
the build warns until you add a key); `webBotAuth: { enabled: false }` turns it off even with keys
present.

{% callout severity="info" title="Good to know" %}
- **Only Ed25519 keys are accepted.** Every key is checked at build time: a string that isn't a
  valid base64url 32-byte Ed25519 public key fails the build, and so does a JWK whose `kty`, `crv`,
  `alg` or `use` disagrees with `OKP` / `Ed25519` / `EdDSA` / `sig` — a key of another type pasted
  in with a matching `x` would otherwise publish a directory no verifier accepts.
- **A private JWK is never published, but it does get noticed.** If a pasted JWK carries private
  members (`d` and friends), the build warns so you can move that key out of
  `aardvark.config.yaml` and into a secret; only the public members reach the directory.
- A JWK with an empty `kid` gets the computed thumbprint instead.
{% endCallout %}

## What gets published

`vark build` writes the directory as a JWKS to
`/.well-known/http-message-signatures-directory`:

```json
{
  "keys": [
    {
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "<PUBLIC_KEY>",
      "kid": "<KEY_ID>",
      "use": "sig"
    }
  ]
}
```

It is served with `Content-Type: application/http-message-signatures-directory+json`, a
one-day cache, open CORS (`Access-Control-Allow-Origin: *`, so a browser-based verifier can fetch it
cross-origin) and `X-Content-Type-Options: nosniff`. The directory holds **public** key material
only, so it is a plain static file:
[`vark serve`](/self-hosting/) serves it directly, and on Cloudflare Pages / Netlify the
generated [`_headers`](/llms-and-sitemap/) rule sets its media type. If you ship your own
`static/.well-known/http-message-signatures-directory`, Aardvark leaves it untouched.
