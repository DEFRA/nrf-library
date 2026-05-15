---
name: review-nrf-code
description: Reviews changed code against team coding standards. Use after writing code in a nrf-* repository
run_as_subagent: true
---

## Parameters

1. **Files to review** (optional) — specific file paths to review; defaults to all files changed on the current branch vs `main`
2. **GitHub PR URL** (optional) — if provided, use `gh pr diff <url>` to get the changed files instead of git diff

## Steps

1. Read [.ai/rules/index.md](../../rules/index.md) and all files it links to, to load the project coding standards.
2. Identify files to review:
   - If a GitHub PR URL was provided, run `gh pr diff <url> --name-only` to get the changed files, and `gh pr diff <url>` to read the diff content.
   - Otherwise, if files were passed as a parameter, use those.
   - Otherwise run `git diff main...HEAD --name-only` to list all files changed on the current branch vs `main`.
   - If that returns no files, fall back to `git diff --name-only HEAD` (unstaged changes) and `git diff --name-only --cached` (staged changes), and combine the results.
   - If there are still no files, report that there is nothing to review and stop.
3. For each file, read the file and any associated test files in the same directory (`*.test.js`, `*.acceptance.test.js`).
4. Review each file against the rules loaded in step 1.
5. Output a structured report grouped by file. Within each file, group findings by severity:
   - **Blocker** — violates a project rule and must be fixed before merge
   - **Suggestion** — improvement that would be good to address but is not a rule violation

## Output format

For each file with findings:

```
### path/to/file.js

**Blockers**
- Line 42: `logger.error('message')` — first param must be an error instance, not a string

**Suggestions**
- Line 10: function `doThing` has 4 primitive params — consider using an object param
```

If a file has no findings, omit it from the report.

End with a one-line summary: total files reviewed, total blockers, total suggestions.

## Posting to GitHub

If a GitHub PR URL was provided, after outputting the report ask the user whether they want to post it as a comment on the PR. If they confirm, post the report using `gh pr comment <url> --body "<report>"`.

> **Note:** `gh` may only be used for `gh pr comment`. Do not use any other `gh` subcommands (e.g. `gh pr diff`, `gh pr create`, `gh issue`).

## Subagent behaviour

Return only the structured findings report and the one-line summary to the main agent. Do not include preamble, tool call narration, or explanation of steps taken.
