#!/bin/bash
# Get JIRA ticket details
# Usage: ./ticket.sh IMTA-XXXXX [format]
# Formats: full (default), summary, json

set -e

TICKET="${1:-}"
FORMAT="${2:-full}"

if [[ -z "$TICKET" ]]; then
    echo "Usage: ./ticket.sh IMTA-XXXXX [format]"
    echo "Formats: full (default), summary, json"
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

response=$(curl -s -u "$AUTH" \
    -H "Content-Type: application/json" \
    "$BASE_URL/rest/api/2/issue/$TICKET?expand=renderedFields")

# Check for errors
if echo "$response" | jq -e '.errorMessages' > /dev/null 2>&1; then
    echo "$response" | jq -r '.errorMessages[]'
    exit 1
fi

case "$FORMAT" in
    json)
        echo "$response"
        ;;
    summary)
        echo "$response" | jq -r '{
            key: .key,
            summary: .fields.summary,
            status: .fields.status.name,
            type: .fields.issuetype.name,
            priority: .fields.priority.name,
            assignee: .fields.assignee.displayName,
            parent: .fields.parent.key,
            labels: .fields.labels
        }'
        ;;
    full|*)
        echo "=== $TICKET ==="
        echo "$response" | jq -r '"Type: \(.fields.issuetype.name)"'
        echo "$response" | jq -r '"Status: \(.fields.status.name)"'
        echo "$response" | jq -r '"Priority: \(.fields.priority.name)"'
        echo "$response" | jq -r '"Summary: \(.fields.summary)"'
        echo "$response" | jq -r '"Assignee: \(.fields.assignee.displayName // "Unassigned")"'
        echo "$response" | jq -r '"Parent: \(.fields.parent.key // "None")"'
        echo "$response" | jq -r '"Labels: \(.fields.labels | join(", "))"'
        echo ""
        echo "=== Description ==="
        echo "$response" | jq -r '.renderedFields.description // "No description"'

        # Show subtasks if present
        subtask_count=$(echo "$response" | jq '.fields.subtasks | length')
        if [[ "$subtask_count" -gt 0 ]]; then
            echo ""
            echo "=== Subtasks ($subtask_count) ==="
            echo "$response" | jq -r '.fields.subtasks[] | "\(.key)\t\(.fields.status.name)\t\(.fields.summary)"' | column -t -s $'\t'
        fi

        # Show linked issues if present
        link_count=$(echo "$response" | jq '.fields.issuelinks | length')
        if [[ "$link_count" -gt 0 ]]; then
            echo ""
            echo "=== Linked Issues ($link_count) ==="
            echo "$response" | jq -r '.fields.issuelinks[] |
                if .outwardIssue then
                    "\(.outwardIssue.key)\t\(.type.outward)\t\(.outwardIssue.fields.status.name)\t\(.outwardIssue.fields.summary)"
                else
                    "\(.inwardIssue.key)\t\(.type.inward)\t\(.inwardIssue.fields.status.name)\t\(.inwardIssue.fields.summary)"
                end' | column -t -s $'\t'
        fi
        ;;
esac
