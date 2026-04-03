# Build front-end - Simplified Version
Push-Location "RoueDeLaChance.Front"

if (-Not (Test-Path "node_modules")) {
    npm install
}

npm run build
npm run copy-static

Pop-Location

Write-Host "Front-end build complete!"
