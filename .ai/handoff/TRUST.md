# failprompt: Trust Register

> Tracks what is verified, assumed, or unknown.
> **verified** = agent ran code/tests to confirm · **assumed** = derived from docs/config · **untested** = unknown

---

## Build System

| Property                    | Status    | Last Verified | Agent               | Notes                              |
| --------------------------- | --------- | ------------- | ------------------- | ---------------------------------- |
| `tsc --build` passes        | verified  | 2026-02-21    | Claude Sonnet 4.6   | Clean, zero errors                 |
| `npm test` passes           | verified  | 2026-02-21    | Claude Sonnet 4.6   | 29/29 tests (2 suites)             |
| `npx failprompt` works      | assumed   | - | - | bin → dist/index.js, not live-tested with npx |

## Core Logic

| Property                                    | Status   | Last Verified | Agent               | Notes                                              |
| ------------------------------------------- | -------- | ------------- | ------------------- | -------------------------------------------------- |
| `gh` CLI log fetching works                 | assumed  | - | - | Based on `gh run view --log-failed` docs           |
| `##[error]` marker reliably identifies errors | verified | 2026-02-21  | Claude Sonnet 4.6   | 17/17 extractor tests pass with realistic fixtures |
| Extended error heuristics (Error:, npm ERR!, FAILED, ENOENT, SyntaxError:) | verified | 2026-02-21 | Claude Sonnet 4.6 | 4 new tests added and passing |
| Last-30-lines fallback when no markers       | verified | 2026-02-21   | Claude Sonnet 4.6   | Test 5 + Test 16 verify this behavior              |
| ANSI stripping regex is complete            | verified | 2026-02-21    | Claude Sonnet 4.6   | Tests include ANSI fixture (LOG_WITH_ANSI)         |
| Git file path extraction from errors        | verified | 2026-02-21    | Claude Sonnet 4.6   | Tests 11-13 confirm src/ and ./src/ paths          |
| Cross-platform stdout piping works          | assumed  | - | - | Standard Unix pipe, should work everywhere        |
| `allErrors` rendered in prompt output       | verified | 2026-02-21    | Claude Sonnet 4.6   | Fix 1: "### All Errors" section added to prompt    |
| Friendly gh error messages                  | verified | 2026-02-21    | Claude Sonnet 4.6   | Fix 3: mapGhError() maps common failure modes      |

## Distribution

| Property                     | Status   | Last Verified | Agent               | Notes                                   |
| ---------------------------- | -------- | ------------- | ------------------- | --------------------------------------- |
| `bin` field works with `npx` | assumed  | - | - | Points to dist/index.js, standard pattern |
| npm publish ready            | verified | 2026-02-21    | Claude Sonnet 4.6   | `files` whitelist + `prepublishOnly` guard added |
| Published package excludes src/tests | verified | 2026-02-21 | Claude Sonnet 4.6 | `"files": ["dist/", "README.md"]` in package.json |

---

*Re-verify after each major change. Verified status degrades after refactors.*
