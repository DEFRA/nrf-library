---
name: read-confluence-page
description: Fetch a Confluence page's details (title, space, version, labels, body HTML) by page ID or URL. Use whenever another skill or task needs to read a Confluence page.
---

## Parameters

`args` is a space-separated string: `<page_id_or_url> [format]`

- First token: Confluence page ID (e.g. `123456789`) or full page URL (e.g. `https://eaflood.atlassian.net/wiki/spaces/FOO/pages/123456789/Title`).
- Second token (optional): output format — `full` (default), `summary`, or `json`.

## Steps

1. Run the page script:

   ```bash
   bash ./.ai/skills/tools/confluence/page.sh <page_id_or_url> [format]
   ```

   Requires `ATLASSIAN_USER` and `ATLASSIAN_TOKEN` env vars. See [atlassian-credentials.md](../../../docs/ai/atlassian-credentials.md) for setup.

2. **If the script fails for any reason, stop immediately.** Report the exact error to the user and ask them to fix it before retrying. Do not fall back to scraping the Confluence UI or guessing the page contents.

3. Return the script's output to the caller. Do not summarise or filter — the caller needs the full page details to do its job.
