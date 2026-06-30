'use client';

import { buildHtmlDocument, downloadFilename } from '@/lib/buildHtmlDocument';
import type { ResumeData, Theme } from '@/lib/types';

export function DownloadControls({ data, theme }: { data: ResumeData; theme: Theme }) {
  function download() {
    const doc = buildHtmlDocument(data, theme);
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename(data);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="download-controls no-print">
      <button type="button" className="primary-btn" onClick={download}>
        ↓ Download HTML
      </button>
      <button type="button" className="ghost-btn" onClick={() => window.print()}>
        ⎙ Print / PDF
      </button>
    </div>
  );
}
