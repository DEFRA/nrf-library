# Using the browser-test skill

The browser-test skill tests features against Jira acceptance criteria using a browser (via Playwright MCP).

## Prerequisites

### Jira credentials

The `read-jira-ticket.sh` script requires `JIRA_USER` and `JIRA_TOKEN` environment variables. Set these once in `~/.env` — this file is shell-agnostic and works for zsh, bash, fish, etc.

```sh
# ~/.env
JIRA_USER=your.name@example.com
JIRA_TOKEN=your-jira-api-token
```

Your Jira API token can be generated at [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens).

### Playwright MCP

```
claude mcp add playwright npx @playwright/mcp@latest
```

## Usage

Invoke the skill with a Jira ticket number and base URL for testing, eg - :

```
/browser-test NRF2-358 https://nrf-frontend.test.cdp-int.defra.cloud
```
