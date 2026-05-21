#!/usr/bin/env bash
set -e

echo "=== EPF Scraper Cron Job ==="
echo "Date: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"

# Configure git
git config --global user.name "render-bot"
git config --global user.email "render-bot@users.noreply.github.com"

# Set authenticated remote for push (Render clones without push access)
if [ -n "$GITHUB_TOKEN" ]; then
  git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/JK0611/Employees-Provident-Fund-Portfolio.git"
fi

# Pull latest changes (in case another run pushed recently)
git pull --rebase origin main || true

# Run scraper
echo ""
echo "--- Running Scraper ---"
node scrape_test.js

# Run data processor
echo ""
echo "--- Processing Data ---"
node process_data.js

# Commit and push if there are changes
echo ""
echo "--- Committing Changes ---"
git add links.json scrape_test_results.json codes_cache.json frontend/data.js
git diff --staged --quiet || (git commit -m "chore: auto-update EPF announcement data [$(date -u '+%Y-%m-%d')]" && git push)

echo ""
echo "=== Done ==="
