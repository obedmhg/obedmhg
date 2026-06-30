'use client';

import { useId } from 'react';

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Edits a string[] — one input per item, with add/remove. */
export function ListField({
  label,
  values,
  onChange,
  placeholder,
  addLabel = '+ Add',
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const update = (i: number, v: string) => onChange(values.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, '']);
  return (
    <div className="field">
      <label>{label}</label>
      {values.map((v, i) => (
        <div className="list-row" key={i}>
          <input value={v} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          <button type="button" className="icon-btn" aria-label={`Remove ${label} item ${i + 1}`} onClick={() => remove(i)}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={add}>
        {addLabel}
      </button>
    </div>
  );
}

export function Fieldset({ legend, children, onRemove }: { legend: string; children: React.ReactNode; onRemove?: () => void }) {
  return (
    <fieldset className="repeater-item">
      <div className="repeater-head">
        <legend>{legend}</legend>
        {onRemove && (
          <button type="button" className="icon-btn" aria-label={`Remove ${legend}`} onClick={onRemove}>
            ✕
          </button>
        )}
      </div>
      {children}
    </fieldset>
  );
}
