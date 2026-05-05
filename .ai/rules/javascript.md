---
paths:
  - '**/*.js'
  - '!**/*.test.js'
---

# Javascript coding guidelines

## Functions

- Use short, single-purpose functions. Any over 75 lines will be failed by SonarQube, but aim to make them shorter.
- If there are multiple function params, use an object param instead
- For functions that accept params that are structured objects, add JSDoc annotations — this applies to all functions, including module-private helpers, not just exported ones. No need to add JSDoc for params with primitive types as those can be inferred.

## Functional / classes

- Favour functional over classes

## Server-side code

### Config

- If a env var will vary between envs, use config to set it
- For any config vars introduced that don’t have a default value in config.js, add to .env.example

### Observability

#### Tracing

- For any inter-service call or message, include the tracing header (example in `src/server/common/services/nrf-backend.js`)

#### Logging

- call `logger.error(error, message)` — always pass the error instance as the first param, message string second
- call `logger.info({ ...context }, message)` — always pass a context object as the first param, never a plain string; include relevant identifiers (eg IDs, template names) in the context object
- prefer using createLogger in modules rather than passing the request.logger in as a function parameter

### Services pattern

- Where you need to interact with other services eg APIs, wrap the code in a service (see examples in `src/common/services`
- If a service interaction is not blocking the user experience, consider adding a retry mechanism
- Use a single HTTP client if possible (wreck?) and wrap it in a helper so eg tracing header is always sent
- Base paths for other services should come from config as a separate env var (eg avoid getImpactAssessorUrl)

### Security

- Don't expose any secrets or API keys; they should come from env vars which are exposed to the app via the config.js file
- validate / sanitize user inputs

### Validation

- if validating any object or response payload, use Joi rather than custom validation

## Client-side Javascript (run in the browser)

Server-side code should be used where possible; client-side code should be kept to an absolute minimum, to meet the requirement for progressive enhancement.

### Use CSS for style

If possible, avoid applying style attributes directly to an element using javascript; instead add a CSS class and store the style properties in a CSS file.
