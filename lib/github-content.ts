const GITHUB_OWNER = 'samotorosyan7-art';
const GITHUB_REPO = 'new-versus';
const GITHUB_BRANCH = 'main';
const GIT_API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git`;

const COMMIT_AUTHOR = {
  name: 'Versus Admin Panel',
  email: 'samvel.torosyan@tirsoft.co',
};

export function isProductionRuntime() {
  return process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL?.includes('localhost');
}

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN is not configured on the server.');
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

async function githubRequest(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, headers: authHeaders(), cache: 'no-store' });
  if (!res.ok) throw new Error(`GitHub API error (${res.status}): ${await res.text()}`);
  return res.json();
}

export type FileChange = {
  path: string;
  content: string;
  /** 'utf-8' for text content (mdx, json); 'base64' for binary content (images). */
  encoding: 'utf-8' | 'base64';
};

/**
 * Writes and/or deletes several files as a single commit against the Git Data API,
 * so a save that touches multiple locale files (and maybe an image) triggers exactly
 * one push — and one deploy — instead of one per file.
 */
export async function commitFiles(changes: FileChange[], deletions: string[], message: string) {
  if (changes.length === 0 && deletions.length === 0) return null;

  const ref = await githubRequest(`${GIT_API_BASE}/ref/heads/${GITHUB_BRANCH}`);
  const latestCommitSha = ref.object.sha as string;

  const latestCommit = await githubRequest(`${GIT_API_BASE}/commits/${latestCommitSha}`);
  const baseTreeSha = latestCommit.tree.sha as string;

  const changeEntries = await Promise.all(
    changes.map(async (change) => {
      if (change.encoding === 'utf-8') {
        return { path: change.path, mode: '100644', type: 'blob', content: change.content };
      }
      const blob = await githubRequest(`${GIT_API_BASE}/blobs`, {
        method: 'POST',
        body: JSON.stringify({ content: change.content, encoding: 'base64' }),
      });
      return { path: change.path, mode: '100644', type: 'blob', sha: blob.sha as string };
    })
  );
  const deletionEntries = deletions.map((path) => ({ path, mode: '100644', type: 'blob', sha: null }));

  const newTree = await githubRequest(`${GIT_API_BASE}/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree: [...changeEntries, ...deletionEntries] }),
  });

  const newCommit = await githubRequest(`${GIT_API_BASE}/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [latestCommitSha],
      author: COMMIT_AUTHOR,
      committer: COMMIT_AUTHOR,
    }),
  });

  await githubRequest(`${GIT_API_BASE}/refs/heads/${GITHUB_BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha }),
  });

  return newCommit;
}
