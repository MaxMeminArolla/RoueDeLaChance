# RoueDeLaChance.Front

Front-end TypeScript/HTML/CSS pour la roue de la chance.

## Installation

```bash
npm install
```

## Build

Compile TypeScript vers `../RoueDeLaChance.Web/wwwroot/js/`:

```bash
npm run build
```

## Mode watch

Recompile automatiquement les modifications TypeScript:

```bash
npm run dev
```

## Fichiers statiques

Copier les fichiers HTML et CSS vers `wwwroot`:

```bash
npm run copy-static
```

## Structure

- `src/app.ts` - Logique TypeScript (roue, animation, API)
- `index.html` - Template HTML
- `css/styles.css` - Styles de la roue
- `tsconfig.json` - Configuration TypeScript
