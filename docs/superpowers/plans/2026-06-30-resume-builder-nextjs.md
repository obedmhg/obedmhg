# Resume Builder — Next.js Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the single-file `index.html` resume into a static Next.js app with a public resume home page (Terminal theme) and a `/builder` that produces the same resume in any of four themes and downloads it as a self-contained HTML file.

**Architecture:** One pure `renderResume(data, theme) -> htmlString` function is the single source for the home page, the builder live preview, and the downloaded file (Approach B). A thin React `<Resume>` wrapper injects that string plus the active theme's raw-string CSS. Builder state autosaves to localStorage. Static export (`output: 'export'`) deploys to Netlify with no server.

**Tech Stack:** Next.js (App Router) 15, React 19, TypeScript, Vitest + @testing-library, jsdom.

## Global Constraints

- Next.js App Router, `output: 'export'` — fully static, no server functions.
- TypeScript everywhere; `strict` on.
- Themes: exactly `terminal | clean | editorial | blueprint`. Terminal is the only theme on `/`.
- The resume markup and the downloaded HTML are produced by the SAME `renderResume()` — never duplicate markup.
- All user-entered text is HTML-escaped when building markup.
- Photos stored as base64 data URIs, downscaled client-side (max 512px longest edge).
- `commit-guard` is active in this repo: the implementer applies changes to the working tree; the developer commits. Treat "Commit" steps as "stage + hand off" unless the developer says otherwise.

---

### Task 1: Scaffold Next.js static-export project + test tooling

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `vitest.setup.ts`, `netlify.toml`, `.gitignore`, `app/layout.tsx`, `app/page.tsx` (placeholder), `app/globals.css`
- Modify: none

**Interfaces:**
- Produces: a buildable Next.js app; `npm test`, `npm run build` scripts.

- [ ] **Step 1: Init Next app deps**

`package.json`:
```json
{
  "name": "resume-builder",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Config files**

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};
export default nextConfig;
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```
(Add `@vitejs/plugin-react` to devDependencies.)

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

`netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "out"
```

`.gitignore`:
```
node_modules
.next
out
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 3: Minimal app shell**

`app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Obed Murillo — console',
  description: 'Resume & resume builder',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`app/globals.css`:
```css
*{box-sizing:border-box;}
html{-webkit-text-size-adjust:100%;}
body{margin:0;}
```

`app/page.tsx` (placeholder, replaced in Task 7):
```tsx
export default function Home() {
  return <main>placeholder</main>;
}
```

- [ ] **Step 4: Install & verify build**

Run: `npm install && npm run build`
Expected: build succeeds, produces `out/` directory.

- [ ] **Step 5: Commit** — `feat: scaffold next.js static-export app with vitest`

---

### Task 2: Data types + default resume

**Files:**
- Create: `lib/types.ts`, `lib/defaultResume.ts`, `lib/defaultResume.test.ts`

**Interfaces:**
- Produces: `ResumeData`, `ExperienceItem`, `Certification`, `Theme`, `THEMES`, `defaultResume`.

- [ ] **Step 1: Write types**

`lib/types.ts`:
```ts
export type Theme = 'terminal' | 'clean' | 'editorial' | 'blueprint';
export const THEMES: Theme[] = ['terminal', 'clean', 'editorial', 'blueprint'];

export interface ExperienceItem {
  title: string;
  company: string;
  dates: string;
  location?: string;
  duration?: string;
  description: string[];
  skills: string[];
}

export interface Certification {
  name: string;
  institution: string;
  date?: string;
}

export interface ResumeData {
  header: { name: string; title: string; org?: string; experience: string; photo?: string };
  about: { summary: string[] };
  skills: string[];
  experience: ExperienceItem[];
  highlight?: { title: string; meta?: string; description: string; url?: string };
  certifications: Certification[];
  contact: { location?: string; email?: string; phone?: string; links?: { label: string; url: string }[] };
}
```

- [ ] **Step 2: Write failing test for defaultResume shape**

