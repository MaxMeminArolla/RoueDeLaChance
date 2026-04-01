#!/usr/bin/env pwsh

# Build front-end
Write-Host "🔨 Building front-end..." -ForegroundColor Cyan
Push-Location "RoueDeLaChance.Front"

if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing npm dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🏗️  Compiling TypeScript..." -ForegroundColor Yellow
npm run build

Write-Host "📁 Copying static files..." -ForegroundColor Yellow
npm run copy-static

Pop-Location

Write-Host "✅ Front-end build complete!" -ForegroundColor Green
