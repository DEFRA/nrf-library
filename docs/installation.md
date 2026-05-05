# Installation

Install in a consuming project straight from GitHub — no npm registry needed:

```bash
npm install github:DEFRA/nrf-library#v0.2.0       # pinned to a release tag
npm install github:DEFRA/nrf-library#main         # track a branch
```

## Consuming from the library

### Javascript modules

```js
import something from '@defra/nrf-library'
```

## Local development with `npm link`

To work against an in-progress local clone of `nrf-library` without publishing or pushing to GitHub, use `npm link`:

```bash
# 1. Register this clone as a global link
cd /path/to/nrf-library
npm link

# 2. Point the consuming project at the link
cd /path/to/consuming-project
npm link @defra/nrf-library
```

`node_modules/@defra/nrf-library` in the consuming project will become a symlink to your local clone, so edits take effect immediately.

To revert to the published GitHub version:

```bash
npm unlink @defra/nrf-library && npm install
```
