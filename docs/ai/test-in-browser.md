# Using the test-in-browser skill

The test-in-browser skill tests features against Jira acceptance criteria using a browser (via Playwright MCP).

## Prerequisites

### Atlassian credentials

Agent skills require `ATLASSIAN_USER` and `ATLASSIAN_TOKEN` environment variables to access Jira and Confluence. See [atlassian-credentials.md](./atlassian-credentials.md) for setup.

### Playwright MCP

```
claude mcp add playwright npx @playwright/mcp@latest
```

## Usage

Invoke the skill with a Jira ticket number and base URL for testing, eg - :

```
/test-in-browser NRF2-358 https://nrf-frontend.test.cdp-int.defra.cloud
```
