# Projet Front-End RoueDeLaChance - Résumé d'intégration

## ✅ Fichiers créés

### RoueDeLaChance.Front/
```
├── package.json              - Dépendances npm et scripts
├── tsconfig.json             - Configuration TypeScript
├── index.html                - Template HTML (roue + boutons)
├── css/styles.css            - Styles responsive
├── src/app.ts                - Logique TypeScript (roue, animation, API)
├── copy-static.js            - Script de copie des fichiers statiques
├── .gitignore                - Fichiers ignorés par git
└── README.md                 - Documentation du projet front
```

### Scripts à la racine
```
├── build-front.ps1           - Build script pour Windows (PowerShell)
├── build-front.sh            - Build script pour macOS/Linux (Bash)
├── FRONT_SETUP.md            - Guide complet d'intégration
└── RoueDeLaChance.Front/...  - Nouveau projet TypeScript
```

### Modifications back-end
```
RoueDeLaChance.Web/Program.cs
  - Ajout: app.UseDefaultFiles()
  - Ajout: app.UseStaticFiles()
  - Ajout: GET /prizes → retourne les lots depuis IPrizeProvider
  - Modification: POST /spin → accepte des lots vides

RoueDeLaChance.Web/appsettings.json
  - Ajout: Section "Prizes" avec exemples de lots
```

## 🚀 Workflow de build

### Windows (PowerShell)
```powershell
./build-front.ps1
```

### macOS/Linux (Bash)
```bash
chmod +x build-front.sh
./build-front.sh
```

### Manual
```bash
cd RoueDeLaChance.Front
npm install
npm run build
npm run copy-static
```

## 📁 Résultat attendu après build

Les fichiers générés sont créés dans `RoueDeLaChance.Web/wwwroot/`:
```
wwwroot/
├── index.html                - Template HTML
├── css/styles.css            - Styles compilés
└── js/app.js                 - TypeScript compilé (ES2020)
```

## 🎯 Points clés

1. **Configuration des lots**: Éditer `appsettings.json` pour ajouter/modifier les lots
2. **Endpoints API**:
   - `GET /prizes` - Récupère la liste des lots
   - `POST /spin` - Effectue le tirage et décrémente les quantités
3. **Compilation TypeScript**: `npm run build` génère `wwwroot/js/app.js`
4. **Fichiers statiques**: `npm run copy-static` copie HTML et CSS
5. **Mode développement**: `npm run dev` surveille les changements TypeScript

## 🔄 Mode développement continu

Terminal 1 - Watch TypeScript:
```bash
cd RoueDeLaChance.Front
npm run dev
```

Terminal 2 - Lancer le serveur .NET:
```bash
cd RoueDeLaChance.Web
dotnet watch run
```

Les modifications TypeScript se recompilent automatiquement, rechargez la page pour voir les changements.

## 📋 Configuration appsettings.json

Exemple complet avec couleurs Arolla:
```json
{
  "Logging": {
    "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" }
  },
  "AllowedHosts": "*",
  "Prizes": [
    {
      "Name": "Formation context engineering",
      "Probability": 0.05,
      "Quantity": 3
    },
    {
      "Name": "Château légo",
      "Probability": 0.01,
      "Quantity": 1
    },
    {
      "Name": "Perdu",
      "Probability": 0.94,
      "Quantity": 999
    }
  ]
}
```

## ✨ Palette de couleurs (Arolla)

```typescript
#0b3d91  - Bleu foncé (primaire)
#1d9dd3  - Bleu clair
#f2a400  - Orange
#e94b35  - Rouge
#6ab04c  - Vert
#8e44ad  - Violet
```

Éditer `src/app.ts` pour personnaliser les couleurs.

## 📱 Responsive

- Desktop: Roue 600x600px
- Mobile: Roue 400x400px (media query)

---

**Statut**: ✅ Intégration complète
**Prêt pour**: `npm install` → `./build-front.ps1` → `dotnet run`
