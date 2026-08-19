const GITHUB_OWNER = 'samotorosyan7-art';
const GITHUB_REPO = 'new-versus';
const GITHUB_BRANCH = 'main';
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

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

async function getFileSha(repoPath: string): Promise<string | null> {
  const res = await fetch(`${API_BASE}/${repoPath}?ref=${GITHUB_BRANCH}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.sha as string;
}

async function putContent(repoPath: string, base64Content: string, message: string) {
  const sha = await getFileSha(repoPath);
  const res = await fetch(`${API_BASE}/${repoPath}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: GITHUB_BRANCH,
      committer: COMMIT_AUTHOR,
      author: COMMIT_AUTHOR,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub API error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function commitFile(repoPath: string, content: string, message: string) {
  return putContent(repoPath, Buffer.from(content, 'utf8').toString('base64'), message);
}

// For binary files (e.g. uploaded images) whose content is already base64-encoded.
export async function commitBinaryFile(repoPath: string, base64Content: string, message: string) {
  return putContent(repoPath, base64Content, message);
}

export async function deleteFile(repoPath: string, message: string) {
  const sha = await getFileSha(repoPath);
  if (!sha) return { skipped: true };
  const res = await fetch(`${API_BASE}/${repoPath}`, {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify({
      message,
      sha,
      branch: GITHUB_BRANCH,
      committer: COMMIT_AUTHOR,
      author: COMMIT_AUTHOR,
    }),
  });
  if (!res.ok) throw new Error(`GitHub API error (${res.status}): ${await res.text()}`);
  return res.json();
}
