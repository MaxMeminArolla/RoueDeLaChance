#!/bin/bash

# Build front-end for macOS/Linux
echo "🔨 Building front-end..."
cd "RoueDeLaChance.Front"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

echo "🏗️  Compiling TypeScript..."
npm run build

echo "📁 Copying static files..."
npm run copy-static

cd ..

echo "✅ Front-end build complete!"
