# Releasing a new version of nrf-library

Releases use [npm's built-in `version` command](https://docs.npmjs.com/cli/v10/commands/npm-version) to bump `package.json` and create a release commit. The matching git tag is created automatically on `main` after the PR is merged, by the `Tag release on main` GitHub Action.

On your pull request branch with a clean working tree, run one of:

```bash
npm run release:patch    # patch: 0.1.0 → 0.1.1  (bug fixes)
npm run release:minor    # minor: 0.1.0 → 0.2.0  (new, backwards-compatible features)
npm run release:major    # major: 0.1.0 → 1.0.0  (breaking changes)
```

Each command will:

1. Bump the `version` field in `package.json`
2. Create a commit (e.g. `v0.1.1`)

Then push the branch, open a PR, and merge it. Once the merge lands on `main`, the workflow reads the new version from `package.json` and creates+pushes the matching tag (e.g. `v0.1.1`). PRs that don't change `package.json` (e.g. docs-only) are skipped.

Consumers can then pin to the new tag:

```bash
npm install github:DEFRA/nrf-library#v0.1.1
```

### Versioning policy ([semver](https://semver.org/))

- **patch** — bug fixes only, no API changes
- **minor** — new features, backwards-compatible
- **major** — breaking changes to the public API
