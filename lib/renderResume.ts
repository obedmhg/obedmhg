import type { ResumeData, Theme, ExperienceItem } from './types';
import type { ChromeConfig } from '@/themes/types';
import { getTheme } from '@/themes';
import { escapeHtml, attr } from './escapeHtml';

const e = escapeHtml;

const MON: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

function ver(dates: string): string {
  const m = dates.match(/([A-Za-z]{3})\s+(\d{4})/);
  return m ? `v${m[2]}.${MON[m[1]] || '00'}` : 'v0000.00';
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const isPresent = (d: string) => /present/i.test(d);

function secLabel(c: ChromeConfig, text: string): string {
  return `<div class="sec-label">${c.showHash ? '<span class="hash">#</span> ' : ''}${e(text)}</div>`;
}

function renderHero(data: ResumeData, c: ChromeConfig): string {
  const h = data.header;
  const photo = h.photo
    ? `<img class="avatar rb-photo" src="${attr(h.photo)}" alt="${e('Portrait of ' + h.name)}" />`
    : '';

  if (c.showTerminalChrome) {
    const org = h.org ? ` @ ${e(h.org)}` : '';
    return `<section class="term">
      <div class="term-bar">
        <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        <span class="path">~/${e(slug(h.name) || 'me')} — zsh</span>
      </div>
      <div class="term-body">
        <div>
          <div class="prompt"><span class="u">${e(slug(h.name).split('-')[0] || 'me')}</span>@<span class="c">latam</span>:~$ whoami</div>
          <h1>${e(h.name)}<span class="cursor"></span></h1>
          <div class="title">› ${e(h.title)}${org}</div>
          <div class="sub"><span class="k">role  </span>${e(h.title)}<br>
          <span class="k">exp   </span>${e(h.experience)}<br>
          ${data.contact.location ? `<span class="k">base  </span>${e(data.contact.location)}` : ''}</div>
        </div>
        ${photo}
      </div>
    </section>`;
  }

  return `<header class="rb-hero">
    ${photo}
    <div class="rb-hero-main">
      <h1>${e(h.name)}</h1>
      <div class="rb-role">${e(h.title)}${h.org ? ` · ${e(h.org)}` : ''}</div>
      <div class="rb-exp">${e(h.experience)}</div>
    </div>
  </header>`;
}

function renderChips(data: ResumeData, c: ChromeConfig): string {
  if (!c.showChips) return '';
  const companies = new Set(data.experience.map((x) => x.company)).size;
  const yrs = (data.header.experience.match(/(\d+\+?)/) || [])[1];
  return `<div class="chips">
    ${yrs ? `<span class="chip"><b>${e(yrs)}</b> yrs uptime</span>` : ''}
    <span class="chip"><b>${data.experience.length}</b> roles deployed</span>
    <span class="chip"><b>${companies}</b> companies</span>
    ${data.certifications.length ? `<span class="chip"><b>${data.certifications.length}</b> certifications</span>` : ''}
    ${data.highlight ? '<span class="chip"><b>1</b> highlight</span>' : ''}
  </div>`;
}

function renderEntry(item: ExperienceItem, c: ChromeConfig): string {
  const active = isPresent(item.dates);

  let left: string;
  if (c.showTerminalChrome) {
    left = `
      ${c.showVersionTags ? `<span class="ver">${e(ver(item.dates))}</span>` : ''}
      <span class="when">${e(item.dates)}</span>
      ${item.location ? `<span class="stamp">${e(item.location)}</span>` : ''}
      ${c.showStatusBadges ? `<span class="status ${active ? 'active' : 'shipped'}">${active ? '● ACTIVE' : '✓ SHIPPED'}</span>` : ''}`;
  } else {
    const stamp = [item.location, item.duration].filter(Boolean).join(' · ');
    left = `
      <span class="when">${e(item.dates)}</span>
      ${stamp ? `<span class="stamp">${e(stamp)}</span>` : ''}`;
  }

  const repo = c.showRepoLine
    ? `<div class="repo">${e(slug(item.title))}@${e(slug(item.company))}${item.duration ? ` · ${e(item.duration)}` : ''}</div>`
    : `<div class="repo">${e(item.company)}</div>`;

  let flags = '';
  if (item.skills.length) {
    flags = c.showTerminalChrome
      ? `<div class="flags"><b>--stack</b> ${e(item.skills.map((s) => s.toLowerCase().replace(/\s+/g, '-')).join(' '))}</div>`
      : `<div class="flags">${item.skills.map((s) => `<span class="etag">${e(s)}</span>`).join('')}</div>`;
  }

  const rightClass = c.showTerminalChrome ? 'right node' : 'right';
  return `<div class="entry ${active && c.showStatusBadges ? 'active' : ''}">
    <div class="left">${left}</div>
    <div class="${rightClass}">
      <h3>${e(item.title)}</h3>
      ${repo}
      <ul>${item.description.map((x) => `<li>${e(x)}</li>`).join('')}</ul>
      ${flags}
    </div>
  </div>`;
}

function highlightPanel(data: ResumeData, c: ChromeConfig): string {
  const hl = data.highlight!;
  return `<div class="panel rb-highlight">
    <h3>${c.showTerminalChrome ? '🎙 ' : ''}${e(hl.title)}</h3>
    ${hl.meta ? `<div class="meta">${e(hl.meta)}</div>` : ''}
    <p>${e(hl.description)}</p>
    ${hl.url ? `<p><a href="${attr(hl.url)}">${e(hl.url)}</a></p>` : ''}
  </div>`;
}

function certsPanel(data: ResumeData, c: ChromeConfig): string {
  const certs = data.certifications;
  const count = certs.length === 1 ? '1 item' : `${certs.length} items`;
  const files = certs
    .map(
      (cert) =>
        `<div class="file"><span class="ic">▤</span><span><span class="nm">${e(cert.name)}</span><br><span class="ds">${e(cert.institution)}${cert.date ? ` · ${e(cert.date)}` : ''}</span></span></div>`,
    )
    .join('');
  return `<div class="panel rb-certs">
    <h3>${e(c.labels.certifications)}</h3>
    <div class="meta">${count}</div>
    ${files}
  </div>`;
}

function renderContact(data: ResumeData, c: ChromeConfig): string {
  const ct = data.contact;
  const t = c.showTerminalChrome;
  const rows: string[] = [];
  if (ct.email) {
    rows.push(`<span><span class="k">${t ? 'email →' : 'email'}</span> <a href="mailto:${attr(ct.email)}">${e(ct.email)}</a></span>`);
  }
  if (ct.phone) {
    rows.push(`<span><span class="k">${t ? 'tel   →' : 'phone'}</span> <a href="tel:${attr(ct.phone.replace(/\s/g, ''))}">${e(ct.phone)}</a></span>`);
  }
  if (ct.location) {
    rows.push(`<span><span class="k">${t ? 'loc   →' : 'location'}</span> ${e(ct.location)}</span>`);
  }
  for (const l of ct.links || []) {
    rows.push(`<span><span class="k">${t ? 'link  →' : ''}</span> <a href="${attr(l.url)}">${e(l.label)}</a></span>`);
  }
  return `<footer class="rb-contact">
    <div class="cta">${e(c.labels.contactCta)}</div>
    <div class="row">${rows.join('')}</div>
  </footer>`;
}

export function renderResume(data: ResumeData, theme: Theme): string {
  const c = getTheme(theme).chrome;

  const hero = renderHero(data, c);
  const chips = renderChips(data, c);

  const summary = data.about.summary.length
    ? `<section class="rb-summary">
        ${secLabel(c, c.labels.summary)}
        <div class="panel">
          ${c.showTerminalChrome ? '<p class="comment"># professional summary</p>' : ''}
          ${data.about.summary.map((p) => `<p>${e(p)}</p>`).join('')}
        </div>
      </section>`
    : '';

  const experience = data.experience.length
    ? `<section class="rb-experience">
        ${secLabel(c, c.labels.experience)}
        <div class="log">${data.experience.map((x) => renderEntry(x, c)).join('')}</div>
      </section>`
    : '';

  const skills = data.skills.length
    ? `<section class="rb-skills">
        ${secLabel(c, c.labels.skills)}
        <div class="stack">${data.skills.map((s) => `<span class="tok">${c.showHash ? '<span class="h">#</span>' : ''}${e(s)}</span>`).join('')}</div>
      </section>`
    : '';

  let extras = '';
  if (c.showTerminalChrome) {
    const panels = [data.highlight ? highlightPanel(data, c) : '', data.certifications.length ? certsPanel(data, c) : '']
      .filter(Boolean)
      .join('');
    if (panels) {
      extras = `<section class="rb-extras">${secLabel(c, c.labels.highlight)}<div class="two">${panels}</div></section>`;
    }
  } else {
    if (data.highlight) {
      extras += `<section class="rb-highlight-sec">${secLabel(c, c.labels.highlight)}${highlightPanel(data, c)}</section>`;
    }
    if (data.certifications.length) {
      extras += `<section class="rb-certs-sec">${secLabel(c, c.labels.certifications)}${certsPanel(data, c)}</section>`;
    }
  }

  const footer = renderContact(data, c);

  return `<div class="rb-root" data-theme="${theme}">${c.showTerminalChrome ? '<div class="grain"></div>' : ''}<div class="wrap">${hero}${chips}${summary}${experience}${skills}${extras}${footer}</div></div>`;
}
