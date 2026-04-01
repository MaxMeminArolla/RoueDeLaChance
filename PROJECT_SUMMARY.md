# 🎉 RoueDeLaChance - Intégration complète

## ✅ Fichiers créés/modifiés

### Nouveau projet front-end
```
RoueDeLaChance.Front/
├── package.json              # npm scripts et dépendances
├── tsconfig.json             # Configuration TypeScript → wwwroot/js
├── index.html                # Template HTML
├── css/styles.css            # Styles responsives
├── src/app.ts                # Logique TypeScript (roue + API)
├── copy-static.js            # Script copie HTML/CSS → wwwroot
├── .gitignore
└── README.md
```

### Scripts racine
```
init.ps1                       # ⚡ Setup complet (Windows)
init.sh                        # ⚡ Setup complet (Linux/Mac)
build-front.ps1               # Build front-end (Windows)
build-front.sh                # Build front-end (Linux/Mac)
```

### Modifications back-end
```
RoueDeLaChance.Web/Program.cs
  ✅ app.UseDefaultFiles() + app.UseStaticFiles()
  ✅ GET /prizes → IPrizeProvider.GetPrizes()
  ✅ POST /spin → WheelEngine.Spin()

RoueDeLaChance.Web/appsettings.json
  ✅ Section "Prizes" avec exemples

RoueDeLaChance.Web/RoueDeLaChance.Web.http
  ✅ Tests API GET /prizes et POST /spin
```

### Documentation
```
README.md                      # Documentation complète
FRONT_SETUP.md                 # Guide détaillé front-end
INTEGRATION_SUMMARY.md         # Résumé technique
```

---

## 🚀 Premier lancement

### Option 1: Setup automatique (recommandé)

**Windows:**
```powershell
.\init.ps1
```

**macOS/Linux:**
```bash
chmod +x init.sh && bash init.sh
```

### Option 2: Manuel

```bash
# 1. Front-end
cd RoueDeLaChance.Front
npm install && npm run build && npm run copy-static
cd ..

# 2. Backend
dotnet build
```

### Lancer l'application
```bash
dotnet run -p RoueDeLaChance.Web
# ou
dotnet watch run -p RoueDeLaChance.Web
```

Accès: **http://localhost:5000**

---

## 📝 Configuration rapide

### Ajouter des lots
Éditer `RoueDeLaChance.Web/appsettings.json`:
```json
"Prizes": [
  { "Name": "Lot 1", "Probability": 0.1, "Quantity": 5 },
  { "Name": "Lot 2", "Probability": 0.05, "Quantity": 2 },
  { "Name": "Perdu", "Probability": 0.85, "Quantity": 999 }
]
```

### Personnaliser couleurs
Éditer `RoueDeLaChance.Front/src/app.ts`:
```typescript
const AROLLA_PALETTE = [
  "#0b3d91", "#1d9dd3", "#f2a400", "#e94b35", "#6ab04c", "#8e44ad"
];
```

---

## 🔄 Développement

### Watch TypeScript
```bash
cd RoueDeLaChance.Front && npm run dev
```

### Watch ASP.NET
```bash
dotnet watch run -p RoueDeLaChance.Web
```

Laissez les deux terminaux ouverts pour recharge automatique.

---

## 🧪 Tests

```bash
dotnet test
```

Tests existants dans `RoueDeLaChance.Tests/WheelEngineTests.cs`.

---

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/prizes` | Récupère tous les lots |
| POST | `/spin` | Effectue un tirage |
| GET | `/` | Page HTML (roue interactive) |

Testez via `RoueDeLaChance.Web.http` (boutons "Send Request" dans VS Code/Visual Studio).

---

## 📱 Responsive

| Appareil | Taille roue |
|----------|------------|
| Desktop | 600×600px |
| Tablet | 500×500px |
| Mobile | 400×400px |

---

## 🎯 Points clés

✅ **Front compilé en TypeScript** → `wwwroot/js/app.js`
✅ **HTML/CSS copiés vers wwwroot**
✅ **Fichiers statiques servis par ASP.NET**
✅ **API REST complète** (GET /prizes, POST /spin)
✅ **Configuration centralisée** dans appsettings.json
✅ **Animation fluide** 5s cubic-bezier avec CSS transform
✅ **Responsive design** mobile/tablet/desktop
✅ **Tests unitaires inclus**

---

## 🐛 Troubleshooting

### `npm: command not found`
→ Installer Node.js depuis https://nodejs.org

### `tsc: command not found`
→ `npm install` dans `RoueDeLaChance.Front`

### `index.html` introuvable au chargement
→ Lancer `npm run copy-static` depuis `RoueDeLaChance.Front`

### Port 5000 déjà utilisé
→ `dotnet run -p RoueDeLaChance.Web --urls http://localhost:5001`

---

## 📚 Structure wwwroot (générée automatiquement)

```
RoueDeLaChance.Web/wwwroot/
├── index.html                   # Copié de RoueDeLaChance.Front/
├── css/
│   └── styles.css               # Copié de RoueDeLaChance.Front/css/
└── js/
    └── app.js                   # Compilé de RoueDeLaChance.Front/src/app.ts
```

---

**✨ Prêt pour production !**

Consulter `README.md` pour la checklist avant déploiement.
