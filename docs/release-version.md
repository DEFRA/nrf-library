# Releasing a new version of nrf-library

Releases use [npm's built-in `version` command](https://docs.npmjs.com/cli/v10/commands/npm-version), which bumps `package.json`, commits the change, and creates a matching git tag.

Make sure your working tree is clean (all changes committed), then run one of:

```bash
npm run release          # patch: 0.1.0 → 0.1.1  (bug fixes)
npm run release:minor    # minor: 0.1.0 → 0.2.0  (new, backwards-compatible features)
npm run release:major    # major: 0.1.0 → 1.0.0  (breaking changes)
```

Each command will:

1. Bump the `version` field in `package.json`
2. Create a commit (e.g. `v0.1.1`)
3. Create a matching git tag (e.g. `v0.1.1`)
4. Push the commit and tag to GitHub

Consumers can then pin to the new tag:

```bash
npm install github:DEFRA/nrf-library#v0.1.1
```

### Versioning policy ([semver](https://semver.org/))

- **patch** — bug fixes only, no API changes
- **minor** — new features, backwards-compatible
- **major** — breaking changes to the public API
