#!/bin/bash

cd "/Users/deonkenzie/Desktop/LIFEPHORIA"

echo "🔍 Checking for running processes..."
# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true

echo "🔍 Checking port 3000..."
# Kill anything on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "⏳ Waiting for processes to terminate..."
sleep 3

echo "🧹 Cleaning build cache..."
rm -rf .next

echo "✅ Starting dev server..."
npm run dev


