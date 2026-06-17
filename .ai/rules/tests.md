---
paths:
  - '**/*.test.js'
---

# Tests

## Types of test

- **Unit** - the lowest level, prefer this for edge cases, there should be many more of these than acceptance tests as they're faster and easier to debug.
- **Acceptance** - Acceptance tests should use the inputs and outputs that a user would generate and expect eg send a real request and parse the returned page DOM. See any page.test.js in nrf-frontend for an example. Or for a backend API, send a request and assert on the response.
- There are also **journey** tests but those are in a different repo (nrf-journey-tests) and should be reserved for very few 'happy path' cases, or functionality that's too complext to test using unit or acceptance tests.

## Location

- Unit tests for a given code file should be in the same directory as the file. For acceptance tests put the test file in the same folder as the page or the endpoint controller it's testing.

## Mocking

- minimise mocking: only mock at the boundary of the system under test (eg external HTTP calls, browser APIs). Do not mock internal library functions like `retryAsyncOperation` — use fake timers (`vi.useFakeTimers()`) instead to test time-dependent behaviour without real delays
- for mocking responses from service calls out to other APIs, prefer Mock Service Worker rather than mocking fetch or HTTP clients like Wreck ([example](../../src/server/quote/check-your-answers/controller-post.test.js))
- no need to reset or clear mocks within test files as `mockReset` is set globally for vitest
- the test suite spins up a real redis container so tests **don't** have to mock functions that wrap it eg session cache

## Testing page forms

- When testing validation errors, use `submitForm` to POST invalid data, then pass the returned `cookie` directly to `loadPage` — `submitForm` already extracts the session cookie from `set-cookie` headers. Assert on `response.statusCode` (303) and `response.headers.location` before loading the redirected page.
- When testing that a previous selection is persisted, submit valid data with `submitForm` and pass the returned `cookie` to a subsequent `loadPage` call.

## Using a running server in tests

- When a test needs a running server instance, use `setupTestServer` from `src/test-utils/setup-test-server.js` — it handles `beforeAll`/`afterAll` lifecycle, shares a single server instance across tests in the file, and ensures Redis is ready. Call the returned getter to get the server: `const getServer = setupTestServer()`, then `getServer()` inside tests.

## Using sessions in tests

- When a test needs a stable session ID (e.g. for rate limiting or any behaviour keyed on session), use `withValidQuoteSession` to prime a real server-side session and obtain a cookie. Pass that cookie to all subsequent `server.inject` calls so Yar reuses the same session ID across requests.

## Module-level singletons

- When a module exports a lazy singleton (e.g. a rate limiter, cache client, or DB connection initialised on first call), tests that mutate its config must reset it in `beforeAll`/`afterAll`. Verify a reset/teardown function exists and is called at the appropriate lifecycle hook — otherwise the stale singleton persists across test files and config mutations have no effect.

## Testing DOM / HTML

- DOM testing library is used for querying the DOM, prefer that to native querySelector as it enables finding elements by ARIA role or associated label so builds in accessibility checks, for free
- Use `toBeInTheDocument()` (from `@testing-library/jest-dom`) rather than `toBeTruthy()` for DOM presence assertions — `getByTestId` etc. throw when absent, so `toBeTruthy()` is always true for present elements and adds no assertion value

## Test readability

- Test titles should be in readable English and avoid implementation details.
- Do not define fixtures, helper functions, or large data objects inline in test files. Extract them to `src/test-utils/` (helpers) or `src/test-utils/fixtures/` (data). This keeps test files focused on assertions and makes fixtures reusable across tests.
- Re-use fixture data across test files rather than duplicating it — this makes it easier to maintain data contracts, especially without TypeScript.

## Config values in tests

- Do not assert on literal strings that are config defaults (e.g. a header name like `'x-cdp-request-id'`). Read the value from config instead, or mock config explicitly — otherwise the test passes even when config changes the value at runtime.

## Test performance

- Favour fast tests over extending test timeouts. If a test is slow because it repeats an operation many times to reach a threshold (e.g. firing 60+ requests to trip a rate limit), lower that threshold in the test environment via config (e.g. `default: isTest ? 5 : 60`) rather than raising the test's timeout. Extending the timeout hides slowness and makes the suite drag; reducing the work keeps the test fast and still proves the behaviour.

## Acceptance tests

- Every page should have a acceptance test file in the same folder, named page.test.js, and a accessibility test, named accessibility.test.js.
