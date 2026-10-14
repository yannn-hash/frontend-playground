import { execFileSync } from 'node:child_process';
let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
  try {
    const credential = execFileSync('git', ['credential', 'fill'], {
      input: 'protocol=https\nhost=github.com\n\n',
      encoding: 'utf8',
      timeout: 8000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' },
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    token = credential
      .split('\n')
      .find((line) => line.startsWith('password='))
      ?.slice(9);
  } catch {
    /* Report missing authentication without triggering an interactive sign-in. */
  }
}
const result = {
  github: { authenticated: false, login: null, repositoryExists: false },
  cloudflare: {
    tokenAvailable: !!(process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN),
    accountAvailable: !!process.env.CLOUDFLARE_ACCOUNT_ID,
  },
};
if (token) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'frontend-arcade-setup' },
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) {
      const user = await response.json();
      result.github.authenticated = true;
      result.github.login = user.login;
      const repo = await fetch('https://api.github.com/repos/yannn-hash/frontend-playground', {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'frontend-arcade-setup' },
        signal: AbortSignal.timeout(8000),
      });
      result.github.repositoryExists = repo.ok;
    }
  } catch {
    /* No credentials or response bodies are logged. */
  }
}
console.log(JSON.stringify(result));
