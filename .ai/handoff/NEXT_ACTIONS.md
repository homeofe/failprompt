# failprompt — Next Actions for Incoming Agent

> Priority order. Work top-down. Each item is self-contained.

---

## 1. Research & Architecture (Sonar → Opus)

**Goal:** Define the technical foundation for failprompt MVP.

**Sonar should research:**
- GitHub Actions REST API: how to fetch run logs programmatically (`gh` CLI vs direct API)
- Existing Node.js libraries for CI log parsing (if any)
- How other CLI tools handle clipboard output cross-platform (pbcopy / xclip / wl-copy)
- Best practices for Node.js CLI tools in 2025 (commander vs yargs vs citty, ESM vs CJS)
- npm publish workflow for a CLI tool (`bin` field, shebang line)

**Opus should then decide:**
- Package structure (single file vs src/ layout)
- CLI argument parsing library
- GitHub API access strategy (gh CLI wrapper vs @octokit/rest)
- Output format for the generated prompt
- Error extraction heuristics (what counts as "the relevant error"?)

---

## 2. Implementation (Sonnet)

**Goal:** Build the MVP — GitHub Actions log fetch + error extraction + prompt output.

**Must implement:**
- `failprompt` CLI entrypoint with `--run`, `--repo`, `--output` flags
- GitHub Actions integration: fetch logs for a run ID (or latest failed run on current branch)
- Error extraction: find the failing step, trim noise, surface the relevant lines
- Git context: automatically include the relevant source file if identifiable from the error
- Prompt template: structured output that works well as an LLM input
- Pipe-friendly: stdout by default, clean (no spinner noise on stdout)
- Cross-platform clipboard hint in output footer

**Must include:**
- Unit tests with mocked GitHub API responses
- `README.md` usage examples updated with real commands
- `package.json` with `bin` field, ready for `npx`

---

## 3. Review Round (Opus + ChatGPT)

**After implementation:** standard AAHP discussion round.

---

## Recently Completed

| Item            | Resolution                             |
| --------------- | -------------------------------------- |
| Project setup   | Repo initialized, README + AAHP files  |
