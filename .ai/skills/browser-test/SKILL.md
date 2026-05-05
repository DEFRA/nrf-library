---
name: browser-test
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

## ⛔ Black-box rule — no source code

**Never read source files, config files, or implementation code** — not to find a URL, a selector, or to debug a failure. Use the browser alone, exactly as a user would.

The only exceptions are things physically impossible to observe in a browser:

- HttpOnly / Secure cookie flags
- Server-set cookie expiry

If you read code for these, mark the result as "code-verified" in the results table.

## Setup

Do steps 1 and 2 **in parallel** — issue both calls in the same message so the browser is already loaded by the time Jira is read:

1. Fetch the Jira ticket by running the script in the same folder as this file:

   ```bash
   bash <path>/read-jira-ticket.sh <ticket>
   ```

   Uses `JIRA_USER` and `JIRA_TOKEN` env vars (loaded from `~/.env` if not set). See `docs/feature-tester.md` in nrf-library for setup.

   **If the script fails for any reason, stop immediately. Report the exact error and ask the user to fix it before retrying.**

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
