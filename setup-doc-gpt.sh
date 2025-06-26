#!/bin/bash

# Abort on error
set -e

echo "📦 Cloning DOC GPT Final repository..."
# Replace YOUR_USERNAME with your GitHub username
# so the repo clones from your fork.
git clone https://github.com/YOUR_USERNAME/DOC-GPT-Final.git
cd DOC-GPT-Final

echo "📁 Installing root dependencies..."
npm install

echo "📁 Installing backend dependencies..."
cd backend
npm install
echo "📦 Packaging backend node_modules..."
tar -czf node_modules-backend.tar.gz node_modules
cd ..

if [ -d "doc-ikgpt-web" ]; then
  echo "📁 Installing web dashboard dependencies..."
  cd doc-ikgpt-web
  npm install
  echo "📦 Packaging web dashboard node_modules..."
  tar -czf node_modules-web.tar.gz node_modules
  cd ..
else
  echo "⚠️ Skipping web dashboard setup: 'doc-ikgpt-web' directory not found."
fi

echo "📦 Packaging root node_modules..."
tar -czf node_modules-root.tar.gz node_modules

echo "✅ Setup complete. Move 'node_modules-root.tar.gz', 'node_modules-backend.tar.gz' and, if present, 'node_modules-web.tar.gz' to your offline machine. Extract each archive with:\n  tar -xzf <archive>"
