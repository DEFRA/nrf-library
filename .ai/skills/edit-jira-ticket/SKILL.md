---
name: edit-jira-ticket
description: Edit a Jira ticket's fields (description, summary, priority, labels) or add a comment, by ticket ID. Use whenever a task needs to update a Jira ticket. Writes Jira wiki markup, NOT HTML.
---

## Parameters

`args` is the Jira ticket ID, e.g. `NRF2-358`, plus what to change.

## Critical: use Jira wiki markup, not HTML

The update script posts to Jira's REST API v2, whose `description`/`comment` fields are **Jira wiki markup**, not HTML. If you send raw HTML it is stored as literal text and the ticket renders visible `<p>`, `<b>`, `<br/>` tags.

Note that `read-jira-ticket` / `ticket.sh` returns the description as _rendered HTML_ — that is the display format, not the stored source. Do not copy that HTML back into an update. Re-author the content in wiki markup instead.

Wiki markup quick reference:

| Intent           | Wiki markup                            |
| ---------------- | -------------------------------------- | ------------- |
| Heading          | `h2. Heading text`                     |
| Bold             | `*bold*`                               |
| Italic           | `_italic_`                             |
| Line break       | a real newline (not `<br/>`)           |
| Paragraph break  | a blank line                           |
| Bullet list      | `* item` per line                      |
| Numbered list    | `# item` per line                      |
| Inline monospace | `{{code}}`                             |
| Code block       | `{code}` … `{code}` on their own lines |
| Horizontal rule  | `----`                                 |
| Link             | a bare URL, or `[text                  | https://url]` |

## Steps

1. Re-author the new field content in **wiki markup** (see above). When editing an existing description, fetch the current text first with the `read-jira-ticket` skill for context, but rewrite in wiki markup — never paste the rendered HTML back.

2. Write the content to a temp file (avoids shell-quoting problems with multi-line markup), then pipe it to the update script via stdin:

   ```bash
   cat /tmp/ticket-body.txt | bash ./node_modules/@defra/nrf-library/.ai/skills/tools/jira/update-ticket.sh <ticket> -d -
   ```

   Other `update-ticket.sh` options: `-s/--summary`, `-P/--priority` (Lowest|Low|Medium|High|Highest), `-l/--labels` (comma-separated, replaces), `--add-label` (repeatable).

   To add a comment instead of editing a field, use `add-comment.sh` (also wiki markup):

   ```bash
   cat /tmp/comment.txt | bash ./node_modules/@defra/nrf-library/.ai/skills/tools/jira/add-comment.sh <ticket> -
   ```

   Both require `ATLASSIAN_USER` and `ATLASSIAN_TOKEN` env vars. See [atlassian-credentials.md](../../../docs/ai/atlassian-credentials.md) for setup.

3. **Always verify the render after updating.** Fetch the rendered field and confirm there are no literal HTML tags:

   ```bash
   curl -s -u "$ATLASSIAN_USER:$ATLASSIAN_TOKEN" \
     "https://eaflood.atlassian.net/rest/api/2/issue/<ticket>?expand=renderedFields&fields=description" \
     | jq -r '.renderedFields.description' | head
   ```

   Correct output contains real `<h2>`, `<b>`, `<pre>` tags. Escaped output like `&lt;p&gt;` means HTML was sent by mistake — re-author in wiki markup and update again.

4. **If the script fails for any reason, stop immediately.** Report the exact error to the user and ask them to fix it before retrying. Do not fall back to editing via the Jira UI or guessing.

## Caution

Editing a ticket is an externally visible change to shared state. Confirm scope with the user before overwriting a description — `update-ticket.sh -d` replaces the whole field, it is not an in-place find/replace. Preserve all content you are not deliberately changing.
