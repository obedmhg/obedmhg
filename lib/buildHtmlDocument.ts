import { renderResume } from './renderResume';
import { getTheme } from '@/themes';
import type { ResumeData, Theme } from './types';

export function downloadFilename(data: ResumeData): string {
  const slug = data.header.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug || 'resume'}-resume.html`;
}

/**
 * Wraps the rendered resume into a complete, standalone HTML document:
 * theme CSS inlined, photo embedded as a data URI, fonts via <link> with
 * system fallbacks. The file renders anywhere with no external assets except
 * the (optional) web fonts.
 */
export function buildHtmlDocument(data: ResumeData, theme: Theme): string {
  const t = getTheme(theme);
  const body = renderResume(data, theme);
  const title = `${data.header.name} — resume`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeTitle(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${t.chrome.fonts}" rel="stylesheet" />
<style>
*{box-sizing:border-box;}
html{-webkit-text-size-adjust:100%;}
body{margin:0;}
${t.css}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function escapeTitle(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
