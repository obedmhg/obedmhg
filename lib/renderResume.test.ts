import { describe, it, expect } from 'vitest';
import { renderResume } from './renderResume';
import { defaultResume } from './defaultResume';
import type { ResumeData } from './types';

const minimal: ResumeData = {
  header: { name: 'Ada <L>', title: 'Engineer', experience: '5y' },
  about: { summary: ['Hi'] },
  skills: ['Rust'],
  experience: [],
  certifications: [],
  contact: {},
};

describe('renderResume', () => {
  it('wraps in rb-root with the data-theme attribute', () => {
    expect(renderResume(minimal, 'terminal')).toContain('data-theme="terminal"');
    expect(renderResume(minimal, 'clean')).toContain('data-theme="clean"');
  });

  it('escapes user-entered text', () => {
    expect(renderResume(minimal, 'terminal')).toContain('Ada &lt;L&gt;');
    expect(renderResume(minimal, 'terminal')).not.toContain('Ada <L>');
  });

  it('shows terminal chrome only for the terminal theme', () => {
    expect(renderResume(defaultResume, 'terminal')).toContain('term-bar');
    expect(renderResume(defaultResume, 'clean')).not.toContain('term-bar');
  });

  it('omits the highlight section when absent', () => {
    expect(renderResume(minimal, 'terminal')).not.toContain('rb-highlight');
    expect(renderResume(minimal, 'clean')).not.toContain('rb-highlight');
  });

  it('renders the highlight when present', () => {
    expect(renderResume(defaultResume, 'terminal')).toContain('From Zero to N');
    expect(renderResume(defaultResume, 'clean')).toContain('From Zero to N');
  });

  it('omits certifications when empty', () => {
    expect(renderResume(minimal, 'clean')).not.toContain('rb-certs');
  });

  it('renders certifications when present', () => {
    expect(renderResume(defaultResume, 'clean')).toContain('rb-certs');
    expect(renderResume(defaultResume, 'clean')).toContain('Oracle Commerce Specialist');
  });

  it.each(['clean', 'editorial', 'blueprint'] as const)('theme %s drops terminal flourishes', (t) => {
    const html = renderResume(defaultResume, t);
    expect(html).not.toContain('term-bar');
    expect(html).not.toContain('● ACTIVE');
    expect(html).not.toContain('✓ SHIPPED');
  });

  it('uses plain section headings for non-terminal themes', () => {
    const html = renderResume(defaultResume, 'clean');
    expect(html).toContain('Summary');
    expect(html).toContain('Experience');
  });

  it('renders every experience role', () => {
    const html = renderResume(defaultResume, 'terminal');
    const count = (html.match(/class="entry/g) || []).length;
    expect(count).toBe(10);
  });
});
