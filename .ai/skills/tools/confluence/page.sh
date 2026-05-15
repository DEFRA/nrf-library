#!/bin/bash
# Get Confluence page details
# Usage: ./page.sh PAGE_ID_OR_URL [format]
# Formats: full (default), summary, json

set -e

INPUT="${1:-}"
FORMAT="${2:-full}"
USER="${ATLASSIAN_USER:-}"
BASE_URL="https://eaflood.atlassian.net/wiki"

if [[ -z "$USER" ]]; then
  echo "Error: ATLASSIAN_USER environment variable not set"
  exit 1
fi

if [[ -z "$INPUT" ]]; then
  echo "Usage: ./page.sh PAGE_ID_OR_URL [format]"
  echo "Formats: full (default), summary, json"
  exit 1
fi

# Extract page id if a URL was provided
if [[ "$INPUT" =~ ^https?:// ]]; then
  PAGE_ID=$(echo "$INPUT" | sed -E 's#.*/pages/([0-9]+).*#\1#')
else
  PAGE_ID="$INPUT"
fi

if ! [[ "$PAGE_ID" =~ ^[0-9]+$ ]]; then
  echo "Error: unable to determine page id from input: $INPUT"
  exit 1
fi

if [[ -z "$ATLASSIAN_TOKEN" ]]; then
  echo "Error: ATLASSIAN_TOKEN environment variable not set"
  exit 1
fi

response=$(curl -s -u "$USER:$ATLASSIAN_TOKEN" \
  -H "Accept: application/json" \
  "$BASE_URL/rest/api/content/$PAGE_ID?expand=body.view,version,space,history,metadata.labels")

# Check for errors
if echo "$response" | jq -e '.statusCode' > /dev/null 2>&1; then
  echo "$response" | jq -r '.message // "Unknown error"'
  exit 1
fi

case "$FORMAT" in
  json)
    echo "$response"
    ;;
  summary)
    echo "$response" | jq -r '{
      id: .id,
      title: .title,
      space: .space.key,
      version: .version.number,
      updated: .version.when,
      updatedBy: .version.by.displayName,
      url: "'"$BASE_URL"'/spaces/\(.space.key)/pages/\(.id)"
    }'
    ;;
  full|*)
    echo "=== Page $PAGE_ID ==="
    echo "$response" | jq -r '"Title: \(.title)"'
    echo "$response" | jq -r '"Space: \(.space.key)"'
    echo "$response" | jq -r '"Version: \(.version.number) (Updated: \(.version.when))"'
    echo "$response" | jq -r '"Updated by: \(.version.by.displayName)"'
    echo "$response" | jq -r '"URL: '"$BASE_URL"'/spaces/\(.space.key)/pages/\(.id)"'
    echo ""
    echo "=== Labels ==="
    echo "$response" | jq -r '.metadata.labels.results[].name // empty'
    echo ""
    echo "=== Body (HTML) ==="
    echo "$response" | jq -r '.body.view.value // "No content"'
    ;;
esac