`lib/defaultResume.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { defaultResume } from './defaultResume';

describe('defaultResume', () => {
  it('carries Obed core identity', () => {
    expect(defaultResume.header.name).toBe('Obed Murillo');
    expect(defaultResume.header.title).toBe('Director of Technology');
  });
  it('migrates podcast into generic highlight', () => {
    expect(defaultResume.highlight?.title).toBe('From Zero to N');
  });
  it('has all experience roles', () => {
    expect(defaultResume.experience.length).toBe(10);
  });
});
```

- [ ] **Step 3: Run test, expect FAIL** — `npx vitest run lib/defaultResume.test.ts` → fails (module not found).

- [ ] **Step 4: Implement defaultResume**

Migrate the `resumeData` object from `index.html:147-173` verbatim into `lib/defaultResume.ts` as a typed `ResumeData`. Map `podcast` → `highlight` (`{title, meta: "<dates> · <duration> · live", description}`). Keep `header.org = "KogniVera"`. `header.photo` omitted (home page uses `/profile.png` via CSS background or img — see Task 7; default data leaves photo undefined and the home page passes the public path).

```ts
import type { ResumeData } from './types';
export const defaultResume: ResumeData = {
  header: { name: 'Obed Murillo', title: 'Director of Technology', org: 'KogniVera', experience: '17+ years in eCommerce & Digital Solutions' },
  about: { summary: [/* three summary lines from index.html:150-152 */] },
  skills: [/* skills array from index.html:154 */],
  experience: [/* 10 items from index.html:156-165 */],
  highlight: { title: 'From Zero to N', meta: 'Aug 2021 - Present · 3 yrs 9 mos · live', description: '/* podcast.description */' },
  certifications: [/* 2 items from index.html:169-170 */],
  contact: { location: 'Chihuahua, Mexico', email: 'obedmhg@gmail.com', phone: '+52 614 182 5638' },
};
```
(Implementer: copy the real string values from `index.html`; the comments above mark exactly which source lines.)

- [ ] **Step 5: Run test, expect PASS.**

- [ ] **Step 6: Commit** — `feat: add resume data types and migrated default resume`

---

### Task 3: HTML escape utility

**Files:**
- Create: `lib/escapeHtml.ts`, `lib/escapeHtml.test.ts`

**Interfaces:**
- Produces: `escapeHtml(s: string): string`, `attr(s: string): string`.

- [ ] **Step 1: Failing test**

