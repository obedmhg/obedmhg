'use client';

import type { ResumeData, ExperienceItem, Certification, ContactLink } from '@/lib/types';
import { TextField, TextArea, ListField, Fieldset } from './fields';
import { PhotoUpload } from './PhotoUpload';

const emptyExperience: ExperienceItem = {
  title: '',
  company: '',
  dates: '',
  location: '',
  duration: '',
  description: [''],
  skills: [],
};

const emptyCert: Certification = { name: '', institution: '', date: '' };
const emptyLink: ContactLink = { label: '', url: '' };

export function BuilderForm({
  data,
  onChange,
  onError,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
  onError: (msg: string) => void;
}) {
  const patch = (partial: Partial<ResumeData>) => onChange({ ...data, ...partial });
  const patchHeader = (p: Partial<ResumeData['header']>) => patch({ header: { ...data.header, ...p } });
  const patchContact = (p: Partial<ResumeData['contact']>) => patch({ contact: { ...data.contact, ...p } });

  const updateExperience = (i: number, item: ExperienceItem) =>
    patch({ experience: data.experience.map((x, idx) => (idx === i ? item : x)) });

  return (
    <div className="builder-form">
      <section className="form-section">
        <h2>Header</h2>
        <TextField label="Name" value={data.header.name} onChange={(v) => patchHeader({ name: v })} />
        <TextField label="Title" value={data.header.title} onChange={(v) => patchHeader({ title: v })} />
        <TextField label="Organization" value={data.header.org ?? ''} onChange={(v) => patchHeader({ org: v })} />
        <TextField
          label="Experience line"
          value={data.header.experience}
          onChange={(v) => patchHeader({ experience: v })}
          placeholder="17+ years in eCommerce & Digital Solutions"
        />
        <PhotoUpload value={data.header.photo} onChange={(p) => patchHeader({ photo: p })} onError={onError} />
      </section>

      <section className="form-section">
        <h2>Summary</h2>
        <ListField
          label="Summary paragraphs"
          values={data.about.summary}
          onChange={(summary) => patch({ about: { summary } })}
          placeholder="One sentence per line"
          addLabel="+ Add paragraph"
        />
      </section>

      <section className="form-section">
        <h2>Skills</h2>
        <ListField label="Skills" values={data.skills} onChange={(skills) => patch({ skills })} placeholder="e.g. Java" addLabel="+ Add skill" />
      </section>

      <section className="form-section">
        <h2>Experience</h2>
        {data.experience.map((item, i) => (
          <Fieldset
            key={i}
            legend={item.title || `Role ${i + 1}`}
            onRemove={() => patch({ experience: data.experience.filter((_, idx) => idx !== i) })}
          >
            <TextField label="Title" value={item.title} onChange={(v) => updateExperience(i, { ...item, title: v })} />
            <TextField label="Company" value={item.company} onChange={(v) => updateExperience(i, { ...item, company: v })} />
            <TextField label="Dates" value={item.dates} onChange={(v) => updateExperience(i, { ...item, dates: v })} placeholder="Apr 2025 - Present" />
            <TextField label="Location" value={item.location ?? ''} onChange={(v) => updateExperience(i, { ...item, location: v })} />
            <TextField label="Duration" value={item.duration ?? ''} onChange={(v) => updateExperience(i, { ...item, duration: v })} placeholder="1 yr 9 mos" />
            <ListField
              label="Bullets"
              values={item.description}
              onChange={(description) => updateExperience(i, { ...item, description })}
              addLabel="+ Add bullet"
            />
            <ListField
              label="Skills / tags"
              values={item.skills}
              onChange={(skills) => updateExperience(i, { ...item, skills })}
              addLabel="+ Add tag"
            />
          </Fieldset>
        ))}
        <button type="button" className="add-btn" onClick={() => patch({ experience: [...data.experience, { ...emptyExperience, description: [''] }] })}>
          + Add role
        </button>
      </section>

      <section className="form-section">
        <h2>Highlight</h2>
        {data.highlight ? (
          <Fieldset legend="Highlight" onRemove={() => patch({ highlight: undefined })}>
            <TextField label="Title" value={data.highlight.title} onChange={(v) => patch({ highlight: { ...data.highlight!, title: v } })} />
            <TextField label="Meta" value={data.highlight.meta ?? ''} onChange={(v) => patch({ highlight: { ...data.highlight!, meta: v } })} placeholder="Aug 2021 - Present · live" />
            <TextArea label="Description" value={data.highlight.description} onChange={(v) => patch({ highlight: { ...data.highlight!, description: v } })} />
            <TextField label="URL" value={data.highlight.url ?? ''} onChange={(v) => patch({ highlight: { ...data.highlight!, url: v } })} />
          </Fieldset>
        ) : (
          <button type="button" className="add-btn" onClick={() => patch({ highlight: { title: '', description: '' } })}>
            + Add highlight
          </button>
        )}
      </section>

      <section className="form-section">
        <h2>Certifications</h2>
        {data.certifications.map((cert, i) => (
          <Fieldset
            key={i}
            legend={cert.name || `Certification ${i + 1}`}
            onRemove={() => patch({ certifications: data.certifications.filter((_, idx) => idx !== i) })}
          >
            <TextField label="Name" value={cert.name} onChange={(v) => patch({ certifications: data.certifications.map((c, idx) => (idx === i ? { ...c, name: v } : c)) })} />
            <TextField label="Institution" value={cert.institution} onChange={(v) => patch({ certifications: data.certifications.map((c, idx) => (idx === i ? { ...c, institution: v } : c)) })} />
            <TextField label="Date / note" value={cert.date ?? ''} onChange={(v) => patch({ certifications: data.certifications.map((c, idx) => (idx === i ? { ...c, date: v } : c)) })} />
          </Fieldset>
        ))}
        <button type="button" className="add-btn" onClick={() => patch({ certifications: [...data.certifications, { ...emptyCert }] })}>
          + Add certification
        </button>
      </section>

      <section className="form-section">
        <h2>Contact</h2>
        <TextField label="Location" value={data.contact.location ?? ''} onChange={(v) => patchContact({ location: v })} />
        <TextField label="Email" type="email" value={data.contact.email ?? ''} onChange={(v) => patchContact({ email: v })} />
        <TextField label="Phone" value={data.contact.phone ?? ''} onChange={(v) => patchContact({ phone: v })} />
        {(data.contact.links ?? []).map((link, i) => (
          <Fieldset
            key={i}
            legend={link.label || `Link ${i + 1}`}
            onRemove={() => patchContact({ links: (data.contact.links ?? []).filter((_, idx) => idx !== i) })}
          >
            <TextField label="Label" value={link.label} onChange={(v) => patchContact({ links: (data.contact.links ?? []).map((l, idx) => (idx === i ? { ...l, label: v } : l)) })} />
            <TextField label="URL" value={link.url} onChange={(v) => patchContact({ links: (data.contact.links ?? []).map((l, idx) => (idx === i ? { ...l, url: v } : l)) })} />
          </Fieldset>
        ))}
        <button type="button" className="add-btn" onClick={() => patchContact({ links: [...(data.contact.links ?? []), { ...emptyLink }] })}>
          + Add link
        </button>
      </section>
    </div>
  );
}
