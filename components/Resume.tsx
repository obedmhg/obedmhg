'use client';

import { renderResume } from '@/lib/renderResume';
import { getTheme } from '@/themes';
import type { ResumeData, Theme } from '@/lib/types';

export function Resume({ data, theme }: { data: ResumeData; theme: Theme }) {
  const html = renderResume(data, theme);
  const css = getTheme(theme).css;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