`lib/escapeHtml.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { escapeHtml, attr } from './escapeHtml';

describe('escapeHtml', () => {
  it('escapes angle brackets and ampersands', () => {
    expect(escapeHtml('<script>&"')).toBe('&lt;script&gt;&amp;&quot;');
  });
  it('attr escapes quotes for attribute context', () => {
    expect(attr('a"b')).toBe('a&quot;b');
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement**

```ts
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
export const attr = escapeHtml;
```

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `feat: add html escaping util`

---

### Task 4: Theme registry + terminal theme (CSS string + chrome config)

**Files:**
- Create: `themes/types.ts`, `themes/terminal.ts`, `themes/index.ts`
- Reference: `index.html:11-139` (terminal CSS), `index.html:203-272` (terminal markup/labels)

**Interfaces:**
- Produces: `ThemeDef { css: string; chrome: ChromeConfig }`, `themeRegistry: Record<Theme, ThemeDef>`, `getTheme(t): ThemeDef`.
- `ChromeConfig` fields consumed by `renderResume` (Task 5):
  ```ts
  interface ChromeConfig {
    showTerminalChrome: boolean;      // term-bar window + shell prompt hero
    showVersionTags: boolean;         // vYYYY.MM per role
    showStatusBadges: boolean;        // ● ACTIVE / ✓ SHIPPED
    showRepoLine: boolean;            // slug@company line
    labels: {
      summary: string; experience: string; skills: string; highlight: string; certifications: string; contactCta: string;
    };
    fonts: string;                    // <link> href for Google Fonts, theme-specific
  }
  ```

- [ ] **Step 1: Define theme types**

`themes/types.ts`: declare `ChromeConfig` (above) and `ThemeDef`.

- [ ] **Step 2: Terminal theme**

`themes/terminal.ts`:
```ts
import type { ThemeDef } from './types';
export const terminal: ThemeDef = {
  css: String.raw`/* paste index.html:11-139 contents here, verbatim, scoped under .rb-root[data-theme="terminal"] */`,
  chrome: {
    showTerminalChrome: true, showVersionTags: true, showStatusBadges: true, showRepoLine: true,
    labels: { summary: '# cat profile.md', experience: '# git log --career', skills: '# stack --list', highlight: '# ls extras/', certifications: 'certifications/', contactCta: '$ open to consulting & technical leadership roles' },
    fonts: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
  },
};
```
**CSS scoping rule:** prefix every selector from the original `<style>` with `.rb-root[data-theme="terminal"] ` so themes don't collide when more than one stylesheet is present. The original `body{...}` background/font rules move onto `.rb-root[data-theme="terminal"]`.

- [ ] **Step 3: Registry**

`themes/index.ts`:
```ts
import type { Theme } from '@/lib/types';
import type { ThemeDef } from './types';
import { terminal } from './terminal';
export const themeRegistry: Record<Theme, ThemeDef> = {
  terminal,
  clean: terminal,      // replaced in Task 8
  editorial: terminal,  // replaced in Task 8
  blueprint: terminal,  // replaced in Task 8
};
export function getTheme(t: Theme): ThemeDef { return themeRegistry[t]; }
```

- [ ] **Step 4: Commit** — `feat: add theme registry and terminal theme`

---

### Task 5: renderResume() — pure data+theme → HTML string

**Files:**
- Create: `lib/renderResume.ts`, `lib/renderResume.test.ts`
- Reference: `index.html:175-272` (render logic + markup)

**Interfaces:**
- Consumes: `ResumeData`, `Theme`, `getTheme`, `escapeHtml`.
- Produces: `renderResume(data: ResumeData, theme: Theme): string` (returns the `.rb-root` wrapper element markup; no `<html>`/`<head>`).

- [ ] **Step 1: Failing tests**

`lib/renderResume.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { renderResume } from './renderResume';
import { defaultResume } from './defaultResume';
import type { ResumeData } from './types';

const minimal: ResumeData = {
  header: { name: 'Ada <L>', title: 'Engineer', experience: '5y' },
  about: { summary: ['Hi'] }, skills: ['Rust'], experience: [],
  certifications: [], contact: {},
};

