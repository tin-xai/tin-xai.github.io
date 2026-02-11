#!/bin/bash
# new-post.sh — Quickly scaffold a new blog post
# Usage: ./new-post.sh

set -e

BLOG_DIR="$(cd "$(dirname "$0")/blog" && pwd)"
POSTS_JSON="$BLOG_DIR/posts.json"
TEMPLATE="$BLOG_DIR/_template.html"

echo "📝 New Blog Post"
echo "──────────────────"

# Gather info
read -r -p "Title (with emoji): " TITLE
read -r -p "Excerpt (one-liner): " EXCERPT
read -r -p "Tags (comma-separated, e.g. Soccer,Auburn Life): " TAGS_RAW
read -r -p "Reading time (e.g. 3 min read): " READING_TIME

# Generate slug from title (lowercase, hyphens, strip emoji/special chars)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')

# Today's date
DATE_ISO=$(date +%Y-%m-%d)
DATE_DISPLAY=$(date +"%B %d, %Y")

echo ""
echo "Slug: $SLUG"
echo "Date: $DATE_ISO"
echo ""

# Build tags JSON array
TAGS_JSON=$(echo "$TAGS_RAW" | sed 's/,/","/g' | sed 's/^ */"/;s/ *$/"/;s/", "/","/g')
TAGS_JSON="[$TAGS_JSON]"

# Build tags HTML
TAGS_HTML=""
IFS=',' read -ra TAG_ARR <<< "$TAGS_RAW"
for tag in "${TAG_ARR[@]}"; do
    tag=$(echo "$tag" | sed 's/^ *//;s/ *$//')
    TAGS_HTML="$TAGS_HTML<span class=\"blog-tag\">$tag</span>\n                    "
done

# Create the HTML file from template
POST_FILE="$BLOG_DIR/$SLUG.html"
if [ -f "$POST_FILE" ]; then
    echo "⚠️  File already exists: $POST_FILE"
    read -r -p "Overwrite? (y/N): " CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
        echo "Aborted."
        exit 1
    fi
fi

sed -e "s|{{TITLE}}|$TITLE|g" \
    -e "s|{{EXCERPT}}|$EXCERPT|g" \
    -e "s|{{DATE_ISO}}|$DATE_ISO|g" \
    -e "s|{{DATE_DISPLAY}}|$DATE_DISPLAY|g" \
    -e "s|{{READING_TIME}}|$READING_TIME|g" \
    -e "s|{{TAGS}}|$TAGS_HTML|g" \
    "$TEMPLATE" > "$POST_FILE"

echo "✅ Created: $POST_FILE"

# Prepend new entry to posts.json (newest first)
# Build the new JSON entry
NEW_ENTRY=$(cat <<EOF
  {
    "slug": "$SLUG",
    "title": "$TITLE",
    "excerpt": "$EXCERPT",
    "date": "$DATE_ISO",
    "tags": $TAGS_JSON,
    "readingTime": "$READING_TIME"
  }
EOF
)

# Use a temp file to prepend the entry
TEMP_FILE=$(mktemp)
echo "[" > "$TEMP_FILE"
echo "$NEW_ENTRY," >> "$TEMP_FILE"
# Strip the opening bracket from existing JSON, append
tail -c +2 "$POSTS_JSON" >> "$TEMP_FILE"
mv "$TEMP_FILE" "$POSTS_JSON"

echo "✅ Added to posts.json"
echo ""
echo "🎉 Done! Now edit $POST_FILE to write your post content."
echo "   The blog listing and homepage will update automatically."
