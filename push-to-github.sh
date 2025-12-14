#!/bin/bash

# Push to GitHub script
# This script will commit any changes and push to GitHub

cd /Users/deonkenzie/Desktop/LIFEPHORIA

# Check status
echo "Checking git status..."
git status

# Stage all changes
echo "Staging all changes..."
git add -A

# Commit if there are changes
if ! git diff --staged --quiet; then
  echo "Committing changes..."
  git commit -m "Update ability tier classification and volume bands"
fi

# Push to GitHub
echo "Pushing to GitHub..."
echo "Note: You'll need to authenticate. Use: git push origin main"
git push origin main

echo "✅ Push complete!"
