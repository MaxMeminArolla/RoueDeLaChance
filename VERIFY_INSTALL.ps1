#!/usr/bin/env powershell

# Vérification installation RoueDeLaChance

Write-Host ""
Write-Host "🔍 Vérification de l'installation..." -ForegroundColor Cyan
Write-Host ""

$checks = @(
    @{ Name = "RoueDeLaChance.sln"; Path = ".\RoueDeLaChance.sln" },
    @{ Name = "RoueDeLaChance.Front.csproj"; Path = ".\RoueDeLaChance.Front\RoueDeLaChance.Front.csproj" },
    @{ Name = "package.json"; Path = ".\RoueDeLaChance.Front\package.json" },
    @{ Name = "src/app.ts"; Path = ".\RoueDeLaChance.Front\src\app.ts" },
    @{ Name = "css/styles.css"; Path = ".\RoueDeLaChance.Front\css\styles.css" },
    @{ Name = "Program.cs"; Path = ".\RoueDeLaChance.Web\Program.cs" },
    @{ Name = "appsettings.json"; Path = ".\RoueDeLaChance.Web\appsettings.json" }
)

$allOk = $true
foreach ($check in $checks) {
    if (Test-Path $check.Path) {
        Write-Host "✅ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($check.Name)" -ForegroundColor Red
        $allOk = $false
    }
}

Write-Host ""

if ($allOk) {
    Write-Host "✨ Tous les fichiers sont présents!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "  1. Lancer: start .\RoueDeLaChance.sln"
    Write-Host "  2. Build:  Ctrl+Shift+B"
    Write-Host "  3. Exécuter: F5"
    Write-Host ""
} else {
    Write-Host "⚠️  Certains fichiers manquent!" -ForegroundColor Yellow
    Write-Host ""
}
