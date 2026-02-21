import { execSync } from 'child_process';

/**
 * Maps a raw gh CLI error message to a user-friendly, actionable message.
 */
function mapGhError(rawMsg: string): string {
  if (/command not found/i.test(rawMsg) || /gh: not found/i.test(rawMsg)) {
    return 'Install GitHub CLI: https://cli.github.com';
  }
  if (/not logged into|authentication required|auth/i.test(rawMsg)) {
    return 'Run: gh auth login';
  }
  if (/could not resolve|repository not found|not found/i.test(rawMsg)) {
    return 'Check repo name and that you have access';
  }
  return `gh error: ${rawMsg}`;
}

/**
 * Checks if the `gh` CLI is installed and authenticated.
 * Throws a clear, user-friendly error if not.
 */
function assertGhAvailable(): void {
  try {
    execSync('gh --version', { stdio: 'pipe' });
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    // gh --version failing almost always means gh is not installed
    if (/command not found|not found|no such file/i.test(raw)) {
      throw new Error('Install GitHub CLI: https://cli.github.com');
    }
    throw new Error(`failprompt requires the GitHub CLI (gh). ${mapGhError(raw)}`);
  }

  try {
    execSync('gh auth status', { stdio: 'pipe' });
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    throw new Error(`Not authenticated with GitHub CLI. Run: gh auth login\n(${mapGhError(raw)})`);
  }
}

/**
 * Auto-detects the latest failed run ID on the current branch.
 */
function detectLatestFailedRunId(repo?: string): string {
  const repoFlag = repo ? `--repo ${repo}` : '';
  let branch: string;
  try {
    branch = execSync('git branch --show-current', { stdio: 'pipe' })
      .toString()
      .trim();
  } catch {
    branch = 'main';
  }

  const cmd = `gh run list --branch "${branch}" --status failure --limit 1 --json databaseId --jq '.[0].databaseId' ${repoFlag}`.trim();

  try {
    const result = execSync(cmd, { stdio: 'pipe' }).toString().trim();
    if (!result || result === 'null') {
      throw new Error(`No failed runs found on branch "${branch}".`);
    }
    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to detect latest failed run: ${msg}`);
  }
}

/**
 * Fetches the failed log from GitHub Actions via the `gh` CLI.
 *
 * @param runId  - Optional specific run ID. If omitted, auto-detects latest failed run.
 * @param repo   - Optional repo in "owner/repo" format. Defaults to origin.
 * @returns Raw log string from `gh run view --log-failed`
 */
export function fetchFailedLog(runId?: string, repo?: string): string {
  assertGhAvailable();

  const resolvedRunId = runId ?? detectLatestFailedRunId(repo);
  const repoFlag = repo ? `--repo ${repo}` : '';

  const cmd = `gh run view ${resolvedRunId} --log-failed ${repoFlag}`.trim();

  try {
    const output = execSync(cmd, {
      stdio: 'pipe',
      maxBuffer: 50 * 1024 * 1024, // 50 MB
    });
    return output.toString();
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to fetch CI log for run ${resolvedRunId}: ${mapGhError(raw)}`);
  }
}
