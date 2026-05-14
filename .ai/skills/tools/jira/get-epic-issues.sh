#!/bin/bash
# Get issues belonging to a JIRA epic (handles pagination)
# Usage: ./get-epic-issues.sh <epic-key> [format]
# Formats: list (default), summary, json

set -e

EPIC_KEY="${1:-}"
FORMAT="${2:-list}"

if [[ -z "$EPIC_KEY" ]]; then
    echo "Usage: ./get-epic-issues.sh <epic-key> [format]"
    echo "Formats: list (default), summary, json"
    echo ""
    echo "Example: ./get-epic-issues.sh IMTA-20419"
    exit 1
fi

USER="${ATLASSIAN_USER:-}"
if [[ -z "$USER" ]]; then
    echo "Error: ATLASSIAN_USER environment variable not set"
    exit 1
fi

if [[ -z "$ATLASSIAN_TOKEN" ]]; then
    echo "Error: ATLASSIAN_TOKEN environment variable not set"
    exit 1
fi

AUTH="$USER:$ATLASSIAN_TOKEN"
BASE_URL="https://eaflood.atlassian.net"

ALL_ISSUES="[]"
START_AT=0
MAX_RESULTS=100

while true; do
    response=$(curl -s -u "$AUTH" \
        -H "Content-Type: application/json" \
        "$BASE_URL/rest/agile/1.0/epic/$EPIC_KEY/issue?startAt=$START_AT&maxResults=$MAX_RESULTS")

    if echo "$response" | jq -e '.errorMessages' > /dev/null 2>&1; then
        echo "$response" | jq -r '.errorMessages[]'
        exit 1
    fi

    PAGE_ISSUES=$(echo "$response" | jq '.issues')
    PAGE_COUNT=$(echo "$PAGE_ISSUES" | jq 'length')
    TOTAL=$(echo "$response" | jq '.total')

    ALL_ISSUES=$(echo "$ALL_ISSUES $PAGE_ISSUES" | jq -s 'add')

    START_AT=$((START_AT + PAGE_COUNT))
    if [[ $START_AT -ge $TOTAL ]] || [[ $PAGE_COUNT -eq 0 ]]; then
        break
    fi

    echo "Fetched $START_AT of $TOTAL issues..." >&2
done

case "$FORMAT" in
    json)
        echo "$ALL_ISSUES" | jq '{issues: ., total: (. | length)}'
        ;;
    summary)
        echo "$ALL_ISSUES" | jq -r '.[] | {
            key: .key,
            summary: .fields.summary,
            status: .fields.status.name,
            type: .fields.issuetype.name,
            priority: .fields.priority.name,
            assignee: (.fields.assignee.displayName // "Unassigned"),
            labels: .fields.labels
        }'
        ;;
    list|*)
        echo "=== Issues in Epic $EPIC_KEY ==="
        echo "$ALL_ISSUES" | jq -r '.[] | "\(.key)\t\(.fields.status.name)\t\(.fields.issuetype.name)\t\(.fields.summary)"' | column -t -s $'\t'
        echo ""
        echo "Total: $(echo "$ALL_ISSUES" | jq 'length') issues"
        ;;
esac
