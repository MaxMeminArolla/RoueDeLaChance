# 🎯 Intégration RoueDeLaChance.Front dans Visual Studio

## ✅ Le projet est maintenant visible dans VS!

### Structure dans Solution Explorer

```
Solution 'RoueDeLaChance'
├── RoueDeLaChance.Web          (ASP.NET 10 - API)
├── RoueDeLaChance.Core         (Class Library - Logique)
├── RoueDeLaChance.Tests        (xUnit - Tests)
└── RoueDeLaChance.Front        (Front-end npm/TypeScript)
    ├── 📁 css/
    │   └── styles.css
    ├── 📁 src/
    │   └── app.ts
    ├── package.json
    ├── tsconfig.json
    ├── index.html
    ├── copy-static.js
    └── RoueDeLaChance.Front.csproj
```

---

## 🔄 Workflow

### 1. Ouvrir la solution dans VS

```powershell
# Depuis le root du projet
start .\RoueDeLaChance.sln
```

Ou directement depuis VS → File → Open Solution → `RoueDeLaChance.sln`

### 2. Build automatique

```
Build → Build Solution (Ctrl+Shift+B)
```

✨ **Magie:** Le .csproj du front lance automatiquement:
- `npm install`
- `npm run build` (TypeScript → ES2020)
- `npm run copy-static` (HTML/CSS → wwwroot)

### 3. Lancer l'application

```
Debug → Start Debugging (F5)
```

Ou depuis terminal:
```powershell
dotnet run -p RoueDeLaChance.Web
```

Accès: **http://localhost:5000**

---

## 📝 Éditer le front depuis VS

Le front est maintenant un vrai projet VS:

✅ **Voir les fichiers** dans Solution Explorer
✅ **Double-clic** pour ouvrir `app.ts`, `styles.css`, etc.
✅ **Intellisense TypeScript** (grâce à `tsconfig.json`)
✅ **Build** auto avec solution
✅ **Ctrl+Shift+B** compile tout

### Aperçu des fichiers

| Fichier | Rôle | Éditable |
|---------|------|----------|
| `src/app.ts` | Logique roue + API | ✅ Oui |
| `css/styles.css` | Styles roue | ✅ Oui |
| `index.html` | Template HTML | ✅ Oui |
| `package.json` | npm config | ✅ Oui (reload build) |
| `tsconfig.json` | TypeScript config | ✅ Oui |

---

## 🔧 Configuration du .csproj

Le `RoueDeLaChance.Front.csproj` contient:

```xml
<Target Name="BuildFrontEnd" BeforeTargets="Build">
  <Exec Command="npm install" />
  <Exec Command="npm run build" />
  <Exec Command="npm run copy-static" />
</Target>
```

**Résultat:** À chaque build VS, npm s'exécute automatiquement.

---

## 🚀 Développement continu (mode "hot")

Pour une recompilation ultra-rapide:

### Terminal 1 (npm watch)
```powershell
cd RoueDeLaChance.Front
npm run dev
```

TypeScript se recompile **instantanément** (< 100ms) lors de modifs.

### Terminal 2 (dotnet watch)
```powershell
dotnet watch run -p RoueDeLaChance.Web
```

Le serveur redémarre auto aux modifs C#.

**Workflow:** Modifier → F5 refresh → Voilà!

---

## 🎨 Personnaliser les styles

1. Ouvrir `RoueDeLaChance.Front/css/styles.css` depuis VS
2. Modifier les couleurs/polices
3. **Ctrl+Shift+B** pour recompiler
4. **F5** pour refresh le navigateur

Exemple:
```css
:root {
  --primary: #0b3d91;      /* Bleu Arolla */
  --secondary: #1d9dd3;    /* Bleu clair */
}
```

---

## 📊 Editer les lots (appsettings.json)

1. Ouvrir `RoueDeLaChance.Web/appsettings.json`
2. Ajouter/modifier la section "Prizes":

```json
{
  "Prizes": [
    {
      "Name": "Mon lot",
      "Probability": 0.1,
      "Quantity": 5
    }
  ]
}
```

3. **Redémarrer** le serveur (Shift+Alt+F5)

---

## 🔍 Déboguer TypeScript

Les sources TypeScript sont déboguables via:

1. **Chrome DevTools** (F12 dans le navigateur)
2. **Source maps** générées automatiquement dans `wwwroot/js/`
3. Breakpoints dans onglet "Sources"

---

## 🧹 Clean & Rebuild

### Clean
```
Build → Clean Solution
```

Supprime:
- `node_modules/` (recréé au prochain build)
- `wwwroot/js/` (recréé au prochain build)
- Artifacts .NET

### Rebuild
```
Build → Rebuild Solution
```

---

## ⚠️ Dépannage

### "npm: command not found"
→ Installer Node.js depuis https://nodejs.org

### Build échoue avec erreur npm
→ Terminal → `cd RoueDeLaChance.Front && npm install`

### Port 5000 occupé
→ Configurer un autre port dans `launchSettings.json`:
```json
"applicationUrl": "http://localhost:5001"
```

### Fichiers TypeScript visibles mais non compilés
→ Forcer un **Rebuild Solution** (Ctrl+Shift+B)

---

## 📋 Checklist

- [x] RoueDeLaChance.Front visible dans Solution Explorer
- [x] .csproj configure les targets npm
- [x] Build Solution compile automatiquement le front
- [x] Fichiers TypeScript/HTML/CSS modifiables depuis VS
- [x] wwwroot/ générés automatiquement
- [x] Application fonctionne après F5

---

## 📚 Fichiers importants

| Fichier | Usage |
|---------|-------|
| `RoueDeLaChance.sln` | Solution VS (à ouvrir) |
| `RoueDeLaChance.Front/RoueDeLaChance.Front.csproj` | Déclare projet + targets npm |
| `RoueDeLaChance.Front/package.json` | Scripts npm (build, dev, etc.) |
| `RoueDeLaChance.Front/tsconfig.json` | Config TypeScript |
| `RoueDeLaChance.Web/Program.cs` | API endpoints |
| `RoueDeLaChance.Web/appsettings.json` | Config des lots |

---

## 🎯 Prochain build

```powershell
# Clean
Build → Clean Solution

# Rebuild
Build → Rebuild Solution

# Ou depuis terminal
dotnet build
dotnet run -p RoueDeLaChance.Web
```

Voilà! Le front et le back sont maintenant **intégrés dans une unique solution VS** 🎉
