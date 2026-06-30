# Resume Builder — Next.js Conversion (Design)

**Date:** 2026-06-30
**Status:** Approved (design)

## Goal

Convert the existing single-file `index.html` resume into a Next.js + React app
deployable on Netlify. Two purposes from one codebase:

1. **Home page (`/`)** — Obed Murillo's resume, rendered exactly as it is today
   (Terminal theme), driven by a hardcoded default dataset.
2. **Builder (`/builder`)** — a form that captures the same data shape, renders
   the identical resume live, lets the visitor pick a theme, and downloads a
   self-contained HTML file (and print/PDF).

The home page footer gains a call to action: `$ like this? → create your own here`
linking to `/builder`.

## Non-goals

- No backend, accounts, or persistence beyond the visitor's own browser.
- No JSON export/import (localStorage covers same-browser re-edit).
- No theme editor / custom color picker (fixed set of themes only).

## Stack & deployment

- **Next.js (App Router) + TypeScript.**
- **Static export** (`output: 'export'`). The whole app is client-side, so it
  builds to static files and deploys on Netlify with zero serverless functions —
  same hosting profile as the current static site.
- No server-side data. All state lives client-side.

## Routes

| Route      | Purpose                                                                 |
|------------|-------------------------------------------------------------------------|
| `/`        | Obed's resume. Terminal theme, hardcoded default dataset. CTA footer.   |
| `/builder` | Two-pane builder: form (left) + live preview (right). Theme picker + Download HTML + Print buttons. |

## Core architecture — single render source

The downloaded HTML file is the actual product, so on-screen preview and the
downloaded file must be identical. We guarantee this by generating both from one
pure function (Approach B).

```
renderResume(data: ResumeData, theme: Theme): string   // framework-agnostic, returns resume HTML markup
```

- A thin React wrapper `<Resume data theme />` injects `renderResume()` output
  (via `dangerouslySetInnerHTML`) for the home page and the builder's live preview,
  and also injects the active theme's CSS `<style>`.
- The Download path calls the **same** `renderResume()` and wraps the result in a
  full HTML document. Preview and download are byte-identical by construction.

### Theme model

```
type Theme = 'terminal' | 'clean' | 'editorial' | 'blueprint';
```

- Each theme exports its CSS as a **raw string** (TS module, template literal).
  This single source is both injected into the live app and inlined into the
  download — no build-time CSS extraction needed in a static export.
- Each theme also exports a small **chrome/label config**: section headings
  (terminal: `# cat profile.md`; clean: `Summary`; etc.), and which decorative
  flourishes apply. Terminal-only flourishes — the `term-bar` window chrome, the
  shell prompt hero, `vYYYY.MM` version tags, `● ACTIVE` / `✓ SHIPPED` badges,
  `slug@company` repo lines — are gated to `theme === 'terminal'`.
- All themes share the same semantic section structure; they differ in CSS and
  these label/chrome configs.

### Themes to build

1. **Terminal** — existing dark console/IDE aesthetic. Default; the only theme on
   the home page. Carries the terminal-specific chrome above.
2. **Clean / Print-pro** — light, whitespace-heavy, classic professional resume.
   Print/PDF optimized.
3. **Editorial / Bold** — magazine layout: oversized headline, one strong accent
   color, asymmetric.
4. **Blueprint / Mono** — high-contrast monospace, hairline borders, grid lines,
   schematic vibe on a light background.

## Data model

Generalizes the current `resumeData`. TypeScript types:

```ts
type Theme = 'terminal' | 'clean' | 'editorial' | 'blueprint';

interface ResumeData {
  header: {
    name: string;
    title: string;
    org?: string;          // e.g. "KogniVera"
    experience: string;    // e.g. "17+ years in eCommerce & Digital Solutions"
    photo?: string;        // base64 data URI (see Photo handling)
  };
  about: { summary: string[] };
  skills: string[];
  experience: ExperienceItem[];
  highlight?: {            // generic, replaces the personal "podcast" section; optional
    title: string;
    meta?: string;         // e.g. "Aug 2021 – Present · live"
    description: string;
    url?: string;
  };
  certifications: Certification[];   // optional; section hidden when empty
  contact: {
    location?: string;
    email?: string;
    phone?: string;
    links?: { label: string; url: string }[];
  };
}

interface ExperienceItem {
  title: string;
  company: string;
  dates: string;           // e.g. "Apr 2025 - Present"
  location?: string;
  duration?: string;       // e.g. "1 mo"
  description: string[];
  skills: string[];
}

interface Certification {
  name: string;
  institution: string;
  date?: string;
}
```

