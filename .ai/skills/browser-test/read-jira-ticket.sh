#!/bin/bash
# Get JIRA ticket details
# Usage: ./ticket.sh IMTA-XXXXX [format]
# Formats: full (default), summary, json

set -e

# Load .env from home directory if vars not already set
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$HOME/.env"
if [[ -f "$ENV_FILE" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
fi

TICKET="${1:-}"
FORMAT="${2:-full}"

if [[ -z "$TICKET" ]]; then
    echo "Usage: ./ticket.sh IMTA-XXXXX [format]"
    echo "Formats: full (default), summary, json"
    exit 1
fi

USER="${JIRA_USER:-}"
if [[ -z "$USER" ]]; then
    echo "Error: JIRA_USER environment variable not set"
    exit 1
fi

if [[ -z "$JIRA_TOKEN" ]]; then
    echo "Error: JIRA_TOKEN environment variable not set"
    exit 1
fi

AUTH="$USER:$JIRA_TOKEN"
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
        echo "$response" | jq -r '.fields.summary'
        echo ""
        echo "$response" | jq -r '.renderedFields.description // "No description"'
        ;;
esac
