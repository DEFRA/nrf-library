# nrf-library

Shared library for NRF projects, installable directly from GitHub.

- [Installation and use](docs/usage/installation.md)
- [Releasing a new version of nrf-library](docs/usage/release-version.md)

## Code utilities

- [retryAsyncOperation](./src/server/utils/retry-async-operation/index.js) - a wrapper function to retry any async operation with configurable interval / retry count
- [formatCurrencyPrecise](./src/server/utils/format-currency-precise/index.js) - formats a currency value with up to four decimal places, for levy figures that need more precision than whole pence
- [formatCurrency](./src/server/utils/format-currency/index.js) - formats a currency value with two decimal places (sits beside `formatCurrencyPrecise`; registered as a Nunjucks filter by nrf-frontend and nrf-admin-frontend)
- [formatDate](./src/server/utils/format-date/index.js) - formats a date with date-fns, defaulting to the GOV.UK-style `'EEE do MMMM yyyy'`
- [getGitHash](./src/server/utils/git-hash/index.js) - resolves the deployed git hash from the `GIT_HASH` env var or the `.git-hash` file written by CI

## Observability

Logging, tracing and metrics helpers are under `src/server/observability`. They are plain factories returning plugin registration objects — shared registration machinery is a possible future addition:

- [structureErrorForECS](./src/server/observability/log-formatters/index.js) - structures an error for ECS logging (message, stack trace, type, code and http context), wired into each repo's local logger-options
- [buildLogger](./src/server/observability/build-logger/index.js) - builds a pino logger from repo-local options; each repo keeps its own singleton `createLogger` around it
- [createRequestLogger](./src/server/observability/request-logger/index.js) - creates the hapi-pino request-logging registration object from repo-local options (extra options such as admin's `ignoreFunc` can be passed alongside)
- [createRequestTracing](./src/server/observability/request-tracing/index.js) - creates the `@defra/hapi-tracing` registration object for a configured tracing header
- [createPulse](./src/server/observability/pulse/index.js) - creates the hapi-pulse graceful-shutdown registration object (10s timeout by default)
- [createMetricsCounter](./src/server/observability/metrics/index.js) - creates an AWS embedded-metrics counter with a per-call enabled gate (boolean or thunk)

## Validation schemas

Shared Joi schemas and patterns are under `src/server/validation`:

- [reference-patterns](./src/server/validation/reference-patterns/index.js) - the quote reference (`NRL-\d{6}`) and access-token patterns, plus matching Joi fragments for route params
- [quote-patch-schema](./src/server/validation/quote-patch-schema/index.js) - the impact assessor's PATCH /quotes/{reference} callback body (EDP entries with impact totals and levy figures)
- [boundary-check](./src/server/validation/boundary-check/index.js) - the impact assessor's boundary-check response object (a loose wire-format check for nrf-backend and the detailed shape nrf-frontend saves to session)

## Constants

Red line boundary errors and constants are under `src/constants`:

- [statusCodes](./src/server/constants/status-codes/index.js) - the shared HTTP status code map (union of the three repos' former local maps; `found` for 302)
- [QUOTE_ACCESS_STATUS](./src/server/constants/quote-access-status/index.js) - the quote access token outcome contract shared by nrf-backend and nrf-frontend
