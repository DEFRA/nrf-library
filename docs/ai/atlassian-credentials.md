# Atlassian credentials setup

Scripts under `.ai/skills/tools/jira/` and `.ai/skills/tools/confluence/` (and the agents and skills that call them — `test-in-browser`, `feature-builder`, etc.) require Atlassian API credentials.

## Required environment variables

| Variable          | Value                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `ATLASSIAN_USER`  | Your Atlassian account email                                                                                                      |
| `ATLASSIAN_TOKEN` | API token from [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens) |

Use a token created via "Create API token" (not the scoped variant) so it covers both Jira and Confluence in one go.

## Where to set them

Put the exports in `~/.zshenv` (zsh users):

```sh
# ~/.zshenv
export ATLASSIAN_USER=your.name@example.com
export ATLASSIAN_TOKEN=your-atlassian-api-token
```

`~/.zshenv` is loaded by **every** zsh invocation — interactive, non-interactive, login, subshell — so scripts run from any context will see the vars. No need to duplicate to `~/.zshrc`.

For bash users, add the same exports to `~/.bash_profile` (or `~/.bashrc` for non-login shells), or use a file that both shells source.
