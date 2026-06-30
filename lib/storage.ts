import type { ResumeData, Theme } from './types';
import { THEMES } from './types';

const KEY = 'rb:v1';

export interface PersistedState {
  data: ResumeData;
  theme: Theme;
}

export function loadState(): PersistedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.data || !parsed.data.header || !THEMES.includes(parsed.theme)) return null;
    return parsed as PersistedState;
  } catch {
    return null;
  }
}

export function saveState(data: ResumeData, theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ data, theme }));
  } catch {
    /* quota exceeded or storage disabled — ignore */
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
