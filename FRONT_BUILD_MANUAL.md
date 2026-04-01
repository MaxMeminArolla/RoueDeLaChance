# 🔧 Build Front-End Manuellement

## ⚠️ Problème

Le build npm dans le `.csproj` échoue si Node.js n'est pas installé ou npm n'est pas dans le PATH.

## ✅ Solution

Les fichiers compilés **existent déjà** dans `wwwroot/`:
```
RoueDeLaChance.Web/wwwroot/
├── index.html          ✅ Template
├── css/styles.css      ✅ Styles compilés
└── js/app.js           ✅ TypeScript compilé
```

L'application **fonctionne comme-est** !

---

## 📝 Si vous modifiez le front

### Installer Node.js

Télécharger depuis https://nodejs.org (v18+ requis)

Vérifier:
```powershell
node --version
npm --version
```

### Compiler le front

```powershell
cd RoueDeLaChance.Front
npm install
npm run build
npm run copy-static
```

### Ou en mode watch (recompile auto)

```powershell
cd RoueDeLaChance.Front
npm run dev
```

Laissez ce terminal ouvert pendant le développement.

---

## 🎯 État actuel

✅ Application démarre sans erreur
✅ wwwroot/ généré et complet
✅ Roue affichée
✅ API fonctionne

**Pas besoin de compiler npm pour lancer l'app** !

---

## 📚 Fichiers concernés

| Fichier | Éditable? | Nécessite rebuild? |
|---------|-----------|-------------------|
| `src/app.ts` | ✅ Oui | ✅ Oui |
| `css/styles.css` | ✅ Oui | ✅ Oui |
| `appsettings.json` | ✅ Oui | ❌ Non |
| `wwwroot/js/app.js` | ❌ Généré | N/A |

---

## 🚀 Workflow

1. **Lancer app** → `F5` (fonctionne)
2. **Modifier TypeScript** → `npm run dev` (autre terminal)
3. **F5 browser** → Changements visibles

---

**Status:** ✅ Prêt à utiliser
