import { forwardRef, useMemo, useState } from 'react';
import {
  Anchor,
  Badge,
  Box,
  Burger,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {
  IconBrandGithub,
  IconBrandGitlab,
  IconChevronRight,
  IconDownload,
  IconFolder,
  IconFolderOpen,
  IconLicense,
} from '@tabler/icons-react';
import CodeActions, { HighlightedPre } from '@aardvark/islands/code-actions';
import { folderSourceUrl, fileSourceUrl, providerName, sourceHost } from './_githubUrls';
import { formatBytes, iconForLang } from './_treeHelpers';
import { sanitizeHref } from '@aardvark/islands/safe-href';
import './GitFolder.css';

// The island behind the built-in {% gitfolder %} block: an IDE-style browser
// for a public GitHub or GitLab repo folder, fetched at build time (av.fetch_repo_folder).
// A header bar (repo/folder title linking to the provider + a Download ZIP button) sits over a
// two-pane split — a file tree on the left, the selected file on the right: highlighted source
// for code, an inline <img> for images, and a Source⟷Preview toggle for Markdown/SVG, with the
// shared Copy/Download actions (@aardvark/islands/code-actions) and a per-file provider source link. The
// provider is derived from the zipUrl prop (sourceHost in _githubUrls.jsx).
//
// It deliberately does NOT use Mantine's real <AppShell> (a viewport-fixed layout with
// header/navbar/main pinned to the screen — it would break flowing doc content). The look is
// reproduced with a bordered Paper + Flex that lives inline in the page.
//
// Files arrive fully resolved as props — each text file carries its raw `code` and build-time
// Pygments `codeHtml` (the same model as {% file %}), so nothing is fetched or highlighted on
// the client. Binary / too-large files carry no code and are available via the zip. Because
// the widget renders INLINE inside .aardvark-content (no portal, unlike the {% tree %} modal),
// the site's syntax palette already colors the code — no palette change needed.
//
// SSR (the build-time prerender, renderToString): no effects run, but useState/useMemo
// initializers do — so the baked HTML pre-selects the default file (folders default-open) and
// shows real, highlighted content in both panes. The client hydrates that tree, so initial
// selection and ordering must agree on both sides. All helpers here are pure and window-free;
// clipboard touches navigator only inside CodeActions' handlers.

// Build a nested {dirs, files} tree from the flat, POSIX-separated file paths. Folders sort
// before files, each group alphabetically — a stable, conventional file-browser order.
function buildTree(files) {
  const root = { dirs: new Map(), files: [] };
  for (const file of files) {
    const parts = String(file.path || '')
      .split('/')
      .filter((p) => p && p !== '.');
    if (!parts.length) continue;
    const fileName = parts.pop();
    let node = root;
    for (const part of parts) {
      if (!node.dirs.has(part)) node.dirs.set(part, { dirs: new Map(), files: [] });
      node = node.dirs.get(part);
    }
    node.files.push({ ...file, name: file.name || fileName });
  }
  return root;
}

function TreeLevel({ node, depth, selected, onSelect }) {
  const dirs = [...node.dirs.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const files = [...node.files].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      {dirs.map(([name, child]) => (
        <FolderRow key={`d:${name}`} name={name} node={child} depth={depth} selected={selected} onSelect={onSelect} />
      ))}
      {files.map((file) => (
        <FileRow key={file.path} file={file} depth={depth} selected={selected} onSelect={onSelect} />
      ))}
    </>
  );
}

function FolderRow({ name, node, depth, selected, onSelect }) {
  const [open, setOpen] = useState(true); // a fetched subfolder is small — default open
  const FolderIcon = open ? IconFolderOpen : IconFolder;
  return (
    <Box className="aardvark-gitfolder-item">
      <UnstyledButton
        className="aardvark-gitfolder-row"
        data-folder=""
        style={{ '--depth': depth }}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <IconChevronRight size={14} className="aardvark-gitfolder-chevron" data-open={open ? '' : undefined} aria-hidden="true" />
        <FolderIcon size={14} className="aardvark-gitfolder-icon" aria-hidden="true" />
        <span className="aardvark-gitfolder-label" title={name}>{name}</span>
      </UnstyledButton>
      {open ? (
        <div className="aardvark-gitfolder-group">
          <TreeLevel node={node} depth={depth + 1} selected={selected} onSelect={onSelect} />
        </div>
      ) : null}
    </Box>
  );
}

function FileRow({ file, depth, selected, onSelect }) {
  const Icon = iconForLang(file.lang);
  const isSelected = file.path === selected;
  return (
    <Box className="aardvark-gitfolder-item">
      <UnstyledButton
        className="aardvark-gitfolder-row"
        data-file=""
        data-selected={isSelected ? '' : undefined}
        aria-current={isSelected ? 'true' : undefined}
        style={{ '--depth': depth }}
        onClick={() => onSelect(file.path)}
      >
        <span className="aardvark-gitfolder-spacer" aria-hidden="true" />
        <Icon size={14} className="aardvark-gitfolder-icon" aria-hidden="true" />
        <span className="aardvark-gitfolder-label" title={file.path}>{file.name}</span>
      </UnstyledButton>
    </Box>
  );
}

// The Copy/Download cluster over the shared HighlightedPre (both in @aardvark/islands/code-actions, the same
// pair TreeFile and CodeGroup render). Copy/Download act on the raw `code`, never the highlighted
// markup — which is why the two ride as separate props.
function CodeBlock({ file }) {
  return (
    <div className="aardvark-code-block">
      <CodeActions text={file.code} filename={file.name} />
      <HighlightedPre
        code={file.code}
        codeHtml={file.codeHtml}
        lang={file.lang}
        className="aardvark-gitfolder-pre"
        ariaLabel={`Source code for ${file.path}`}
      />
    </div>
  );
}

function ImageView({ file }) {
  return (
    <div className="aardvark-gitfolder-imgwrap">
      <img src={file.image} alt={file.name} loading="lazy" />
    </div>
  );
}

// The provider's brand mark — one chooser for the heading link and the per-file source link,
// so a new provider (or an icon-size change) is one edit, not a hunt for copies.
function BrandIcon({ host, className }) {
  const Icon = host === 'gitlab.com' ? IconBrandGitlab : IconBrandGithub;
  return <Icon size={18} aria-hidden="true" className={className} />;
}

function FilePane({ file, repo, gitRef, folder, host }) {
  // A file is toggleable (Source⟷Preview) when it has both a rendered form and a text
  // source: Markdown (previewHtml) or SVG (a served image + its markup `code`).
  const canPreview = !!file && (!!file.previewHtml || (!!file.image && typeof file.code === 'string'));
  const [view, setView] = useState(canPreview ? 'preview' : 'source'); // remounted per file via key
  if (!file) {
    return (
      <Text c="dimmed" size="sm" className="aardvark-gitfolder-empty">
        Select a file to view its contents.
      </Text>
    );
  }
  const sizeText = formatBytes(file.size);
  const hasCode = typeof file.code === 'string';
  const isRaster = !!file.image && !hasCode; // an image with no text source → display only

  let body;
  if (file.overBudget) {
    // Checked FIRST, ahead of the raster branch, because an over-budget SVG still carries its
    // `image` (the asset costs the page a URL, not its markup) and would otherwise fall into
    // `isRaster` and render as a bare picture — silently losing the Source view the docs
    // promise for SVG, with nothing on screen to say why. It keeps the image AND the note.
    //
    // Distinct from `truncated` on purpose: this file is not too large, the PAGE was — the
    // widget stopped embedding source at its maxEmbedBytes budget. Saying "too large" here
    // would send a reader (or an author) after the wrong number.
    body = (
      <>
        {file.image ? <ImageView file={file} /> : null}
        <Text c="dimmed" size="sm" className="aardvark-gitfolder-note">
          {file.image ? 'Source not shown' : 'Not previewed'} to keep this page small
          {sizeText ? ` · ${sizeText}` : ''} — open it on the source link above, or download it
          from the .zip.
        </Text>
      </>
    );
  } else if (isRaster) {
    body = <ImageView file={file} />;
  } else if (canPreview && view === 'preview') {
    // Markdown → sanitized rendered HTML; SVG → the rendered image.
    body = file.previewHtml ? (
      <div className="aardvark-gitfolder-md" dangerouslySetInnerHTML={{ __html: file.previewHtml }} />
    ) : (
      <ImageView file={file} />
    );
  } else if (file.binary) {
    body = (
      <Text c="dimmed" size="sm" className="aardvark-gitfolder-note">
        Binary file{sizeText ? ` · ${sizeText}` : ''} — download it from the .zip.
      </Text>
    );
  } else if (file.truncated || !hasCode) {
    body = (
      <Text c="dimmed" size="sm" className="aardvark-gitfolder-note">
        {file.truncated
          ? `File too large to preview${sizeText ? ` · ${sizeText}` : ''} — download it from the .zip.`
          : 'No preview available — download it from the .zip.'}
      </Text>
    );
  } else {
    body = <CodeBlock file={file} />;
  }

  return (
    <>
      <div className="aardvark-gitfolder-filehead">
        <Text component="span" className="aardvark-gitfolder-path" fw={600}>
          {file.path}
        </Text>
        <Group gap="sm" wrap="nowrap" className="aardvark-gitfolder-fileactions">
          {canPreview ? (
            <SegmentedControl
              size="xs"
              value={view}
              onChange={setView}
              data={[
                { label: 'Preview', value: 'preview' },
                { label: 'Source', value: 'source' },
              ]}
              className="aardvark-gitfolder-toggle"
            />
          ) : null}
          <Anchor
            href={fileSourceUrl(repo, gitRef, folder, file.path, host)}
            target="_blank"
            rel="noopener noreferrer"
            className="aardvark-gitfolder-ghlink"
            aria-label={`View this file on ${providerName(host)}`}
            title={`View this file on ${providerName(host)}`}
          >
            <BrandIcon host={host} />
          </Anchor>
        </Group>
      </div>
      {body}
    </>
  );
}

const GitFolder = forwardRef(function GitFolder(
  { repo = '', folder = '', gitRef, zipUrl, defaultPath, files = [], license, label, height },
  ref,
) {
  // Default selection: defaultPath if it resolves, else the first previewable file, else the
  // first file, else nothing. Pure → also correct under SSR.
  const initialPath = useMemo(() => {
    if (defaultPath && files.some((f) => f.path === defaultPath)) return defaultPath;
    const firstText = files.find((f) => typeof f.code === 'string');
    return (firstText || files[0])?.path ?? null;
  }, [defaultPath, files]);

  const [selectedPath, setSelectedPath] = useState(initialPath);
  const [navOpen, setNavOpen] = useState(false); // mobile nav (desktop CSS keeps the nav shown)

  const tree = useMemo(() => buildTree(files), [files]);
  const byPath = useMemo(() => new Map(files.map((f) => [f.path, f])), [files]);
  const selected = selectedPath ? byPath.get(selectedPath) : null;
  const canZip = typeof zipUrl === 'string' && zipUrl.length > 0;
  // The provider host, read off the build-constructed archive URL (see _githubUrls.jsx) — it
  // decides every source link's shape, the brand icon, and the link labels below.
  const host = sourceHost(zipUrl);
  // Ref used to build source links: the pinned ref, else HEAD (default branch).
  const srcRef = gitRef || 'HEAD';
  const folderHref = folderSourceUrl(repo, srcRef, folder, host);
  // license.url is untrusted: the build composes it from page-supplied `owner/repo`/`ref` plus a
  // filename taken from the downloaded archive, and a warm cache replays whatever a previous
  // build wrote. Run it through sanitizeHref so a `javascript:`/`data:` URL can't become a
  // clickable footer link (React won't block it).
  const licenseHref = license ? sanitizeHref(license.url) : undefined;

  // On mobile, picking a file drops the reader straight to the content.
  const handleSelect = (path) => {
    setSelectedPath(path);
    setNavOpen(false);
  };

  const bodyStyle = height != null ? { height: typeof height === 'number' ? `${height}px` : height } : undefined;

  return (
    <div data-aardvark-gitfolder="" ref={ref}>
      <Paper withBorder radius="md" className="aardvark-gitfolder" role="group" aria-label={label || `${repo}/${folder}`}>
        <Group className="aardvark-gitfolder-header" justify="space-between" wrap="nowrap" gap="sm">
          <Group gap="xs" wrap="nowrap" className="aardvark-gitfolder-heading" miw={0}>
            <Burger
              opened={navOpen}
              onClick={() => setNavOpen((o) => !o)}
              size="sm"
              className="aardvark-gitfolder-burger"
              aria-label="Toggle file browser"
            />
            <Anchor
              href={folderHref}
              target="_blank"
              rel="noopener noreferrer"
              underline="never"
              className="aardvark-gitfolder-heading-link"
              title={`View this folder on ${providerName(host)}`}
            >
              <BrandIcon host={host} className="aardvark-gitfolder-ghicon" />
              <div className="aardvark-gitfolder-titles">
                <Text fw={600} size="sm" truncate>
                  {repo}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {folder}
                </Text>
              </div>
            </Anchor>
            {gitRef ? (
              <Badge variant="light" size="sm" className="aardvark-gitfolder-ref">
                {gitRef}
              </Badge>
            ) : null}
          </Group>
          {/* The zip is always the WHOLE repo (so the LICENSE comes along) — the tooltip sets
              that expectation. No `download` attr: zipUrl is GitHub's (cross-origin) archive,
              where `download` is spec-ignored anyway — GitHub serves it with
              Content-Disposition: attachment, so the click downloads `repo-ref.zip`. */}
          <Tooltip label="Downloads a ZIP of the entire repository" withArrow position="bottom-end">
            <Button
              component="a"
              href={canZip ? zipUrl : undefined}
              disabled={!canZip}
              leftSection={<IconDownload size={16} />}
              variant="light"
              size="xs"
              className="aardvark-gitfolder-zip"
            >
              Download ZIP
            </Button>
          </Tooltip>
        </Group>
        <Divider />
        <Flex className="aardvark-gitfolder-body" style={bodyStyle}>
          <Box
            className="aardvark-gitfolder-nav"
            data-open={navOpen ? '' : undefined}
            role="group"
            aria-label="Repository files"
          >
            <ScrollArea type="auto" className="aardvark-gitfolder-scroll">
              <div className="aardvark-gitfolder-tree">
                {files.length ? (
                  <TreeLevel node={tree} depth={0} selected={selectedPath} onSelect={handleSelect} />
                ) : (
                  <Text c="dimmed" size="sm" p="xs">
                    No files.
                  </Text>
                )}
              </div>
            </ScrollArea>
          </Box>
          <Box className="aardvark-gitfolder-main">
            <ScrollArea type="auto" className="aardvark-gitfolder-scroll">
              {/* key per file so the Source/Preview toggle resets when the selection changes */}
              <FilePane
                key={selectedPath || 'none'}
                file={selected}
                repo={repo}
                gitRef={srcRef}
                folder={folder}
                host={host}
              />
            </ScrollArea>
          </Box>
        </Flex>
        {/* THREE states, and `undefined` is not `null`. The build omits the `license` prop
            entirely when nothing read this repo's root (a cache written by an older aardvark,
            served without reaching the network), and the whole footer goes with it. `null` is
            a positive finding — the root was read and holds no license file — so it keeps the
            all-rights-reserved line. Rendering that line for an unread repo would assert
            terms nobody checked, which is the one thing this footer must never do. */}
        {license !== undefined && (
          <>
            <Divider />
            <div className="aardvark-gitfolder-footer">
              <IconLicense size={14} aria-hidden="true" />
              {license ? (
                // The file's OWN title, quoted — never a name this code decided on. A null
                // `title` (copyright-first file, or unreadable) still links: read the terms.
                <Text component="span" size="xs" c="dimmed">
                  {license.title ? 'License: ' : ''}
                  {licenseHref ? (
                    <Anchor href={licenseHref} target="_blank" rel="noopener noreferrer" size="xs">
                      {license.title || 'License'}
                    </Anchor>
                  ) : (
                    license.title || 'License'
                  )}
                </Text>
              ) : (
                <Text component="span" size="xs" c="dimmed">
                  No license detected — assume all rights reserved.
                </Text>
              )}
            </div>
          </>
        )}
      </Paper>
    </div>
  );
});

export default GitFolder;
