# Colin Nies Portfolio

A single-page portfolio built with Vite, React, TypeScript, and Tailwind CSS.

## Stack

- Vite + React 19
- TypeScript
- Tailwind CSS
- Framer Motion for animation
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script                 | What it does                       |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the dev server               |
| `npm run build`        | Type-check and build to `dist/`    |
| `npm run preview`      | Serve the production build locally |
| `npm run format`       | Format the repo with Prettier      |
| `npm run format:check` | Check formatting without writing   |

## Project layout

```
src/
  App.tsx            Page composition
  data/              Site content (projects, companies, links)
  components/        UI and animated sections
  hooks/             Text measurement hooks
  lib/               Shared helpers and motion variants
  index.css          Fonts, theme tokens, global styles
```

## Editing content

Projects, companies, and social links live in `src/data/`. Update those files to change what the page shows without touching component code.
