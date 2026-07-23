---
title: Secret page (demo)
description: A live demo of password protection — unlock it to see the encrypted content.
menu: docs
weight: 58
icon: fa-solid fa-unlock
---

# You're in

If you can read this, your browser just decrypted this page.

The content was **AES-256-GCM encrypted at build time** and served as an opaque `.enc` blob.
Nothing in the page source, the sitemap, the on-site search index, or `llms.txt` revealed this
text. Your browser fetched the blob, derived the key from the password with PBKDF2 (600,000
iterations), and decrypted it locally — no server check involved.

Notice that the page is otherwise completely normal: the sidebar, search, theme, and every
interactive component work exactly as on any other page, because what got decrypted is the
full rendered page.

See [Password protection](/protected-pages/) for how to set this up on your own site.
