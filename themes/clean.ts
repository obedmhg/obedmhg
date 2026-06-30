import type { ThemeDef } from './types';

const S = '.rb-root[data-theme="clean"]';

export const clean: ThemeDef = {
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
      skills: 'Skills',
      highlight: 'Highlights',
      certifications: 'Certifications',
      contactCta: 'Open to consulting & technical leadership opportunities',
    },
    fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  css: `
${S}{
  --ink:#1f2937; --strong:#0f172a; --muted:#6b7280; --line:#e5e7eb; --accent:#2563eb; --bg:#ffffff;
  background:var(--bg); color:var(--ink); min-height:100vh;
  font-family:"Inter",system-ui,-apple-system,Segoe UI,Roboto,sans-serif; font-size:15px; line-height:1.62;
  -webkit-font-smoothing:antialiased;
}
${S} *{box-sizing:border-box;}
${S} .wrap{max-width:840px;margin:0 auto;padding:56px 28px 90px;}
${S} a{color:var(--accent);text-decoration:none;}
${S} a:hover{text-decoration:underline;}
${S} :focus-visible{outline:2px solid var(--accent);outline-offset:2px;}

${S} .rb-hero{display:flex;gap:24px;align-items:center;}
${S} .rb-hero .avatar{width:96px;height:96px;border-radius:50%;object-fit:cover;border:1px solid var(--line);}
${S} .rb-hero-main h1{margin:0;font-size:38px;line-height:1.05;font-weight:700;letter-spacing:-.02em;color:var(--strong);}
${S} .rb-role{margin-top:6px;font-size:17px;font-weight:600;color:var(--accent);}
${S} .rb-exp{margin-top:4px;color:var(--muted);font-size:14.5px;}

${S} section{margin-top:40px;}
${S} .sec-label{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);padding-bottom:8px;border-bottom:1px solid var(--line);margin-bottom:18px;}
${S} .panel p{margin:0 0 10px;}
${S} .panel p:last-child{margin-bottom:0;}

${S} .log{display:flex;flex-direction:column;gap:4px;}
${S} .entry{display:grid;grid-template-columns:170px 1fr;gap:20px;padding:18px 0;border-top:1px solid var(--line);}
${S} .entry:first-child{border-top:0;}
${S} .entry .when{display:block;font-weight:600;color:var(--strong);font-size:13.5px;}
${S} .entry .stamp{display:block;color:var(--muted);font-size:12.5px;margin-top:4px;}
${S} .entry h3{margin:0;font-size:17px;font-weight:600;color:var(--strong);}
${S} .entry .repo{color:var(--accent);font-size:13.5px;font-weight:500;margin:2px 0 8px;}
${S} .entry ul{margin:0;padding-left:18px;}
${S} .entry li{margin-bottom:5px;}
${S} .entry .flags{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;}
${S} .etag{font-size:11.5px;color:var(--muted);background:#f3f4f6;border-radius:999px;padding:3px 9px;}

${S} .stack{display:flex;flex-wrap:wrap;gap:8px;}
${S} .tok{font-size:13px;color:var(--ink);border:1px solid var(--line);border-radius:6px;padding:6px 11px;background:#fafafa;}

${S} .rb-highlight,${S} .rb-certs{border:1px solid var(--line);border-radius:10px;padding:20px;}
${S} .rb-highlight h3,${S} .rb-certs h3{margin:0;font-size:17px;color:var(--strong);}
${S} .meta{color:var(--muted);font-size:12.5px;margin:4px 0 12px;}
${S} .file{display:flex;gap:10px;padding:9px 0;border-top:1px solid var(--line);}
${S} .file:first-of-type{border-top:0;}
${S} .file .ic{color:var(--accent);}
${S} .file .nm{color:var(--strong);font-weight:600;}
${S} .file .ds{color:var(--muted);font-size:12.5px;}

${S} footer{margin-top:44px;border-top:1px solid var(--line);padding-top:24px;}
${S} footer .cta{font-weight:600;color:var(--strong);margin-bottom:14px;}
${S} footer .row{display:flex;flex-wrap:wrap;gap:10px 28px;}
${S} footer .row .k{color:var(--muted);}

@media (max-width:640px){
  ${S} .rb-hero{flex-direction:column;align-items:flex-start;}
  ${S} .entry{grid-template-columns:1fr;gap:6px;}
}
@media print{
  ${S}{font-size:12px;}
  ${S} .wrap{padding:0;max-width:none;}
  ${S} a{color:var(--strong);}
  ${S} section{margin-top:22px;break-inside:avoid;}
  ${S} .entry{break-inside:avoid;}
}
`,
};
