---
name: test-in-browser
description: Test a feature in the browser against Jira acceptance criteria
tools: Bash, Read, mcp__playwright__browser_navigate, mcp__playwright__browser_navigate_back, mcp__playwright__browser_snapshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_run_code_unsafe, mcp__playwright__browser_click, mcp__playwright__browser_type, mcp__playwright__browser_fill_form, mcp__playwright__browser_press_key, mcp__playwright__browser_wait_for, mcp__playwright__browser_close, mcp__playwright__browser_console_messages, mcp__playwright__browser_network_requests
---

## Parameters

`args` is a space-separated string: `<ticket> <url>`

- First token: Jira ticket number, e.g. `NRF2-358`
- Remainder: starting URL, e.g. `http://localhost:3000/`. If omitted, default to `http://localhost:3000/`.

## Project context

- **Framework:** Hapi.js with Nunjucks templates
- **Cookies:** HttpOnly — cannot be inspected via JS
- **CSRF:** All form POSTs are CSRF-protected — never POST via `fetch`
- **Bot filtering (deployed environments):** Deployed environments (e.g. `*.cdp-int.defra.cloud`) run a bot filter that suppresses page content for headless/scanner user agents. Playwright's default UA contains `HeadlessChrome`, so it gets treated as a scanner: requests return **200 with an empty page body (heading only, no content or error)** and do **not** consume a magic-link session. This silently breaks every scenario and looks like a content/render bug. **Always set a real-browser UA before testing on a deployed environment** — see "User agent" below.
- **Jira:** `https://eaflood.atlassian.net/browse/<ticket>`
- **Local environment (localhost targets):** When testing against `localhost`, more than the browser is available for setup and verification — these still count as black-box exceptions, so note any use in the results table:
  - **Docker logs:** `docker compose logs <service> --since <duration>` to confirm backend behaviour (e.g. that an email send was triggered, or that one was _not_).
  - **Postgres DB:** `docker compose exec -T postgres psql -U postgres -d <db> -c "<SQL>"` to inspect or set up test state directly (e.g. expiring/exhausting a token to reach a state a user can't reach manually).
  - **Notify API:** emails can be verified against the GOV.UK Notify API (real key locally, not a stub). See `journey-tests/test/support/find-notify-email.js` for how to query notifications by recipient, status, body text, and a `sentAfter` cutoff. Use this to confirm email content (subject/body) or that no email was sent.
- **Playwright console & network:** `mcp__playwright__browser_console_messages` and `mcp__playwright__browser_network_requests` are available to inspect client-side errors and HTTP traffic — see "Error monitoring".
- **Browser:** Use only the Playwright MCP tools (`mcp__playwright__browser_navigate`, `mcp__playwright__browser_snapshot`, `mcp__playwright__browser_evaluate`, `mcp__playwright__browser_run_code_unsafe`, `mcp__playwright__browser_close`, etc.). Never use Chrome DevTools MCP tools (`mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`). If Playwright MCP tools are not available, stop immediately and report this to the user.

## ⛔ Black-box rule — don't read source code unless necessary

**Default to the browser alone, exactly as a user would.** Don't read source files, config files, or implementation code to find a URL, a selector, or to debug a failure — if a user can't see it, neither should you.

Exceptions are limited to cases where the AC genuinely can't be verified from the browser alone:

- Things physically unobservable in a browser (e.g. `HttpOnly` / `Secure` cookie flags, server-set cookie expiry).
- Named implementation details the AC depends on (e.g. specific cookie names to assert presence/absence of, a policy version field, a config flag or env var used to simulate a state a user can't reach).
- Test hooks the implementer has provided to make an AC testable — prefer using these over skipping the scenario. The ticket's testing notes are the expected channel for the implementer to surface these; check there first before reading code.

When you rely on code-derived knowledge, mark the row as "code-verified" in the results table and note exactly what you looked up. Every code read must be visible in the output.

## Setup

Confirm the Playwright MCP server is configured with a real-browser user agent before proceeding — see "User agent" under Browser testing. Otherwise the bot filter silently returns empty pages to Playwright's default headless UA.

Do steps 1 and 2 **in parallel** — issue both calls in the same message so the browser is already loaded by the time Jira is read:

1. Invoke the `read-jira-ticket` skill with the ticket ID to fetch the ticket's details.

2. Navigate to the test URL with `mcp__playwright__browser_navigate`.

Once both complete: confirm the correct page loaded via `mcp__playwright__browser_snapshot`, then extract every scenario as a numbered checklist before proceeding.

**If any scenario or acceptance criterion is unclear, ambiguous, or untestable** (e.g. missing expected values, vague assertions, or steps that can't be verified in a browser), flag it to the user before testing that scenario. Ask for clarification rather than guessing. Note any assumptions you had to make in the results table.

## Progress narration

Output one short line before every tool call. Announce each scenario by title only (no markdown headings). After each scenario output `"Scenario N done — PASS"` or `"Scenario N done — FAIL: <reason>"`. If a tool call is slow, output `"Waiting for browser — <tool name>..."`. If a tool call errors, output `"FAILED: <tool name> — <error>. Stopping this scenario."`.

## Browser testing

**User agent:** On deployed environments the bot filter (see Project context) blanks the page for Playwright's default `HeadlessChrome` UA. The fix is to pass `--user-agent` to the Playwright MCP server so it applies globally to every session — add it to the server's args in `~/.claude.json` (user scope) or via `claude mcp add`:

```
--user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
```

Restart Claude Code after changing MCP server args for them to take effect.

**Clean state:** Use `mcp__playwright__browser_navigate` to reset state between scenarios. Don't try to clear HttpOnly cookies via JS — it won't work. Don't POST via `fetch` — CSRF will block it. Note any cookie-state limitations in the results table.

To fully clear all cookies (including HttpOnly/server-set ones), use Playwright's context API:

```js
// via mcp__playwright__browser_run_code_unsafe:
;async (page) => {
  await page.context().clearCookies()
  return 'cookies cleared'
}
```

**Assertions:** Prefer `mcp__playwright__browser_evaluate` — fast and precise. Only use `mcp__playwright__browser_snapshot` when you need to discover an unknown selector. Don't take screenshots.

**Browser tool errors:** Retry once. If the retry fails, stop and wait for the user.

## Error monitoring

After each scenario, check for client-side errors using `mcp__playwright__browser_console_messages` and `mcp__playwright__browser_network_requests`. Flag in the Notes column:

- Console errors or warnings (ignore info/debug level)
- Failed network requests (4xx/5xx responses, or requests that never completed)

## Cleanup

Close the browser with `mcp__playwright__browser_close` after all scenarios.

## Output format

Results table only — no preamble. List bugs/gaps below the table.

| Scenario | Description | Result                                            | Notes |
| -------- | ----------- | ------------------------------------------------- | ----- |
| 1        | ...         | ✅ Pass / ❌ Fail / ⚠️ Partial / 🔍 Code-verified | ...   |
