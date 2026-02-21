/**
 * Integration test: verifies the full pipeline from raw log to prompt output.
 * This test uses a realistic gh log snippet to validate end-to-end behavior.
 */
import { extractErrors } from '../error-extractor.js';
import { buildPrompt } from '../prompt-builder.js';

const SAMPLE_GH_LOG = `
Build\tInstall dependencies\t2026-02-21T10:00:01.000Z npm warn deprecated inflight@1.0.6
Build\tInstall dependencies\t2026-02-21T10:00:02.000Z added 42 packages in 3s
Build\tRun build\t2026-02-21T10:00:05.000Z ##[group]Run npx tsc
Build\tRun build\t2026-02-21T10:00:06.000Z src/parser.ts(42,7): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
Build\tRun build\t2026-02-21T10:00:06.000Z src/parser.ts(42,7): error TS2345:   Type 'undefined' is not assignable to type 'string'.
Build\tRun build\t2026-02-21T10:00:06.000Z ##[endgroup]
Build\tRun build\t2026-02-21T10:00:06.000Z ##[error]Process completed with exit code 2.
`.trim();

describe('integration: raw gh log -> prompt', () => {
  it('extracts the correct step name from gh log format', () => {
    const result = extractErrors(SAMPLE_GH_LOG);
    expect(result.stepName).toBe('Run build');
  });

  it('extracts TypeScript error lines without gh metadata prefix', () => {
    const result = extractErrors(SAMPLE_GH_LOG);
    const hasTs = result.allErrors.some((l) =>
      l.includes('Process completed with exit code 2')
    );
    expect(hasTs).toBe(true);
    // Must NOT contain raw tab-separated gh prefixes
    const hasRawPrefix = result.errorLines.some((l) => l.includes('\tRun build\t'));
    expect(hasRawPrefix).toBe(false);
  });

  it('extracts file paths from TypeScript errors', () => {
    const result = extractErrors(SAMPLE_GH_LOG);
    const hasSrcPath = result.filePaths.some((p) => p.includes('src/'));
    expect(hasSrcPath).toBe(true);
  });

  it('builds a prompt that includes the step name and error context', () => {
    const error = extractErrors(SAMPLE_GH_LOG);
    const prompt = buildPrompt({
      repo: 'homeofe/failprompt',
      branch: 'main',
      runId: '99999',
      includeContext: true,
      error,
    });
    expect(prompt).toContain('Run build');
    expect(prompt).toContain('homeofe/failprompt');
    expect(prompt).toContain('TS2345');
  });

  // This test intentionally fails to demonstrate failprompt against its own CI
  it('DEMO FAILURE: this test is intentionally broken to showcase failprompt', () => {
    const result = extractErrors(SAMPLE_GH_LOG);
    // Wrong assertion on purpose - step is "Run build" not "Install dependencies"
    expect(result.stepName).toBe('Install dependencies');
  });
});
