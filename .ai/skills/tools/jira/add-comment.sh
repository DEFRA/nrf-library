#!/bin/bash
# Add a comment to a JIRA ticket
# Usage: ./add-comment.sh IMTA-XXXXX "Comment text"
#        ./add-comment.sh IMTA-XXXXX -f comment.txt
#        echo "Comment" | ./add-comment.sh IMTA-XXXXX -
#
# Options:
#   -f, --file FILE   Read comment from file
#   -              Read comment from stdin
#   -h, --help        Show this help message

set -e

show_help() {
    cat << EOF
Add a comment to a JIRA ticket

Usage: ./add-comment.sh IMTA-XXXXX "Comment text"
       ./add-comment.sh IMTA-XXXXX -f comment.txt
       echo "Comment" | ./add-comment.sh IMTA-XXXXX -

Options:
  -f, --file FILE   Read comment from file
  -                 Read comment from stdin
  -h, --help        Show this help message

Environment Variables:
  ATLASSIAN_USER   Your Atlassian email address
  ATLASSIAN_TOKEN  Your Atlassian API token

Examples:
  ./add-comment.sh IMTA-12345 "This is a comment"
  ./add-comment.sh IMTA-12345 -f my-comment.txt
  cat notes.md | ./add-comment.sh IMTA-12345 -
EOF
    exit 0
}

# Parse arguments
TICKET=""
COMMENT=""
FROM_FILE=""
FROM_STDIN=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_help
            ;;
        -f|--file)
            FROM_FILE="$2"
            shift 2
            ;;
        -)
            FROM_STDIN=true
            shift
            ;;
        -*)
            echo "Unknown option: $1"
            exit 1
            ;;
        *)
            if [[ -z "$TICKET" ]]; then
                TICKET="$1"
            elif [[ -z "$COMMENT" ]]; then
                COMMENT="$1"
            fi
            shift
            ;;
    esac
done

# Validate ticket
if [[ -z "$TICKET" ]]; then
    echo "Error: Ticket ID required"
    echo "Usage: ./add-comment.sh IMTA-XXXXX \"Comment text\""
    exit 1
fi

# Get comment from appropriate source
if [[ -n "$FROM_FILE" ]]; then
    if [[ ! -f "$FROM_FILE" ]]; then
        echo "Error: File not found: $FROM_FILE"
        exit 1
    fi
    COMMENT=$(cat "$FROM_FILE")
elif [[ "$FROM_STDIN" == true ]]; then
    COMMENT=$(cat)
fi

if [[ -z "$COMMENT" ]]; then
    echo "Error: Comment text required"
    echo "Usage: ./add-comment.sh IMTA-XXXXX \"Comment text\""
    exit 1
fi

# Check credentials
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

# Build JSON payload (escape special characters for JSON)
JSON_COMMENT=$(echo "$COMMENT" | jq -Rs '.')

PAYLOAD=$(cat <<EOF
{
  "body": $JSON_COMMENT
}
EOF
)

# Add the comment
response=$(curl -s -w "\n%{http_code}" -u "$AUTH" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$PAYLOAD" \
    "$BASE_URL/rest/api/2/issue/$TICKET/comment")

# Extract HTTP status code (last line) and body (everything else)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

# Check for errors
if [[ "$http_code" -ge 400 ]]; then
    echo "Error: Failed to add comment (HTTP $http_code)"
    if echo "$body" | jq -e '.errorMessages' > /dev/null 2>&1; then
        echo "$body" | jq -r '.errorMessages[]'
    else
        echo "$body"
    fi
    exit 1
fi

# Success
comment_id=$(echo "$body" | jq -r '.id')
echo "Comment added to $TICKET (comment ID: $comment_id)"
echo "URL: $BASE_URL/browse/$TICKET?focusedCommentId=$comment_id"
