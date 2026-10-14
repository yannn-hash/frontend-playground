import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
let sha = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || 'local';
if (sha === 'local') {
  try {
    sha = execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    /* An uncommitted local checkout has no release SHA. */
  }
}
await writeFile(
  'dist/version.json',
  JSON.stringify({ version: '1.0.0', commit: sha, builtAt: new Date().toISOString() }, null, 2),
);
