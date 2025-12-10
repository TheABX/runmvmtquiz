#!/bin/bash

# Formatting Check Script
# Ensures CSS and formatting consistency

set -e

echo "🎨 Checking formatting..."

# Check for common CSS issues
echo "📝 Checking for CSS conflicts..."

# Find files with conflicting Tailwind classes
if grep -r "className.*bg-white.*bg-black\|className.*bg-black.*bg-white" app/ 2>/dev/null; then
  echo "⚠️  Warning: Conflicting background colors found"
fi

# Check for missing closing tags
echo "📝 Checking for unclosed tags..."
if grep -r "className.*{" app/ --include="*.tsx" | grep -v "}" | head -5; then
  echo "⚠️  Warning: Possible unclosed className attributes"
fi

echo "✅ Formatting check complete"


