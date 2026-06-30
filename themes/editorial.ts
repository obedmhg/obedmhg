import type { ThemeDef } from './types';

const S = '.rb-root[data-theme="editorial"]';

export const editorial: ThemeDef = {
  chrome: {
    showTerminalChrome: false,
    showChips: false,
    showHash: false,
    showVersionTags: false,
    showStatusBadges: false,
    showRepoLine: false,
    labels: {
      summary: 'Profile',
      experience: 'Selected Work',
      skills: 'Capabilities',
      highlight: 'Beyond Work',
      certifications: 'Credentials',
      contactCta: 'Open to consulting & technical leadership opportunities',
    },
    fonts:
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap',
  },
  css: `
${S}{
  --paper:#f7f4ee; --ink:#1a1714; --strong:#100d0a; --muted:#7a7268; --line:#e0d8cb; --accent:#e8431f;
  background:var(--paper); color:var(--ink); min-height:100vh;
  font-family:"Inter",system-ui,sans-serif; font-size:15.5px; line-height:1.6; -webkit-font-smoothing:antialiased;
}
${S} *{box-sizing:border-box;}
${S} .wrap{max-width:960px;margin:0 auto;padding:64px 32px 110px;}
${S} a{color:var(--accent);text-decoration:none;border-bottom:1px solid transparent;}
${S} a:hover{border-bottom-color:var(--accent);}
${S} :focus-visible{outline:2px solid var(--accent);outline-offset:3px;}

${S} .rb-hero{display:grid;grid-template-columns:1fr auto;gap:32px;align-items:end;border-bottom:3px solid var(--strong);padding-bottom:28px;}
${S} .rb-hero .avatar{width:120px;height:120px;border-radius:4px;object-fit:cover;filter:grayscale(1) contrast(1.05);}
${S} .rb-hero-main h1{margin:0;font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:clamp(46px,8vw,84px);line-height:.92;letter-spacing:-.02em;color:var(--strong);}
${S} .rb-role{margin-top:14px;font-size:19px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.04em;}
${S} .rb-exp{margin-top:6px;color:var(--muted);font-size:15px;}

${S} section{margin-top:54px;}
${S} .sec-label{font-family:"Fraunces",Georgia,serif;font-size:13px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--strong);margin-bottom:22px;display:flex;align-items:center;gap:14px;}
${S} .sec-label::before{content:"";width:34px;height:3px;background:var(--accent);}
${S} .panel{font-size:18px;line-height:1.55;max-width:62ch;}
${S} .panel p{margin:0 0 14px;}

${S} .log{display:flex;flex-direction:column;}
${S} .entry{display:grid;grid-template-columns:200px 1fr;gap:28px;padding:26px 0;border-top:1px solid var(--line);}
${S} .entry:first-child{border-top:0;}
${S} .entry .when{display:block;font-weight:600;color:var(--strong);font-size:14px;}
${S} .entry .stamp{display:block;color:var(--muted);font-size:13px;margin-top:5px;}
${S} .entry h3{margin:0;font-family:"Fraunces",Georgia,serif;font-size:25px;font-weight:600;color:var(--strong);line-height:1.1;}
${S} .entry .repo{color:var(--accent);font-size:14px;font-weight:600;margin:4px 0 10px;text-transform:uppercase;letter-spacing:.03em;}
${S} .entry ul{margin:0;padding-left:18px;}
${S} .entry li{margin-bottom:6px;color:var(--ink);}
${S} .entry .flags{margin-top:12px;display:flex;flex-wrap:wrap;gap:7px;}
${S} .etag{font-size:11.5px;font-weight:500;color:var(--strong);border:1px solid var(--strong);border-radius:2px;padding:3px 9px;}

${S} .stack{display:flex;flex-wrap:wrap;gap:10px;}
${S} .tok{font-size:14px;font-weight:500;color:var(--strong);background:transparent;border:1px solid var(--strong);border-radius:2px;padding:7px 13px;}
${S} .tok:hover{background:var(--strong);color:var(--paper);}

${S} .rb-highlight,${S} .rb-certs{border-top:1px solid var(--line);padding-top:18px;}
${S} .rb-highlight h3,${S} .rb-certs h3{margin:0;font-family:"Fraunces",Georgia,serif;font-size:24px;font-weight:600;color:var(--strong);}
${S} .meta{color:var(--muted);font-size:13px;margin:6px 0 12px;}
${S} .rb-highlight p{font-size:17px;max-width:60ch;}
${S} .file{display:flex;gap:12px;padding:11px 0;border-top:1px solid var(--line);}
${S} .file:first-of-type{border-top:0;}
${S} .file .ic{color:var(--accent);}
${S} .file .nm{color:var(--strong);font-weight:600;font-size:16px;}
${S} .file .ds{color:var(--muted);font-size:13px;}

${S} footer{margin-top:60px;border-top:3px solid var(--strong);padding-top:26px;}
${S} footer .cta{font-family:"Fraunces",Georgia,serif;font-size:22px;font-weight:600;color:var(--strong);margin-bottom:16px;max-width:30ch;}
${S} footer .row{display:flex;flex-wrap:wrap;gap:10px 30px;font-size:15px;}
${S} footer .row .k{color:var(--muted);text-transform:uppercase;font-size:12px;letter-spacing:.08em;}

@media (max-width:680px){
  ${S} .rb-hero{grid-template-columns:1fr;align-items:start;}
  ${S} .entry{grid-template-columns:1fr;gap:8px;}
}
@media print{
  ${S}{background:#fff;font-size:12px;}
  ${S} .wrap{padding:0;max-width:none;}
  ${S} a{color:var(--strong);}
  ${S} .entry,${S} section{break-inside:avoid;}
}
`,
};
