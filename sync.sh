#!/bin/bash

echo "=== Syncing all local files to GitHub ==="
echo ""

# Step 1: Sync main branch
echo "Step 1: Syncing main branch..."
git checkout main
git add .
git commit -m "Sync all files from Mac to main"
git push origin main
echo "✓ main branch synced"
echo ""

# Step 2: Sync gh-pages branch
echo "Step 2: Syncing gh-pages branch..."
git checkout gh-pages
git add .
git commit -m "Sync all files from Mac to gh-pages"
git push origin gh-pages
echo "✓ gh-pages branch synced"
echo ""

# Step 3: Verify
echo "Step 3: Verifying..."
echo ""
echo "Checking main branch commits:"
git log origin/main --oneline -3
echo ""
echo "Checking gh-pages branch commits:"
git log origin/gh-pages --oneline -3
echo ""

echo "=== Done! ==="
echo "Your Mac files are now on GitHub in both main and gh-pages branches"
echo "Website should update at: https://harmonicsandhealing.github.io/harmonicsandhealing/"
echo "Wait 10-30 seconds and hard refresh (Cmd+Shift+R)"