---
name: read-jira-ticket
description: Fetch a Jira ticket's details (summary, description, acceptance criteria, testing notes) by ticket ID. Use whenever another skill or task needs to read a Jira ticket.
---

## Parameters

`args` is the Jira ticket ID, e.g. `NRF2-358`.

## Steps

1. Run the ticket script:

   ```bash
   bash ./node_modules/@defra/nrf-library/.ai/skills/tools/jira/ticket.sh <ticket>
   ```

   Requires `ATLASSIAN_USER` and `ATLASSIAN_TOKEN` env vars. See [atlassian-credentials.md](../../../docs/ai/atlassian-credentials.md) for setup.

2. **If the script fails for any reason, stop immediately.** Report the exact error to the user and ask them to fix it before retrying. Do not fall back to scraping the Jira UI or guessing the ticket contents.

3. Return the script's output to the caller. Do not summarise or filter — the caller needs the full ticket details (description, acceptance criteria, testing notes, etc.) to do its job.
