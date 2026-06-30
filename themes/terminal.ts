import type { ThemeDef } from './types';

const S = '.rb-root[data-theme="terminal"]';

export const terminal: ThemeDef = {
  chrome: {
    showTerminalChrome: true,
    showChips: true,
    showHash: true,
    showVersionTags: true,
    showStatusBadges: true,
    showRepoLine: true,
    labels: {
      summary: 'cat profile.md',
      experience: 'git log --career',
      skills: 'stack --list',
      highlight: 'ls extras/',
      certifications: 'certifications/',
      contactCta: '$ open to consulting & technical leadership roles',
    },
    fonts:
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
  },
  css: `
${S}{
  --bg:#0A0E14; --panel:#10161F; --panel2:#0D131B; --line:#1E2733; --line2:#283442;
  --text:#9FB0C0; --bright:#E7EEF5; --dim:#5E6E7E; --cyan:#6FD6E6; --amber:#E8B161; --ok:#74C99A; --maxw:1060px;
  background:var(--bg); color:var(--text);
  font-family:"JetBrains Mono",ui-monospace,monospace; font-size:14.5px; line-height:1.7; -webkit-font-smoothing:antialiased;
  min-height:100vh;
  background-image:
    radial-gradient(900px 500px at 80% -10%, rgba(111,214,230,.06), transparent 60%),
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size:auto, 46px 46px, 46px 46px;
}
${S} *{box-sizing:border-box;}
${S} .grain{position:fixed;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));z-index:0;}
${S} .wrap{position:relative;z-index:1;max-width:var(--maxw);margin:0 auto;padding:24px 22px 90px;}
${S} a{color:var(--cyan);text-decoration:none;}
${S} a:hover{text-decoration:underline;}
${S} :focus-visible{outline:2px solid var(--cyan);outline-offset:2px;}

${S} .term{margin-top:0;border:1px solid var(--line2);border-radius:12px;overflow:hidden;background:linear-gradient(180deg,var(--panel),var(--panel2));box-shadow:0 30px 70px -40px rgba(0,0,0,.9);}
${S} .term-bar{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--line);background:rgba(255,255,255,.015);}
${S} .dot{width:11px;height:11px;border-radius:50%;}
${S} .dot.r{background:#FF5F56;}${S} .dot.y{background:#FFBD2E;}${S} .dot.g{background:#27C93F;}
${S} .term-bar .path{margin-left:10px;color:var(--dim);font-size:12.5px;}
${S} .term-body{padding:26px 26px 30px;display:grid;grid-template-columns:1fr 132px;gap:26px;align-items:center;}
${S} .prompt{color:var(--dim);}
${S} .prompt .u{color:var(--ok);}
${S} .prompt .c{color:var(--cyan);}
${S} .term h1{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:clamp(34px,6vw,58px);line-height:1.02;letter-spacing:-.02em;color:var(--bright);margin:6px 0 4px;}
${S} .cursor{display:inline-block;width:11px;height:.95em;background:var(--cyan);vertical-align:-2px;margin-left:4px;animation:rb-term-blink 1.1s steps(1) infinite;}
@keyframes rb-term-blink{50%{opacity:0;}}
${S} .term .title{color:var(--amber);font-size:15px;}
${S} .term .sub{color:var(--text);font-size:13.5px;margin-top:10px;}
${S} .term .sub .k{color:var(--dim);}
${S} .avatar{width:132px;height:132px;border-radius:10px;object-fit:cover;border:1px solid var(--line2);filter:grayscale(.3) brightness(.95);}

${S} .chips{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 8px;}
${S} .chip{border:1px solid var(--line);background:var(--panel);border-radius:6px;padding:8px 12px;font-size:12.5px;}
${S} .chip b{color:var(--cyan);font-weight:500;}

${S} section{margin-top:46px;}
${S} .sec-label{display:flex;align-items:center;gap:10px;color:var(--dim);font-size:12.5px;margin-bottom:16px;}
${S} .sec-label::after{content:"";flex:1;height:1px;background:var(--line);}
${S} .sec-label .hash{color:var(--cyan);}
${S} .panel{border:1px solid var(--line);border-radius:10px;background:rgba(16,22,31,.7);backdrop-filter:blur(2px);padding:24px;}
${S} .panel p{margin:0 0 12px;}
${S} .panel p:last-child{margin-bottom:0;}
${S} .panel .comment{color:var(--dim);}

${S} .log{position:relative;padding-left:8px;}
${S} .entry{position:relative;display:grid;grid-template-columns:150px 1fr;gap:22px;padding:18px 0;border-top:1px dashed var(--line);}
${S} .entry:first-child{border-top:0;}
${S} .entry .left{position:relative;}
${S} .entry .ver{color:var(--amber);font-weight:500;font-size:13px;}
${S} .entry .when{color:var(--dim);font-size:12px;display:block;margin-top:2px;}
${S} .entry .stamp{color:var(--dim);font-size:11.5px;display:block;margin-top:6px;}
${S} .status{display:inline-block;font-size:10px;letter-spacing:.1em;padding:2px 8px;border-radius:4px;margin-top:8px;}
${S} .status.active{color:var(--ok);border:1px solid rgba(116,201,154,.4);background:rgba(116,201,154,.08);}
${S} .status.shipped{color:var(--dim);border:1px solid var(--line2);}
${S} .node{position:relative;}
${S} .node::before{content:"";position:absolute;left:-20px;top:6px;width:9px;height:9px;border-radius:50%;background:var(--cyan);box-shadow:0 0 0 4px rgba(111,214,230,.12);}
${S} .entry.active .node::before{background:var(--ok);box-shadow:0 0 0 4px rgba(116,201,154,.15);}
${S} .right{border-left:1px solid var(--line);padding-left:24px;}
${S} .entry h3{font-family:"Space Grotesk",sans-serif;font-weight:600;font-size:18px;color:var(--bright);margin:0 0 2px;}
${S} .entry .repo{color:var(--cyan);font-size:13px;margin-bottom:10px;}
${S} .entry ul{margin:0 0 10px;padding:0;list-style:none;}
${S} .entry li{position:relative;padding-left:18px;margin-bottom:5px;color:var(--text);}
${S} .entry li::before{content:"›";position:absolute;left:0;color:var(--cyan);}
${S} .entry .flags{color:var(--dim);font-size:12.5px;}
${S} .entry .flags b{color:var(--amber);font-weight:400;}

${S} .stack{display:flex;flex-wrap:wrap;gap:8px;}
${S} .tok{font-size:12.5px;color:var(--text);border:1px solid var(--line);border-radius:6px;padding:6px 10px;background:var(--panel);}
${S} .tok:hover{border-color:var(--cyan);color:var(--cyan);}
${S} .tok .h{color:var(--dim);}

${S} .two{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
${S} .two h3{font-family:"Space Grotesk",sans-serif;color:var(--bright);font-weight:600;font-size:17px;margin:0 0 4px;}
${S} .two .meta{color:var(--dim);font-size:12px;margin-bottom:12px;}
${S} .file{display:flex;gap:10px;padding:10px 0;border-top:1px dashed var(--line);}
${S} .file:first-of-type{border-top:0;}
${S} .file .ic{color:var(--amber);}
${S} .file .nm{color:var(--bright);}
${S} .file .ds{color:var(--dim);font-size:12px;}

${S} footer{margin-top:46px;border-top:1px solid var(--line);padding-top:26px;}
${S} footer .cta{color:var(--ok);margin-bottom:14px;}
${S} footer .row{display:flex;flex-wrap:wrap;gap:10px 26px;}
${S} footer .row .k{color:var(--dim);}

@media (max-width:760px){
  ${S} .term-body{grid-template-columns:1fr;}
  ${S} .avatar{width:96px;height:96px;order:-1;}
  ${S} .entry{grid-template-columns:1fr;gap:12px;}
  ${S} .right{border-left:0;padding-left:0;border-top:1px solid var(--line);padding-top:12px;}
  ${S} .node::before{display:none;}
  ${S} .two{grid-template-columns:1fr;}
  ${S}{background-size:auto,32px 32px,32px 32px;}
}
@media (prefers-reduced-motion:reduce){${S} .cursor{animation:none;}}
@media print{
  ${S}{background:#fff;color:#111;min-height:0;}
  ${S} .grain{display:none;}
  ${S} .wrap{padding:0 12px 20px;}
  ${S} .term{box-shadow:none;border-color:#ccc;background:#fff;}
  ${S} .term h1,${S} .entry h3,${S} .two h3{color:#111;}
  ${S} .title,${S} .ver,${S} .entry .repo,${S} .entry li::before,${S} .sec-label .hash,${S} footer .cta{color:#444;}
  ${S} .panel{background:#fff;border-color:#ccc;backdrop-filter:none;}
  ${S} .text,${S} .sub,${S} .entry li{color:#222;}
}
`,
};
