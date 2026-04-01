# Intégration Front-End - RoueDeLaChance.Front

## Structure

```
RoueDeLaChance/
├── RoueDeLaChance.Front/          # Nouveau projet front-end
│   ├── src/
│   │   └── app.ts                 # Logique TypeScript
│   ├── css/
│   │   └── styles.css             # Styles
│   ├── index.html                 # Template HTML
│   ├── package.json
│   ├── tsconfig.json
│   └── copy-static.js
├── RoueDeLaChance.Web/
│   ├── wwwroot/                   # Fichiers statiques générés (AUTO)
│   │   ├── index.html
│   │   ├── css/
│   │   └── js/
│   ├── Program.cs
│   └── ...
├── build-front.ps1                # Script de build (PowerShell)
├── build-front.sh                 # Script de build (Bash)
└── ...
```

## Installation et Build

### Sur Windows (PowerShell)

```powershell
# Build front-end et copier vers wwwroot
./build-front.ps1
```

### Sur macOS/Linux (Bash)

```bash
# Make le script exécutable
chmod +x build-front.sh

# Build front-end et copier vers wwwroot
./build-front.sh
```

### Manual

```bash
cd RoueDeLaChance.Front
npm install
npm run build
npm run copy-static
cd ..
```

## Développement

### Recompiler TypeScript automatiquement

```bash
cd RoueDeLaChance.Front
npm run dev
```

Laissez ce terminal ouvert pendant le développement. TypeScript se recompilera à chaque modification de `src/**/*.ts`.

## Endpoints API requis

Le backend doit exposer:

- `GET /prizes` - Retourne la liste des lots
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

- `POST /spin` - Effectue le tirage
  ```json
  {
    "isWin": true,
    "prizeName": "Formation context engineering"
  }
  ```

## Configuration des lots

Éditer `RoueDeLaChance.Web/appsettings.json` ou `appsettings.Development.json`:

```json
{
  "Logging": { ... },
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
    }
  ]
}
```

## Fichiers générés

Après `npm run build`, les fichiers TypeScript compilés sont générés dans:
- `RoueDeLaChance.Web/wwwroot/js/app.js`

Les fichiers statiques (HTML, CSS) sont copiés dans:
- `RoueDeLaChance.Web/wwwroot/index.html`
- `RoueDeLaChance.Web/wwwroot/css/styles.css`

## Accès

Une fois l'application `.NET` lancée:
- Front-end: `http://localhost:5000/` (ou le port configuré)
- API OpenAPI (dev): `http://localhost:5000/openapi/v1.json`