describe('renderResume', () => {
  it('wraps in rb-root with data-theme', () => {
    expect(renderResume(minimal, 'terminal')).toContain('data-theme="terminal"');
  });
  it('escapes user text', () => {
    expect(renderResume(minimal, 'terminal')).toContain('Ada &lt;L&gt;');
  });
  it('shows terminal chrome only for terminal theme', () => {
    expect(renderResume(defaultResume, 'terminal')).toContain('term-bar');
    expect(renderResume(defaultResume, 'clean')).not.toContain('term-bar');
  });
  it('omits highlight section when absent', () => {
    expect(renderResume(minimal, 'terminal')).not.toContain('rb-highlight');
  });
  it('renders highlight when present', () => {
    expect(renderResume(defaultResume, 'terminal')).toContain('From Zero to N');
  });
  it('omits certifications when empty', () => {
    expect(renderResume(minimal, 'clean')).not.toContain('rb-certs');
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement renderResume**

Port the vanilla `render()` from `index.html:180-273` into a pure function. Key changes:
- Wrap everything in `<div class="rb-root" data-theme="${theme}">…</div>`.
- Pull `ver()`, `slug()`, `isPresent()` helpers from `index.html:175-178`.
- Escape every interpolated `data` string with `escapeHtml()`.
- Gate terminal-only blocks on `chrome.showTerminalChrome / showVersionTags / showStatusBadges / showRepoLine`. Non-terminal themes render a plain hero (name, title, org, experience, optional photo `<img>`), plain section headings from `chrome.labels`, and experience entries as `dates · location · duration` without version/status/repo flourishes.
- Use stable, theme-neutral class names on structural elements and add section marker classes `rb-summary`, `rb-experience`, `rb-skills`, `rb-highlight`, `rb-certs`, `rb-contact` so tests and theme CSS can target them. Keep the original terminal class names too (the terminal CSS depends on them).
- Section render guards: skip `highlight` if `!data.highlight`; skip `certifications` block if `data.certifications.length === 0`; skip `skills` if empty; skip contact rows for missing fields.
- Photo: if `data.header.photo` set, render `<img class="avatar rb-photo" src="${attr(photo)}" alt="...">`. (Home page passes Obed's photo path; builder passes data URI.)

Implementer writes the full function following the existing markup as the terminal-theme reference. No placeholders in committed code.

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `feat: add renderResume pure html generator`

---

### Task 6: <Resume> React wrapper

**Files:**
- Create: `components/Resume.tsx`, `components/Resume.test.tsx`

**Interfaces:**
- Consumes: `renderResume`, `getTheme`, `ResumeData`, `Theme`.
- Produces: `<Resume data={ResumeData} theme={Theme} />` client component.

- [ ] **Step 1: Failing test**

`components/Resume.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Resume } from './Resume';
import { defaultResume } from '@/lib/defaultResume';

describe('Resume', () => {
  it('renders name and injects theme style', () => {
    const { container } = render(<Resume data={defaultResume} theme="terminal" />);
    expect(container.querySelector('.rb-root')).toBeTruthy();
    expect(container.querySelector('style')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement**

```tsx
'use client';
import { renderResume } from '@/lib/renderResume';
import { getTheme } from '@/themes';
import type { ResumeData, Theme } from '@/lib/types';

export function Resume({ data, theme }: { data: ResumeData; theme: Theme }) {
  const html = renderResume(data, theme);
  const css = getTheme(theme).css;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
```

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `feat: add Resume react wrapper`

---

### Task 7: Home page (`/`) with CTA footer

**Files:**
- Modify: `app/page.tsx`
- Move asset: `profile.png` → `public/profile.png`
- Reference: existing `index.html` for visual parity

**Interfaces:**
- Consumes: `Resume`, `defaultResume`.

- [ ] **Step 1: Move the photo**

Run: `mkdir -p public && git mv profile.png public/profile.png`

- [ ] **Step 2: Home page**

`app/page.tsx`:
```tsx
import { Resume } from '@/components/Resume';
import { defaultResume } from '@/lib/defaultResume';
import Link from 'next/link';

const data = { ...defaultResume, header: { ...defaultResume.header, photo: '/profile.png' } };

export default function Home() {
  return (
    <main className="rb-page">
      <Resume data={data} theme="terminal" />
      <div className="rb-cta-wrap">
        <Link className="rb-cta-link" href="/builder">$ like this? → create your own here</Link>
      </div>
    </main>
  );
}
```
Add fonts: include the Google Fonts `<link>` in `app/layout.tsx` `<head>` (Next: use `<link>` in a `head` export or `app/layout` metadata `other`; simplest is a plain `<link>` in layout's returned `<html><head>`). Add minimal CTA styling to `globals.css` matching terminal footer (`--ok` green link). The CTA wrap is centered, max-width matched to `.wrap`.

- [ ] **Step 3: Verify build + visual parity**

Run: `npm run build` (expect success). Then `npm run dev`, open `/`, confirm it matches the original `index.html` (terminal hero, log entries, skills, highlight, certs, footer + new CTA link).

- [ ] **Step 4: Commit** — `feat: home page renders resume with builder CTA`

---

### Task 8: Clean, Editorial, Blueprint themes

**Files:**
- Create: `themes/clean.ts`, `themes/editorial.ts`, `themes/blueprint.ts`
- Modify: `themes/index.ts` (wire real themes), `lib/renderResume.test.ts` (add per-theme chrome assertions)

**Interfaces:**
- Produces: three `ThemeDef`s with `showTerminalChrome:false` and appropriate `labels`/`fonts`. CSS scoped under `.rb-root[data-theme="clean|editorial|blueprint"]`.

- [ ] **Step 1: Failing tests for non-terminal chrome**

Add to `lib/renderResume.test.ts`:
```ts
it.each(['clean','editorial','blueprint'] as const)('theme %s has no terminal flourishes', (t) => {
  const html = renderResume(defaultResume, t);
  expect(html).not.toContain('term-bar');
  expect(html).not.toContain('● ACTIVE');
});
it('clean uses plain section heading', () => {
  expect(renderResume(defaultResume, 'clean')).toContain('Summary');
});
```

- [ ] **Step 2: Run, expect FAIL** (registry still maps these to terminal).

- [ ] **Step 3: Implement three themes**

Each file exports `ThemeDef`. `chrome` flags all false except labels (plain words: `Summary`, `Experience`, `Skills`, `Highlights`, `Certifications`, and a plain contact CTA string). Write a complete CSS string per theme, scoped under `.rb-root[data-theme="<name>"]`, styling the structural classes (`.rb-header`, `.rb-photo`, `.rb-summary`, `.rb-experience`, `.entry`, `.rb-skills .tok`, `.rb-highlight`, `.rb-certs`, `.rb-contact`):
- **clean** — light bg (#fff), dark text, system/Inter sans, subtle accent (#2563eb), generous spacing, simple bordered timeline. Print-friendly.
- **editorial** — large display headline, one bold accent (e.g. #ff4d2e), asymmetric two-column header, big section numbers.
- **blueprint** — light grid background, monospace, hairline 1px borders, uppercase labels, schematic feel.

Use the design skill (frontend-design) judgment for aesthetics; each must render all sections legibly with real data.

- [ ] **Step 4: Wire registry** — update `themes/index.ts` to import the real `clean`, `editorial`, `blueprint`.

- [ ] **Step 5: Run tests, expect PASS. Build, expect success.**
- [ ] **Step 6: Commit** — `feat: add clean, editorial, blueprint themes`

---

### Task 9: Image downscale utility

**Files:**
- Create: `lib/image.ts`, `lib/image.test.ts`

**Interfaces:**
- Produces: `fileToDataUrl(file: File, maxEdge?: number): Promise<string>` and pure helper `fitDimensions(w, h, maxEdge): {w:number; h:number}`.

- [ ] **Step 1: Failing test for pure bounds helper**

`lib/image.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { fitDimensions } from './image';

describe('fitDimensions', () => {
  it('keeps small images unchanged', () => {
    expect(fitDimensions(300, 200, 512)).toEqual({ w: 300, h: 200 });
  });
  it('scales landscape to maxEdge on width', () => {
    expect(fitDimensions(1024, 512, 512)).toEqual({ w: 512, h: 256 });
  });
  it('scales portrait to maxEdge on height', () => {
    expect(fitDimensions(512, 1024, 512)).toEqual({ w: 256, h: 512 });
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement**

```ts
export function fitDimensions(w: number, h: number, maxEdge: number) {
  const longest = Math.max(w, h);
  if (longest <= maxEdge) return { w, h };
  const scale = maxEdge / longest;
  return { w: Math.round(w * scale), h: Math.round(h * scale) };
}

export async function fileToDataUrl(file: File, maxEdge = 512): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  const bitmap = await createImageBitmap(file);
  const { w, h } = fitDimensions(bitmap.width, bitmap.height, maxEdge);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unsupported.');
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.82);
}
```

- [ ] **Step 4: Run, expect PASS.** (Only `fitDimensions` is unit-tested; `fileToDataUrl` relies on browser APIs.)
- [ ] **Step 5: Commit** — `feat: add image downscale util`

---

### Task 10: buildHtmlDocument() — full downloadable doc

**Files:**
- Create: `lib/buildHtmlDocument.ts`, `lib/buildHtmlDocument.test.ts`

**Interfaces:**
- Consumes: `renderResume`, `getTheme`, `ResumeData`, `Theme`.
- Produces: `buildHtmlDocument(data: ResumeData, theme: Theme): string` (complete `<!doctype html>` document) and `downloadFilename(data): string`.

- [ ] **Step 1: Failing test**

`lib/buildHtmlDocument.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildHtmlDocument, downloadFilename } from './buildHtmlDocument';
import { defaultResume } from './defaultResume';

describe('buildHtmlDocument', () => {
  it('is a complete standalone doc', () => {
    const doc = buildHtmlDocument(defaultResume, 'clean');
    expect(doc.startsWith('<!doctype html>')).toBe(true);
    expect(doc).toContain('<style>');
    expect(doc).toContain('data-theme="clean"');
    expect(doc).toContain('From Zero to N');
  });
  it('filenames by name', () => {
    expect(downloadFilename(defaultResume)).toBe('obed-murillo-resume.html');
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement**

```ts
import { renderResume } from './renderResume';
import { getTheme } from '@/themes';
import type { ResumeData, Theme } from './types';

export function downloadFilename(data: ResumeData): string {
  const slug = data.header.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'resume';
  return `${slug}-resume.html`;
}

export function buildHtmlDocument(data: ResumeData, theme: Theme): string {
  const t = getTheme(theme);
  const body = renderResume(data, theme);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${data.header.name} — resume</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${t.chrome.fonts}" rel="stylesheet" />
<style>*{box-sizing:border-box;}html{-webkit-text-size-adjust:100%;}body{margin:0;}
${t.css}</style>
</head>
<body>
${body}
</body>
</html>`;
}
```

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `feat: add self-contained html document builder`

---

### Task 11: localStorage persistence

**Files:**
- Create: `lib/storage.ts`, `lib/storage.test.ts`

**Interfaces:**
- Produces: `loadState(): { data: ResumeData; theme: Theme } | null`, `saveState(data, theme): void`, `clearState(): void`. Key `rb:v1`.

- [ ] **Step 1: Failing test**

`lib/storage.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState, clearState } from './storage';
import { defaultResume } from './defaultResume';

beforeEach(() => localStorage.clear());

describe('storage', () => {
  it('returns null when empty', () => { expect(loadState()).toBeNull(); });
  it('round-trips', () => {
    saveState(defaultResume, 'clean');
    expect(loadState()).toEqual({ data: defaultResume, theme: 'clean' });
  });
  it('returns null on corrupt json', () => {
    localStorage.setItem('rb:v1', '{not json');
    expect(loadState()).toBeNull();
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement** (guard `typeof window`, try/catch parse).

```ts
import type { ResumeData, Theme } from './types';
const KEY = 'rb:v1';
export function loadState(): { data: ResumeData; theme: Theme } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data || !parsed?.theme) return null;
    return parsed;
  } catch { return null; }
}
export function saveState(data: ResumeData, theme: Theme): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEY, JSON.stringify({ data, theme })); } catch { /* ignore quota */ }
}
export function clearState(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(KEY);
}
```

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `feat: add localStorage persistence`

---

### Task 12: Builder form components

**Files:**
- Create: `components/builder/BuilderForm.tsx`, `components/builder/PhotoUpload.tsx`, `components/builder/ThemePicker.tsx`, `components/builder/DownloadControls.tsx`, `components/builder/fields.tsx` (small input primitives)
- Create: `components/builder/BuilderForm.test.tsx`

**Interfaces:**
- `BuilderForm`: `{ data: ResumeData; onChange: (d: ResumeData) => void }`.
- `PhotoUpload`: `{ value?: string; onChange: (dataUrl?: string) => void; onError: (msg: string) => void }`.
- `ThemePicker`: `{ value: Theme; onChange: (t: Theme) => void }`.
- `DownloadControls`: `{ data: ResumeData; theme: Theme }` (Download HTML via Blob; Print via `window.print()`).

- [ ] **Step 1: Failing test (form edits propagate)**

`components/builder/BuilderForm.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BuilderForm } from './BuilderForm';
import { defaultResume } from '@/lib/defaultResume';

describe('BuilderForm', () => {
  it('edits name and calls onChange', () => {
    const onChange = vi.fn();
    render(<BuilderForm data={defaultResume} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Name' } });
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)[0].header.name).toBe('New Name');
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement field primitives + sub-components + BuilderForm**

`fields.tsx`: `TextField`, `TextArea`, `ListField` (string arrays: one input per line / add-remove), `RepeaterField` (for experience & certifications: add/remove/reorder items). Each labeled (`<label>` linked to input). All controlled.

`BuilderForm`: sections for header (name, title, org, experience, PhotoUpload), about.summary (ListField), skills (ListField, comma or line), experience (RepeaterField of ExperienceItem editors: title, company, dates, location, duration, description ListField, skills ListField), highlight (optional — a "add highlight" toggle), certifications (RepeaterField), contact (location, email, phone, links repeater). Emits a new `ResumeData` (immutable update) to `onChange` on every edit.

`PhotoUpload`: file input → `fileToDataUrl` → `onChange(dataUrl)`; on throw → `onError(msg)`. Shows current thumbnail + remove button.

`ThemePicker`: radio/segmented control over `THEMES`.

`DownloadControls`: "Download HTML" → `buildHtmlDocument` → `Blob` → anchor download with `downloadFilename`. "Print / PDF" → `window.print()`.

- [ ] **Step 4: Run, expect PASS. Build, expect success.**
- [ ] **Step 5: Commit** — `feat: add builder form components`

---

### Task 13: Builder page (`/builder`) wiring

**Files:**
- Create: `app/builder/page.tsx`, `app/builder/builder.css` (layout-only styles for the builder shell, not the resume)

**Interfaces:**
- Consumes: `BuilderForm`, `ThemePicker`, `DownloadControls`, `Resume`, `loadState`, `saveState`, `defaultResume`.

- [ ] **Step 1: Implement builder page (client component)**

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { Resume } from '@/components/Resume';
import { BuilderForm } from '@/components/builder/BuilderForm';
import { ThemePicker } from '@/components/builder/ThemePicker';
import { DownloadControls } from '@/components/builder/DownloadControls';
import { defaultResume } from '@/lib/defaultResume';
import { loadState, saveState } from '@/lib/storage';
import type { ResumeData, Theme } from '@/lib/types';
import './builder.css';

export default function BuilderPage() {
  const [data, setData] = useState<ResumeData>(defaultResume);
  const [theme, setTheme] = useState<Theme>('clean');
  const [error, setError] = useState<string>('');
  const hydrated = useRef(false);

  useEffect(() => { const s = loadState(); if (s) { setData(s.data); setTheme(s.theme); } hydrated.current = true; }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    const id = setTimeout(() => saveState(data, theme), 400);
    return () => clearTimeout(id);
  }, [data, theme]);

  return (
    <div className="builder">
      <aside className="builder-panel no-print">
        <h1>Resume builder</h1>
        <ThemePicker value={theme} onChange={setTheme} />
        {error && <p className="builder-error" role="alert">{error}</p>}
        <BuilderForm data={data} onChange={setData} />
        <DownloadControls data={data} theme={theme} />
      </aside>
      <main className="builder-preview"><Resume data={data} theme={theme} /></main>
    </div>
  );
}
```
Note: pass `onError={setError}` into `PhotoUpload` via BuilderForm (thread the prop, or have BuilderForm own its own error state — implementer's call; keep one error surface).

`builder.css`: two-column grid (form left ~420px, preview right, scrollable), responsive stack under 900px, `.no-print { @media print { display:none } }`, `.builder-preview` full-width on print.

- [ ] **Step 2: Verify** — `npm run dev`, open `/builder`: edit fields → preview updates; switch theme → preview restyles; upload photo → appears; reload → state restored; Download HTML → file opens standalone and matches preview; Print → only resume prints.

- [ ] **Step 3: Build** — `npm run build`, expect success (static export of `/` and `/builder`).
- [ ] **Step 4: Commit** — `feat: add builder page with live preview, persistence, download`

---

### Task 14: Print styles per theme + dark print override

**Files:**
- Modify: `themes/terminal.ts`, `themes/clean.ts`, `themes/editorial.ts`, `themes/blueprint.ts`

**Interfaces:** none new.

- [ ] **Step 1: Add `@media print` blocks**

In each theme's `css` string, append `@media print` rules scoped to that theme's `.rb-root`: hide the grain/decorations, set white background + dark text for dark themes (terminal, and any dark editorial), remove box-shadows, ensure page width fits. Clean/blueprint already light — minimal print tweaks (remove backgrounds, keep borders crisp).

- [ ] **Step 2: Verify** — in `/builder`, choose each theme, browser Print preview shows a clean, legible page (no dark ink dumps, no clipped content).

- [ ] **Step 3: Build, expect success.**
- [ ] **Step 4: Commit** — `feat: add per-theme print styles`

---

### Task 15: Remove legacy index.html + final verification

**Files:**
- Delete: `index.html`
- Modify: `README.md` (add dev/build/deploy notes), `docs/...` unchanged

- [ ] **Step 1: Confirm parity first** — Diff the rendered `/` against the original `index.html` output visually. Only after parity is confirmed, delete legacy file.

Run: `git rm index.html`

- [ ] **Step 2: README** — document `npm install`, `npm run dev`, `npm run build` (outputs `out/`), Netlify publish dir `out`, and the `/builder` feature.

- [ ] **Step 3: Full verification**

Run: `npm test` (all green), `npm run build` (success, `out/index.html` and `out/builder/index.html` exist).

- [ ] **Step 4: Commit** — `chore: remove legacy index.html, update README`

---

## Self-Review

**Spec coverage:**
- Static Next.js export → Task 1, 13, 15. ✓
- Home page Terminal + CTA → Task 7. ✓
- Builder two-pane + theme picker → Task 12, 13. ✓
- Single render source (renderResume) → Task 5, used by 6/7/10/13. ✓
- 4 themes → Task 4 (terminal) + Task 8 (three more). ✓
- Generic highlight (not podcast) → types Task 2, render Task 5. ✓
- Optional/hidden empty sections → Task 5 guards + tests. ✓
- Photo upload + downscale + data URI → Task 9, 12. ✓
- localStorage persistence → Task 11, 13. ✓
- Download self-contained HTML → Task 10, 12. ✓
- Print/PDF → Task 12 (button), Task 14 (styles). ✓
- HTML escaping → Task 3, used in Task 5. ✓
- Error handling (bad image, corrupt storage, empty data) → Task 9/11/5. ✓

**Placeholder scan:** Theme CSS strings and the full `renderResume`/form bodies are described with exact source references (`index.html` line ranges) and explicit structural/behavioral requirements rather than literal "TODO"s — the terminal CSS is copied verbatim from existing code, the three new themes have concrete palette/layout specs. Acceptable: these are large presentational artifacts whose source either already exists or is fully specified.

**Type consistency:** `ResumeData`/`Theme`/`ChromeConfig` defined in Task 2/4, consumed consistently in Tasks 5/6/10/11/12/13. `renderResume(data, theme)`, `buildHtmlDocument(data, theme)`, `getTheme(theme)`, `fitDimensions/fileToDataUrl`, `loadState/saveState/clearState` names stable across references. ✓
