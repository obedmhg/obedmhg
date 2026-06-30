'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Resume } from '@/components/Resume';
import { BuilderForm } from '@/components/builder/BuilderForm';
import { ThemePicker } from '@/components/builder/ThemePicker';
import { DownloadControls } from '@/components/builder/DownloadControls';
import { sampleResume } from '@/lib/sampleResume';
import { loadState, saveState, clearState } from '@/lib/storage';
import type { ResumeData, Theme } from '@/lib/types';
import './builder.css';

const blankResume: ResumeData = {
  header: { name: '', title: '', org: '', experience: '' },
  about: { summary: [''] },
  skills: [],
  experience: [],
  certifications: [],
  contact: {},
};

export default function BuilderPage() {
  const [data, setData] = useState<ResumeData>(sampleResume);
  const [theme, setTheme] = useState<Theme>('clean');
  const [error, setError] = useState('');
  const hydrated = useRef(false);

  useEffect(() => {
    const s = loadState();
    if (s) {
      setData(s.data);
      setTheme(s.theme);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const id = setTimeout(() => saveState(data, theme), 400);
    return () => clearTimeout(id);
  }, [data, theme]);

  function reset(to: ResumeData) {
    clearState();
    setData(to);
    setError('');
  }

  return (
    <div className="builder">
      <aside className="builder-panel no-print">
        <header className="builder-head">
          <Link className="builder-back" href="/">
            ← back
          </Link>
          <h1>Resume builder</h1>
          <p className="builder-sub">Fill in your details, pick a theme, then download a standalone HTML file.</p>
        </header>

        <ThemePicker value={theme} onChange={setTheme} />
        <DownloadControls data={data} theme={theme} />

        {error && (
          <p className="builder-error" role="alert">
            {error}
          </p>
        )}

        <BuilderForm data={data} onChange={setData} onError={setError} />

        <div className="builder-reset">
          <button type="button" className="ghost-btn" onClick={() => reset(blankResume)}>
            Start blank
          </button>
          <button type="button" className="ghost-btn" onClick={() => reset(sampleResume)}>
            Load example
          </button>
        </div>
      </aside>

      <main className="builder-preview">
        <Resume data={data} theme={theme} />
      </main>
    </div>
  );
}
