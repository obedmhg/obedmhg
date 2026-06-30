'use client';

import { useId, useState } from 'react';
import { fileToDataUrl } from '@/lib/image';

export function PhotoUpload({
  value,
  onChange,
  onError,
}: {
  value?: string;
  onChange: (dataUrl?: string) => void;
  onError: (msg: string) => void;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    onError('');
    try {
      const dataUrl = await fileToDataUrl(file, 512);
      onChange(dataUrl);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not process that image.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field">
      <label htmlFor={id}>Photo</label>
      <div className="photo-row">
        {value ? <img className="photo-thumb" src={value} alt="Resume photo preview" /> : <div className="photo-thumb empty">no photo</div>}
        <div className="photo-actions">
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {busy && <span className="hint">processing…</span>}
          {value && (
            <button type="button" className="add-btn" onClick={() => onChange(undefined)}>
              Remove photo
            </button>
          )}
        </div>
      </div>
      <p className="hint">Resized to 512px and embedded in the download.</p>
    </div>
  );
}
