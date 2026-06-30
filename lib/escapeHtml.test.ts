import { describe, it, expect } from 'vitest';
import { escapeHtml, attr } from './escapeHtml';

describe('escapeHtml', () => {
  it('escapes angle brackets, ampersands and quotes', () => {
    expect(escapeHtml('<script>&"')).toBe('&lt;script&gt;&amp;&quot;');
  });
  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });
  it('attr is the same escaper', () => {
    expect(attr('a"b')).toBe('a&quot;b');
  });
});
