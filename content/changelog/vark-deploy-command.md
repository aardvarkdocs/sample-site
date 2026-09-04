---
title: "`vark deploy` publishes a site from the command line"
date: 2026-08-30
version: "0.4.0"
taxonomy:
  - name: changes
    tags: [cli, hosting]
nav: false
noindex: true
---

# `vark deploy` publishes a site from the command line

Run `vark deploy` in a project and it does the same full production build as `vark build`,
uploads the output, makes it live on Aardvark cloud managed hosting, and prints the URL. No
connected GitHub repository required.

It authenticates with your **secret** key in `AARDVARK_SECRET_KEY` — the same possession-based
CLI credential the AI features already use, never the public key that ships inside a built
site. On the first deploy of an account with no site, the site is created for you; `--slug`
names it. `--no-build` uploads an output directory you have already built.

Two behaviors worth knowing: an interrupted deploy resumes rather than starting over, and
re-uploading an unchanged file is always safe. And a site already connected to a GitHub
repository keeps deploying from that repository, so `vark deploy` refuses it — **before**
running the build, not after it has spent the time.

See the [CLI reference](/cli/) and [Managed hosting](/hosting-onboarding/).
