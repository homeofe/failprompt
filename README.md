# failprompt

> **Parse CI failure logs and generate ready-to-paste AI prompts — in one command.**

```bash
npx failprompt --run 1234
# → copies a structured prompt to clipboard, ready for Claude / ChatGPT / Copilot
```

---

## The Problem

Every developer using AI has done this manually:

1. CI fails on GitHub Actions / Jenkins / GitLab
2. Open the run, scroll through 200 lines of logs
3. Copy the relevant error
4. Paste into Claude: *"what's wrong with this?"*
5. Paste the relevant file
6. Get the fix

`failprompt` automates steps 2–5.

---

## Features (planned)

- **GitHub Actions** support (`gh` CLI integration)
- **GitLab CI** support
- **Jenkins** support
- Extracts the relevant error section — not 200 lines of noise
- Pulls the failing file from git context automatically
- Outputs a structured prompt optimised for LLMs
- Pipe-friendly: `failprompt | pbcopy`, `failprompt | wl-copy`, `failprompt | xclip`

---

## Usage (planned)

```bash
# Latest failed run on current branch
failprompt

# Specific run ID
failprompt --run 1234

# Pipe to clipboard (macOS)
failprompt | pbcopy

# Pipe to clipboard (Linux)
failprompt | xclip -selection clipboard

# Output to file
failprompt --output prompt.md
```

---

## Installation (planned)

```bash
npm install -g failprompt
# or
npx failprompt
```

---

---

## ⚠️ AAHP Case Study

> **This project is a public demonstration of the [AAHP Protocol](https://github.com/homeofe/AAHP).**
>
> It was built end-to-end by a multi-agent pipeline (Sonar → Opus → Sonnet → Review → Fix)
> with no manual code writing. Every decision is documented in `.ai/handoff/LOG.md`.
>
> The goal is to show how AAHP enables autonomous, auditable, multi-agent software development
> — not just as a concept, but as a working repository you can clone and inspect.
>
> Read the handoff files to see exactly what each agent decided and why:
> - [`.ai/handoff/STATUS.md`](.ai/handoff/STATUS.md) — current build state
> - [`.ai/handoff/LOG.md`](.ai/handoff/LOG.md) — full agent journal
> - [`.ai/handoff/NEXT_ACTIONS.md`](.ai/handoff/NEXT_ACTIONS.md) — task queue

---

## License

MIT
