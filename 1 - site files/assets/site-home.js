/* Homepage section renderers for the Arshad Site Lab, carried over from home.js. X = the page's effective settings. */
window.SH = (function(){
'use strict';
const H = window.HD, D = window.PD;
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let X = {};
const st = { stageSel: 'F', wiz: { step: 0, a: null, b: null }, openDoor: 'F' };
const tx = k => H.T[X.text][k];
const brand = k => H.BRANDS.find(b => b.k === k);
const bk = () => (window.PU && PU.shortlist ? PU.shortlist : []).map(id => ({ id, name: (D.P[id] && D.P[id].name) || id }));
/* ---------- small drawn assets ---------- */
const MARKP = 'M0 299 75 299 220 5 147 5ZM257 5 293 5 330 78 220 78ZM202 115 348 115 385 188 165 188ZM147 226 403 226 440 299 110 299Z';
const mark = (cls = '') => `<svg class="mark ${cls}" viewBox="0 0 440 304" aria-hidden="true"><path d="${MARKP}"/></svg>`;
const I = {
  film: '<path d="M4 7h11a4 4 0 0 1 0 8H4z"/><circle cx="15" cy="11" r="1.5"/><path d="M4 15v3h16"/>',
  print: '<rect x="5" y="3" width="14" height="6" rx="1"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 17v4h10v-4"/>',
  fabric: '<path d="M4 4h16v16H4z"/><path d="M4 9h16M4 14h16M9 4v16M14 4v16"/>',
  cable: '<path d="M3 17c4 0 4-10 9-10s5 10 9 10"/><circle cx="3" cy="17" r="1.5"/><circle cx="21" cy="17" r="1.5"/>',
  jar: '<rect x="6" y="3" width="12" height="4" rx="1"/><rect x="5" y="7" width="14" height="14" rx="2"/><path d="M5 12h14"/>',
  bottle: '<path d="M10 2h4v4l2 3v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3z"/><path d="M8 13h8"/>',
  pill: '<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M9 7l6 10" transform="rotate(0)"/>',
  tube: '<path d="M8 3h8l-1 14H9z"/><path d="M10 17h4v4h-4z"/>',
  drop: '<path d="M12 3c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z"/>',
  leaf: '<path d="M5 19c0-9 6-14 14-14 0 8-5 14-14 14z"/><path d="M5 19l8-8"/>',
  can: '<rect x="6" y="6" width="12" height="15" rx="1"/><path d="M9 6V3h6v3M6 11h12"/>',
  grain: '<path d="M12 21V8"/><path d="M12 8c-3 0-4-2-4-5 3 0 4 2 4 5zM12 8c3 0 4-2 4-5-3 0-4 2-4 5zM12 13c-3 0-4-2-4-5 3 0 4 2 4 5zM12 13c3 0 4-2 4-5-3 0-4 2-4 5z"/>',
  factory: '<path d="M3 21V10l6 4V10l6 4V6h6v15z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  wrench: '<path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 1-2-2z"/>',
  hand: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M8 20h8M12 16v4M8 9h3M8 12h6"/>',
  phone: '<path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  chat: '<path d="M4 20l1.5-4A8 8 0 1 1 9 19z"/><path d="M9 10c1 3 3 5 6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  layers: '<path d="M12 3 2 8l10 5 10-5z"/><path d="M2 13l10 5 10-5"/>'
};
const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;
const WHYI = ['factory', 'check', 'wrench', 'hand'];

/* ---------- sections ---------- */
const NAVS = [['s-hero', 'Products'], ['s-story', 'About us'], ['s-help', 'FAQ'], ['s-con', 'Contact']];
function doorVis(b, big){
  const photo = X.photos && b.photo;
  const lbl = X.m3d && b.m3 ? '3D model, built from photos' : (photo ? b.photoLbl : (b.k === 'Pl' ? b.photoLbl : 'Drawn visual'));
  const cut = !photo && X.cuts && b.cut && !(X.m3d && b.m3) ? `<div class="cut"><img src="${b.cut}" alt="" data-depth="-0.06"></div>` : '';
  return `<canvas data-vis="${b.vis}" data-photo="${photo ? b.photo : ''}" aria-hidden="true"></canvas>${X.m3d && b.m3 ? `<canvas class="hp-3d" data-m3="${b.m3}" aria-label="${esc(b.name)} 3D model"></canvas>` : ''}${cut}<span class="lbl">${esc(lbl)}</span>${b.ext && !big ? `<span class="ext">plasmaright.com ${ic('ext', 'mark')}</span>`.replace('class="mark"', 'style="width:12px;height:12px;vertical-align:-2px"') : ''}`;
}
function layerChips(b){
  return `<div class="clayer cl-specs">${b.specs.map(s => `<span>${esc(s)}</span>`).join('')}</div>
    <div class="clayer cl-ind">${b.ind.map(s => `<span>${esc(s)}</span>`).join('')}</div>
    <div class="clayer cl-how">${b.how.map((s, i) => `${i ? '→' : ''}<b>${esc(s)}</b>`).join(' ')}</div>`;
}
function finderHTML(k, sel){
  const F = H.FINDER[k]; if (!F) return '';
  const r = sel != null ? F.a[sel] : null;
  return `<div class="finder" data-fk="${k}"><div class="q">${esc(F.q)}</div><div class="ch">${F.a.map((a, i) => `<button data-fa="${i}" aria-pressed="${i === sel}">${esc(a[0])}</button>`).join('')}</div>
    ${r ? `<div class="res" aria-live="polite"><span>${esc(r[2])}</span><div class="acts">${r[1].length ? `<button class="linkb" data-add="${r[1].join(',')}">Add ${r[1].map(id => D.P[id].name).join(' / ')} to enquiry</button>` : `<button class="linkb" data-add="simco:${k}:${i18(r[0])}">Add Simco-Ion (${esc(r[0].toLowerCase())}) to enquiry</button>`}${X.drawer && brand(k).products.length ? `<button class="linkb" data-drawer="${k}">See all ${esc(brand(k).name)}</button>` : ''}</div></div>` : ''}</div>`;
}
const i18 = s => s.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
function door(b){
  const [name, desc] = tx(b.k);
  const go = b.ext ? `<a class="go" href="${b.ext}" target="_blank" rel="noopener">Visit plasmaright.com ${ic('ext')}</a>`.replace('<svg class=""', '<svg style="width:14px;height:14px"') : `<span class="go">Explore ${esc(b.name)} <span class="arrow">→</span></span>`;
  return `<article class="door ac-${b.ac}" data-door="${b.k}" tabindex="0" aria-label="${esc(b.name)}: ${esc(name)}">
    <div class="vis">${doorVis(b)}</div>
    <div class="bd"><span class="brand acl"><i class="acbar"></i>${esc(b.name)}</span><h3>${esc(name)}</h3><p>${esc(desc)}</p>
      <div class="subs">${b.subs.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>${layerChips(b)}
      <div class="peek"><div><ul>${b.list.map(l => `<li>${esc(l[0])}<span>${esc(l[1])}</span></li>`).join('')}</ul>${H.FINDER[b.k] ? `<div class="fslot" style="margin-top:8px"><button class="linkb" data-finder="${b.k}">Find the right ${esc(b.name)} in one question</button></div>` : ''}</div></div>
      ${go}</div></article>`;
}
function hero(){
  const v = X.hero;
  let doors;
  if (v === 'd'){
    const b = brand(st.stageSel), [name, desc] = tx(b.k);
    doors = `<div class="stagebox"><div class="picks" role="tablist" aria-label="Product families">${H.BRANDS.map(x => `<button class="pick ac-${x.ac}" role="tab" data-stage="${x.k}" aria-pressed="${x.k === st.stageSel}"><i class="acbar" style="width:6px;height:34px"></i><span><b>${esc(x.name)}</b><small>${esc(tx(x.k)[0])}</small></span><span class="arrow">→</span></button>`).join('')}</div>
      <div class="big ac-${b.ac}" data-door="${b.k}">${doorVis(b, true).replace('<div class="cut">', '<div class="cut">')}<div class="info"><span class="brand acl" style="font:800 12px/1 var(--fM);letter-spacing:.12em;text-transform:uppercase;display:flex;gap:8px;align-items:center;color:#DCE5BD"><i class="acbar"></i>${esc(b.name)}</span><h2 style="color:#F2F4EC">${esc(name)}</h2><p>${esc(desc)}</p><div class="subs" style="display:flex;gap:6px;flex-wrap:wrap">${b.subs.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>${b.ext ? `<a class="btnp" href="${b.ext}" target="_blank" rel="noopener" style="justify-self:start">Visit plasmaright.com</a>` : finderHTML(b.k, null)}</div></div></div>`;
  } else {
    const order = H.BRANDS;
    doors = `<div class="doors" data-v="${v}">${order.map(door).join('')}</div>`;
  }
  return `<section class="sec hero" id="s-hero" data-sec="Products">${X.glow ? '<div class="glow"></div>' : ''}<div class="wrap">
    ${X.motif ? `<div class="hero-bars" data-depth="0.25">${mark()}</div>` : ''}
    <div class="hero-top rv"><div style="display:grid;gap:16px"><span class="eb">${esc(tx('heroEb'))}</span><h1>${esc(tx('heroH'))}</h1></div><div style="display:grid;gap:18px;justify-items:start"><p class="lead">${esc(tx('heroL'))}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btnp" href="#s-con" data-go="s-con">Get a quote <span class="arrow">→</span></a><a class="btng" href="#s-help" data-go="s-help">Help me choose</a></div></div></div>
    <div class="rv" style="display:grid;gap:12px"><span class="eb" style="color:var(--mut)">${esc(tx('doorsQ'))}</span>${doors}</div></div></section>`;
}
function divider(){ return X.dividers ? `<div class="divider" aria-hidden="true">${mark()}${mark()}${mark()}</div>` : ''; }
function sh(eb, h, p){ return `<div class="sh rv"><span class="eb">${esc(eb)}</span><h2>${esc(h)}</h2>${p ? `<p class="lead">${esc(p)}</p>` : ''}</div>`; }
function story(){
  const v = X.story;
  if (v === 'b'){
    const pic = X.photos ? `<img class="ph" src="img/photo-jar50.jpg" alt="Fluxosealer jars labelled Celebrating 50 years on the conveyor" data-depth="0.06">` : `<div style="position:absolute;inset:0;display:grid;place-items:center;background:var(--brand);color:var(--brandInk)">${mark().replace('class="mark "', 'class="mark" style="width:50%"')}</div>`;
    return `<section class="sec" id="s-story" data-sec="Our story"><div class="wrap story-split"><div class="pic rv">${pic}</div><div style="display:grid;gap:18px" class="rv"><span class="eb">${esc(tx('storyEb'))}</span><h2>${esc(tx('storyH'))}</h2><p class="lead">${esc(tx('storyP'))}</p><blockquote>${esc(D.company.motto)}</blockquote><p class="who">Motto of Arshad Electronics · since 1971 · Mahim, Mumbai</p></div></div></section>`;
  }
  if (v === 'c'){
    const panes = [
      `<div class="mkv on">${mark()}</div>`,
      `<img class="ph" src="img/photo-corona-glow.jpg" alt="Violet corona discharge along a treater roller">`,
      `<img class="ph" src="img/photo-fts-mnl.jpg" alt="FTS-MNL corona treater station and control panel">`,
      `<img class="ph" src="img/photo-jar50.jpg" alt="Jars labelled Celebrating 50 years">`,
      `<div class="num"><div><b>10,000+</b>installations in 35+ countries</div></div>`
    ];
    const steps = [
      ['1971', 'Founded in Mumbai', 'Built on solid fundamentals of the late Mr. A G Moolji, Arshad Electronics carries his legacy of precision and quality.', 'Quality only happens when you care enough to do your best.', true],
      ['What we do', 'Corona treaters, cap sealers and static control', 'Fluxomatic corona discharge treaters achieve better bonding for long-lasting printability and lamination. Fluxosealer induction cap sealers keep your product fresh, safe and secure.', 'Alongside them we offer Simco-Ion static eliminators. We provide the best solutions for printing and packaging.'],
      ['Made here', 'Designed and built in-house', 'Our manufacturing plant consists of 10,000 sq feet of production area, with dedicated areas for R&D as well as wiring and assembly.', 'In-house manufacturing gives us greater power over quality assurance and build times, and a well documented quality control process ensures the best possible final product.'],
      ['50 years', 'Fifty years of excellence', 'We are a quality driven company with fast and reliable service, celebrating 50 years of excellence in corona surface treaters and induction cap sealers.', 'Our easy to use systems ensure that you get the best user experience with our machines.'],
      ['Today', 'Running worldwide', 'Our presence is spread worldwide: we have over 10,000 successful installations, both local and international, in more than 35 countries.', 'Our customer service department is available to you at all times, and our highly qualified service engineers provide support on a global scale.']
    ];
    return `<section class="sec" id="s-story" data-sec="Our story"><div class="wrap">${sh(tx('storyEb'), tx('storyH'), tx('storyP'))}<div class="chap"><div class="stick" data-panes>${panes.map((p, i) => p.replace(/^<(\w+) class="/, `<$1 data-pane="${i}" class="${i === 0 ? '' : ''}`).replace('class="mkv on"', 'class="mkv on"')).join('')}</div><div class="steps">${steps.map((s, i) => `<div class="step${i ? '' : ' on'}" data-step="${i}"><span class="yr">${esc(s[0])}</span><h3 style="font-size:clamp(22px,2.4cqi,30px)">${esc(s[1])}</h3><p class="lead">${esc(s[2])}</p>${s[3] ? `<p class="more${s[4] ? ' q' : ''}">${esc(s[3])}</p>` : ''}</div>`).join('')}</div></div></div></section>`;
  }
  return `<section class="sec" id="s-story" data-sec="Our story"><div class="wrap">${sh(tx('storyEb'), tx('storyH'), tx('storyP'))}
    <div class="tl rv"><svg class="line" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12H1000" pathLength="1" style="--len:1"/></svg>${H.STORY.map(m => `<div class="ms${m.todo ? ' todo' : ''}"><span class="yr">${esc(m.yr)}</span><h3>${esc(m.t)}</h3><p>${esc(m.p)}</p>${m.todo ? '<span class="needs">Needs date from Arshad</span>' : ''}</div>`).join('')}</div></div></section>`;
}
const NUMS = [[10000, '+', 'installations worldwide'], [35, '+', 'countries'], [10000, ' sq ft', 'manufacturing plant in Mumbai'], [1971, '', 'founded', true]];
const fmtN = n => n[3] ? String(n[0]) : n[0].toLocaleString('en-IN');
const numHTML = n => `<div class="num"><b><span ${n[3] ? '' : `data-count="${n[0]}"`}>${fmtN(n)}</span>${n[1] ? `<small>${esc(n[1].trim())}</small>` : ''}</b><span>${esc(n[2])}</span></div>`;
function proof(){
  const v = X.proof;
  const head = sh(tx('proofEb'), tx('proofH'));
  if (v === 'b') return `<section class="sec band" id="s-proof" data-sec="Numbers"><div class="wrap globe-wrap"><div class="globe rv"><canvas data-globe aria-label="Dot globe with Mumbai marked"></canvas></div><div>${head}<div class="gnums">${NUMS.slice(0, 3).map(numHTML).join('')}</div><p class="needs" style="margin-top:14px">Country markers need Arshad’s list of 35+ countries</p></div></div></section>`;
  if (v === 'c'){ const it = NUMS.map(n => `<div class="it">${mark()}<b>${fmtN(n)}${esc(n[1])}</b><span>${esc(n[2])}</span></div>`).join(''); return `<section class="sec band" id="s-proof" data-sec="Numbers"><div class="wrap">${head}</div><div class="ticker rv" aria-label="10,000+ installations, 35+ countries, 10,000 sq ft plant, founded 1971"><div class="tr">${it}${it}</div></div></section>`; }
  return `<section class="sec band" id="s-proof" data-sec="Numbers"><div class="wrap">${head}<div class="nums rv">${NUMS.map(numHTML).join('')}</div></div></section>`;
}
function industries(){
  const v = X.ind, B = H.BRANDS;
  const dots = s => B.filter(b => s.split(' ').includes(b.ac === 'P' ? 'P' : b.k)).map(b => `<i class="dot ac-${b.ac}" title="${esc(b.name)}"></i>`).join('');
  let body;
  if (v === 'b') body = `<div class="mtxw rv"><table class="mtx"><thead><tr><th>Industry</th>${B.map(b => `<th class="ac-${b.ac}">${esc(b.name)}</th>`).join('')}</tr></thead><tbody>${H.INDUSTRIES.map(r => `<tr><td>${esc(r[0])}</td>${B.map(b => `<td class="ac-${b.ac}">${r[1].split(' ').includes(b.ac === 'P' ? 'P' : b.k) ? '<i class="dot"></i>' : ''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  else if (v === 'c') body = `<div class="tiles rv">${H.INDUSTRIES.map(r => `<div class="tile">${ic(r[2])}<b>${esc(r[0])}</b><span class="ds">${dots(r[1])}</span></div>`).join('')}</div>`;
  else body = `<div class="rv"><div class="chips" role="group" aria-label="Filter by industry">${H.INDUSTRIES.map((r, i) => `<button class="chip" data-ind="${i}" aria-pressed="false">${esc(r[0])}</button>`).join('')}</div>
    <div class="ind-out">${B.map(b => `<div class="ind-b ac-${b.ac}" data-ib="${b.ac === 'P' ? 'P' : b.k}"><span class="brand acl" style="font:800 11px/1 var(--fM);letter-spacing:.12em;text-transform:uppercase;display:flex;gap:8px;align-items:center"><i class="acbar"></i>${esc(b.name)}</span><b>${esc(tx(b.k)[0])}</b><small>${esc(b.ind.join(' · '))}</small></div>`).join('')}</div></div>`;
  return `<section class="sec" id="s-ind" data-sec="Industries"><div class="wrap">${sh(tx('indEb'), tx('indH'))}${body}</div></section>`;
}
function why(){
  const v = X.why, W = tx('why');
  const four = `<div class="why4 rv">${W.map((w, i) => `<div class="wy">${ic(WHYI[i])}<h3>${esc(w[0])}</h3><p>${esc(w[1])}</p></div>`).join('')}</div>`;
  if (v === 'b'){
    const pic = X.photos ? `<img class="ph" src="img/raw-kabra-electrode.jpg" alt="Looking down inside an FTS-MML electrode station" data-depth="0.06"><span class="cap">Inside an FTS-MML station</span>` : `<div style="position:absolute;inset:0;display:grid;place-items:center;color:var(--brandTx)">${mark().replace('class="mark "', 'class="mark" style="width:44%"')}</div>`;
    return `<section class="sec" id="s-why" data-sec="Why Arshad"><div class="wrap why-split"><div class="pic rv">${pic}</div><div>${sh(tx('whyEb'), tx('whyH'))}<div class="why-list rv">${W.map((w, i) => `<div>${ic(WHYI[i])}<div><h3>${esc(w[0])}</h3><p>${esc(w[1])}</p></div></div>`).join('')}</div></div></div></section>`;
  }
  if (v === 'c') return `<section class="sec" id="s-why" data-sec="Why Arshad"><div class="wrap"><span class="eb rv">${esc(tx('whyEb'))}</span><p class="motto rv" style="margin-top:14px">Quality only happens when you <em>care enough</em> to do your best.</p>${four}</div></section>`;
  return `<section class="sec" id="s-why" data-sec="Why Arshad"><div class="wrap">${sh(tx('whyEb'), tx('whyH'))}${four}</div></section>`;
}
const lgi = (n, extra = '') => { const f = H.LOGO[n]; return X.logos && f ? `<div class="lgi" ${extra} title="${esc(n)}"><img src="img/logos/${f}.png" alt="${esc(n)}" loading="lazy"></div>` : `<div class="lgi txt" ${extra}>${esc(n)}</div>`; };
function clients(){
  const v = X.cli, F = H.CLIENTS.filter(c => c[1] === 'F'), Sx = H.CLIENTS.filter(c => c[1] === 'S');
  let body;
  if (v === 'b'){ const half = Math.ceil(H.CLIENTS.length / 2), r1 = H.CLIENTS.slice(0, half), r2 = H.CLIENTS.slice(half); const row = (r, rev) => `<div class="tr${rev ? ' rev' : ''}">${[...r, ...r].map(c => lgi(c[0])).join('')}</div>`; body = `<div class="mq rv">${row(r1)}${row(r2, 1)}</div>`; }
  else if (v === 'c'){ const secs = ['All', ...new Set(H.CLIENTS.map(c => c[2]))]; body = `<div class="rv"><div class="cl-f" role="group" aria-label="Filter clients">${secs.map((s, i) => `<button class="chip" data-cf="${esc(s)}" aria-pressed="${!i}">${esc(s)}</button>`).join('')}</div><div class="lg">${H.CLIENTS.map(c => lgi(c[0], `data-sector="${esc(c[2])}"`)).join('')}</div><p class="needs" style="margin-top:12px">Sector groups are ours, for the filter</p></div>`; }
  else body = `<div class="cl-split rv"><div class="cl-col ac-F"><h3><i class="acbar"></i>Corona treaters</h3><div class="lg">${F.map(c => lgi(c[0])).join('')}</div></div><div class="cl-col ac-S"><h3><i class="acbar"></i>Induction cap sealers</h3><div class="lg">${Sx.map(c => lgi(c[0])).join('')}</div></div></div>`;
  return `<section class="sec" id="s-cli" data-sec="Clients"><div class="wrap">${sh(tx('cliEb'), tx('cliH'))}${body}</div></section>`;
}
function partners(){
  const go = p => `href="${p[2]}" target="_blank" rel="noopener" aria-label="${esc(p[0])} (opens their website)"`;
  const body = X.par === 'b' ? `<div class="par-row rv">${H.PARTNERS.map(p => `<a class="par-l" ${go(p)}>${lgi(p[0])}</a>`).join('')}</div>`
    : `<div class="pars rv">${H.PARTNERS.map(p => `<a class="par" ${go(p)}>${lgi(p[0])}<span class="par-k">${esc(p[1])}</span><span class="par-u">${esc(p[3])} <span aria-hidden="true">↗</span></span></a>`).join('')}</div>`;
  return `<section class="sec" id="s-par" data-sec="Partners"><div class="wrap">${sh(tx('parEb'), tx('parH'), tx('parP'))}${body}</div></section>`;
}
/* wizard */
const W1 = [['film', 'Plastic film', 'blown, cast, BOPP, multilayer'], ['pack', 'Printed or laminated packaging', 'on a printing or laminating machine'], ['woven', 'Woven sacks or fabric', 'up to 5100 mm wide'], ['parts', 'Moulded parts, pipes or cables', 'before printing'], ['bottle', 'Filled bottles or jars', 'food, pharma, oil, chemicals'], ['textile', 'Textiles or grains', 'plasma treatment']];
function wizStep2(a){
  if (a === 'film') return [['Blown film, printing', ['mnl', 'mnlaba']], ['Blown film, lamination', ['mml', 'mmlibc']], ['Static or dust on the film', 'I']];
  if (a === 'pack') return [['Non-conductive film', ['ncf']], ['Conductive or metallised film', ['cmbr']], ['Static or dust while printing', 'I']];
  if (a === 'bottle') return H.FINDER.X.a.map(x => [x[0], x[1]]);
  if (a === 'parts') return [['Flat moulded parts or pipes', ['3d']], ['Cables for ink-jet printing', ['cbl']]];
  if (a === 'woven') return [['Lamination, coating or printing', ['ws']]];
  return [['Textiles or grains', 'P']];
}
function wizard(){
  const stp = st.wiz.step, pb = `<div class="pbar">${[0, 1, 2].map(i => `<i class="${i <= stp ? 'on' : ''}"></i>`).join('')}</div>`;
  let inner;
  if (stp === 0) inner = `<span class="stp">Step 1 of 3</span><div class="qq">What do you make or pack?</div><div class="ch">${W1.map(o => `<button data-w1="${o[0]}">${esc(o[1])}<small>${esc(o[2])}</small></button>`).join('')}</div>`;
  else if (stp === 1) inner = `<span class="stp">Step 2 of 3 · ${esc(W1.find(o => o[0] === st.wiz.a)[1])}</span><div class="qq">Which fits best?</div><div class="ch">${wizStep2(st.wiz.a).map((o, i) => `<button data-w2="${i}">${esc(o[0])}</button>`).join('')}</div><div><button class="linkb" data-wback>← Back</button></div>`;
  else {
    const o = wizStep2(st.wiz.a)[st.wiz.b], ids = Array.isArray(o[1]) ? o[1] : [];
    const res = ids.length ? ids.map(id => { const p = D.P[id]; return `<div class="rs">${X.cuts && p.img && p.img !== 'null' ? `<img src="img/${p.img}" alt="">` : `<span style="width:60px;color:var(--brandTx)">${mark()}</span>`}<div><b style="font-family:var(--fH);font-size:18px">${esc(p.name)}</b><div style="color:var(--mut);font-size:14px">${esc(p.desc)}</div></div></div>`; }).join('')
      : o[1] === 'I' ? `<div class="rs"><span style="width:60px;color:var(--acI)">${ic('layers')}</span><div><b style="font-family:var(--fH);font-size:18px">Simco-Ion static control</b><div style="color:var(--mut);font-size:14px">IQ Power (static neutralising system) or IQ Easy (ionising bar). Arshad is an authorised Simco-Ion distributor in India.</div></div></div>`
      : `<div class="rs"><span style="width:60px;color:var(--acP)">${ic('grain')}</span><div><b style="font-family:var(--fH);font-size:18px">Plasmaright</b><div style="color:var(--mut);font-size:14px">Plasma treaters for textiles and grains, on their own site.</div></div></div>`;
    const add = ids.length ? `<button class="btnp" data-add="${ids.join(',')}">Add to enquiry</button>` : o[1] === 'I' ? `<button class="btnp" data-add="simco:st.wiz:${i18(o[0])}">Add to enquiry</button>` : `<a class="btnp" href="https://plasmaright.com/" target="_blank" rel="noopener">Visit plasmaright.com</a>`;
    inner = `<span class="stp">Step 3 of 3 · your answer</span><div class="qq">We’d start with</div><div class="out">${res}</div><div class="acts">${add}<button class="btng" data-wreset>Start again</button></div>`;
  }
  return `<div class="wiz" id="wiz">${pb}${inner}</div>`;
}
function faqHTML(){
  const all = [...D.faq.corona.map(f => [...f, 'Corona treaters']), ...D.faq.sealing.map(f => [...f, 'Induction sealers'])];
  return `<div><input class="fq-s" type="search" id="fqs" placeholder="Search questions (e.g. dyne, foil, speed)" aria-label="Search FAQ"><div class="faqs" id="faqs">${all.map((f, i) => `<details${i ? '' : ' open'} data-q="${esc((f[0] + ' ' + f[1]).toLowerCase())}"><summary><span>${esc(f[0])}<span class="fb">${esc(f[2])}</span></span></summary><p>${esc(f[1])}</p></details>`).join('')}</div></div>`;
}
function help(){
  const v = X.help, head = sh(tx('helpEb'), tx('helpH'));
  const body = v === 'a' ? `<div class="rv">${wizard()}</div>` : v === 'b' ? `<div class="rv">${faqHTML()}</div>` : `<div class="help2 rv"><div>${wizard()}</div>${faqHTML()}</div>`;
  return `<section class="sec" id="s-help" data-sec="Help me choose"><div class="wrap">${head}${body}</div></section>`;
}
function enquiryText(){
  if (!bk().length) return '';
  return 'Hello Arshad team,\n\nI would like a quote for:\n' + bk().map(e => '- ' + e.name).join('\n') + '\n\nMaterial / container:\nWidth or cap size:\nLine speed:\n\nThanks,';
}
function details(){
  const c = D.company;
  return `<div class="det"><div class="ln"><small>Sales</small><div><span>${esc(c.email)}</span><button class="cpy" data-copy="${esc(c.email)}">Copy</button></div></div>
    <div class="ln"><small>Phone</small>${c.phones.map(p => `<div><span>${esc(p)}</span><button class="cpy" data-copy="${esc(p)}">Copy</button></div>`).join('')}</div>
    <div class="ln"><small>Factory & office</small><div>${esc(c.addr)}</div></div></div>`;
}
function form(short){
  const opts = ['Not sure yet', ...H.BRANDS.map(b => b.name)];
  return `<form class="form" id="enqForm" novalidate>
    <label>Name<input id="f-name" autocomplete="name" required></label>${short ? '' : '<label>Company<input id="f-co" autocomplete="organization"></label>'}
    <label>Email<input id="f-mail" type="email" autocomplete="email" required></label>${short ? '' : '<label>Phone<input id="f-ph" type="tel" autocomplete="tel"></label>'}
    ${short ? '' : `<label class="f">Product family<select id="f-prod">${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>`}
    <label class="f">Message<textarea id="f-msg" placeholder="Material, width and line speed, or container and cap size">${esc(enquiryText())}</textarea></label>
    <div class="acts"><button class="btnp" type="submit">Send enquiry</button><span class="ok" id="f-ok" aria-live="polite">${bk().length ? `${bk().length} item${bk().length > 1 ? 's' : ''} from your enquiry list added to the message.` : ''}</span></div></form>`;
}
function contact(){
  const v = X.con;
  if (v === 'b') return `<section class="sec band" id="s-con" data-sec="Contact"><div class="wrap cta rv"><div style="display:grid;gap:14px"><span class="eb">${esc(tx('conEb'))}</span><h2>${esc(tx('conH'))}</h2><p class="lead">${esc(tx('conP'))}</p></div><div style="display:grid;gap:14px"><div class="mini"><span>${esc(D.company.email)}</span><span>+91 90046 17373 · +91 22 2445 1709</span></div><div class="acts"><button class="btnp" data-copy="${esc(D.company.email)}">Copy email</button><button class="btng" data-copy="+91 90046 17373">Copy phone</button><a class="btng" href="#s-help" data-go="s-help">Help me choose</a></div>${bk().length ? `<p class="mini">In your enquiry: ${bk().map(e => esc(e.name)).join(', ')}</p>` : ''}</div></div></section>`;
  if (v === 'c') return `<section class="sec" id="s-con" data-sec="Contact"><div class="wrap">${sh(tx('conEb'), tx('conH'), tx('conP'))}<div class="mapc rv"><canvas data-map aria-label="Drawn map of Mahim, Mumbai"></canvas><div class="card2">${details()}${form(true)}</div></div></div></section>`;
  return `<section class="sec" id="s-con" data-sec="Contact"><div class="wrap">${sh(tx('conEb'), tx('conH'), tx('conP'))}<div class="con rv">${details()}${form()}</div></div></section>`;
}
return { set X(v){ X = v; }, get X(){ return X; }, st, tx, brand, esc, mark, ic, I, WHYI, NUMS, numHTML, lgi, door, doorVis, layerChips, finderHTML, hero, divider, sh, story, proof, industries, why, clients, partners, W1, wizStep2, wizard, faqHTML, help, enquiryText, details, form, contact, i18 };
})();
