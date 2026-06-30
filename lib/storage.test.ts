import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState, clearState } from './storage';
import { defaultResume } from './defaultResume';

beforeEach(() => localStorage.clear());

describe('storage', () => {
  it('returns null when empty', () => {
    expect(loadState()).toBeNull();
  });

  it('round-trips data and theme', () => {
    saveState(defaultResume, 'clean');
    expect(loadState()).toEqual({ data: defaultResume, theme: 'clean' });
  });

  it('returns null on corrupt json', () => {
    localStorage.setItem('rb:v1', '{not json');
    expect(loadState()).toBeNull();
  });

  it('returns null on an unknown theme', () => {
    localStorage.setItem('rb:v1', JSON.stringify({ data: defaultResume, theme: 'neon' }));
    expect(loadState()).toBeNull();
  });

  it('clears state', () => {
    saveState(defaultResume, 'terminal');
    clearState();
    expect(loadState()).toBeNull();
  });
});
