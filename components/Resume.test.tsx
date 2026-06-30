import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Resume } from './Resume';
import { defaultResume } from '@/lib/defaultResume';

describe('Resume', () => {
  it('renders the resume root and injects theme styles', () => {
    const { container } = render(<Resume data={defaultResume} theme="terminal" />);
    expect(container.querySelector('.rb-root')).toBeTruthy();
    expect(container.querySelector('style')).toBeTruthy();
    expect(container.textContent).toContain('Obed Murillo');
  });

  it('switches markup with the theme', () => {
    const { container } = render(<Resume data={defaultResume} theme="clean" />);
    expect(container.querySelector('[data-theme="clean"]')).toBeTruthy();
    expect(container.querySelector('.term-bar')).toBeNull();
  });
});
