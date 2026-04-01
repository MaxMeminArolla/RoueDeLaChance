# ✅ RoueDeLaChance - Intégration VS complète

## 🎉 C'est fait!

Votre project front est maintenant **entièrement intégré dans VS**.

---

## 📂 Ouvrir la solution

### Méthode 1: Depuis terminal PowerShell
```powershell
start .\RoueDeLaChance.sln
```

### Méthode 2: Depuis VS
1. File → Open Solution
2. Parcourir → `RoueDeLaChance.sln`
3. Open

---

## 🚀 Premier build dans VS

1. **Build → Clean Solution** (Ctrl+Shift+Alt+B)
2. **Build → Build Solution** (Ctrl+Shift+B)

✨ VS va automatiquement:
- Détecter npm manquant
- Installer `node_modules/`
- Compiler TypeScript → ES2020
- Copier HTML/CSS vers wwwroot/

Attendez le message:
```
✅ Front-end build complete
```

---

## ✨ Solution Explorer

Vous verrez maintenant:

```
RoueDeLaChance (Solution)
├── RoueDeLaChance.Web
│   ├── wwwroot/
│   │   ├── index.html
│   │   ├── css/styles.css
│   │   └── js/app.js
│   ├── Program.cs
│   ├── appsettings.json
│   └── RoueDeLaChance.Web.csproj
│
├── RoueDeLaChance.Core
│   ├── WheelEngine.cs
│   ├── Prize.cs
│   └── ...
│
├── RoueDeLaChance.Tests
│   ├── WheelEngineTests.cs
│   └── ...
│
└── RoueDeLaChance.Front ⭐ NOUVEAU
    ├── 📁 css/
    │   └── styles.css
    ├── 📁 src/
    │   └── app.ts
    ├── 📁 node_modules/ (généré)
    ├── package.json
    ├── tsconfig.json
    ├── index.html
    ├── copy-static.js
    └── RoueDeLaChance.Front.csproj
```

---

## 🎯 Utilisation quotidienne

### Développement itératif

**Terminal 1** - Watch TypeScript (recompile auto):
```powershell
cd RoueDeLaChance.Front
npm run dev
```

**Terminal 2** - Serveur avec hot-reload:
```powershell
dotnet watch run -p RoueDeLaChance.Web
```

**VS** - Cliquer sur fichiers:
- `RoueDeLaChance.Front/src/app.ts` - Éditer la logique roue
- `RoueDeLaChance.Front/css/styles.css` - Éditer les styles
- `RoueDeLaChance.Web/appsettings.json` - Éditer les lots

**Navigateur**:
- F5 → Voir les changements instantanément

---

## 🔧 Workflow complet

### 1️⃣ Modifier TypeScript
```
Edit: RoueDeLaChance.Front/src/app.ts
      (npm watch détecte)
      → TypeScript compilé en 100ms
      → F5 browser refresh
      ✅ Changement visible
```

### 2️⃣ Modifier styles
```
Edit: RoueDeLaChance.Front/css/styles.css
      (npm watch copie automatiquement)
      → F5 browser refresh
      ✅ Nouveau style visible
```

### 3️⃣ Ajouter lots
```
Edit: RoueDeLaChance.Web/appsettings.json
      → Serveur redémarre (dotnet watch)
      → GET /prizes retourne nouveaux lots
      → F5 browser
      ✅ Nouveaux lots affichés
```

### 4️⃣ Modifier logique back
```
Edit: RoueDeLaChance.Core/WheelEngine.cs
      → dotnet watch redémarre (1-2s)
      → F5 browser
      ✅ Nouveau comportement actif
```

---

## 📋 Architecture

### Back-end (.NET 10)
```
Program.cs (routes API)
├── GET /prizes → Returns config-based Prize[]
└── POST /spin  → Spin wheel + decrement quantities

appsettings.json
└── "Prizes": [ {Name, Probability, Quantity} ]
```

### Front-end (TypeScript)
```
index.html (template)
css/styles.css (styles roue responsive)
src/app.ts (logique roue canvas + API calls)
└── Fetches /prizes
    Draws canvas wheel
    On click: POST /spin
    Animate rotation
    Display result
```

### Résultat
```
wwwroot/ (générés automatiquement)
├── index.html → Servi par StaticFiles
├── css/styles.css
└── js/app.js (TypeScript compilé)
```

---

## 🎨 Personnalisation facile

### Couleurs Arolla
**File:** `RoueDeLaChance.Front/src/app.ts` (ligne ~6)
```typescript
const AROLLA_PALETTE = [
  "#0b3d91",  // Bleu foncé
  "#1d9dd3",  // Bleu clair
  "#f2a400",  // Orange
  "#e94b35",  // Rouge
  "#6ab04c",  // Vert
  "#8e44ad"   // Violet
];
```

### Ajouter des lots
**File:** `RoueDeLaChance.Web/appsettings.json`
```json
"Prizes": [
  { "Name": "Nouveau lot", "Probability": 0.05, "Quantity": 10 }
]
```

### Modifier la taille roue
**File:** `RoueDeLaChance.Front/css/styles.css` (ligne ~1)
```css
:root {
  --wheel-size: 600px;  /* 400px pour mobile, 800px pour desktop */
}
```

---

## 🧪 Tests

Lancer tests unitaires:
```
Test → Run All Tests (Ctrl+R, A)
```

Ou depuis terminal:
```powershell
dotnet test
```

---

## 🐛 Si ça ne marche pas

### "npm: command not found"
→ Installer Node.js: https://nodejs.org (18+ requis)

### "Build échoue avec npm error"
→ Dans VS: Tools → Command Line → `npm cache clean --force`

### "TypeScript pas compilé"
→ Build → Clean Solution
→ Build → Build Solution

### "wwwroot vide"
→ `npm run copy-static` (depuis terminal dans RoueDeLaChance.Front)

### "Port 5000 occupé"
→ Edit `RoueDeLaChance.Web/Properties/launchSettings.json`
→ Changer `"applicationUrl": "http://localhost:5001"`

---

## 📚 Documentation

| Fichier | Contenu |
|---------|---------|
| `VS_INTEGRATION.md` | Guide détaillé VS |
| `README.md` | Documentation générale |
| `PROJECT_SUMMARY.md` | Quick start |
| `FRONT_SETUP.md` | Config front-end |
| `INTEGRATION_SUMMARY.md` | Architecture |

---

## ✨ Points clés

✅ **Le front est visible dans VS Solution Explorer**
✅ **Build VS → npm install + build auto**
✅ **Hot-reload** avec `npm run dev` + `dotnet watch`
✅ **TypeScript compilé** automatiquement
✅ **Fichiers statiques** copiés vers wwwroot
✅ **API routes** prêtes
✅ **Tests unitaires** inclus

---

## 🎯 Prochaines étapes

1. **Ouvrir solution:** `start .\RoueDeLaChance.sln`
2. **Clean & Rebuild:** Ctrl+Shift+B (attend npm install)
3. **Lancer:** F5
4. **Accès:** http://localhost:5000
5. **Éditer:** src/app.ts, css/styles.css, appsettings.json
6. **Refresh:** F5 browser

---

**Status:** ✅ Production-ready
**Structure:** .NET 10 + TypeScript + Canvas
**Intégration:** ✅ Complete dans VS

Vous êtes prêt! 🚀
