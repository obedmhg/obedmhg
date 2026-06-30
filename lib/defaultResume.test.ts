import { describe, it, expect } from 'vitest';
import { defaultResume } from './defaultResume';

describe('defaultResume', () => {
  it('carries Obed core identity', () => {
    expect(defaultResume.header.name).toBe('Obed Murillo');
    expect(defaultResume.header.title).toBe('Director of Technology');
    expect(defaultResume.header.org).toBe('KogniVera');
  });
  it('migrates podcast into generic highlight', () => {
    expect(defaultResume.highlight?.title).toBe('From Zero to N');
    expect(defaultResume.highlight?.description).toContain('Podcast host');
  });
  it('has all ten experience roles', () => {
    expect(defaultResume.experience.length).toBe(10);
  });
  it('has two certifications', () => {
    expect(defaultResume.certifications.length).toBe(2);
  });
});
