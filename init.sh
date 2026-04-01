#!/bin/bash

# Initialize RoueDeLaChance solution
# Usage: bash init.sh

set -e

echo "🚀 Initializing RoueDeLaChance solution..."
echo ""

# Step 1: Check Node.js
echo "1️⃣  Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION found"
echo ""

# Step 2: Install front-end dependencies
echo "2️⃣  Installing front-end dependencies..."
cd "RoueDeLaChance.Front"
npm install
cd ..
echo "✅ Dependencies installed"
echo ""

# Step 3: Build front-end
echo "3️⃣  Building front-end..."
chmod +x build-front.sh
./build-front.sh
echo "✅ Front-end built successfully"
echo ""

# Step 4: Build .NET solution
echo "4️⃣  Building .NET solution..."
dotnet build
echo "✅ .NET solution built"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run the application: dotnet run -p RoueDeLaChance.Web"
echo "  2. Open http://localhost:5000 in your browser"
echo "  3. For continuous development: npm run dev (in RoueDeLaChance.Front folder)"
echo ""
