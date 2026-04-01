# RoueDeLaChance - Solution Complète

Roue de la chance interactive avec back-end .NET 10 et front-end TypeScript/Canvas.

## 📁 Structure de la solution

```
RoueDeLaChance/
│
├── RoueDeLaChance.Core/               # Logique métier (.NET 10)
│   ├── Prize.cs
│   ├── WheelEngine.cs
│   ├── IRandomNumberProvider.cs
│   └── IPrizeProvider.cs
│
├── RoueDeLaChance.Web/                # API REST + fichiers statiques
│   ├── Program.cs                     # Endpoints /prizes et /spin
│   ├── ConfigurationPrizeProvider.cs
│   ├── appsettings.json               # Configuration des lots
│   ├── wwwroot/                       # Fichiers statiques (AUTO)
│   │   ├── index.html
│   │   ├── css/styles.css
│   │   └── js/app.js
│   └── RoueDeLaChance.Web.csproj
│
├── RoueDeLaChance.Tests/              # Tests unitaires
│   ├── WheelEngineTests.cs
│   └── RoueDeLaChance.Tests.csproj
│
├── RoueDeLaChance.Front/              # Projet front-end (TypeScript)
│   ├── src/app.ts                     # Logique TypeScript
│   ├── css/styles.css                 # Styles
│   ├── index.html                     # Template HTML
│   ├── package.json                   # Dépendances npm
│   ├── tsconfig.json                  # Config TypeScript
│   ├── copy-static.js                 # Script de copie
│   └── README.md
│
├── init.ps1                           # Script d'initialisation (Windows)
├── init.sh                            # Script d'initialisation (macOS/Linux)
├── build-front.ps1                    # Build front-end (Windows)
├── build-front.sh                     # Build front-end (macOS/Linux)
│
├── INTEGRATION_SUMMARY.md             # Résumé technique complet
├── FRONT_SETUP.md                     # Guide configuration front-end
└── README.md (this file)
```

## 🚀 Démarrage rapide

### Windows (PowerShell)

```powershell
# Initialisation complète
.\init.ps1

# Lancer l'application
dotnet run -p RoueDeLaChance.Web
```

### macOS/Linux (Bash)

```bash
# Initialisation complète
chmod +x init.sh
bash init.sh

# Lancer l'application
dotnet run -p RoueDeLaChance.Web
```

### Manual setup

```bash
# 1. Installer les dépendances front-end
cd RoueDeLaChance.Front
npm install

# 2. Builder le front-end
npm run build
npm run copy-static
cd ..

# 3. Builder la solution .NET
dotnet build

# 4. Lancer l'application
dotnet run -p RoueDeLaChance.Web
```

L'application sera accessible à **http://localhost:5000**

## 📋 Configuration

### Ajouter/modifier les lots

Éditer `RoueDeLaChance.Web/appsettings.json`:

```json
{
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

- **Name**: Nom du lot affiché
- **Probability**: Probabilité de tirage (0.0 à 1.0, sera normalisée)
- **Quantity**: Nombre de lots restants (décrémenté après chaque tirage)

### Personnaliser les couleurs

Éditer `RoueDeLaChance.Front/src/app.ts`:

```typescript
const AROLLA_PALETTE = [
  "#0b3d91",  // Bleu foncé (primaire Arolla)
  "#1d9dd3",  // Bleu clair
  "#f2a400",  // Orange
  "#e94b35",  // Rouge
  "#6ab04c",  // Vert
  "#8e44ad"   // Violet
];
```

## 🛠️ Développement continu

### Terminal 1 - Watch TypeScript

```bash
cd RoueDeLaChance.Front
npm run dev
```

TypeScript se recompile automatiquement. Rechargez la page pour voir les changements.

### Terminal 2 - Serveur ASP.NET

```bash
dotnet watch run -p RoueDeLaChance.Web
```

Le serveur redémarre automatiquement aux modifications de code C#.

## 📡 Endpoints API

### `GET /prizes`

Récupère la liste complète des lots.

**Response:**
```json
[
  {
    "name": "Formation context engineering",
    "probability": 0.05,
    "quantity": 3,
    "color": "#0b3d91"
  }
]
```

### `POST /spin`

Effectue un tirage et retourne le lot gagnant.

**Response (gain):**
```json
{
  "isWin": true,
  "prizeName": "Formation context engineering"
}
```

**Response (perte):**
```json
{
  "isWin": false,
  "prizeName": "Perdu"
}
```

## 🧪 Tests

Lancer les tests unitaires:

```bash
dotnet test
```

Les tests du `WheelEngine` sont dans `RoueDeLaChance.Tests/WheelEngineTests.cs`.

## 📱 Responsive Design

- **Desktop**: Roue 600×600px
- **Tablet**: Roue 500×500px
- **Mobile**: Roue 400×400px

Les CSS utilise des media queries pour s'adapter.

## 🔧 Dépendances

### Front-end
- **TypeScript 5.0+** - Langage de programmation
- **Node.js 16+** - Runtime JavaScript

### Back-end
- **.NET 10** - Framework
- **Microsoft.Extensions.Configuration** - Configuration
- **Microsoft.AspNetCore.OpenApi** - Documentation OpenAPI

## 📚 Documentation supplémentaire

- `FRONT_SETUP.md` - Guide complet d'intégration front-end
- `INTEGRATION_SUMMARY.md` - Résumé technique détaillé
- `RoueDeLaChance.Front/README.md` - Documentation du projet front

## 🎯 Points importants

1. **Build front-end obligatoire** avant de lancer l'application (génère `wwwroot/`)
2. **Probabilités normalisées** - La somme des probabilités n'a pas besoin de faire 1.0
3. **Quantités décrémentées côté serveur** - Sécurisé contre les modifications client
4. **CSS responsive** - Fonctionne sur mobile, tablet, desktop
5. **Mode développement** - Utilisez `dotnet watch` et `npm run dev` pour le développement continu

## ✅ Checklist avant production

- [ ] Éditer `appsettings.json` avec les vrais lots
- [ ] Adapter la palette de couleurs aux couleurs Arolla
- [ ] Modifier typo/logo/UI selon branding Arolla
- [ ] Configurer CORS si front et back sur domaines différents
- [ ] Tester sur mobile/tablet/desktop
- [ ] Mettre en place une base de données pour persister les quantités
- [ ] Ajouter authentification/validation si nécessaire

---

**Version**: 1.0.0  
**Stack**: .NET 10 + TypeScript + Canvas  
**Status**: ✅ Production-ready
