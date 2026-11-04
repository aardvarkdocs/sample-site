// Pure source-URL builders for the {% gitfolder %} island (GitFolder.jsx), kept in a
// `_`-prefixed helper so they're easy to unit-test without importing the island (and its CSS).
// `ref` is the pinned ref or "HEAD" (which the provider resolves to the default branch). Path
// segments are encodeURIComponent'd, and empty segments are dropped, so a leading/trailing or
// doubled "/" never produces a malformed URL. No JSX/React here — safe under SSR and in tests.
//
// Provider-aware: the widget serves GitHub and GitLab repos, whose web URL shapes differ only
// in the host and GitLab's `/-/` resource separator. The island derives the host from the
// build-constructed `zipUrl` prop (sourceHost) rather than a dedicated prop — the archive URL
// already names exactly the host the content came from, so the two can never disagree.

const GITLAB_HOST = 'gitlab.com';

// The provider host for a widget's source links, read off its whole-repo archive URL.
// Build-constructed input (the build emits only github.com / gitlab.com archive URLs), so a
// plain prefix test is reliable; anything else defaults to GitHub, the pre-GitLab behavior.
export function sourceHost(zipUrl) {
  return typeof zipUrl === 'string' && zipUrl.startsWith(`https://${GITLAB_HOST}/`)
    ? GITLAB_HOST
    : 'github.com';
}

export function providerName(host) {
  return host === GITLAB_HOST ? 'GitLab' : 'GitHub';
}

export function encPath(p) {
  return String(p)
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');
}

// The folder's page on the provider. In whole-repo mode (no folder) link to the repo home —
// GitHub 404s on a bare `/tree/HEAD/` with no path segment. `ref` goes through encPath (not
// encodeURIComponent) so a slash-containing branch like `release/v2` keeps its `/` — GitHub
// 404s on the `%2F` that encodeURIComponent would produce. GitLab's directory browser lives
// under its `/-/` resource separator.
export function folderSourceUrl(repo, ref, folder, host = 'github.com') {
  if (!folder) return `https://${host}/${repo}`;
  const tree = host === GITLAB_HOST ? '/-/tree/' : '/tree/';
  return `https://${host}/${repo}${tree}${encPath(ref)}/${encPath(folder)}`;
}

// A single file's blob page on the provider. `folder` may be "" (whole-repo mode); encPath
// drops the empty segment so the path is just the file's repo-relative path.
export function fileSourceUrl(repo, ref, folder, path, host = 'github.com') {
  const blob = host === GITLAB_HOST ? '/-/blob/' : '/blob/';
  return `https://${host}/${repo}${blob}${encPath(ref)}/${encPath(`${folder}/${path}`)}`;
}
