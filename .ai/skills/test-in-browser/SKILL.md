---
name: test-in-browser
description: Test a feature in the browser against Jira acceptance criteria
---

## Parameters

`args` is a space-separated string: `<ticket> <url>`

- First token: Jira ticket number, e.g. `NRF2-358`
- Remainder: starting URL, e.g. `http://localhost:3000/`. If omitted, default to `http://localhost:3000/`.

## Project context

- **Framework:** Hapi.js with Nunjucks templates
- **Cookies:** HttpOnly — cannot be inspected via JS
- **CSRF:** All form POSTs are CSRF-protected — never POST via `fetch`
- **Jira:** `https://eaflood.atlassian.net/browse/<ticket>`
- **Browser:** Use only Claude Code's built-in `browser_*` tools. Never use MCP browser tools. If any browser tool fails, stop and report the error immediately.

## ⛔ Black-box rule — don't read source code unless necessary

**Default to the browser alone, exactly as a user would.** Don't read source files, config files, or implementation code to find a URL, a selector, or to debug a failure — if a user can't see it, neither should you.

Exceptions are limited to cases where the AC genuinely can't be verified from the browser alone:

- Things physically unobservable in a browser (e.g. `HttpOnly` / `Secure` cookie flags, server-set cookie expiry).
- Named implementation details the AC depends on (e.g. specific cookie names to assert presence/absence of, a policy version field, a config flag or env var used to simulate a state a user can't reach).
- Test hooks the implementer has provided to make an AC testable — prefer using these over skipping the scenario. The ticket's testing notes are the expected channel for the implementer to surface these; check there first before reading code.

When you rely on code-derived knowledge, mark the row as "code-verified" in the results table and note exactly what you looked up. Every code read must be visible in the output.

## Setup

Do steps 1 and 2 **in parallel** — issue both calls in the same message so the browser is already loaded by the time Jira is read:

1. Invoke the `read-jira-ticket` skill with the ticket ID to fetch the ticket's details.

2. Navigate to the test URL with `browser_navigate`.

Once both complete: confirm the correct page loaded via `browser_snapshot`, then extract every scenario as a numbered checklist before proceeding.

**If any scenario or acceptance criterion is unclear, ambiguous, or untestable** (e.g. missing expected values, vague assertions, or steps that can't be verified in a browser), flag it to the user before testing that scenario. Ask for clarification rather than guessing. Note any assumptions you had to make in the results table.

## Progress narration

Output one short line before every tool call. Announce each scenario by title only (no markdown headings). After each scenario output `"Scenario N done — PASS"` or `"Scenario N done — FAIL: <reason>"`. If a tool call is slow, output `"Waiting for browser — <tool name>..."`. If a tool call errors, output `"FAILED: <tool name> — <error>. Stopping this scenario."`.

## Browser testing

**Clean state:** Use `browser_navigate` to reset state between scenarios. Don't try to clear HttpOnly cookies via JS — it won't work. Don't POST via `fetch` — CSRF will block it. Note any cookie-state limitations in the results table.

To fully clear all cookies (including HttpOnly/server-set ones), use Playwright's context API:

```js
// via browser_run_code_unsafe:
;async (page) => {
  await page.context().clearCookies()
  return 'cookies cleared'
}
```

**Assertions:** Prefer `browser_evaluate` — fast and precise. Only use `browser_snapshot` when you need to discover an unknown selector. Don't take screenshots.

**Browser tool errors:** Retry once. If the retry fails, stop and wait for the user.

## Cleanup

Close the browser with `browser_close` after all scenarios.

## Output format

Results table only — no preamble. List bugs/gaps below the table.

| Scenario | Description | Result                                            | Notes |
| -------- | ----------- | ------------------------------------------------- | ----- |
| 1        | ...         | ✅ Pass / ❌ Fail / ⚠️ Partial / 🔍 Code-verified | ...   |
