import type { ThemeDef } from './types';

const S = '.rb-root[data-theme="blueprint"]';

export const blueprint: ThemeDef = {
  chrome: {
    showTerminalChrome: false,
    showChips: false,
    showHash: false,
    showVersionTags: false,
    showStatusBadges: false,
    showRepoLine: false,
    labels: {
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Stack',
      highlight: 'Highlights',
      certifications: 'Certifications',
      contactCta: 'Open to consulting & technical leadership opportunities',
    },
    fonts: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
  },
  css: `
${S}{
  --paper:#f4f6f9; --ink:#27343f; --strong:#0c2233; --muted:#6a7a88; --line:#c2d0dc; --accent:#1f6feb; --grid:#dde6ee;
  background:var(--paper); color:var(--ink); min-height:100vh;
  font-family:"JetBrains Mono",ui-monospace,monospace; font-size:13.5px; line-height:1.66; -webkit-font-smoothing:antialiased;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:28px 28px;
}
${S} *{box-sizing:border-box;}
${S} .wrap{max-width:900px;margin:0 auto;padding:48px 26px 90px;}
${S} a{color:var(--accent);text-decoration:none;}
${S} a:hover{text-decoration:underline;}
${S} :focus-visible{outline:2px solid var(--accent);outline-offset:2px;}

${S} .rb-hero{display:flex;gap:22px;align-items:center;border:1px solid var(--line);background:rgba(255,255,255,.7);padding:22px;}
${S} .rb-hero .avatar{width:104px;height:104px;border-radius:2px;object-fit:cover;border:1px solid var(--line);filter:grayscale(.4);}
${S} .rb-hero-main h1{margin:0;font-size:34px;font-weight:700;letter-spacing:-.01em;color:var(--strong);}
${S} .rb-role{margin-top:6px;font-size:15px;font-weight:500;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;}
${S} .rb-exp{margin-top:4px;color:var(--muted);}

${S} section{margin-top:38px;}
${S} .sec-label{font-size:11.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--strong);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
${S} .sec-label::before{content:"//";color:var(--accent);}
${S} .sec-label::after{content:"";flex:1;height:1px;background:var(--line);}
${S} .panel{border:1px solid var(--line);background:rgba(255,255,255,.7);padding:20px;}
${S} .panel p{margin:0 0 10px;}
${S} .panel p:last-child{margin-bottom:0;}

${S} .log{border:1px solid var(--line);background:rgba(255,255,255,.55);}
${S} .entry{display:grid;grid-template-columns:160px 1fr;gap:18px;padding:18px 20px;border-bottom:1px dashed var(--line);}
${S} .entry:last-child{border-bottom:0;}
${S} .entry .when{display:block;font-weight:700;color:var(--strong);font-size:12.5px;}
${S} .entry .stamp{display:block;color:var(--muted);font-size:11.5px;margin-top:4px;}
${S} .entry h3{margin:0;font-size:16px;font-weight:700;color:var(--strong);}
${S} .entry .repo{color:var(--accent);font-size:12.5px;margin:2px 0 9px;}
${S} .entry ul{margin:0;padding-left:16px;list-style:none;}
${S} .entry li{position:relative;padding-left:14px;margin-bottom:5px;}
${S} .entry li::before{content:"+";position:absolute;left:0;color:var(--accent);}
${S} .entry .flags{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;}
${S} .etag{font-size:11px;color:var(--strong);border:1px solid var(--line);border-radius:2px;padding:2px 8px;background:var(--paper);text-transform:uppercase;letter-spacing:.04em;}

${S} .stack{display:flex;flex-wrap:wrap;gap:8px;}
${S} .tok{font-size:12px;color:var(--ink);border:1px solid var(--line);border-radius:2px;padding:6px 10px;background:rgba(255,255,255,.7);}
${S} .tok:hover{border-color:var(--accent);color:var(--accent);}

${S} .rb-highlight,${S} .rb-certs{border:1px solid var(--line);background:rgba(255,255,255,.7);padding:20px;}
${S} .rb-highlight h3,${S} .rb-certs h3{margin:0;font-size:16px;color:var(--strong);text-transform:uppercase;letter-spacing:.04em;}
${S} .meta{color:var(--muted);font-size:11.5px;margin:5px 0 12px;}
${S} .file{display:flex;gap:10px;padding:9px 0;border-top:1px dashed var(--line);}
${S} .file:first-of-type{border-top:0;}
${S} .file .ic{color:var(--accent);}
${S} .file .nm{color:var(--strong);font-weight:700;}
${S} .file .ds{color:var(--muted);font-size:11.5px;}

${S} footer{margin-top:40px;border-top:1px solid var(--line);padding-top:22px;}
${S} footer .cta{color:var(--strong);font-weight:700;margin-bottom:14px;}
${S} footer .row{display:flex;flex-wrap:wrap;gap:10px 26px;}
${S} footer .row .k{color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-size:11px;}

@media (max-width:640px){
  ${S} .rb-hero{flex-direction:column;align-items:flex-start;}
  ${S} .entry{grid-template-columns:1fr;gap:6px;}
}
@media print{
  ${S}{background:#fff;background-image:none;font-size:11.5px;}
  ${S} .wrap{padding:0;max-width:none;}
  ${S} .log,${S} .panel,${S} .rb-hero,${S} .rb-highlight,${S} .rb-certs{background:#fff;}
  ${S} a{color:var(--strong);}
  ${S} .entry,${S} section{break-inside:avoid;}
}
`,
};
