#!/bin/bash

# Safe Development Server Startup Script
# This script handles common issues that cause internal server errors

set -e

echo "🔧 Starting safe dev server..."

# Kill any existing processes on port 3000
echo "📌 Checking for existing processes..."
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "   Killing processes on port 3000..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

# Kill any Next.js dev processes
echo "📌 Checking for Next.js processes..."
pkill -f 'next dev' 2>/dev/null || true
pkill -f 'node.*next' 2>/dev/null || true

# Wait for processes to fully terminate
sleep 2

# Clean build cache
echo "🧹 Cleaning build cache..."
rm -rf .next
rm -rf node_modules/.cache

# Verify critical files exist
echo "✅ Verifying critical files..."
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found!"
  exit 1
fi

if [ ! -f "next.config.js" ]; then
  echo "❌ Error: next.config.js not found!"
  exit 1
fi

# Check for syntax errors before starting
echo "🔍 Checking for TypeScript errors..."
if ! npm run build --dry-run 2>/dev/null; then
  echo "⚠️  Warning: TypeScript errors detected. Running type check..."
  npx tsc --noEmit || echo "⚠️  Type errors found but continuing..."
fi

# Start dev server
echo "🚀 Starting dev server..."
npm run dev