- Optional sections (`highlight`, `certifications`, and any empty field) are
  omitted from render when empty.
- Obed's current `resumeData` is migrated into a `defaultResume` constant
  (with `podcast` mapped into `highlight`) used by the home page and as the
  builder's starting example.

## Photo handling

- Builder accepts an image upload.
- Image is **downscaled and compressed client-side** (canvas → JPEG/WebP data
  URI) before being stored in `data.header.photo`. The current 6.6MB PNG is far
  too large to inline; target a small bounded size (e.g. max ~512px, quality-
  compressed) so the downloaded file stays reasonable.
- Stored as a base64 data URI so the downloaded HTML is fully self-contained.

## Persistence

- Builder data and selected theme autosave to `localStorage` (debounced), so a
  refresh doesn't lose work. A "reset to example" action restores `defaultResume`.

## Download (self-contained HTML)

`renderResume(data, theme)` output is wrapped into a complete HTML document:

- `<!doctype html>` + `<head>` with meta, `<title>`, and the theme's CSS inlined
  in a `<style>` block.
- Google Fonts via `<link>` (Space Grotesk / JetBrains Mono per theme) with
  system mono/sans fallbacks declared in CSS — so the file renders fine offline,
  just without the web fonts. (Embedding font binaries would bloat the file;
  this is the accepted tradeoff.)
- Photo embedded as a data URI; data baked into the markup.
- Assembled into a `Blob`, downloaded as `<name>-resume.html`.

## Print / PDF

- Each theme ships `@media print` rules.
- A **Print** button calls `window.print()`.
- Clean theme is print-optimized. Dark themes (Terminal, etc.) get a light print
  override so printing/PDF doesn't dump ink or render poorly.

## Component / file layout (proposed)

```
app/
  layout.tsx
  page.tsx                 # home: <Resume data={defaultResume} theme="terminal" /> + CTA footer
  builder/page.tsx         # builder shell: form + preview + controls
components/
  Resume.tsx               # React wrapper: injects renderResume() + theme <style>
  builder/
    BuilderForm.tsx        # all section editors
    PhotoUpload.tsx        # upload + downscale/compress
    ThemePicker.tsx
    DownloadControls.tsx   # Download HTML + Print
lib/
  types.ts                 # ResumeData, Theme, etc.
  defaultResume.ts         # Obed's data migrated from index.html
  renderResume.ts          # pure data+theme -> HTML string
  buildHtmlDocument.ts     # wraps renderResume() into a full downloadable doc
  storage.ts               # localStorage load/save (debounced)
themes/
  terminal.ts              # { css: string, chrome: {...} }
  clean.ts
  editorial.ts
  blueprint.ts
  index.ts                 # theme registry
next.config.js             # output: 'export'
netlify.toml               # build + publish config
```

## Error handling & edge cases

- **Empty/partial data:** every optional field/section is render-guarded; the
  resume renders sensibly with missing pieces.
- **Bad image upload:** non-image or oversized file → user-facing validation
  message; data unchanged.
- **localStorage unavailable / corrupt:** fall back to `defaultResume`; never
  crash on parse errors.
- **HTML safety:** user-entered text is escaped when building the HTML string to
  avoid breaking markup / injection in the downloaded file.

## Testing

- Unit-test `renderResume()` for each theme: required sections render, optional
  sections omitted when empty, terminal-only chrome appears only for terminal,
  HTML escaping works.
- Unit-test `buildHtmlDocument()`: output is a valid standalone doc with CSS
  inlined and photo data URI embedded.
- Unit-test image downscale util: bounds output dimensions/size.
- Smoke-test builder ↔ preview: editing data updates preview; download output
  equals preview markup.

## Open considerations (deferred, not blocking)

- Exact visual design of the three new themes is an implementation detail.
- Whether to keep the legacy `index.html` in-repo during migration (likely yes,
  until parity is verified, then remove).
