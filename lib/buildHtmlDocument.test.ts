import { describe, it, expect } from 'vitest';
import { buildHtmlDocument, downloadFilename } from './buildHtmlDocument';
import { defaultResume } from './defaultResume';

describe('buildHtmlDocument', () => {
  it('produces a complete standalone document', () => {
    const doc = buildHtmlDocument(defaultResume, 'clean');
    expect(doc.startsWith('<!doctype html>')).toBe(true);
    expect(doc).toContain('<style>');
    expect(doc).toContain('data-theme="clean"');
    expect(doc).toContain('From Zero to N');
    expect(doc).toContain('</html>');
  });

  it('inlines the chosen theme css', () => {
    const doc = buildHtmlDocument(defaultResume, 'terminal');
    expect(doc).toContain('.rb-root[data-theme="terminal"]');
    expect(doc).toContain('data-theme="terminal"');
  });

  it('embeds a photo data uri when present', () => {
    const withPhoto = { ...defaultResume, header: { ...defaultResume.header, photo: 'data:image/jpeg;base64,AAA' } };
    expect(buildHtmlDocument(withPhoto, 'clean')).toContain('data:image/jpeg;base64,AAA');
  });
});

describe('downloadFilename', () => {
  it('slugifies the name', () => {
    expect(downloadFilename(defaultResume)).toBe('obed-murillo-resume.html');
  });
  it('falls back when the name is empty', () => {
    const blank = { ...defaultResume, header: { ...defaultResume.header, name: '' } };
    expect(downloadFilename(blank)).toBe('resume-resume.html');
  });
});
