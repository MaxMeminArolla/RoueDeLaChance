#!/usr/bin/env powershell

# RoueDeLaChance - Quick Commands Reference

Write-Host "🎯 RoueDeLaChance - Commandes rapides" -ForegroundColor Cyan
Write-Host ""

$commands = @(
    @{
        Cmd = "start .\RoueDeLaChance.sln"
        Desc = "Ouvrir la solution dans VS"
    },
    @{
        Cmd = "dotnet build"
        Desc = "Builder front + back"
    },
    @{
        Cmd = "dotnet run -p RoueDeLaChance.Web"
        Desc = "Lancer l'app (http://localhost:5000)"
    },
    @{
        Cmd = "dotnet watch run -p RoueDeLaChance.Web"
        Desc = "Lancer avec hot-reload"
    },
    @{
        Cmd = "cd RoueDeLaChance.Front && npm run dev"
        Desc = "Watch TypeScript (recompile auto)"
    },
    @{
        Cmd = "dotnet test"
        Desc = "Lancer les tests"
    },
    @{
        Cmd = "cd RoueDeLaChance.Front && npm run build"
        Desc = "Builder le front manuellement"
    },
    @{
        Cmd = "cd RoueDeLaChance.Front && npm run copy-static"
        Desc = "Copier HTML/CSS vers wwwroot"
    }
)

$commands | Format-Table -Property @(
    @{Label="Commande"; Expression={$_.Cmd}; Width=45},
    @{Label="Description"; Expression={$_.Desc}; Width=35}
) -AutoSize

Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   START_HERE.md           → Commencer ici"
Write-Host "   VS_COMPLETE.md          → Guide complet VS"
Write-Host "   VS_INTEGRATION.md       → Détails intégration"
Write-Host "   README.md               → Documentation générale"
Write-Host "   PROJECT_SUMMARY.md      → Résumé technique"
Write-Host ""
