# Build front-end
Write-Host "Building front-end..."

# Extraction de la date Git de facon robuste
$gitDate = git log -1 --format=%cd --date=format:"%d/%m/%Y %H:%M:%S"
$versionPath = "RoueDeLaChance.Front/src/version.ts"
$content = "export const lastCommitDate = '$gitDate';"
Set-Content -Path $versionPath -Value $content -Encoding Utf8

# Compilation et copie
Set-Location "RoueDeLaChance.Front"
if (-Not (Test-Path "node_modules")) { npm install }
npm run build
npm run copy-static
Set-Location ".."

Write-Host "Build Complete!"
