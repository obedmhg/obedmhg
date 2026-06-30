# Resume site & builder — development

This repo is a static **Next.js** app deployed to Netlify:

- **`/`** — Obed Murillo's resume (Terminal theme), the page you see at the deployed URL.
- **`/builder`** — a resume builder: fill in a form, pick a theme, live-preview, and
  download a self-contained `.html` resume (or print to PDF).

> The GitHub profile content lives in `README.md` and is unrelated to the app.

## Scripts

```bash
npm install      # install dependencies
npm run dev      # local dev server (http://localhost:3000)
npm run build    # static export -> ./out
npm test         # run the Vitest suite
```

## Deploy (Netlify)

`netlify.toml` is configured:

- **Build command:** `npm run build`
- **Publish directory:** `out`

The app is a fully static export (`output: 'export'` in `next.config.mjs`) — no
serverless functions are used.

## Architecture

One pure function is the single source of truth for the resume markup:

- `lib/renderResume.ts` — `renderResume(data, theme)` returns the resume as an HTML string.
- `components/Resume.tsx` — React wrapper that injects that string plus the active
  theme's CSS. Used by the home page and the builder's live preview.
- `lib/buildHtmlDocument.ts` — wraps the same `renderResume()` output into a complete,
  standalone HTML document for download (theme CSS inlined, photo embedded as a data URI).

Because preview and download come from the same function, **what you see is what you download**.

### Data & themes

- `lib/types.ts` — `ResumeData` shape and the four `Theme` values.
- `lib/defaultResume.ts` — Obed's data (home page + builder starting example).
- `themes/*.ts` — one `ThemeDef` per theme (`terminal`, `clean`, `editorial`, `blueprint`),
  each a raw CSS string scoped under `.rb-root[data-theme="…"]` plus a chrome/label config.
  Terminal-only flourishes (window chrome, version tags, ACTIVE/SHIPPED badges) are gated
  by chrome flags so the other themes share the same markup with different styling.

### Builder

- `app/builder/page.tsx` — two-pane shell; autosaves to `localStorage` (key `rb:v1`).
- `components/builder/*` — form, photo upload (downscales to 512px, base64), theme picker,
  download/print controls.

Design notes and the implementation plan live in `docs/superpowers/`.
