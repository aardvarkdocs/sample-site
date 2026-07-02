# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv
#
# The check above is intentionally skipped for SECRET_PAGE_PW / AARDVARK_KEY (below). BuildKit
# flags any secret-looking ARG, but here it's a false positive for the threat model that matters:
#   1. Both are consumed ONLY in the discarded stage-1 builder; the runtime image copies just
#      build/ forward, so neither value lands in a published layer or `docker history`.
#   2. This image is built by Cloudflare's container service via wrangler `image_vars`, which is
#      defined as "equivalent to --build-arg" — there is no build-time secret-mount channel to
#      switch to (`RUN --mount=type=secret`), so build-args are the only delivery mechanism.
#   3. AARDVARK_KEY is the *public* gateway key (baked into the public ai-config.json anyway);
#      SECRET_PAGE_PW only guards the demo /secretpage/. Neither is a runtime credential.
#
# Build & serve THIS docs site (static files + a live MCP server at /mcp) with `vark serve`,
# using the published `vark` release binary -- no source build, no Python/uv toolchain in the
# image. Drop this file in your docs project root (next to aardvark.config.yaml + content/):
#
#   DOCKER_BUILDKIT=1 docker build -t my-docs .
#   docker run --rm -p 8080:8080 --read-only --tmpfs /tmp my-docs
#   docker buildx build --platform linux/amd64,linux/arm64 -t my-docs .   # multi-arch
#
# The project is BIND-MOUNTED read-only at build time and rendered in-container; the source
# Markdown never lands in an image layer. Only the built assets (build/), the vark binary, and
# aardvark.config.* travel in the final runtime image.
#
# REQUIRES a vark release whose binary includes `serve` (>= 0.1.6 -- the release this feature
# first ships in; 0.1.5 and earlier have no `serve` command). VARK_VERSION defaults to `latest`
# (the newest published tap release, resolved at build time), so a new vark is picked up
# automatically; pass --build-arg VARK_VERSION=X.Y.Z to pin a specific version instead.
#
# SUPPLY CHAIN: pass --build-arg VARK_SHA256=<hash> to verify the downloaded tarball before it's
# installed (the per-arch hash is published with the tap release / Homebrew formula). When set the
# build fails on mismatch or a MITM'd asset; left unset it proceeds on HTTPS trust alone and warns.
# The hash is per-arch, so set it on single-arch builds; for a multi-arch buildx build, verify each
# arch separately. Set it for any image you publish.

ARG VARK_VERSION=latest
ARG VARK_SHA256=""
# Build-time only (stage 1): encrypt protected dirs and bake AARDVARK_KEY into ai-config.json.
# Passed via wrangler `image_vars` at deploy (scripts/cf-container-deploy.sh / GHA secrets).
# Not present in the runtime image — only the rendered build/ output is copied forward.
ARG SECRET_PAGE_PW=""
ARG AARDVARK_KEY=""

# ---- stage 1: render the site ----------------------------------------------
# node:22 supplies Node for the Mantine "islands" esbuild bundle; curl fetches the release
# binary (resolving VARK_VERSION=latest to the newest tap release via the /releases/latest
# redirect — the asset filename embeds the version, so a concrete number is needed for the URL).
# Both this and the runtime base are Debian trixie: the published Linux binaries are built on
# native Ubuntu 24.04 CI runners and link glibc >= 2.38, which Debian bookworm (glibc 2.36) is
# too old to run — `vark --version` aborts with "GLIBC_2.38 not found". trixie ships glibc 2.41,
# clearing that floor while keeping the builder and runtime on the same Debian for a stable ABI.
FROM node:22-trixie-slim AS builder
# A UTF-8 locale is required: `vark build` bundles the Mantine islands by capturing the Node/esbuild
# subprocess output, and esbuild emits non-ASCII bytes. Under the default C/POSIX locale Python
# decodes that pipe as ASCII and aborts with a UnicodeDecodeError. C.UTF-8 is built into glibc (no
# locales package needed) and makes the captured output decode as UTF-8.
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
ARG VARK_VERSION
ARG VARK_SHA256
ARG SECRET_PAGE_PW
ARG AARDVARK_KEY
ARG TARGETARCH
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends curl ca-certificates; \
    rm -rf /var/lib/apt/lists/*; \
    case "${TARGETARCH:-amd64}" in \
      amd64) asset="linux-x86_64" ;; \
      arm64) asset="linux-aarch64" ;; \
      *) echo "unsupported TARGETARCH='${TARGETARCH}'" >&2; exit 1 ;; \
    esac; \
    ver="${VARK_VERSION:-latest}"; \
    if [ "$ver" = "latest" ]; then \
      ver="$(curl -fsSL -o /dev/null -w '%{url_effective}' https://github.com/aardvarkdocs/homebrew-tap/releases/latest | sed -E 's#.*/tag/v?##')"; \
      [ -n "$ver" ] || { echo "ERROR: could not resolve the latest vark release from the tap" >&2; exit 1; }; \
      echo "VARK_VERSION=latest resolved to ${ver}"; \
    fi; \
    curl -fsSL -o /tmp/vark.tgz \
      "https://github.com/aardvarkdocs/homebrew-tap/releases/download/v${ver}/aardvark-${ver}-${asset}.tar.gz" \
      || { echo "ERROR: could not fetch vark ${ver} (${asset}). VARK_VERSION must be 'latest' or a PUBLISHED release whose binary includes 'vark serve' (>= 0.1.6 — the release this feature ships in; 0.1.5 and earlier cannot serve)." >&2; exit 1; }; \
    if [ -n "$VARK_SHA256" ]; then \
      echo "${VARK_SHA256}  /tmp/vark.tgz" | sha256sum -c -; \
    else \
      echo "WARNING: VARK_SHA256 unset — installing vark on HTTPS trust alone; pass --build-arg VARK_SHA256=<hash> to verify." >&2; \
    fi; \
    tar -xz -C /usr/local/bin -f /tmp/vark.tgz vark; \
    rm -f /tmp/vark.tgz; \
    vark --version

