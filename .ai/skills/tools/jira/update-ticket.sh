#!/bin/bash
# Update a JIRA ticket's fields
# Usage: ./update-ticket.sh TICKET-KEY [options]
#
# Options:
#   -s, --summary TEXT      Update summary
#   -d, --description TEXT  Update description (use - to read from stdin)
#   -P, --priority LEVEL    Update priority: Lowest, Low, Medium, High, Highest
#   -l, --labels LABELS     Set labels (comma-separated, replaces existing)
#   --add-label LABEL       Add a label (can be used multiple times)
#   -h, --help              Show this help message
#
# Examples:
#   ./update-ticket.sh IMTA-12345 -s "New summary"
#   ./update-ticket.sh IMTA-12345 -d "New description"
#   echo "Description from pipe" | ./update-ticket.sh IMTA-12345 -d -
#   ./update-ticket.sh IMTA-12345 -P High --add-label urgent

set -e

# Defaults
TICKET=""
SUMMARY=""
DESCRIPTION=""
PRIORITY=""
LABELS=""
ADD_LABELS=()

show_help() {
    cat << EOF
Update a JIRA ticket's fields

Usage: ./update-ticket.sh TICKET-KEY [options]

Options:
  -s, --summary TEXT      Update summary
  -d, --description TEXT  Update description (use - to read from stdin)
  -P, --priority LEVEL    Update priority: Lowest, Low, Medium, High, Highest
  -l, --labels LABELS     Set labels (comma-separated, replaces existing)
  --add-label LABEL       Add a label (can be used multiple times)
  -h, --help              Show this help message

Examples:
  ./update-ticket.sh IMTA-12345 -s "New summary"
  ./update-ticket.sh IMTA-12345 -d "New description"
  echo "Long description" | ./update-ticket.sh IMTA-12345 -d -
  ./update-ticket.sh IMTA-12345 -P High --add-label urgent

Environment Variables:
  ATLASSIAN_USER   Your Atlassian email address
  ATLASSIAN_TOKEN  Your Atlassian API token
EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -s|--summary)
            SUMMARY="$2"
            shift 2
            ;;
        -d|--description)
            if [[ "$2" == "-" ]]; then
                DESCRIPTION=$(cat)
            else
                DESCRIPTION="$2"
            fi
            shift 2
            ;;
        -P|--priority)
            PRIORITY="$2"
            shift 2
            ;;
        -l|--labels)
            LABELS="$2"
            shift 2
            ;;
        --add-label)
            ADD_LABELS+=("$2")
            shift 2
            ;;
        -h|--help)
            show_help
            ;;
        -*)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
        *)
            if [[ -z "$TICKET" ]]; then
                TICKET="$1"
            else
                echo "Error: Unexpected argument '$1'"
                echo "Use --help for usage information"
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate required fields
if [[ -z "$TICKET" ]]; then
    echo "Error: Ticket key is required"
    echo "Use --help for usage information"
    exit 1
fi

# Validate ticket key format (project key may contain digits, e.g. NRF2-731)
if [[ ! "$TICKET" =~ ^[A-Z][A-Z0-9]*-[0-9]+$ ]]; then
    echo "Error: Invalid ticket key format '$TICKET'. Expected format: IMTA-12345"
    exit 1
fi

# Check we have something to update
if [[ -z "$SUMMARY" && -z "$DESCRIPTION" && -z "$PRIORITY" && -z "$LABELS" && ${#ADD_LABELS[@]} -eq 0 ]]; then
    echo "Error: Nothing to update. Provide at least one option."
    echo "Use --help for usage information"
    exit 1
fi

# Validate priority if provided
if [[ -n "$PRIORITY" ]]; then
    case "$PRIORITY" in
        Lowest|Low|Medium|High|Highest) ;;
        *)
            echo "Error: Invalid priority '$PRIORITY'. Must be Lowest, Low, Medium, High, or Highest"
            exit 1
            ;;
    esac
fi

# Check environment variables
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

# If adding labels, we need to fetch existing labels first
EXISTING_LABELS=()
if [[ ${#ADD_LABELS[@]} -gt 0 ]]; then
    existing=$(curl -s -X GET \
        -u "$AUTH" \
        -H "Content-Type: application/json" \
        "$BASE_URL/rest/api/2/issue/$TICKET?fields=labels")

    if echo "$existing" | jq -e '.fields.labels' > /dev/null 2>&1; then
        mapfile -t EXISTING_LABELS < <(echo "$existing" | jq -r '.fields.labels[]')
    fi
fi

# Build the JSON payload
PAYLOAD=$(jq -n '{fields: {}}')

if [[ -n "$SUMMARY" ]]; then
    PAYLOAD=$(echo "$PAYLOAD" | jq --arg summary "$SUMMARY" '.fields.summary = $summary')
fi

if [[ -n "$DESCRIPTION" ]]; then
    PAYLOAD=$(echo "$PAYLOAD" | jq --arg description "$DESCRIPTION" '.fields.description = $description')
fi

if [[ -n "$PRIORITY" ]]; then
    PAYLOAD=$(echo "$PAYLOAD" | jq --arg priority "$PRIORITY" '.fields.priority = {name: $priority}')
fi

if [[ -n "$LABELS" ]]; then
    # Replace all labels
    LABELS_JSON=$(echo "$LABELS" | tr ',' '\n' | jq -R . | jq -s .)
    PAYLOAD=$(echo "$PAYLOAD" | jq --argjson labels "$LABELS_JSON" '.fields.labels = $labels')
elif [[ ${#ADD_LABELS[@]} -gt 0 ]]; then
    # Merge existing and new labels
    ALL_LABELS=("${EXISTING_LABELS[@]}" "${ADD_LABELS[@]}")
    # Remove duplicates
    UNIQUE_LABELS=$(printf '%s\n' "${ALL_LABELS[@]}" | sort -u)
    LABELS_JSON=$(echo "$UNIQUE_LABELS" | jq -R . | jq -s .)
    PAYLOAD=$(echo "$PAYLOAD" | jq --argjson labels "$LABELS_JSON" '.fields.labels = $labels')
fi

# Update the ticket
response=$(curl -s -X PUT \
    -u "$AUTH" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    -w "\n%{http_code}" \
    "$BASE_URL/rest/api/2/issue/$TICKET")

# Extract HTTP status code
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

# Check for errors
if [[ "$http_code" == "204" ]]; then
    echo "Updated: $TICKET"
    echo "URL: $BASE_URL/browse/$TICKET"
elif [[ "$http_code" == "200" ]]; then
    echo "Updated: $TICKET"
    echo "URL: $BASE_URL/browse/$TICKET"
else
    echo "Error updating ticket (HTTP $http_code):"
    if [[ -n "$body" ]]; then
        echo "$body" | jq -r '.errorMessages[]? // .errors // .' 2>/dev/null || echo "$body"
    fi
    exit 1
fi
