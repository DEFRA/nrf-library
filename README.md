# nrf-library

Shared library for NRF projects, installable directly from GitHub.

- [Installation and use](docs/usage/installation.md)
- [Releasing a new version of nrf-library](docs/usage/release-version.md)

## Code utilities

- [retryAsyncOperation](./src/server/utils/retry-async-operation/index.js) - a wrapper function to retry any async operation with configurable interval / retry count
- [formatCurrencyPrecise](./src/server/utils/format-currency-precise/index.js) - formats a currency value with up to four decimal places, for levy figures that need more precision than whole pence

## Validation schemas

Shared Joi schemas and patterns are under `src/server/validation`:

- [reference-patterns](./src/server/validation/reference-patterns/index.js) - the quote reference (`NRL-\d{6}`) and access-token patterns, plus matching Joi fragments for route params
- [quote-patch-schema](./src/server/validation/quote-patch-schema/index.js) - the impact assessor's PATCH /quotes/{reference} callback body (EDP entries with impact totals and levy figures)
- [boundary-check](./src/server/validation/boundary-check/index.js) - the impact assessor's boundary-check response object (a loose wire-format check for nrf-backend and the detailed shape nrf-frontend saves to session)

## Constants

Red line boundary errors and constants are under `src/constants`