WORKDIR /site
# Bind-mount the docs project (the build context, minus .dockerignore'd paths) and render it.
# npm ci + vark build need a writable tree, so copy the mount into /site first; this builder
# stage is discarded, so the source only ever exists in throwaway layers -- never in the final
# image. `npm ci` is skipped for sites with no islands toolchain (no package.json).
RUN --mount=type=bind,target=/ctx,readonly \
    set -eux; \
    cp -R /ctx/. /site; \
    if [ -f package.json ]; then npm ci --no-fund; fi; \
    vark build --root /site; \
    test -d /site/build  # fail the image build if no assets were produced

# ---- stage 2: serve ---------------------------------------------------------
# The release binary is a self-contained Nuitka onefile (it bundles its own Python), so the
# runtime needs only glibc -- debian:trixie-slim, the same Debian as the builder for a stable
# ABI (trixie's glibc 2.41 satisfies the binary's >= 2.38 floor; see the builder note above).
# curl is the only added package, for the HEALTHCHECK (debian-slim ships neither curl nor a
# usable Python on PATH; the onefile's interpreter is internal, not callable).
FROM debian:trixie-slim AS runtime
LABEL org.opencontainers.image.title="aardvark-docs" \
      org.opencontainers.image.description="Serve an aardvark docs site + a live MCP server"
# Same UTF-8 locale rationale as the builder: `vark serve` reads/serves UTF-8 docs content and the
# MCP tools, so keep Python out of the ASCII default C/POSIX locale here too. C.UTF-8 is built into
# glibc (no locales package needed).
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends curl; \
    rm -rf /var/lib/apt/lists/*; \
    useradd --system --uid 10001 --create-home --home-dir /home/app app

COPY --from=builder /usr/local/bin/vark /usr/local/bin/vark
# Only the built assets travel: the rendered site, plus the config `vark serve` reads to resolve
# the output dir and the mcp/search flags. No Markdown source, no Node, no venv.
COPY --from=builder /site/build /srv/site/build
# Copy the project config (if any) via find — NOT `COPY /site/aardvark.config.*`: BuildKit aborts a
# glob COPY with "no source files were specified" on NO match, but a minimal aardvark project runs
# fine on defaults with no config file at all. find exits 0 on no match (cp simply isn't run).
RUN --mount=type=bind,from=builder,source=/site,target=/bsite \
    find /bsite -maxdepth 1 -name 'aardvark.config.*' -exec cp {} /srv/site/ \;

EXPOSE 8080
USER app
WORKDIR /srv/site

# The onefile binary self-extracts to $TMPDIR on startup; when running `--read-only`, give it a
# writable /tmp (`--tmpfs /tmp`). The healthcheck hits the in-process /healthz.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS -o /dev/null "http://127.0.0.1:8080/healthz" || exit 1

# TLS is terminated by the CDN/LB in front (see content/self-hosting.md); pass --trusted-proxy
# its CIDR(s) so the per-IP /mcp rate limit keys on the real client. Append flags to
# `docker run ... my-docs --no-mcp` etc.
ENTRYPOINT ["vark", "serve", "--root", "/srv/site", "--host", "0.0.0.0", "--port", "8080"]
