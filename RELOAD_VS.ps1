#!/usr/bin/env powershell

# Recharge la solution VS avec tous les projets
# Lance "Reload Solution in Visual Studio"

Write-Host "✅ Solution créée!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Ouvrir dans Visual Studio:" -ForegroundColor Cyan
Write-Host "   File → Open Solution"
Write-Host "   → Sélectionner: RoueDeLaChance.sln"
Write-Host ""
Write-Host "Ou depuis PowerShell:" -ForegroundColor Yellow
Write-Host "   start .\RoueDeLaChance.sln"
Write-Host ""
Write-Host "⚙️  À la première ouverture:" -ForegroundColor Cyan
Write-Host "   1. Build → Clean Solution"
Write-Host "   2. Build → Build Solution (va installer npm deps)"
Write-Host "   3. F5 pour lancer l'application"
Write-Host ""
