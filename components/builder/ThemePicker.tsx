'use client';

import { THEMES, THEME_LABELS } from '@/lib/types';
import type { Theme } from '@/lib/types';

export function ThemePicker({ value, onChange }: { value: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className="field">
      <label>Theme</label>
      <div className="theme-picker" role="radiogroup" aria-label="Theme">
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={value === t}
            className={`theme-chip ${value === t ? 'active' : ''}`}
            onClick={() => onChange(t)}
          >
            {THEME_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  );
}
