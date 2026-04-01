#!/usr/bin/env pwsh

# Initialize RoueDeLaChance solution
# Usage: .\init.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Initializing RoueDeLaChance solution..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "1️⃣  Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
Write-Host ""

# Step 2: Install front-end dependencies
Write-Host "2️⃣  Installing front-end dependencies..." -ForegroundColor Yellow
Push-Location "RoueDeLaChance.Front"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 3: Build front-end
Write-Host "3️⃣  Building front-end..." -ForegroundColor Yellow
./build-front.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Front-end build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Front-end built successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Build .NET solution
Write-Host "4️⃣  Building .NET solution..." -ForegroundColor Yellow
dotnet build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ .NET build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ .NET solution built" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run the application: dotnet run -p RoueDeLaChance.Web"
Write-Host "  2. Open http://localhost:5000 in your browser"
Write-Host "  3. For continuous development: npm run dev (in RoueDeLaChance.Front folder)"
Write-Host ""
