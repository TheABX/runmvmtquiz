#!/bin/bash

# Build Validation Script
# Run this before committing to catch issues early

set -e

echo "🔍 Validating build..."

# Clean first
echo "🧹 Cleaning..."
rm -rf .next

# Type check
echo "📝 Type checking..."
npx tsc --noEmit || {
  echo "❌ TypeScript errors found!"
  exit 1
}

# Build
echo "🏗️  Building..."
npm run build || {
  echo "❌ Build failed!"
  exit 1
}

echo "✅ Build validation passed!"


