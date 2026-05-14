# Code reviewer

Reviews changed files against project coding standards defined in `.ai/rules/`.

## Via the agent (recommended)

The `code-reviewer` agent runs as a subagent with persistent memory, accumulating knowledge of recurring patterns across reviews.

Invoke with an @-mention:

```
@"code-reviewer (agent)" review my changes
```

Or ask naturally:

```
Use the code-reviewer agent to review my changes
```

## Via the skill

Runs a one-off review in the current conversation context, without persistent memory.

```
/review-nrf-code
```

To review specific files only:

```
/review-nrf-code src/server/quote/controller.js
```

## Output

Findings are grouped by file and severity:

- **Blocker** — violates a project rule, must be fixed before merge
- **Suggestion** — improvement that is not a rule violation

Files with no findings are omitted. A one-line summary of totals is shown at the end.
