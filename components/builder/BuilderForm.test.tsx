import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BuilderForm } from './BuilderForm';
import { defaultResume } from '@/lib/defaultResume';

describe('BuilderForm', () => {
  it('edits the name and reports a new data object', () => {
    const onChange = vi.fn();
    render(<BuilderForm data={defaultResume} onChange={onChange} onError={vi.fn()} />);
    // "Name" also labels each certification editor — the header field is the first.
    fireEvent.change(screen.getAllByLabelText('Name')[0], { target: { value: 'New Name' } });
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)![0].header.name).toBe('New Name');
  });

  it('adds a skill', () => {
    const onChange = vi.fn();
    render(<BuilderForm data={defaultResume} onChange={onChange} onError={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '+ Add skill' }));
    expect(onChange.mock.calls.at(-1)![0].skills.length).toBe(defaultResume.skills.length + 1);
  });

  it('removes the highlight', () => {
    const onChange = vi.fn();
    render(<BuilderForm data={defaultResume} onChange={onChange} onError={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Highlight' }));
    expect(onChange.mock.calls.at(-1)![0].highlight).toBeUndefined();
  });
});
