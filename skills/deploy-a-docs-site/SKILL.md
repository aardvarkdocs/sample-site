---
name: deploy-a-docs-site
description: Build an aardvark documentation site and deploy it to a static host. Use when someone wants to publish, ship, or host their aardvark docs.
---

# Deploy an aardvark documentation site

1. Set `baseUrl` in `aardvark.config.yaml` to the site's canonical URL, so the
   `sitemap.xml` and `robots.txt` emit absolute links.
2. From the project root, run `vark build`. The static site is written to the
   `build/` directory, including the generated `_redirects` and `_headers` files.
3. Preview it locally with `vark dev` (live-reload while you edit) or serve the
   production build exactly as a host would with `vark serve`.
4. Upload the contents of `build/` to any static host — Cloudflare Pages, Netlify,
   S3, or GitHub Pages. Cloudflare Pages and Netlify honor `_redirects` and
   `_headers`; other hosts serve the files but ignore those rules.
