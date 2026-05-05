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

## Testing DOM / HTML

- DOM testing library is used for querying the DOM, prefer that to native querySelector as it enables finding elements by ARIA role or associated label so builds in accessibility checks, for free

## Test readability

- Keep fixtures and test utils out of tests and place in eg `src/test-utils` for re-use and to make the test file itself shorter and easier to read.
- The test title should be in readable english and avoid too many implementation details

## Fixtures

- Re-use fixture fragments eg response JSON where possible to make it easier to maintain data contracts, as the codebase doesn't have the benefit of using Typescript. Shared fixtures can be placed in `src/test-utils/fixtures`
