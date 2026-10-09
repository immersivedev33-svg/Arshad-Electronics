/* Arshad Site Lab: router, page renderers, product-page composition, effects and visitor helpers.
   The lab drawer, panels and saving live in site-lab.js and talk to this file through window.SITE. */
(() => {
'use strict';
const H = window.HD, D = window.PD, SDX = window.SD, U = window.PU, SH = window.SH, PB = window.PB;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = SH.esc;
const site = $('#site'), bgc = $('#bgc'), veil = $('#veil'), ovl = $('#ovl'), ptrans = $('#ptrans');
const PG = id => SDX.PAGES.find(p => p.id === id);
const BUILD = id => PB.BUILDS.find(b => b.id === id);
const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const P2PG = { mnl: 'films', mnlaba: 'films', mml: 'films', mmlibc: 'films', cmbr: 'films', ncf: 'films', ws: 'woven', '3d': 'objects', cbl: 'objects', brezop: 'brezo', brezoa: 'brezo', brezo2: 'brezo', brezo3: 'brezo', aurae3: 'aurae', iqpower: 'simco', iqeasy: 'simco' };
const MAINP = { films: 'mml', woven: 'ws', objects: '3d', brezo: 'brezo3', aurae: 'aurae3', simco: 'iqpower' };
const HUBOF = { F: 'fluxomatic', S: 'fluxosealer', I: 'simco' };
const store = { get(k, d){ try { const v = localStorage.getItem('arshad-site-' + k); return v == null ? d : JSON.parse(v); } catch (e){ return d; } }, set(k, v){ try { localStorage.setItem('arshad-site-' + k, JSON.stringify(v)); } catch (e){} } };

/* ---------- state (owned here, edited by the lab drawer) ---------- */
const ST = { S: Object.assign({}, SDX.DEFAULTS), pins: {}, feat: {}, cur: 'home', visitor: {} };
const featOff = id => new Set(ST.feat[id] || []);
const eff = id => Object.assign({}, ST.S, ST.pins[id] || {}, ST.visitor);
let X = eff('home');
const motionEff = () => X.motion === 'full' && reduceMQ ? 'subtle' : X.motion;

/* product builds render without their own nav, crumbs and footer: the site provides those */
U.nav = () => ''; U.footer = () => ''; U.crumbs = () => '';
const origStage3d = U.stage3d;

/* ---------- shared bits ---------- */
const mark = SH.mark, ic = SH.ic;
const I2 = { clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', type: '<path d="M4 7V5h11v2M9.5 5v14M7 19h5"/><path d="M14 12v-1.5h7V12M17.5 10.5V19M16 19h3"/>', share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>', compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>', up: '<path d="M12 19V5M6 11l6-6 6 6"/>', callb: '<path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/><path d="M15 3a6 6 0 0 1 6 6M15 7a2 2 0 0 1 2 2"/>' };
const ic2 = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I2[n] || SH.I[n] || ''}</svg>`;
const pl = (id, inner, extra = '') => `<a href="${DRAFT.href(id)}" data-page="${id}" ${extra}>${inner}</a>`;
const famOf = id => (PG(id) || {}).fam || null;
const pageCut = id => { const p = PG(id); return p && p.cut ? 'img/' + p.cut : null; };
const sec = (cls, id, label, inner, extra = '') => `<section class="psec ${cls}" id="${id}" data-sec="${esc(label)}" ${extra}><div class="wrap">${inner}</div></section>`;
const SHd = (eb, h, p) => SH.sh(eb, h, p);

/* ---------- header + footer (every page) ---------- */
function megaPanel(){
  const thumbs = X.mega;
  const item = id => { const p = PG(id), m = D.P[MAINP[id]]; return pl(id, `${thumbs ? (p.cut ? `<img src="img/${p.cut}" alt="" loading="lazy">` : `<span class="ph0">${mark()}</span>`) : ''}<span><b>${esc(p.t)}</b><small>${esc(m ? m.sub || '' : '')}</small></span>`, thumbs ? '' : 'style="grid-template-columns:1fr"'); };
  const col = (fam, hub, label, ids) => `<div class="col" style="--fam:var(--fam${fam})"><b><i class="fambar"></i>${hub ? pl(hub, esc(label), 'style="display:inline;padding:0;color:inherit"') : esc(label)}</b>${ids.map(item).join('')}</div>`;
  return `<div class="megap" id="megap" hidden><div class="wrap">${col('F', 'fluxomatic', 'Fluxomatic', ['films', 'woven', 'objects'])}${col('S', 'fluxosealer', 'Fluxosealer', ['brezo', 'aurae'])}${col('I', null, 'Simco-Ion', ['simco'])}
    <div class="col" style="--fam:var(--famP)"><b><i class="fambar"></i>Plasmaright</b><a href="https://plasmaright.com/" target="_blank" rel="noopener" style="grid-template-columns:1fr"><span><b>Plasma treaters ↗</b><small>Textiles and grains, on plasmaright.com</small></span></a></div></div></div>`;
}
function siteHeader(){
  const v = X.hdr, n = U.shortlist.length;
  const strip = v !== 'b' ? `<div class="strip"><div class="wrap"><span>${esc(SH.tx('heroEb'))}</span><span>${esc(SDX.CONTACT.emails[0])}</span><span>${esc(SDX.CONTACT.mobile)}</span></div></div>` : '';
  const navs = [['about', 'About us'], ['clients', 'Clients'], ['faq', 'FAQ'], ['contact', 'Contact']];
  const prodCur = ['fluxomatic', 'fluxosealer', ...SDX.PRODUCT_ORDER].includes(ST.cur);
  return `<header class="shdr" data-v="${v}">${strip}<div class="wrap bar">
    <a class="logo" href="${DRAFT.href('home')}" data-page="home" aria-label="Arshad Electronics home"><span class="logoimg" role="img" aria-label="Arshad Electronics Pvt. Ltd."></span></a>
    <nav class="snav" id="snav" aria-label="Site">
      <button type="button" data-mega aria-expanded="false" aria-controls="megap"${prodCur ? ' aria-current="page"' : ''}>Products ▾</button>
      ${navs.map(([id, t]) => pl(id, t, ST.cur === id ? 'aria-current="page"' : '')).join('')}
      ${X.quiz ? '<button type="button" data-quiz>Which machine?</button>' : ''}
      ${X.search ? `<button type="button" class="ibtn" data-search aria-label="Search (/)">${ic('search')}</button>` : ''}
      ${X.recent ? `<button type="button" class="ibtn" data-recent aria-label="Recently viewed">${ic2('clock')}</button>` : ''}
      ${(X.vtheme || X.contrast || X.textsize !== 100 || true) ? `<button type="button" class="ibtn" data-comfort aria-label="Display and comfort settings">${ic2('type')}</button>` : ''}
      ${X.lang ? `<button type="button" class="ibtn" data-lang aria-label="Language">${ic2('globe')}</button>` : ''}
      ${X.basket ? `<button type="button" class="ibtn" data-basket aria-label="Shortlist, ${n} items">${ic2('star')}${n ? `<span class="hcount">${n}</span>` : ''}</button>` : ''}
      ${pl('contact', 'Get a quote', 'class="quote btnp" style="padding:10px 14px"')}
    </nav>
    ${I18N.switcher()}<button class="burger" data-burger aria-expanded="false" aria-controls="snav">Menu</button></div>${megaPanel()}</header>`;
}
/* the nav folds into the Menu button whenever it does not fit in the bar, so items never run into the logo or each other */
function fitHeader(){
  const h = $('.shdr', site); if (!h) return;
  const bar = $('.bar', h), nav = $('#snav', h), wasOpen = nav.classList.contains('open');
  h.classList.remove('compact'); nav.classList.remove('open');
  const logo = $('.logo', bar), need = logo.offsetWidth + nav.scrollWidth + ($('.langs', bar)?.offsetWidth || 0) + 42, room = bar.clientWidth - (parseFloat(getComputedStyle(bar).paddingLeft) || 0) - (parseFloat(getComputedStyle(bar).paddingRight) || 0);
  const compact = need > room;
  h.classList.toggle('compact', compact);
  if (compact && wasOpen) nav.classList.add('open');
  $('[data-burger]', h).setAttribute('aria-expanded', nav.classList.contains('open'));
}
let megaAt = 0;
function closeMega(){ const m = $('#megap', site); if (m && !m.hidden){ m.hidden = true; $('[data-mega]', site)?.setAttribute('aria-expanded', 'false'); } }
function openMega(){ const m = $('#megap', site); if (!m) return; m.hidden = false; megaAt = performance.now(); $('[data-mega]', site)?.setAttribute('aria-expanded', 'true'); $('.hdrpop', site)?.remove(); }
/* the "Mega menu" header opens on hover as well as on click */
function megaHover(){
  if (X.hdr !== 'c' || !matchMedia('(hover:hover)').matches) return;
  const h = $('.shdr', site), btn = $('[data-mega]', h), m = $('#megap', h); let tm = 0;
  const open = () => { clearTimeout(tm); if (!h.classList.contains('compact') && m.hidden) openMega(); }, close = () => { clearTimeout(tm); tm = setTimeout(closeMega, 240); };
  btn.addEventListener('pointerenter', open); btn.addEventListener('pointerleave', close);
  m.addEventListener('pointerenter', () => clearTimeout(tm)); m.addEventListener('pointerleave', close);
}
function crumbs(){
  if (!X.crumbs || ST.cur === 'home') return '';
  const p = PG(ST.cur); const parts = [pl('home', 'Home')];
  if (p.parent) parts.push(pl(p.parent, esc(PG(p.parent).t)));
  parts.push(`<b>${esc(p.t)}</b>`);
  return `<div class="wrap scrumb">${parts.join(' / ')}</div>`;
}
function siteFooter(){
  const C = SDX.CONTACT;
  return `<footer class="ftr"><div class="wrap"><div class="fl"><span class="logoimg light" role="img" aria-label="Arshad Electronics Pvt. Ltd."></span><p>${esc(D.company.motto)}</p><p style="margin-top:8px">Service centres: ${SDX.ABOUT.centres.join(' · ')}</p></div>
    <div><h4>Products</h4><ul>${[['fluxomatic', 'Fluxomatic'], ['films', '· Blown / cast film'], ['woven', '· Woven fabric'], ['objects', '· 3D objects & cables'], ['fluxosealer', 'Fluxosealer'], ['brezo', '· Brezo series'], ['aurae', '· Aurae series'], ['simco', 'Simco-Ion']].map(([id, t]) => `<li>${pl(id, esc(t))}</li>`).join('')}<li><a href="https://plasmaright.com/" target="_blank" rel="noopener">Plasmaright ↗</a></li></ul></div>
    <div><h4>Company</h4><ul>${[['about', 'About us'], ['clients', 'Clients'], ['faq', 'FAQ'], ['contact', 'Contact']].map(([id, t]) => `<li>${pl(id, t)}</li>`).join('')}</ul></div>
    <div><h4>Contact</h4><ul>${C.emails.map(e => `<li><a href="mailto:${esc(e)}">${esc(e)}</a></li>`).join('')}${[...C.phones, C.mobile].map(p => `<li><a href="tel:${p.replace(/[^+\d]/g, '')}">${esc(p)}</a></li>`).join('')}</ul></div>
    <div class="base"><span>© Arshad Electronics Pvt. Ltd. · Mahim, Mumbai · since 1971</span>${X.keys ? `<span><button class="rm" data-rm>${motionEff() === 'off' ? 'Turn motion on' : 'Reduce motion'}</button> · Press ? for shortcuts</span>` : ''}</div></div></footer>`;
}

/* ---------- shared section builders for the new pages ---------- */
function timeline(v){
  const T = SDX.TIMELINE;
  if (v === 'chapters') return `<div class="tlx" data-v="chapters"><div class="big" aria-live="polite"><div><b id="tlBig">${T[0][0]}</b><span id="tlTxt">${esc(T[0][1])}</span></div></div><ol>${T.map((m, i) => `<li data-tl="${i}"${i ? '' : ' class="on"'}><b>${m[0]}</b><p>${esc(m[1])}</p></li>`).join('')}</ol></div>`;
  return `<div class="tlx rv" data-v="${v}"><ol>${T.map(m => `<li><b>${m[0]}</b><p>${esc(m[1])}</p></li>`).join('')}</ol></div>`;
}
function quotes(v){ return `<div class="quotes rv" data-v="${v}">${SDX.TESTIMONIALS.map(q => `<figure><blockquote>${esc(q[0])}</blockquote><figcaption><b>${esc(q[1])}</b> · ${esc(q[2])}</figcaption></figure>`).join('')}</div>`; }
function numsRow(arr){ return `<div class="nums rv">${arr.map(n => `<div class="num"><b><span data-cnt="${n[0]}">${n[0].toLocaleString('en-IN')}</span>${n[1] ? `<small>${esc(n[1])}</small>` : ''}</b><span>${esc(n[2])}</span></div>`).join('')}</div>`; }
function seriesCards(ids, v){
  const card = id => { const p = PG(id), m = D.P[MAINP[id]] || {}; const spec = (m.spec || []).filter(s => s[1] && !s[2]).slice(0, 2).map(s => s[1]).join(' · ');
    return `<a class="scard tiltc" href="${DRAFT.href(id)}" data-page="${id}" data-qv="${id}"><span class="im">${p.cut ? `<img src="img/${p.cut}" alt="" loading="lazy" class="zoomable">` : `<span style="width:40%;color:var(--brandTx)">${mark()}</span>`}</span><span class="bd"><span class="eb" style="color:var(--fam)">${esc(PG(p.parent || id).t)}</span><h3>${esc(p.t)}</h3><p>${esc(m.desc || m.sub || '')}</p>${spec ? `<p style="font-family:var(--fM);font-size:13px">${esc(spec)}</p>` : ''}<span class="go">Open ${esc(p.t)} <span class="arrow">→</span></span></span></a>`; };
  if (v === 'rail') return `<div class="srail" data-pin="${X.srail && motionEff() !== 'off' ? 1 : 0}"><div class="sticky"><div class="track">${ids.map(card).join('')}</div></div></div>`;
  return `<div class="series" data-v="${v}">${ids.map(card).join('')}</div>`;
}
function logoWall(fam){ const L = H.CLIENTS.filter(c => !fam || c[1] === fam); return `<div class="lg">${L.map(c => SH.lgi(c[0])).join('')}</div>`; }
function visCanvas(kind, photo, label){ return `<canvas data-vis="${kind}" data-photo="${X.photos && photo ? photo : ''}" aria-hidden="true"></canvas><span class="lbl">${esc(label)}</span>`; }

/* ---------- pages ---------- */
function pgHome(){
  const S = SH;
  let story = S.story();
  if (X.story === 'a') story = `<section class="sec" id="s-story" data-sec="Our story"><div class="wrap">${SHd(S.tx('storyEb'), S.tx('storyH'), S.tx('storyP'))}${timeline('rail')}</div></section>`;
  return S.hero() + S.divider() + story + S.divider() + S.proof() + S.industries() + S.divider() + S.why() + S.clients() + S.partners() + S.divider() + S.help() + S.contact();
}
function pgHub(id){
  const Hb = SDX.HUBS[id], fam = Hb.fam, photo = fam === 'F' ? 'img/corona-hero.jpg' : 'img/jars-hero.jpg', fx = fam === 'F' ? 'corona' : 'induction';
  const hv = X.hubHero;
  const hero = `<section class="psec hubsec" id="h-hero" data-sec="${esc(PG(id).t)}" data-hero><div class="wrap hubwrap" data-v="${hv}"><div class="hubhero" data-v="${hv}">
      <div class="txt" style="display:grid;gap:16px"><span class="eb" style="color:var(--fam)">${esc(Hb.brand)}</span><h1>${esc(Hb.h)}</h1><p class="lead">${esc(Hb.lede)}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btnp" href="#h-series">See the series <span class="arrow">→</span></a>${pl('contact', 'Get a quote', 'class="btng"')}</div></div>
      <div class="vis">${visCanvas(fx, photo, X.photos ? (fam === 'F' ? 'Corona discharge, real photo' : 'Jars under the sealing head') : 'Drawn visual')}</div></div></div></section>`;
  const intro = sec('', 'h-intro', 'Overview', `<div class="two"><div>${SHd(Hb.brand, fam === 'F' ? 'Better bonding for long-lasting printability' : 'The perfect induction seal')}</div><div class="prose rv">${Hb.intro.map(p => `<p>${esc(p)}</p>`).join('')}</div></div>`);
  const series = sec('', 'h-series', 'Series', `${SHd('Series', fam === 'F' ? 'Three ways to treat' : 'Air-cooled or water-cooled')}${seriesCards(Hb.series, X.hubSeries)}`);
  const apps = sec('band', 'h-apps', 'Applications', `${SHd('Applications', fam === 'F' ? 'Types of applications for corona treatment' : 'Types of applications for induction sealing')}<div class="chiprow rv">${Hb.apps.map(a => `<span>${esc(a)}</span>`).join('')}</div>`);
  const what = sec('', 'h-what', Hb.whatTitle, `<div class="two"><div>${SHd(fam === 'F' ? 'Substrates' : 'Advantages', Hb.whatTitle, Hb.what)}</div>${fam === 'F' ? `<div class="chiprow rv">${Hb.subs.map(a => `<span>${esc(a)}</span>`).join('')}</div>` : `<div class="adv rv">${Hb.advantages.map(a => `<div>${esc(a)}</div>`).join('')}</div>`}</div>`);
  const cli = sec('', 'h-clients', 'Clients', `${SHd('Clients', 'Our esteemed clients')}${logoWall(fam)}`);
  const cta = sec('band', 'h-cta', 'Contact', `<div class="cta"><div style="display:grid;gap:12px"><span class="eb">Next step</span><h2>${fam === 'F' ? 'Tell us your film, width and speed' : 'Tell us your container and cap size'}</h2></div><div class="acts">${pl('contact', 'Get a quote', 'class="btnp"')}${pl('faq', 'Read the FAQ', 'class="btng"')}</div></div>`);
  return hero + intro + series + apps + what + cli + cta;
}
function pgAbout(){
  const A = SDX.ABOUT;
  return `<section class="psec pghead" id="a-head" data-sec="About us" data-hero><div class="wrap"><span class="eb">${esc(A.eb)}</span><h1>${esc(A.h)}</h1><p class="lead">${esc(A.history)}</p></div></section>` +
    sec('', 'a-focus', 'Our focus', `<div class="two"><div class="prose rv"><p>${esc(A.focus)}</p><p>${esc(A.motto)}</p><p>${esc(A.expertise)}</p></div><div style="display:grid;gap:14px;align-content:start"><span class="eb">We focus on ensuring</span><div class="vals">${A.values.map(v => `<span>${esc(v)}</span>`).join('')}</div></div></div>`) +
    sec('band', 'a-presence', 'Our presence', `${SHd('Our presence', 'Fifty years in printing and packaging', A.presence)}${numsRow(A.numbers)}<div style="margin-top:18px"><span class="eb" style="margin-bottom:10px">Service centres</span><div class="centres" style="margin-top:10px">${A.centres.map(c => `<span>${esc(c)}</span>`).join('')}</div></div>`) +
    sec('', 'a-timeline', 'Timeline', `${SHd('Milestones', '1971 to today')}${timeline(X.abTimeline)}`) +
    sec('', 'a-strengths', 'Strengths', `${SHd('Our expertise', 'Timeless products with a fine regard for detail')}<div class="strengths rv" data-v="${X.abStrengths}">${A.strengths.map(s => `<div><b>${esc(s[0])}</b><p>${esc(s[1])}</p></div>`).join('')}</div>`) +
    sec('', 'a-quotes', 'Testimonials', `${SHd('What they say', 'Testimonials')}${quotes(X.abQuotes)}`) +
    SH.partners().replace('class="sec"', 'class="sec psec"');
}
function pgClients(){
  const v = X.cli;
  return `<section class="psec pghead" id="c-head" data-sec="Clients" data-hero><div class="wrap"><span class="eb">Clients</span><h1>Our esteemed clients</h1><p class="lead">Converters, machine builders and brands across food, pharma, oil, chemicals and packaging run Arshad machines. Logos as shown on the current site.</p></div></section>` +
    SH.clients().replace('class="sec"', 'class="sec psec"') + sec('', 'c-quotes', 'Testimonials', `${SHd('What they say', 'Testimonials')}${quotes(X.abQuotes)}`) + (v ? '' : '');
}
function pgFaq(){
  const groups = [['corona', 'Corona surface treaters', 'F'], ['sealing', 'Induction cap sealers', 'S']];
  const item = f => `<details data-q="${esc((f[1] + ' ' + f[2]).toLowerCase())}"><summary>${esc(f[1])}</summary><p>${esc(f[2])}</p></details>`;
  const v = X.faqLayout;
  let body;
  if (v === 'tabs') body = `<div class="faqtabs" role="tablist">${groups.map((g, i) => `<button data-faqtab="${g[0]}" aria-pressed="${!i}">${esc(g[1])}</button>`).join('')}</div><div class="faqx">${SDX.FAQ.map(f => item(f).replace('<details', `<details data-g="${f[0]}"${f[0] === 'sealing' ? ' hidden' : ''}`)).join('')}</div>`;
  else if (v === 'cols') body = `<div class="faqx" data-v="cols">${groups.map(g => `<div><h3 style="--fam:var(--fam${g[2]})"><i class="fambar"></i>${esc(g[1])}</h3>${SDX.FAQ.filter(f => f[0] === g[0]).map(item).join('')}</div>`).join('')}</div>`;
  else body = `<div class="faqx">${groups.map(g => `<h3 style="--fam:var(--fam${g[2]})"><i class="fambar"></i>${esc(g[1])}</h3>${SDX.FAQ.filter(f => f[0] === g[0]).map(item).join('')}`).join('')}</div>`;
  return `<section class="psec pghead" id="f-head" data-sec="FAQ" data-hero><div class="wrap"><span class="eb">Feel free to ask us</span><h1>Frequently asked questions</h1><p class="lead">Answers from Arshad on corona treatment and induction cap sealing. Values that matter: quality, accuracy, safety, reliance.</p></div></section>` +
    sec('', 'f-list', 'Questions', `<input class="fq-s" type="search" id="fqs2" placeholder="Search the answers (e.g. dyne, foil, gauge)" aria-label="Search the FAQ"><p class="hint" id="fqn" style="margin:0 0 8px"></p>${body}`) +
    sec('band', 'f-ask', 'Ask us', `<div class="cta"><div style="display:grid;gap:12px"><span class="eb">Ask us</span><h2>Didn’t find your answer?</h2></div><div class="acts">${pl('contact', 'Ask our team', 'class="btnp"')}</div></div>`);
}
function pgContact(){
  const C = SDX.CONTACT, v = X.con;
  const det = `<div class="det"><div class="ln"><small>Email</small>${C.emails.map(e => `<div><span>${esc(e)}</span><button class="cpy" data-copy="${esc(e)}">Copy</button></div>`).join('')}</div>
    <div class="ln"><small>Phone</small>${[...C.phones, C.mobile].map(p => `<div><span>${esc(p)}</span><button class="cpy" data-copy="${esc(p)}">Copy</button></div>`).join('')}</div>
    <div class="ln"><small>Office address</small><div>${esc(C.addr)}</div></div><div class="ln"><small>Service centres</small><div class="centres">${SDX.ABOUT.centres.map(c => `<span>${esc(c)}</span>`).join('')}</div></div></div>`;
  let body;
  if (v === 'c') body = `<div class="mapc rv"><canvas data-map aria-label="Drawn map of Mahim, Mumbai"></canvas><div class="card2">${det}${SH.form(true)}</div></div>`;
  else if (v === 'b') body = `<div class="cta"><div style="display:grid;gap:12px"><p class="lead">${esc(C.intro)}</p></div><div class="acts"><button class="btnp" data-copy="${esc(C.emails[0])}">Copy email</button><button class="btng" data-copy="${esc(C.phones[0])}">Copy phone</button></div></div><div class="con" style="margin-top:30px">${det}${SH.form()}</div>`;
  else body = `<div class="con rv">${det}${SH.form()}</div>`;
  return `<section class="psec pghead" id="ct-head" data-sec="Contact" data-hero><div class="wrap"><span class="eb">Get in touch</span><h1>Contact us</h1><p class="lead">${esc(C.intro)}</p></div></section>` + sec(v === 'b' ? 'band' : '', 'ct-main', 'Contact', body);
}

/* ---------- product pages: original build + composition into shared layouts ---------- */
/* where each original page's parts go in the shared layouts. Nothing is dropped: parts without a slot of their own
   go to a "More about" section, and every page can keep its own hero (Product hero > Page's own). */
const PARTS = {
  brezo: { hero: '.bz-hero', heroWrap: true, stage: '#bzStage', ctrls: ['.bz-ladder'], figs: '#bzFigs', howx: '#how', models: ['#compare'], specs: ['#datasheet'], demos: [['Will it seal?', '#check'], ['Tamper test', 'section.p-sec:has(.bz-tamper)']], ind: null, ownInd: 'section.p-sec:has(.ind)' },
  aurae: { hero: '.au-hero', heroWrap: true, stage: '#auStage', ctrls: [], figs: '.au-nums', howx: 'section.p-sec:has(.au-prose)', models: [], specs: ['section.p-sec:has(.p-spec)'], demos: [['Five things decide a good seal', 'section.p-sec:has(.au-factors)']], ind: null, ownInd: 'section.p-sec:has(.au-inds)' },
  films: { hero: '.fm-hero', heroWrap: false, stage: null, ctrls: [], figs: null, kf: [['6', '', 'film series'], ['500–2600', ' mm', 'web widths'], ['300', ' m/min', 'top line speed']], howx: '#how', models: ['#finder'], specs: ['#series'], demos: [['Dyne test', '.fm-dyne'], ['Dyne pen', 'section.p-sec:has(#fmPen)']], ind: null },
  woven: { hero: '.wv-sheet', heroWrap: true, stage: '#wvStage', ctrls: [], figs: '.wv-head .p-figs', howx: null, models: [], specs: ['section.p-sec:has(.wv-parts)'], demos: [['Pre-lump sensor', '.wv-lump']], ind: null },
  objects: { hero: '.ob-hero', heroWrap: true, stage: '.ob-stage', ctrls: ['.ob-tabs'], figs: null, kf: [['300', ' m/min', 'line speed'], ['3', '', 'object types'], ['1', '', 'pass to print-ready']], howx: null, models: [], specs: ['section.p-sec:has(#obSpec)'], demos: [['Why treat before printing', 'section.p-sec:has(#obPrint)']], ind: null },
  simco: { hero: '.io-hero', heroWrap: true, stage: '.io-stage', ctrls: ['.io-sym'], figs: null, kf: [['2', '', 'Simco-Ion products'], [String(new Set([...PD.simco.plastics, ...PD.simco.packaging]).size), '', 'processes served'], ['4', '', 'symptoms it fixes']], howx: null, models: ['section.p-sec:has(.io-apps)'], specs: [], demos: [], ind: 'section.p-sec:has([data-proc])' }
};
/* every feature each page has in the Product Pages lab (same wording as that lab's notes), and how to switch it off.
   css: a rule keyed on .pp[data-off]; hide: selector(s) to hide; stage: photo view instead of the live 3D;
   count: figures appear without counting; js: a hook run after the page starts; always: part of something else */
const FEAT = {
  brezo: [
    ['words', 'Headline words rise in', 'motion', 'css'], ['count', 'Figures count up', 'motion', 'count'], ['field', 'Induction field pulses over the real jar photo', 'motion', 'css'], ['steps', 'Seal steps light in sequence', 'motion', 'css'],
    ['stage', 'Live 3D Brezo: switch P / A / 2 / 3C SS, run the line (bottles, coil, tower light)', 'assets', 'stage'], ['check', 'Seal check: container, cap, foil gsm, output → which models fit', 'assets', 'hide:#check'], ['tamper', 'Tamper test: twist the cap off, the foil stays', 'assets', 'hide:section.p-sec:has(.bz-tamper)'],
    ['units', 'Units: as published / metric / imperial', 'qol', 'css'], ['copy', 'Copy or save the spec as .csv', 'qol', 'css'], ['sl', 'Shortlist + side-by-side compare', 'qol', 'css'], ['compare', 'Compare table with “only differences”', 'qol', 'hide:#compare'], ['variants', 'Variant buttons fill the enquiry', 'qol', 'css'], ['sticky', 'Sticky bar, progress, shortcuts', 'qol', 'css']],
  aurae: [
    ['count', 'Numbers count up', 'motion', 'count'], ['flow', 'Coolant flows through the loop', 'motion', 'js'], ['marq', 'Client names drift in a marquee', 'motion', 'css'], ['indhover', 'Industries shift colour on hover', 'motion', 'css'],
    ['stage', 'Live 3D Aurae 3 with its chiller and coolant loop running', 'assets', 'stage'], ['factors', 'Five-factor seal checklist, written out', 'assets', 'hide:section.p-sec:has(.au-factors)'],
    ['units', 'Units toggle on the ledger', 'qol', 'css'], ['copy', 'Copy / save spec', 'qol', 'css'], ['sl', 'Shortlist + compare', 'qol', 'css'], ['faqq', 'FAQ search with highlights', 'qol', 'css'], ['enq', 'Enquiry builder', 'qol', 'hide:#enq']],
  films: [
    ['pushin', 'Slow push-in on the real corona photo', 'motion', 'css'], ['flicker', 'The photo’s own discharge line flickers', 'motion', 'css'], ['power', 'Power flows between the system parts', 'motion', 'css'], ['dim', 'Series cards dim and brighten as you filter', 'motion', 'css'],
    ['finder', 'Series finder over all six film series', 'assets', 'hide:#finder'], ['stage', 'Live 3D treater with corona glow that follows your speed', 'assets', 'stage'], ['dyne', 'Dyne test: drops bead on untreated film and flatten when treated', 'assets', 'hide:.fm-dyne'], ['formula', 'Generator power formula from Arshad’s FAQ, filled with your numbers', 'assets', 'hide:section.p-sec:has(#fmForm)'],
    ['prefill', 'Finder values pre-fill the enquiry', 'qol', 'js'], ['units', 'Units toggle', 'qol', 'css'], ['copy', 'Copy / save spec', 'qol', 'css'], ['sl', 'Shortlist + compare across series', 'qol', 'css'], ['faqq', 'FAQ search', 'qol', 'css']],
  woven: [
    ['turn', 'Line-art model turns slowly', 'motion', 'js'], ['ruler', 'Width ruler stretches the station to scale', 'motion', 'hide:section.p-sec:has(#wvRuler)'], ['lump', 'Fabric runs under the electrode; the pre-lump sensor reacts', 'motion', 'hide:.wv-lump'], ['zoom', 'Magnifier over the real fabric photo', 'motion', 'hide:.wv-zoom'],
    ['stage', '3D FTS-WS as line art with dimensions', 'assets', 'stage'], ['ruler', 'Width ruler 500–5100 mm against a 1.7 m person', 'assets', 'hide:section.p-sec:has(#wvRuler)'], ['lump', 'Pre-lump sensor demo: a lump arrives, the electrode lifts', 'assets', 'hide:.wv-lump'], ['zoom', 'Fabric magnifier', 'assets', 'hide:.wv-zoom'],
    ['units', 'Units toggle on the parts list', 'qol', 'css'], ['copy', 'Copy / save spec', 'qol', 'css'], ['sl', 'Shortlist', 'qol', 'css'], ['enq', 'Enquiry with width and speed', 'qol', 'hide:#enq']],
  objects: [
    ['float', 'Cards float on hover', 'motion', 'css'], ['conveyor', 'Parts ride the conveyor under the head', 'motion', 'js'], ['cable', 'Ink-jet print sweeps across the cable', 'motion', 'hide:.ob-tabs [data-k="cable"]'],
    ['stage', 'Live 3D FTS-3D with parts or a pipe running under the electrode', 'assets', 'stage'], ['cable', 'Cable demo: treated vs untreated ink-jet print', 'assets', 'hide:.ob-tabs [data-k="cable"]'], ['print', 'Print test that shows beading vs crisp marks', 'assets', 'hide:.ob-print'],
    ['spectabs', '3D and CBL specs as tabs', 'qol', 'hide:.p-chips:has([data-spec])'], ['ucs', 'Units, copy, save, shortlist', 'qol', 'css'], ['enq', 'Enquiry with object size', 'qol', 'hide:#enq']],
  simco: [
    ['particles', 'Charged particles drift and stick', 'motion', 'always:part of the static simulator below'], ['ions', 'Ions stream from the bar and neutralise the charge', 'motion', 'always:part of the static simulator below'], ['meter', 'Charge meter falls when the bar is on', 'motion', 'always:part of the static simulator below'],
    ['sim', 'Static simulator with four symptoms: dust, cling, sticking sheets, shocks', 'assets', 'hide:.io-stage, .io-sym'], ['finder', 'Application finder across plastics and packaging', 'assets', 'hide:section.p-sec:has([data-proc])'],
    ['proc', 'Pick a process to highlight it', 'qol', 'css'], ['enq', 'Enquiry asks for the problem and process', 'qol', 'hide:#enq'], ['note', 'Clear note that specs come from Simco-Ion', 'qol', 'hide:.io-apps ~ .p-note']]
};
/* switch off what the drawer says is off for this page, before the page's own code starts */
function featPre(pp, id){
  const off = featOff(id); pp.dataset.off = [...off].join(' ');
  (FEAT[id] || []).forEach(([k, , , how]) => {
    if (!off.has(k)) return;
    if (how === 'count') $$('[data-count]', pp).forEach(e => e.removeAttribute('data-count'));
    if (how.startsWith('hide:')) $$(how.slice(5), pp).forEach(e => { const box = e.closest('.dmo') || e; box.hidden = true; box.dataset.featoff = k; });
  });
  // demo tabs: no tab for a demo that is off; a template section left with nothing in it goes too
  $$('.dmo[data-featoff]', pp).forEach(d => { const t = $(`[data-dtab="${d.dataset.dmo}"]`, pp); if (t) t.hidden = true; });
  const firstTab = $$('.dtabs [data-dtab]', pp).find(t => !t.hidden); if (firstTab && $(`.dmo[data-dmo="${firstTab.dataset.dtab}"]`, pp)?.hidden && !$(`.dmo[data-dmo="${firstTab.dataset.dtab}"]`, pp).dataset.featoff){ $$('.dtabs [data-dtab]', pp).forEach(x => x.setAttribute('aria-pressed', x === firstTab)); $$('.dmo:not([data-featoff])', pp).forEach(d => d.hidden = d !== $(`.dmo[data-dmo="${firstTab.dataset.dtab}"]`, pp)); }
  $$('.tsec', pp).forEach(sec => { const box = $('.slot, .dlist', sec); if (box && ![...box.children].some(c => !c.hidden)) sec.hidden = true; });
}
/* hooks that need the page's own code to have started */
function featPost(pp, id){
  const off = featOff(id), stageOf = sel => { const cv = $(sel, pp); return cv && [...A3.stages].find(s => s.canvas === cv); };
  if (off.has('count')) $$('[data-count]', pp).forEach(e => { e.textContent = (+e.dataset.count).toLocaleString('en-IN'); e.removeAttribute('data-count'); });
  if (id === 'aurae' && off.has('flow')){ const b = $('[data-flow]', pp); if (b && b.getAttribute('aria-pressed') === 'true') b.click(); }
  if (id === 'woven' && off.has('turn')){ const st = stageOf('#wvStage canvas'); if (st) st.auto = false; }
  if (id === 'objects' && off.has('conveyor')){ const st = stageOf('canvas.c3'); if (st){ st.hooks = []; st.dirty = true; } }
  if (id === 'films' && off.has('prefill')){
    const clear = () => setTimeout(() => { const e = $('[data-enq]', pp); if (e) ['width', 'speed', 'sides', 'app'].forEach(n => { if (e[n]) e[n].value = ''; }); }, 0);
    const f = $('#finder', pp); if (f){ f.addEventListener('input', clear); f.addEventListener('click', clear); } clear();
  }
}
const HOW = {
  F: [['Generator', 'IGBT, sized to your film, width and speed'], ['HV transformer', 'Oil-cooled, steps up to electrode voltage'], ['Electrode', 'Pneumatic, key or fin type, micro gap'], ['Ozone extraction', 'Draws the ozone away from the operator']],
  S: [['Fill', 'Product goes in on your filling line'], ['Cap', 'The cap goes on with the foil liner inside'], ['Seal', 'The coil’s field heats the foil; its coating bonds to the rim'], ['Check', 'No-foil detection rejects any bottle without a liner']],
  I: [['Charge builds', 'Film, sheets and packs pick up static as they run'], ['Ion bar', 'Simco-Ion bars put out positive and negative ions'], ['Neutral', 'Charges pair up; dust, cling and shocks stop']]
};
const IND = {
  F: () => [...D.corona.applications, ...D.corona.substrates.slice(0, 4)],
  S: () => D.sealing.industries,
  I: () => [...D.simco.plastics.slice(0, 4), ...D.simco.packaging.slice(0, 4)]
};
const INDI = { 'Blown film': 'film', 'Printing and UV coating': 'print', 'Aseptic packaging': 'jar', 'Lamination and coating': 'film', 'Sheet extrusion': 'film', 'Monolayer film': 'film', 'Multilayer film': 'film', 'Metallised film': 'film', 'Cast film': 'film', Food: 'jar', 'Cosmetics and personal care': 'tube', Pharmaceuticals: 'pill', Adhesives: 'drop', Dairy: 'bottle', 'Agro-chemicals': 'leaf', Detergents: 'bottle', Lubricants: 'can' };
const ORDER = {
  template: ['hero', 'how', 'models', 'specs', 'demo', 'ind', 'faq', 'enq'],
  F: ['hero', 'models', 'demo', 'how', 'specs', 'ind', 'faq', 'enq'],
  S: ['hero', 'specs', 'how', 'demo', 'models', 'ind', 'faq', 'enq'],
  I: ['hero', 'models', 'ind', 'how', 'enq']
};
function tSec(key, label, eb, h, inner, v, extra = ''){ return `<section class="tsec t${key}" data-sec="${esc(label)}" data-v="${v || ''}" ${extra}><div class="wrap">${h ? SHd(eb, h) : ''}<div class="slot">${inner}</div></div></section>`; }
function pVisual(pid, pg){ // photo + drawn family effect, used when the page has no stage in its hero or the machine view is photo
  return `<div class="pvis">${visCanvas(pg.fx, pg.photo, X.photos ? (pg.id === 'simco' ? 'Application photo, not a product' : 'Real photo · drawn effect') : 'Drawn visual')}</div>`;
}
function compose(pp, b, mode){
  const P = PARTS[b.id], pg = PG(b.id), fam = pg.fam, q = s => s ? pp.querySelector(s) : null;
  const take = s => { const el = q(s); if (el) el.remove(); return el; };
  const heroEl = q(P.hero), heroBox = heroEl && P.heroWrap ? heroEl.closest('.p-wrap') || heroEl : heroEl;
  let hero;
  if (X.tHero === 'own' && heroBox){
    // the page's own hero, exactly as in the Product Pages lab
    hero = heroBox; hero.classList.add('ownhero'); hero.dataset.sec = pg.t;
  } else {
    const stage = P.stage ? q(P.stage) : null, stageInHero = stage && heroEl && heroEl.contains(stage);
    const ctrls = P.ctrls.map(s => take(s)).filter(Boolean), figs = take(P.figs);
    const kicker = (q('.p-kick', heroEl) || {}).textContent || pg.t, h1 = (q('h1', heroEl) || {}).textContent || pg.t, lede = (q('.p-lede, .au-sub', heroEl) || {}).textContent || '';
    const pid = MAINP[b.id], vis = stageInHero ? stage : null;
    const kfHTML = P.kf ? P.kf.map(k => `<div><b>${esc(k[0])}${esc(k[1])}</b><span>${esc(k[2])}</span></div>`).join('') : '';
    hero = document.createElement('section'); hero.className = 'tsec thero'; hero.dataset.v = X.tHero; hero.dataset.hero = ''; hero.dataset.sec = pg.t;
    hero.innerHTML = `<div class="wrap"><div class="txt"><span class="eb" style="color:var(--fam)">${esc(kicker)}</span><h1>${esc(h1.trim())}</h1>${lede ? `<p class="lead">${esc(lede)}</p>` : ''}<div class="ctrls"></div><div class="kf">${kfHTML}</div>
      <div class="acts"><a class="btnp" href="#enq">Get a quote <span class="arrow">→</span></a>${pid && D.P[pid] && D.P[pid].spec ? `<button class="btng" type="button" data-sl="${pid}">☆ Shortlist</button>` : ''}${X.share ? `<button class="btng" type="button" data-share>${ic2('share').replace('<svg', '<svg style="width:16px;height:16px"')} Share</button>` : ''}${X.brochure ? '<button class="btng" type="button" data-brochure>Brochure (PDF)</button>' : ''}</div></div><div class="vis"></div></div>`;
    const cbox = $('.ctrls', hero); ctrls.forEach(c => cbox.appendChild(c));
    if (figs){ const kf = $('.kf', hero); kf.innerHTML = ''; kf.appendChild(figs); }
    const vbox = $('.vis', hero);
    if (vis) vbox.appendChild(vis); else vbox.innerHTML = pVisual(pid, pg);
    // the original hero goes; anything in it the page's own code looks up by id stays, hidden, so that code keeps working
    if (heroEl){ const keep = document.createElement('div'); keep.hidden = true; keep.className = 'tkeep'; $$('[id]', heroEl).forEach(el => { if (!hero.contains(el)) keep.appendChild(el); }); hero.appendChild(keep); }
    if (heroBox) heroBox.replaceWith(hero); else pp.prepend(hero);
  }
  const faq = take('#p-faq'), enq = take('#enq'), mini = take('.p-hold');
  if (mode === 'parts'){
    // shared parts: the shared hero, FAQ and enquiry; everything else stays where the page has it
    if (faq) pp.appendChild(tsecEl('faq', 'FAQ', 'FAQ', 'Questions, answered', [faq], X.tFaq));
    if (enq) pp.appendChild(tsecEl('enq', 'Enquiry', 'Enquiry', null, [enq], X.tEnq));
    if (mini) pp.prepend(mini);
    return;
  }
  // collect parts (demos first: some sit inside the page's own how-it-works section)
  const demos = P.demos.map(([l, s]) => [l, take(s)]).filter(d => d[1]);
  const models = P.models.map(take).filter(Boolean), specs = P.specs.map(take).filter(Boolean);
  const howSec = P.howx ? take(P.howx) : null;
  const indEl = P.ind ? take(P.ind) : null, ownInd = P.ownInd ? take(P.ownInd) : null;
  let howx = null;
  if (howSec){ howx = document.createElement('div'); howx.className = 'howown'; const w = $('.p-wrap', howSec) || howSec; [...w.children].forEach(c => { if (!c.matches('h2.p-h2')) howx.appendChild(c); }); }
  // whatever the page has that no shared section takes (quotes, client marquee, extra lists) is kept, in its own order
  const extras = () => {
    const left = [...pp.children].filter(ch => ch !== hero && ch !== mini && ch.tagName !== 'STYLE' && ch.textContent.trim());
    if (!left.length) return null;
    const el = document.createElement('section'); el.className = 'tsec textra'; el.dataset.sec = 'More';
    el.innerHTML = `<div class="wrap">${SHd('More about ' + pg.t, 'From this page')}<div class="slot"></div></div>`;
    left.forEach(ch => $('.slot', el).appendChild(ch)); return el;
  };
  const order = mode === 'family' ? ORDER[fam] : ORDER.template;
  const out = [];
  let moreDone = false;
  const more = () => { if (moreDone) return; moreDone = true; const m = extras(); if (m) out.push(m); };
  order.forEach(k => {
    if (k === 'hero') return;
    if (k === 'how'){ const steps = HOW[fam], ownSteps = howx && howx.querySelector('.bz-steps, .fm-sys'); const el = document.createElement('section'); el.className = 'tsec thow'; el.dataset.v = X.tHow; el.dataset.sec = 'How it works';
      el.innerHTML = `<div class="wrap">${SHd('How it works', fam === 'F' ? 'How corona treatment works' : fam === 'S' ? 'How the seal is made' : 'How static control works')}${ownSteps ? '' : `<div class="steps rv" style="--n:${steps.length}">${steps.map(s => `<div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>`}<div class="howx" style="margin-top:22px"></div></div>`;
      if (howx) $('.howx', el).appendChild(howx); out.push(el); return; }
    if (k === 'models' && models.length) out.push(tsecEl('models', 'Models', 'Models and series', fam === 'F' && b.id === 'films' ? 'Find your series' : 'Choose a model', models, X.tModels, 'tpanel'));
    if (k === 'specs' && specs.length) out.push(tsecEl('specs', 'Specs', 'Specification', 'Specs and options', specs, X.tSpecs, 'tpanel'));
    if (k === 'demo' && demos.length) out.push(demoSec(demos));
    if (k === 'ind'){
      if (indEl) out.push(tsecEl('ind', 'Industries', 'Where it works', 'Industries and processes', [indEl], X.tInd));
      else if (X.tInd === 'own' && ownInd) out.push(tsecEl('ind', 'Industries', 'Where it works', 'Industries and applications', [ownInd], 'own'));
      else { const items = IND[fam](); const el = document.createElement('section'); el.className = 'tsec tind'; el.dataset.v = X.tInd === 'own' ? 'tiles' : X.tInd; el.dataset.sec = 'Industries'; el.innerHTML = `<div class="wrap">${SHd('Where it works', 'Industries and applications')}<div class="tiles rv">${items.map(n => `<div>${ic(INDI[n] || 'film')}<span>${esc(n)}</span></div>`).join('')}</div></div>`; out.push(el); } }
    if (k === 'faq'){ more(); if (faq) out.push(tsecEl('faq', 'FAQ', 'FAQ', null, [faq], X.tFaq)); }
    if (k === 'enq'){ more(); if (enq) out.push(tsecEl('enq', 'Enquiry', 'Enquiry', null, [enq], X.tEnq)); }
  });
  more();
  [...pp.children].forEach(ch => { if (ch !== hero && ch !== mini && ch.tagName !== 'STYLE') ch.remove(); });
  out.forEach(el => pp.appendChild(el));
  if (mini) pp.prepend(mini);
}
function wrapP(el){ const s = document.createElement('div'); s.className = 'p-wrap'; s.style.paddingBlock = '30px 0'; s.appendChild(el); return s; }
function panelWrap(el){ return el; }
function tsecEl(key, label, eb, h, nodes, v, extraCls = ''){
  const el = document.createElement('section'); el.className = `tsec t${key} ${extraCls}`; el.dataset.v = v || ''; el.dataset.sec = label;
  // the moved part already has its own heading: keep only the eyebrow so headings never repeat
  const own = nodes[0] && nodes[0].querySelector && nodes[0].querySelector(':scope > .p-wrap > .p-h2, :scope > .p-wrap > div > .p-h2, :scope > .p-h2');
  el.innerHTML = `<div class="wrap">${h ? (own ? `<span class="eb" style="margin-bottom:10px">${esc(eb)}</span>` : SHd(eb, h)) : ''}<div class="slot"></div></div>`; const slot = $('.slot', el); nodes.forEach(n => slot.appendChild(n)); return el;
}
function demoSec(demos){
  const el = document.createElement('section'); el.className = 'tsec tdemo'; el.dataset.v = X.tDemo; el.dataset.sec = 'Demos';
  el.innerHTML = `<div class="wrap">${X.tDemo === 'tabs' ? `<div class="dtabs" role="tablist">${demos.map((d, i) => `<button type="button" data-dtab="${i}" aria-pressed="${!i}">${esc(d[0])}</button>`).join('')}</div>` : ''}<div class="dlist"></div></div>`;
  const list = $('.dlist', el); demos.forEach((d, i) => { const w = document.createElement('div'); w.className = 'dmo'; w.dataset.dmo = i; if (X.tDemo === 'tabs' && i) w.hidden = true; w.appendChild(d[1]); list.appendChild(w); });
  return el;
}
/* photo machine view: a stand-in stage with the cut-out over the drawn family effect */
function photoStage(canvas){
  const host = canvas.parentElement, pg = PG(ST.cur), pid = MAINP[ST.cur];
  canvas.style.visibility = 'hidden';
  const box = document.createElement('div'); box.className = 'mvph';
  const cut = (D.P[pid] && D.P[pid].img && D.P[pid].img !== 'null') ? 'img/' + D.P[pid].img : pageCut(ST.cur);
  box.innerHTML = `<canvas data-vis="${pg.fx}" data-photo="" aria-hidden="true"></canvas>${cut ? `<img src="${cut}" alt="${esc(pg.t)} product photo" class="zoomable">` : ''}<span class="lbl">Photo view · cut-out over a drawn effect</span>`;
  host.appendChild(box);
  const cv = $('canvas', box); FX.add(cv, (ctx, w, h, t, L) => FX.V[pg.fx](ctx, w, h, t, L), { photo: null });
  const st = { canvas, add: g => g, remove(){}, frame(){}, onFrame(){}, view(){}, dispose(){ box.remove(); canvas.style.visibility = ''; }, amb: {}, dir: {}, dirty: false, auto: false, yaw: 0 };
  U.onClean(() => st.dispose());
  return st;
}
/* site photo machine view: arshadelectronics.com's own product photos for the page, on the stage's own ground.
   The photo follows the model the page would show in 3D (the page still asks A3 for it; we watch which one). */
const SITEPH = {
  brezo: { ph: [['brezo-3css', 'Brezo 3C SS'], ['brezo-2', 'Brezo 2'], ['brezo-a', 'Brezo A'], ['brezo-p', 'Brezo P']] },
  aurae: { ph: [['aurae-3', 'Aurae 3']] },
  films: { ph: [['mnl-aba', 'FTS-MNL-ABA'], ['mnl', 'FTS-MNL'], ['cm-br', 'FTS-CM-BR'], ['ncf', 'FTS-NCF'], ['mml', 'FTS-MML'], ['mml-ibc', 'FTS-MML-IBC']] },
  woven: { ph: [['ws', 'FTS-WS']] },
  objects: { ph: [['cds-3d', 'FTS-3D']] }
};
const sitePhOf = m3 => { const k = String(m3 || '').replace(/^cdt-/, ''); return ['brezo-p', 'brezo-a', 'brezo-2', 'brezo-3css', 'aurae-3', 'mnl-aba', 'mml-ibc', 'mnl', 'mml', 'cm-br', 'ncf', 'ws', 'cds-3d'].find(f => k === f || k.startsWith(f + '-')) || null; };
function siteStage(canvas){
  const host = canvas.parentElement, pg = PG(ST.cur), S = SITEPH[ST.cur]; if (!S) return photoStage(canvas);
  canvas.style.visibility = 'hidden';
  const box = document.createElement('div'); box.className = 'mvph mvsite';
  const thumbs = S.ph.length > 1 ? `<div class="mvs-th">${S.ph.map(([f, n]) => `<button type="button" data-sph="${f}" title="${esc(n)}" aria-label="${esc(n)} photo"><img src="img/site/${f}-t.webp" alt=""></button>`).join('')}</div>` : '';
  box.innerHTML = `<img class="mvs-p zoomable" src="img/site/${S.ph[0][0]}.webp" alt="${esc(S.ph[0][1])} product photo">${thumbs}<span class="lbl">Photos from arshadelectronics.com</span>`;
  host.appendChild(box);
  const pr = $('img.mvs-p', box);
  const set = f => { const p = S.ph.find(x => x[0] === f); if (!p) return; if (!pr.src.endsWith('/' + f + '.webp')){ pr.src = 'img/site/' + f + '.webp'; pr.alt = p[1] + ' product photo'; } $$('[data-sph]', box).forEach(b => b.setAttribute('aria-pressed', b.dataset.sph === f)); };
  box.addEventListener('click', e => { const b = e.target.closest('[data-sph]'); if (b){ e.stopPropagation(); set(b.dataset.sph); } });
  set(S.ph[0][0]);
  const load0 = A3.load; A3.load = id => { const f = sitePhOf(id); if (f) set(f); return load0(id); };
  const st = { canvas, add: g => g, remove(){}, frame(){}, onFrame(){}, view(){}, dispose(){ if (A3.load !== load0) A3.load = load0; box.remove(); canvas.style.visibility = ''; }, amb: {}, dir: {}, dirty: false, auto: false, yaw: 0 };
  U.onClean(() => st.dispose());
  return st;
}
/* Simco has no 3D stage: its product cards show the site's own IQ Power system and IQ Easy bar photos instead */
function simcoSitePhotos(pp){
  $$('.io-apps .p-card > img', pp).forEach((im, i) => { im.src = 'img/site/' + (i ? 'simco-bar' : 'simco-system') + '.webp'; im.alt = (i ? 'Simco-Ion static eliminator bars' : 'Simco-Ion static eliminator system') + ': photo from arshadelectronics.com'; im.classList.add('sitepic'); if (i) im.style.objectPosition = 'center 12%'; });
}
function pgProduct(id){ const b = BUILD(id); return `<div class="pp" data-style="${X.treat === 'page' ? b.style : X.treat}" data-motion="${motionEff()}" data-review="${X.review === 'on' ? 'on' : 'off'}" data-orig="${X.orig ? 1 : 0}">${b.render()}</div>`; }
function prevNext(){
  if (!X.prevnext) return '';
  const L = SDX.PRODUCT_ORDER, i = L.indexOf(ST.cur); if (i < 0) return '';
  const a = L[(i - 1 + L.length) % L.length], z = L[(i + 1) % L.length];
  return `<div class="wrap prevnext">${pl(a, `<small>← Previous</small><b>${esc(PG(a).t)}</b>`)}${pl(z, `<small>Next →</small><b>${esc(PG(z).t)}</b>`)}</div>`;
}

/* ---------- render ---------- */
let cleanups = [];
const onClean = f => cleanups.push(f);
function setAttrs(){
  const ds = site.dataset, isHome = ST.cur === 'home', pg = PG(ST.cur), fam = pg.fam || null;
  Object.assign(ds, { look: X.look, font: X.font, accents: X.accents, simco: X.simco, plasma: X.plasma, motion: motionEff(), sheets: X.sheets, review: X.review,
    clSpecs: X.clSpecs ? '1' : '0', clInd: X.clInd ? '1' : '0', clHow: X.clHow ? '1' : '0', famacc: X.famAcc, mview: X.mview, hover: X.hover, click: X.click, contrast: X.contrast ? '1' : '0', ts: String(X.textsize), keybar: X.keybar ? '1' : '0', page: ST.cur });
  if (fam) ds.fam = fam; else delete ds.fam;
  const pbg = isHome ? X.bg : X.pbg;
  const kind = isHome ? X.bg : pbg === 'calm' ? 'off' : pbg === 'same' ? ST.S.bg : pbg === 'family' ? ({ F: 'ribbon', S: 'rings', I: 'ions' }[fam] || 'bars') : pbg;
  ds.bg = isHome ? X.bg : 'off';
  ds.bgon = kind && kind !== 'off' ? '1' : '0';
  document.body.classList.toggle('a11y', !!X.a11y);
  document.body.classList.toggle('site-basket', !!X.basket);
  return { kind: kind || 'off', veilOn: !isHome && kind && kind !== 'off' };
}
/* layered sections already sit on their own (see-through) ground, so the reading veil can be lighter under them */
const PANEL_LAYERS = ['rise', 'stack', 'cards', 'glass', 'offset', 'bands'];
const veilK = () => ((X.veil / 100) * (PANEL_LAYERS.includes(X.sheets) ? 0.6 : 1)).toFixed(2);
function copyTokens(){
  const cs = getComputedStyle(site), b = document.body.style;
  [['--bg', '--bg'], ['--surf', '--surf'], ['--surf2', '--surf2'], ['--ink', '--ink'], ['--line', '--line'], ['--mut', '--muted'], ['--brand', '--acc'], ['--brandInk', '--onacc'], ['--r', '--r'], ['--fB', '--body'], ['--brand', '--brand'], ['--brandInk', '--brandInk'], ['--brandTx', '--brandTx'], ['--fB', '--fB'], ['--fH', '--fH'], ['--mut', '--mut']].forEach(([a, z]) => b.setProperty(z, cs.getPropertyValue(a)));
  veil.style.setProperty('--vbg', cs.getPropertyValue('--bg'));
}
let calmUntil = 0;
function render(opts = {}){
  X = eff(ST.cur); SH.X = X;
  // a lab change re-renders the page in place: what is already on screen stays put instead of animating in again
  calmUntil = opts.calm ? performance.now() + 500 : 0;
  U.cleanAll(); FX.clear(); cleanups.forEach(f => { try { f(); } catch (e){} }); cleanups = [];
  const { kind, veilOn } = setAttrs();
  const pg = PG(ST.cur);
  let body;
  if (pg.kind === 'home') body = pgHome();
  else if (pg.kind === 'hub') body = pgHub(ST.cur);
  else if (pg.kind === 'about') body = pgAbout();
  else if (pg.kind === 'clients') body = pgClients();
  else if (pg.kind === 'faq') body = pgFaq();
  else if (pg.kind === 'contact') body = pgContact();
  else body = pgProduct(ST.cur);
  site.innerHTML = `${X.a11y ? '<a class="skip" href="#main">Skip to content</a>' : ''}${(X.grain ? '<div class="fx-grain" aria-hidden="true"></div>' : '') + (X.grid ? '<div class="fx-grid" aria-hidden="true"></div>' : '')}${siteHeader()}<div class="famstrip"></div>
    <main id="main"><div class="pgwrap">${crumbs()}${body}${pg.kind === 'product' ? prevNext() : ''}</div></main>${siteFooter()}`;
  if (pg.kind === 'product'){
    const pp = $('.pp', site), b = BUILD(ST.cur);
    if (X.uni !== 'original') compose(pp, b, X.uni === 'parts' ? 'parts' : X.uni === 'family' ? 'family' : 'template');
    featPre(pp, ST.cur);
    const photo = X.mview === 'photo' || featOff(ST.cur).has('stage');
    U.stage3d = X.mview === 'site' ? siteStage : photo ? photoStage : origStage3d;
    if (X.mview === 'site' && ST.cur === 'simco') simcoSitePhotos(pp);
    U.wire(pp, { go: id => navigate(id) });
    const id0 = ST.cur;
    try { Promise.resolve(b.init(pp)).then(() => { if (pp.isConnected) featPost(pp, id0); }).catch(e => { console.error(b.id, e); U.toast('Part of this page failed to load: ' + e.message); }); }
    catch (e){ console.error(b.id, e); U.toast('Part of this page failed to load: ' + e.message); }
    $$('[data-dtab]', pp).forEach(btn => btn.addEventListener('click', () => { $$('[data-dtab]', pp).forEach(x => x.setAttribute('aria-pressed', x === btn)); $$('.dmo:not([data-featoff])', pp).forEach(d => d.hidden = d.dataset.dmo !== btn.dataset.dtab); window.dispatchEvent(new Event('resize')); }));
  } else {
    $$('[data-count]', site).forEach(el => { el.dataset.cnt = el.dataset.count; el.removeAttribute('data-count'); });
    U.stage3d = origStage3d;
    U.wire($('main', site), { go: id => navigate(id) });
  }
  copyTokens();
  FX.setPal(readPal()); FX.setMotion(motionEff());
  FX.setBg(bgc, kind, () => ({ y: scrollY, p: scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight), mx: 0, my: 0 }));
  veil.hidden = !veilOn; veil.style.setProperty('--veil', veilK());
  wire();
  overlays();
  if (X.toc) toc(); else if (tocIO){ tocIO.disconnect(); tocIO = null; }
  helpers();
  fitHeader(); megaHover();
  if (!opts.keepScroll) scrollTo(0, 0);
  document.title = DRAFT.titles[ST.cur] || (pg.t + ' - Arshad Electronics');
  window.SITE && SITE.onRender && SITE.onRender();
}
function readPal(){
  const cs = getComputedStyle(site), g = n => cs.getPropertyValue(n).trim(), hex = v => /^#/.test(v) ? v.slice(0, 7) : '#576630';
  return { bgHex: hex(g('--bg')), inkHex: hex(g('--ink')), brandHex: hex(g('--brand')), brandTxHex: hex(g('--brandTx')), lineHex: hex(g('--line')), surf2Hex: hex(g('--surf2')), acFHex: hex(g('--acF')), acSHex: hex(g('--acS')), dark: ['dark', 'blueprint'].includes(X.look),
    acIGlow: X.simco === 'steel' ? '#A7C6D4' : X.simco === 'sage' ? '#C9D2A6' : '#DCE5BD', acPGlow: X.plasma === 'tint' ? '#D8DEC4' : '#C9E39A', acFGlow: '#B9A2FF' };
}

/* ---------- wiring after each render ---------- */
const ptr = { x: 0, y: 0, cx: -999, cy: -999 };
function wire(){
  const m = motionEff();
  $$('canvas[data-vis]', site).forEach(cv => { if (cv.closest('.mvph')) return; FX.add(cv, (ctx, w, h, t, L) => FX.V[cv.dataset.vis](ctx, w, h, t, L), { photo: cv.dataset.photo || null }); });
  $$('canvas[data-globe]', site).forEach(cv => FX.add(cv, FX.globe));
  $$('canvas[data-map]', site).forEach(cv => FX.add(cv, FX.map));
  if (X.m3d && ST.cur === 'home') $$('canvas[data-m3]', site).forEach(mount3d);
  // reveal (homepage-style pages) + counters + timelines
  const pre = X.reveal && m !== 'off' && PG(ST.cur).kind !== 'product';
  const calmNow = () => performance.now() < calmUntil;
  if (calmUntil){ site.classList.add('now'); requestAnimationFrame(() => requestAnimationFrame(() => site.classList.remove('now'))); }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target; el.classList.remove('pre'); io.unobserve(el);
    const calm = calmNow();
    $$('[data-cnt]', el).concat(el.dataset.cnt ? [el] : []).forEach(n => calm ? (n.dataset.done = '1') : numFx(n));
    if (el.classList.contains('tl')) el.classList.add('drawn'); $$('.tl', el).forEach(t => t.classList.add('drawn'));
    if (X.sheets === 'curtain' && !calm && el.matches('.sec,.psec,.tsec')) el.classList.add('cur-in');
    if (el.classList.contains('lines')) el.classList.add('in');
    if (X.ticks && !calm) $$('.p-spec td span, .kf b, .num b', el).forEach((s, i) => { s.classList.remove('tick'); void s.offsetWidth; s.style.animationDelay = (i * 40) + 'ms'; s.classList.add('tick'); });
    if (X.typing && !calm) $$('[data-type]', el).concat(el.dataset.type ? [el] : []).forEach(typeIn);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv, .sec, .psec, .tsec, .lines, .p-spec, .tl, [data-type]', site).forEach(el => {
    if (pre && el.classList.contains('rv') && el.getBoundingClientRect().top > innerHeight * 0.92) el.classList.add('pre');
    io.observe(el);
  });
  onClean(() => io.disconnect());
  // headline motion: words rise in
  if (X.lines && m !== 'off') $$('main h1, main h2', site).forEach(h => { if (h.closest('.pp[data-off~="words"]') || h.querySelector('.split-words, .ln') || h.children.length > 2) return; const t = h.textContent; h.classList.add('lines'); h.innerHTML = I18N.tr(t).split(' ').map((w, i) => `<span class="ln" style="display:inline-block" translate="no"><span style="transition-delay:${i * 50}ms">${esc(w)}</span></span>`).join(' '); if (calmUntil && h.getBoundingClientRect().top < innerHeight) h.classList.add('in'); io.observe(h); });
  if (X.typing) $$('.motto, .story-split blockquote, .au-quote, .ftr .fl p:first-of-type', site).forEach(el => { el.dataset.type = el.textContent; io.observe(el); });
  // chapters (homepage story c) + timeline chapters
  const steps = $$('[data-step]', site);
  if (steps.length){ const pp = $('[data-panes]', site); if (pp) [...pp.children].forEach((p, i) => p.classList.toggle('on', !i));
    const ioS = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const i = +e.target.dataset.step; steps.forEach(s => s.classList.toggle('on', +s.dataset.step === i)); if (pp) [...pp.children].forEach((p, j) => p.classList.toggle('on', j === i)); }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => ioS.observe(s)); onClean(() => ioS.disconnect()); }
  const tls = $$('[data-tl]', site);
  if (tls.length){ const ioT = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const i = +e.target.dataset.tl; tls.forEach(s => s.classList.toggle('on', +s.dataset.tl === i)); $('#tlBig').textContent = SDX.TIMELINE[i][0]; $('#tlTxt').textContent = SDX.TIMELINE[i][1]; }), { rootMargin: '-45% 0px -45% 0px' });
    tls.forEach(s => ioT.observe(s)); onClean(() => ioT.disconnect()); }
  // expanding panels on the homepage
  const dc = $('.doors[data-v="c"]', site);
  if (dc){ const set = k => { SH.st.openDoor = k; $$('.door', dc).forEach(d => d.classList.toggle('open', d.dataset.door === k)); }; set(SH.st.openDoor); const keys = $$('.door', dc).map(d => d.dataset.door); let hov = 0, cyc = 0, user = false;
    $$('.door', dc).forEach(d => d.insertAdjacentHTML('beforeend', '<i class="dbar" aria-hidden="true"></i>'));
    // round 3: photo and text keep their open size, so a panel reveals them as it widens instead of resizing and reflowing them every frame;
    // a closed panel shows its own small label, which cross-fades with the full text
    $$('.door', dc).forEach(d => { const b = $('.bd', d); d.insertAdjacentHTML('beforeend', `<div class="dlab" aria-hidden="true">${b.querySelector('.brand').outerHTML}<h3>${esc(b.querySelector('h3').textContent)}</h3><span class="go">→</span></div>`); });
    const sizeD = () => { const n = keys.length, g = parseFloat(getComputedStyle(dc).columnGap) || 10, W = dc.clientWidth - g * (n - 1); dc.style.setProperty('--ow', (W * 3.2 / (3.2 + n - 1)).toFixed(1) + 'px'); dc.style.setProperty('--cw', (W / (3.2 + n - 1)).toFixed(1) + 'px'); };
    sizeD(); const roD = new ResizeObserver(sizeD); roD.observe(dc); onClean(() => roD.disconnect());
    const pauseCycle = () => { clearInterval(cyc); cyc = 0; dc.classList.remove('cycling'); }, stopCycle = () => { user = true; pauseCycle(); };
    const startCycle = () => { if (user || cyc || motionEff() !== 'full' || matchMedia('(prefers-reduced-motion: reduce)').matches || getComputedStyle(dc).flexDirection === 'column') return; dc.classList.add('cycling'); cyc = setInterval(() => set(keys[(keys.indexOf(SH.st.openDoor) + 1) % keys.length]), 5200); };
    const intent = d => { if (SH.st.openDoor === d.dataset.door) return; clearTimeout(hov); hov = setTimeout(() => set(d.dataset.door), 90); };
    // a resting pointer 'enters' a panel when the page scrolls under it: only real pointer movement counts as the visitor taking over
    $$('.door', dc).forEach(d => { d.addEventListener('mouseenter', () => { if (!cyc) intent(d); }); d.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && !e.movementX && !e.movementY) return; stopCycle(); intent(d); }); d.addEventListener('mouseleave', () => clearTimeout(hov)); d.addEventListener('focusin', () => { stopCycle(); set(d.dataset.door); }); });
    dc.addEventListener('pointerdown', stopCycle);
    const ioD = new IntersectionObserver(es => es[0].isIntersecting ? startCycle() : pauseCycle(), { threshold: .5 }); ioD.observe(dc);
    onClean(() => { ioD.disconnect(); pauseCycle(); clearTimeout(hov); }); }
  // sideways series rail
  const sr = $('.srail[data-pin="1"]', site);
  if (sr){ const tr = $('.track', sr); const size = () => { const over = Math.max(0, tr.scrollWidth - sr.clientWidth); sr.style.setProperty('--railh', (innerHeight * 0.75 + over) + 'px'); sr._over = over; }; size(); addEventListener('resize', size); onClean(() => removeEventListener('resize', size)); }
  else $$('.srail .sticky', site).forEach(s => { s.style.overflowX = 'auto'; });
  if (X.sheets === 'stack') stackTops();
  onScroll();
}
/* stacked sheets stick just below the site header (the pill floats, so leave room for it), never under it */
function stackTops(){
  const lb = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb')) || 0, h = $('.shdr', site);
  const top = lb + (!h ? 0 : X.hdr === 'b' ? 76 : h.offsetHeight);
  $$('main :is(.sec,.psec,.tsec)', site).forEach((s, i) => { if (s.closest('.slot')) return; s.style.top = Math.min(top, innerHeight - s.offsetHeight) + 'px'; s.style.zIndex = i + 1; });
}
function numFx(el){
  if (el.dataset.done) return; el.dataset.done = '1';
  const to = +el.dataset.cnt, m = motionEff(); if (m === 'off' || !to){ return; }
  if (X.scramble){ const fin = to.toLocaleString('en-IN'), t0 = performance.now(); const f = now => { const k = Math.min(1, (now - t0) / 700); el.textContent = k < 1 ? fin.replace(/\d/g, (d, i) => (k * fin.length > i ? d : String(Math.floor(Math.random() * 10)))) : fin; if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); return; }
  const t0 = performance.now(), dur = m === 'subtle' ? 500 : 1300; const f = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e).toLocaleString('en-IN'); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f);
}
function typeIn(el){ if (el.dataset.typed || motionEff() === 'off') return; el.dataset.typed = '1'; const t = el.dataset.type; let i = 0; el.textContent = ''; el.classList.add('typing'); const iv = setInterval(() => { el.textContent = t.slice(0, ++i); if (i >= t.length){ clearInterval(iv); setTimeout(() => el.classList.remove('typing'), 1200); } }, 28); onClean(() => clearInterval(iv)); }
let tocIO = null;
function toc(){
  $('.toc', ovl)?.remove(); if (tocIO){ tocIO.disconnect(); tocIO = null; }
  const secs = $$('main :is(.sec,.psec,.tsec,.p-sec)', site).filter(s => !s.closest('.slot') && (s.dataset.sec || $('h2', s)));
  if (secs.length < 3) return;
  // beside the page when there is room for it, otherwise a small button that opens the list (so it never sits on the text)
  const wrap = $('main .wrap, main .p-wrap', site), room = wrap ? innerWidth - wrap.getBoundingClientRect().right : 0;
  const el = document.createElement('nav'); el.className = 'toc' + (room < 240 ? ' mini' : ''); el.setAttribute('aria-label', 'On this page');
  el.innerHTML = '<b>On this page</b>' + secs.map((s, i) => { s.id = s.id || 'sx' + i; const t = s.dataset.sec || ($('h2', s) || {}).textContent || ''; return `<a href="#${s.id}" data-toc="${s.id}">${esc(t.slice(0, 40))}</a>`; }).join('');
  ovl.appendChild(el);
  el.addEventListener('click', e => { if (e.target.closest('b') && el.classList.contains('mini')){ el.classList.toggle('open'); return; } const a = e.target.closest('[data-toc]'); if (!a) return; e.preventDefault(); e.stopPropagation(); el.classList.remove('open'); document.getElementById(a.dataset.toc).scrollIntoView({ behavior: motionEff() === 'off' ? 'auto' : 'smooth' }); });
  tocIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('a', el).forEach(a => a.classList.toggle('on', a.dataset.toc === e.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
  secs.forEach(s => tocIO.observe(s));
}
let a3p = null;
function mount3d(cv){
  A3.load(cv.dataset.m3).then(d => { if (!cv.isConnected) return; const st = A3.stage(cv, { yaw: -30, pitch: 10, fit: 1, auto: motionEff() !== 'off', floor: true, shadows: false }); const g = A3.build(d); st.add(g); st.frame([g], 1.02); onClean(() => { try { st.dispose(); } catch (e){} }); }).catch(() => U.toast('3D model could not load'));
}

/* ---------- overlays carried over from the Homepage Lab ---------- */
function overlays(){
  const secs = $$('main :is(.sec,.psec,.tsec)', site).filter(s => !s.closest('.slot'));
  const n = U.shortlist.length;
  ovl.innerHTML = `${X.prog ? '<div class="o-prog" id="oProg"></div>' : ''}
    ${X.rail && secs.length > 2 ? `<nav class="o-rail" aria-label="Sections">${secs.map((s, i) => { s.id = s.id || 'rs' + i; return `<button data-goto="${s.id}" aria-label="${esc(s.dataset.sec || '')}"><span>${esc(s.dataset.sec || '')}</span></button>`; }).join('')}</nav>` : ''}
    ${X.clPill && ST.cur === 'home' ? `<div class="o-cl" style="bottom:250px"><button data-clp aria-expanded="false">${ic('layers').replace('<svg class=""', '<svg style="width:15px;height:15px"')} Layers</button></div>` : ''}
    ${X.fab ? `<div class="o-fab"><button data-fab="call" aria-label="Call sales">${ic('phone')}</button>${X.wa ? `<button data-fab="wa" aria-label="WhatsApp sales">${ic('chat')}</button>` : ''}</div>` : ''}
    ${X.bar ? `<button type="button" class="o-sl" id="oBar" data-basket aria-hidden="true" title="Your shortlist" aria-label="Your shortlist, ${n} items">${ic2('star')}<span class="hcount"${n ? '' : ' hidden'}>${n}</span></button>` : ''}
    ${X.drawer && ST.cur === 'home' ? '<aside class="o-drawer" id="oDrawer" aria-hidden="true" aria-label="Products"></aside>' : ''}
    <div class="o-toast" id="oToast" role="status" aria-live="polite"></div>`;
}
function helpers(){
  $$('.fly, .torch, .ccur, .qv').forEach(e => e.remove());
  const br = document.createElement('div'); br.className = 'fly br';
  const bl = document.createElement('div'); bl.className = 'fly bl';
  if (X.finder) bl.insertAdjacentHTML('beforeend', `<button class="fbtn" type="button" data-quiz>${ic2('compass')} Find a machine</button>`);
  if (X.callback) bl.insertAdjacentHTML('beforeend', `<button class="fbtn ghost" type="button" data-callback>${ic2('callb')} Call me back</button>`);
  if (X.totop) br.insertAdjacentHTML('beforeend', `<button class="fbtn ghost" type="button" data-top hidden aria-label="Back to top">${ic2('up')}</button>`);
  document.body.append(br, bl);
  if (X.torch){ const t = document.createElement('div'); t.className = 'torch'; document.body.appendChild(t); }
  if (X.cursor && matchMedia('(pointer:fine)').matches){ const c = document.createElement('div'); c.className = 'ccur'; c.innerHTML = '<i></i><span></span>'; document.body.appendChild(c); }
}

/* ---------- product drawer on the homepage doors (homepage option) ---------- */
function drawer(k){
  const d = $('#oDrawer'), b = SH.brand(k); if (!d) return;
  const ids = b.products;
  d.innerHTML = `<div class="dh"><div><small style="color:#5B6250;font:600 11px 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase">${esc(b.name)}</small><br><b>${esc(SH.tx(b.k)[0])}</b></div><button data-close aria-label="Close">Close</button></div>
    <div class="db">${(ids.length ? ids : [MAINP.simco]).map(id => { const p = D.P[id]; return `<div class="pr">${X.cuts && p.img && p.img !== 'null' ? `<img src="img/${p.img}" alt="">` : `<span style="width:78px;color:#576630">${mark()}</span>`}<div><b>${esc(p.name)}</b><small>${esc(p.sub)}</small><div class="pa"><button data-sladd="${id}">${U.shortlist.includes(id) ? '★ Shortlisted' : '☆ Shortlist'}</button>${pl(P2PG[id], 'Open page')}</div></div></div>`; }).join('')}
      ${pl(HUBOF[k] || 'simco', 'See the whole family →', 'class="btnp" style="justify-self:start;margin-top:6px"')}</div>`;
  d.classList.add('on'); d.setAttribute('aria-hidden', 'false');
}
function closeDrawer(){ const d = $('#oDrawer'); if (d){ d.classList.remove('on'); d.setAttribute('aria-hidden', 'true'); } }

/* ---------- basket: one shortlist across the site ---------- */
function addIds(spec){
  spec.split(',').forEach(id => { if (id.startsWith('simco:')) id = 'iqpower'; if (D.P[id] && !U.shortlist.includes(id)) U.toggleShort(id); });
  refreshBasket();
}
function refreshBasket(){
  const n = U.shortlist.length;
  const b = $('[data-basket]', site); if (b){ $('.hcount', b)?.remove(); if (n) b.insertAdjacentHTML('beforeend', `<span class="hcount">${n}</span>`); b.setAttribute('aria-label', `Shortlist, ${n} items`); }
  const sl = $('#oBar'); if (sl){ const c = $('.hcount', sl); c.textContent = n; c.hidden = !n; sl.setAttribute('aria-label', `Your shortlist, ${n} items`); sl.classList.toggle('has', !!n); }
  const msg = $('#f-msg', site); if (msg && msg.dataset.auto !== '0') msg.value = SH.enquiryText();
}

/* ---------- modals and popovers ---------- */
function modal(html, cls = ''){
  closeModal();
  const m = document.createElement('div'); m.className = 'modal ' + cls; m.setAttribute('role', 'dialog');
  m.innerHTML = `<div class="box"><button class="x" type="button" data-mclose aria-label="Close">Close</button>${html}</div>`;
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-mclose]')) closeModal(); });
  copyVarsTo(m); document.body.appendChild(m); setTimeout(() => ($('input, button:not(.x)', m) || $('.x', m)).focus(), 30); return m;
}
function closeModal(){ $$('.modal').forEach(m => m.remove()); }
function copyVarsTo(el){ const cs = getComputedStyle(site); ['--bg', '--surf', '--surf2', '--ink', '--mut', '--line', '--brand', '--brandInk', '--brandTx', '--fH', '--fB', '--fM', '--r', '--hW', '--hSt', '--sh', '--fam'].forEach(v => el.style.setProperty(v, cs.getPropertyValue(v))); el.style.fontFamily = cs.getPropertyValue('--fB'); }
function quizModal(){
  SH.st.wiz = { step: 0, a: null, b: null };
  const m = modal(`<div class="hp" style="background:none" id="qzhp"><h2 style="margin:0 0 14px;font:var(--hW) 26px/1.1 var(--fH)">Which machine do you need?</h2><div id="qz">${SH.wizard()}</div></div>`);
  const hp = $('#qzhp', m); Object.assign(hp.dataset, { look: X.look, font: X.font });
  const redraw = () => { $('#qz', m).innerHTML = SH.wizard(); addPageLink(m); };
  m.addEventListener('click', e => {
    const b = e.target.closest('button, a'); if (!b) return; const d = b.dataset;
    if (d.w1){ SH.st.wiz = { step: 1, a: d.w1, b: null }; redraw(); }
    else if (d.w2 != null){ SH.st.wiz.step = 2; SH.st.wiz.b = +d.w2; redraw(); }
    else if (d.wback !== undefined || d.wreset !== undefined){ SH.st.wiz = { step: 0, a: null, b: null }; redraw(); }
    else if (d.add){ addIds(d.add); U.toast('Added to your shortlist'); }
  });
}
function addPageLink(root){
  const w = SH.st.wiz; if (w.step !== 2) return; const o = SH.wizStep2(w.a)[w.b];
  const ids = Array.isArray(o[1]) ? o[1] : o[1] === 'I' ? ['iqpower'] : [];
  if (!ids.length) return; const pid = P2PG[ids[0]];
  const acts = $('.wiz .acts', root); if (acts && pid) acts.insertAdjacentHTML('afterbegin', pl(pid, `Open ${esc(PG(pid).t)} →`, 'class="btng"'));
}
function comfortPop(btn){
  togglePop(btn, `<h5>Units</h5><div class="opts">${[['site', 'As published'], ['metric', 'Metric'], ['imperial', 'Imperial']].map(([k, t]) => `<button data-cunits="${k}" aria-pressed="${U.units === k}">${t}</button>`).join('')}</div>
    <h5>Text size</h5><div class="opts">${[90, 100, 112, 125].map(v => `<button data-cts="${v}" aria-pressed="${X.textsize === v}">${v}%</button>`).join('')}</div>
    ${X.vtheme ? `<h5>Theme</h5><div class="opts">${[['', 'As designed'], ['light', 'Light'], ['dark', 'Dark']].map(([k, t]) => `<button data-ctheme="${k}" aria-pressed="${(ST.visitor.look ? (['dark', 'blueprint'].includes(ST.visitor.look) ? 'dark' : 'light') : '') === k}">${t}</button>`).join('')}</div>` : ''}
    <h5>Contrast and motion</h5><div class="opts"><button data-ccontrast aria-pressed="${!!X.contrast}">High contrast</button><button data-cmotion aria-pressed="${motionEff() === 'off'}">Reduce motion</button></div>`);
}
function recentPop(btn){
  const r = store.get('recent', []).filter(id => id !== ST.cur && PG(id)).slice(0, 6);
  togglePop(btn, `<h5>Recently viewed</h5>${r.length ? r.map(id => pl(id, esc(PG(id).t), 'style="display:block;padding:6px 4px;text-decoration:none;font-weight:600"')).join('') : '<p class="hint" style="margin:0">Pages you open will show up here.</p>'}`);
}
function togglePop(btn, html){
  closeMega();
  const had = $('.hdrpop', site); if (had){ had.remove(); if (had._btn === btn) return; }
  const p = document.createElement('div'); p.className = 'hdrpop'; p.innerHTML = html; p._btn = btn; $('.shdr', site).appendChild(p);
}
function callbackModal(){
  modal(`<h2 style="margin:0 0 6px;font:var(--hW) 24px/1.1 var(--fH)">Request a call back</h2><p class="hint" style="margin:0 0 14px">Leave a number and a good time. Our sales team calls you back.</p>
    <form class="cb" id="cbf"><label class="tg" style="display:grid">Name<input id="cb-n" autocomplete="name" required></label><label class="tg" style="display:grid">Phone<input id="cb-p" type="tel" autocomplete="tel" required></label><label class="tg" style="display:grid">Best time<select id="cb-t"><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label><button class="btnp" type="submit" style="justify-self:start">Request a call</button><p class="hint" id="cb-ok" aria-live="polite"></p></form>`);
  $('#cbf').addEventListener('submit', e => { e.preventDefault(); $('#cb-ok').textContent = 'Thanks, we’ll call you back. (Draft site: this form is not connected yet, so nothing was sent.)'; });
}
function search(){
  if ($('.o-search')) return;
  const items = [
    ...SDX.PAGES.map(p => ({ t: p.t, s: 'Page', a: () => navigate(p.id) })),
    ...Object.entries(D.P).filter(([id, p]) => p.name && P2PG[id]).map(([id, p]) => ({ t: p.name, s: (p.sub || '') + ' · ' + PG(P2PG[id]).t, a: () => navigate(P2PG[id]) })),
    ...SDX.FAQ.map(f => ({ t: f[1], s: 'FAQ', a: () => { navigate('faq'); setTimeout(() => { const d = $$('.faqx details', site).find(x => x.dataset.q.startsWith(f[1].toLowerCase())); if (d){ d.open = true; d.scrollIntoView({ block: 'center' }); } }, 500); } })),
    ...$$('main :is(.sec,.psec,.tsec)', site).filter(s => s.dataset.sec).map(s => ({ t: s.dataset.sec, s: 'On this page', a: () => s.scrollIntoView({ behavior: 'smooth' }) }))
  ];
  const o = document.createElement('div'); o.className = 'o-search'; o.style.position = 'fixed'; o.style.zIndex = 320;
  o.innerHTML = `<div class="box"><input id="qs" placeholder="Search pages, products and FAQ answers" autocomplete="off"><ul id="qr"></ul><div class="foot">↑ ↓ to move · Enter to open · Esc to close</div></div>`;
  document.body.appendChild(o);
  const inp = $('#qs', o), ul = $('#qr', o); let act = 0, list = [];
  const draw = () => { const q = inp.value.trim().toLowerCase(); list = items.filter(i => !q || (i.t + ' ' + i.s).toLowerCase().includes(q)).slice(0, 10); act = Math.min(act, Math.max(0, list.length - 1)); ul.innerHTML = list.length ? list.map((i, n) => `<li><button class="${n === act ? 'act' : ''}" data-qi="${n}">${esc(i.t)}<small>${esc(i.s)}</small></button></li>`).join('') : '<li style="padding:10px;color:#5B6250">No match. Try “foil”, “woven” or “Brezo”.</li>'; };
  const close = () => o.remove(), pick = n => { const i = list[n]; close(); i && i.a(); };
  inp.addEventListener('input', () => { act = 0; draw(); });
  inp.addEventListener('keydown', e => { if (e.key === 'ArrowDown'){ act = Math.min(list.length - 1, act + 1); draw(); e.preventDefault(); } else if (e.key === 'ArrowUp'){ act = Math.max(0, act - 1); draw(); e.preventDefault(); } else if (e.key === 'Enter') pick(act); else if (e.key === 'Escape') close(); });
  ul.addEventListener('click', e => { const b = e.target.closest('[data-qi]'); if (b) pick(+b.dataset.qi); });
  o.addEventListener('click', e => { if (e.target === o) close(); });
  draw(); inp.focus();
}
function keysHelp(){
  modal(`<h2 style="margin:0 0 12px;font:var(--hW) 22px/1.1 var(--fH)">Shortcuts</h2>${[['/ or Ctrl K', 'Search'], ['1 – 6', 'Open a product page'], ['H', 'Home'], ['E', 'Enquiry or contact'], ['U', 'Switch units (product pages)'], ['S', 'Your shortlist'], ['Esc', 'Close']].map(k => `<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid var(--line)"><span>${k[1]}</span><kbd style="font:12px 'IBM Plex Mono',monospace;border:1px solid var(--line);border-bottom-width:2px;border-radius:5px;padding:1px 6px">${k[0]}</kbd></div>`).join('')}`);
}

/* ---------- navigation + transitions ---------- */
function navigate(id, o = {}){
  if (!PG(id)){ return; }
  if (id === ST.cur && !o.force){ scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const t = motionEff() === 'off' ? 'none' : X.trans;
  const go = () => { ST.cur = id; if (!o.pop) try { history.pushState({ p: id }, '', DRAFT.href(id)); } catch (e){} remember(id); render(); afterIn(t, o.src); };
  closeModal(); $('.o-search')?.remove();
  if (t === 'wipe'){ ptrans.className = 'ptrans wipe'; ptrans.innerHTML = '<i></i><i></i><i></i>'; const cs = getComputedStyle(site); ptrans.style.setProperty('--tbg', cs.getPropertyValue('--brand')); ptrans.style.setProperty('--tbg2', cs.getPropertyValue('--brandD')); setTimeout(go, 300); setTimeout(() => { ptrans.className = 'ptrans'; ptrans.innerHTML = ''; }, 720); return; }
  if (t === 'grow' && o.src){ const img = o.src.querySelector ? (o.src.matches('img') ? o.src : o.src.querySelector('img')) : null; if (img){ const r = img.getBoundingClientRect(); const c = img.cloneNode(); c.className = 'growimg'; Object.assign(c.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }); document.body.appendChild(c); go(); requestAnimationFrame(() => { const tgt = $('.thero .vis, .hubhero .vis, .pghead', site); const tr = tgt ? tgt.getBoundingClientRect() : { left: innerWidth * 0.5, top: 120, width: innerWidth * 0.4, height: innerHeight * 0.4 }; Object.assign(c.style, { left: tr.left + 'px', top: tr.top + 'px', width: tr.width + 'px', height: tr.height + 'px', opacity: '0.0' }); }); setTimeout(() => c.remove(), 650); return; } }
  go();
}
function afterIn(t){ const mn = $('main', site); if (!mn) return; if (t === 'fade' || t === 'grow') mn.classList.add('pg-in-fade'); if (t === 'slide') mn.classList.add('pg-in-slide'); }
function remember(id){ if (!X.recent && !X.resume) return; const r = store.get('recent', []).filter(x => x !== id); r.unshift(id); store.set('recent', r.slice(0, 10)); }
addEventListener('popstate', e => { const id = (e.state && e.state.p) || DRAFT.idFromPath(); if (PG(id) && id !== ST.cur) navigate(id, { pop: true }); });

/* ---------- scroll + pointer driven effects ---------- */
let sRAF = 0;
function onScroll(){
  if (sRAF) return;
  sRAF = requestAnimationFrame(() => {
    sRAF = 0; const st = scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight), vh = innerHeight;
    const pr = $('#oProg'); if (pr) pr.style.width = (st / max * 100) + '%';
    const bar = $('#oBar'), heroEl = $('[data-hero], .hero', site);
    if (bar){ const on = st > (heroEl ? heroEl.offsetHeight * 0.8 : 500); bar.classList.toggle('on', on); bar.setAttribute('aria-hidden', !on); bar.tabIndex = on ? 0 : -1; }
    const rail = $$('.o-rail button', ovl); if (rail.length){ let cur = 0; rail.forEach((b, i) => { const s = document.getElementById(b.dataset.goto); if (s && s.getBoundingClientRect().top < vh * 0.4) cur = i; }); rail.forEach((b, i) => b.classList.toggle('on', i === cur)); }
    const top = $('[data-top]'); if (top) top.hidden = st < 800;
    if (X.parallax && motionEff() === 'full') $$('[data-depth]', site).forEach(el => { const r = el.parentElement.getBoundingClientRect(); const c = (r.top + r.height / 2) - vh / 2; el.style.transform = `translate3d(0,${(-c * +el.dataset.depth).toFixed(1)}px,0)`; });
    const sr = $('.srail[data-pin="1"]', site); if (sr && sr._over){ const r = sr.getBoundingClientRect(), span = sr.offsetHeight - vh * 0.75; const k = Math.min(1, Math.max(0, -r.top / Math.max(1, span))); $('.track', sr).style.transform = `translateX(${-k * sr._over}px)`; }
    if (X.sturn && motionEff() !== 'off'){ (A3.stages || []).forEach(s => { if (!s.canvas || !s.canvas.isConnected) return; const r = s.canvas.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return; if (s._y0 == null) s._y0 = s.yaw; s.auto = false; s.yaw = s._y0 + ((r.top + r.height / 2) / vh - 0.5) * -90; s.dirty = true; }); $$('.mvph img, .scard .im img', site).forEach(img => { const r = img.getBoundingClientRect(); img.style.transform = `perspective(800px) rotateY(${(((r.top + r.height / 2) / vh) - 0.5) * 24}deg)`; }); }
    if (X.shift){ let best = null, bd = 1e9; $$('main :is(.sec,.psec,.tsec)', site).forEach((s, i) => { if (s.closest('.slot')) return; const r = s.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - vh / 2); if (d < bd){ bd = d; best = i; } }); site.style.setProperty('--shiftk', best % 2 ? '1' : '0'); site.style.background = best % 2 ? 'color-mix(in srgb, var(--bg) 90%, var(--fam))' : ''; }
    FX.bgPaint();
  });
}
addEventListener('scroll', onScroll, { passive: true });
let rzT = 0;
addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { fitHeader(); if (X.sheets === 'stack') stackTops(); if (X.toc) toc(); }, 120); onScroll(); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitHeader());
addEventListener('pointermove', e => {
  ptr.x = e.clientX / innerWidth * 2 - 1; ptr.y = e.clientY / innerHeight * 2 - 1;
  const t = $('.torch'); if (t){ t.style.setProperty('--mx', e.clientX + 'px'); t.style.setProperty('--my', e.clientY + 'px'); const dark = ['dark', 'blueprint'].includes(X.look) || !!(e.target.closest && e.target.closest('.hero, .thero, .p-stage, .door .vis, .hubhero .vis, .ftr')); t.classList.toggle('on', dark); }
  const c = $('.ccur'); if (c){ c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; const el = e.target.closest && e.target.closest('[data-page], [data-door], .p-stage canvas, [data-sl], input[type=range], [data-zoom], .zoomable, [data-add], [data-sladd]'); const lab = !el ? '' : el.matches('[data-page]') ? 'Open' : el.matches('[data-door]') ? 'Explore' : el.matches('canvas') ? 'Drag to turn' : el.matches('[data-sl],[data-sladd],[data-add]') ? 'Shortlist' : el.matches('input') ? 'Slide' : 'Zoom'; $('span', c).textContent = lab; c.classList.toggle('lab', !!lab); }
  if (X.magnet && motionEff() !== 'off'){ const b = e.target.closest && e.target.closest('.btnp, .btng, .p-btn, .fbtn, .quote'); $$('.magn').forEach(x => { if (x !== b){ x.style.transform = ''; x.classList.remove('magn'); } }); if (b){ const r = b.getBoundingClientRect(); b.classList.add('magn'); b.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 10}px,${((e.clientY - r.top) / r.height - 0.5) * 8}px)`; } }
  if ((X.tilt || X.hover === 'tilt') && motionEff() !== 'off'){ const cd = e.target.closest && e.target.closest('.scard, .door, .tile, .par, .strengths>div, .quotes figure, .prevnext a'); $$('.tilted').forEach(x => { if (x !== cd){ x.style.transform = ''; x.classList.remove('tilted'); } }); if (cd){ const r = cd.getBoundingClientRect(); cd.classList.add('tilted'); cd.style.transform = `perspective(900px) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 8}deg) rotateX(${-((e.clientY - r.top) / r.height - 0.5) * 6}deg) translateY(-3px)`; } }
}, { passive: true });

/* quick view on product links */
let qvT = 0;
document.addEventListener('pointerover', e => {
  if (!X.quick || !matchMedia('(pointer:fine)').matches) return;
  const a = e.target.closest && e.target.closest('[data-qv], .megap a[data-page], .prevnext a[data-page]'); const old = $('.qv');
  if (!a){ if (old && !e.target.closest('.qv')) old.remove(); return; }
  const id = a.dataset.qv || a.dataset.page, pid = MAINP[id]; if (!pid || !D.P[pid]) return;
  clearTimeout(qvT); qvT = setTimeout(() => {
    $('.qv')?.remove(); const p = D.P[pid], r = a.getBoundingClientRect(); const q = document.createElement('div'); q.className = 'qv'; copyVarsTo(q);
    q.innerHTML = `${p.img && p.img !== 'null' ? `<img src="img/${p.img}" alt="">` : ''}<b>${esc(p.name)}</b><span style="color:var(--mut)">${esc(p.sub || '')}</span>${(p.spec || []).filter(s => s[1] && !s[2]).slice(0, 3).map(s => `<div class="r"><span>${esc(s[0])}</span><span style="color:var(--ink)">${esc(s[1])}</span></div>`).join('')}`;
    document.body.appendChild(q); const left = Math.min(innerWidth - 296, r.right + 10 < innerWidth - 290 ? r.right + 10 : r.left - 290); q.style.left = Math.max(8, left) + 'px'; q.style.top = Math.max(60, Math.min(innerHeight - 280, r.top)) + 'px';
  }, 380);
});
document.addEventListener('pointerout', e => { if (e.target.closest && e.target.closest('[data-qv], .megap a, .prevnext a')){ clearTimeout(qvT); setTimeout(() => { if (!document.querySelector(':hover.qv')) $('.qv')?.remove(); }, 120); } });

/* ---------- one click handler for the whole site (capture: runs before the product pages' own handler) ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  if (!t.closest || !(t.closest('#site') || t.closest('.modal') || t.closest('.fly') || t.closest('#ovl') || t.closest('.hdrpop'))) return;
  // click feedback
  const fb = t.closest('button, a, .scard, .door');
  if (fb && X.click === 'ripple' && motionEff() !== 'off' && !fb.closest('.lb, .dr')){ const r = fb.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2; const s = document.createElement('span'); s.className = 'rip'; Object.assign(s.style, { width: d + 'px', height: d + 'px', left: (e.clientX - r.left - d / 2) + 'px', top: (e.clientY - r.top - d / 2) + 'px' }); if (getComputedStyle(fb).position === 'static') fb.style.position = 'relative'; fb.style.overflow = fb.style.overflow || 'hidden'; fb.appendChild(s); setTimeout(() => s.remove(), 600); }
  if (fb && X.click === 'burst' && motionEff() !== 'off'){ const b = document.createElement('div'); b.className = 'burst'; b.style.left = (e.clientX - 22) + 'px'; b.style.top = (e.clientY - 15) + 'px'; copyVarsTo(b); b.innerHTML = `<svg viewBox="0 0 440 304"><path d="M0 299 75 299 220 5 147 5ZM257 5 293 5 330 78 220 78ZM202 115 348 115 385 188 165 188ZM147 226 403 226 440 299 110 299Z"/></svg>`; document.body.appendChild(b); setTimeout(() => b.remove(), 520); }
  // clicks outside the header menus close them
  if (!t.closest('#megap, [data-mega]')) closeMega();
  if (!t.closest('.hdrpop, [data-comfort], [data-recent]')) $('.hdrpop', site)?.remove();
  if (!t.closest('#snav, [data-burger]')){ const n = $('#snav', site); if (n && n.classList.contains('open')){ n.classList.remove('open'); $('[data-burger]', site)?.setAttribute('aria-expanded', 'false'); } }
  const b = t.closest('button, a, [data-door], summary'); if (!b) return;
  const d = b.dataset;
  if (d.page){ e.preventDefault(); e.stopPropagation(); closeMega(); $('#snav', site)?.classList.remove('open'); navigate(d.page, { src: b }); return; }
  if (d.goto){ e.preventDefault(); document.getElementById(d.goto)?.scrollIntoView({ behavior: motionEff() === 'off' ? 'auto' : 'smooth' }); return; }
  if (d.go && !b.closest('.pp')){ e.preventDefault(); e.stopPropagation(); if (PG(d.go)) navigate(d.go); else document.getElementById(d.go)?.scrollIntoView({ behavior: motionEff() === 'off' ? 'auto' : 'smooth' }); return; }
  if (d.mega !== undefined){ const m = $('#megap', site); if (!m.hidden && performance.now() - megaAt < 500) return; if (m.hidden){ openMega(); if ($('.shdr', site).classList.contains('compact')){ $('#snav', site).classList.remove('open'); $('[data-burger]', site).setAttribute('aria-expanded', 'false'); } } else closeMega(); return; }
  if (d.burger !== undefined){ const n = $('#snav', site); closeMega(); n.classList.toggle('open'); b.setAttribute('aria-expanded', n.classList.contains('open')); return; }
  if (d.search !== undefined){ search(); return; }
  if (d.quiz !== undefined){ quizModal(); return; }
  if (d.callback !== undefined){ callbackModal(); return; }
  if (d.basket !== undefined){ U.openDrawer(); return; }
  if (d.recent !== undefined){ recentPop(b); return; }
  if (d.comfort !== undefined){ comfortPop(b); return; }
  if (d.lang !== undefined){ U.toast('English only for now: Hindi copy is needed from Arshad'); return; }
  if (d.cunits){ U.setUnits(d.cunits); $$('[data-cunits]').forEach(x => x.setAttribute('aria-pressed', x === b)); return; }
  if (d.cts){ ST.visitor.textsize = +d.cts; render({ keepScroll: true, calm: true }); return; }
  if (d.ctheme !== undefined){ if (!d.ctheme) delete ST.visitor.look; else ST.visitor.look = d.ctheme === 'dark' ? 'dark' : (X.look === 'dark' || X.look === 'blueprint' ? 'light' : ST.S.look === 'dark' ? 'light' : ST.S.look); render({ keepScroll: true, calm: true }); return; }
  if (d.ccontrast !== undefined){ ST.visitor.contrast = X.contrast ? 0 : 1; render({ keepScroll: true, calm: true }); return; }
  if (d.cmotion !== undefined || d.rm !== undefined){ ST.visitor.motion = motionEff() === 'off' ? (ST.S.motion === 'off' ? 'subtle' : ST.S.motion) : 'off'; render({ keepScroll: true, calm: true }); U.toast(motionEff() === 'off' ? 'Motion off' : 'Motion on'); return; }
  if (d.share !== undefined){ const url = location.href.split('#')[0]; U.copy(url, 'Link to this page'); return; }
  if (d.brochure !== undefined){ U.toast('Brochure PDF to come from Arshad'); return; }
  if (d.top !== undefined){ scrollTo({ top: 0, behavior: motionEff() === 'off' ? 'auto' : 'smooth' }); return; }
  if (d.add){ e.preventDefault(); addIds(d.add); return; }
  if (d.sladd){ U.toggleShort(d.sladd); refreshBasket(); b.textContent = U.shortlist.includes(d.sladd) ? '★ Shortlisted' : '☆ Shortlist'; return; }
  if (d.sl && !b.closest('.pp')){ setTimeout(refreshBasket, 0); }
  if (d.sl && b.closest('.pp')){ setTimeout(refreshBasket, 0); }
  if (d.drawer){ e.preventDefault(); drawer(d.drawer); return; }
  if (d.close !== undefined){ closeDrawer(); return; }
  if (d.copy && !b.closest('.pp')){ U.copy(d.copy); return; }
  if (d.finder){ const slot = b.closest('.fslot'); slot.innerHTML = SH.finderHTML(d.finder, null); return; }
  if (d.fa != null){ const f = b.closest('.finder'); f.outerHTML = SH.finderHTML(f.dataset.fk, +d.fa); return; }
  if (d.stage){ SH.st.stageSel = d.stage; render({ keepScroll: true, calm: true }); return; }
  if (d.ind != null){ const on = b.getAttribute('aria-pressed') !== 'true'; $$('[data-ind]', site).forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', on); const bs = on ? H.INDUSTRIES[+d.ind][1].split(' ') : null; $$('[data-ib]', site).forEach(x => { const hit = !bs || bs.includes(x.dataset.ib); x.classList.toggle('dim', !hit); x.classList.toggle('hit', !!bs && hit); }); return; }
  if (d.cf){ $$('[data-cf]', site).forEach(x => x.setAttribute('aria-pressed', x === b)); $$('[data-sector]', site).forEach(x => x.classList.toggle('gone', d.cf !== 'All' && x.dataset.sector !== d.cf)); return; }
  if (d.w1 && !b.closest('.modal')){ SH.st.wiz = { step: 1, a: d.w1, b: null }; redrawWiz(); return; }
  if (d.w2 != null && !b.closest('.modal')){ SH.st.wiz.step = 2; SH.st.wiz.b = +d.w2; redrawWiz(); return; }
  if ((d.wback !== undefined || d.wreset !== undefined) && !b.closest('.modal')){ SH.st.wiz = { step: 0, a: null, b: null }; redrawWiz(); return; }
  if (d.clp !== undefined){ clPanel(b.getAttribute('aria-expanded') !== 'true'); return; }
  if (d.fab){ const box = $('.o-fab', ovl); $('.pop', box)?.remove(); const msg = 'Hello Arshad, I would like details on: ' + (U.shortlist.map(id => D.P[id].name).join(', ') || PG(ST.cur).t);
    box.insertAdjacentHTML('beforeend', `<div class="pop"><b>${d.fab === 'wa' ? 'WhatsApp sales' : 'Call sales'}</b><span>${esc(SDX.CONTACT.mobile)}</span>${d.fab === 'wa' ? `<span style="color:#A9B09A;font-size:12px">Message ready: “${esc(msg)}”</span><button data-copy="${esc(msg)}">Copy message</button>` : `<span style="color:#A9B09A;font-size:12px">On phones this starts a call.</span>`}<button data-copy="${esc(SDX.CONTACT.mobile)}">Copy number</button></div>`); return; }
  if (d.faqtab){ $$('[data-faqtab]', site).forEach(x => x.setAttribute('aria-pressed', x === b)); $$('.faqx details[data-g]', site).forEach(x => x.hidden = x.dataset.g !== d.faqtab); return; }
  if (d.mclose !== undefined) return;
  const dr = b.closest('[data-door]');
  if (dr && !t.closest('.finder, .peek button, a.go, .linkb')){
    const bb = SH.brand(dr.dataset.door);
    if (bb.ext){ if (!t.closest('a')) window.open(bb.ext, '_blank', 'noopener'); return; }
    if (X.hero === 'c' && SH.st.openDoor !== bb.k){ SH.st.openDoor = bb.k; $$('.doors[data-v="c"] .door', site).forEach(x => x.classList.toggle('open', x.dataset.door === bb.k)); return; }
    if (X.drawer){ drawer(bb.k); return; }
    navigate(HUBOF[bb.k] || 'simco', { src: dr });
  }
  if (X.gallery && t.matches('img.zoomable') && !t.closest('a')){ U.lightbox(t.src, t.alt); }
}, true);
function redrawWiz(){ $$('#wiz', site).forEach(w => { w.outerHTML = SH.wizard(); }); addPageLink(site); }
function clPanel(open){
  const box = $('.o-cl', ovl); if (!box) return; $('.pan', box)?.remove(); $('[data-clp]', box).setAttribute('aria-expanded', open); if (!open) return;
  box.insertAdjacentHTML('beforeend', `<div class="pan"><small>Show extra detail across the page</small>${[['clSpecs', 'Specs', 'key figures on each product'], ['clInd', 'Industries', 'who each product is for'], ['clHow', 'How it works', 'the process in steps']].map(o => `<label><input type="checkbox" data-cl="${o[0]}" ${X[o[0]] ? 'checked' : ''}> <span>${o[1]} <small>· ${o[2]}</small></span></label>`).join('')}</div>`);
}
document.addEventListener('change', e => { const c = e.target.dataset && e.target.dataset.cl; if (c){ ST.S[c] = e.target.checked ? 1 : 0; site.dataset[c] = ST.S[c] ? '1' : '0'; SITE.changed && SITE.changed(); } });
document.addEventListener('input', e => {
  const id = e.target.id;
  if (id === 'fqs' || id === 'fqs2'){ const q = e.target.value.trim().toLowerCase(); const items = $$(id === 'fqs' ? '#faqs details' : '.faqx details', site); let n = 0; items.forEach(d => { const hit = !q || d.dataset.q.includes(q); d.hidden = !hit && !(d.dataset.g && false); if (hit){ n++; if (q) d.open = true; } }); const fn = $('#fqn', site); if (fn) fn.textContent = q ? `${n} of ${items.length} answers` : ''; }
  if (id === 'f-msg') e.target.dataset.auto = '0';
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'enqForm') return; e.preventDefault();
  const ok = $('#f-ok', site), n = ($('#f-name', site) || {}).value || '', m = ($('#f-mail', site) || {}).value || '';
  ok.textContent = !n.trim() || !/.+@.+\..+/.test(m) ? 'Add your name and a valid email so the team can reply.' : 'Thanks, we’ll be in touch. (Draft site: this form is not connected yet, so nothing was sent.)';
});
document.addEventListener('keydown', e => {
  if (document.body.classList.contains('lp-open')) return;
  const tag = (e.target.tagName || '').toLowerCase(); if (['input', 'textarea', 'select'].includes(tag)) return;
  if (e.key === 'Escape'){ closeModal(); $('.o-search')?.remove(); closeDrawer(); $('.hdrpop', site)?.remove(); $('#megap', site)?.setAttribute('hidden', ''); return; }
  if ((e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) && X.search){ e.preventDefault(); search(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey || !X.keys) return;
  const isProd = PG(ST.cur).kind === 'product';
  if (e.key === '?' && !isProd){ e.stopPropagation(); keysHelp(); return; }
  if (/^[1-6]$/.test(e.key)){ navigate(SDX.PRODUCT_ORDER[+e.key - 1]); return; }
  if (e.key.toLowerCase() === 'h'){ navigate('home'); return; }
  if (e.key.toLowerCase() === 'e' && !isProd){ e.stopPropagation(); navigate('contact'); return; }
  if (e.key.toLowerCase() === 's' && !isProd){ e.stopPropagation(); U.openDrawer(); return; }
});

/* ---------- start ---------- */
function resumeOffer(){
  if (!X.resume) return; const r = store.get('recent', []); const last = r[0];
  if (!last || last === ST.cur || !PG(last) || last === 'home') return;
  const el = document.createElement('div'); el.className = 'resume'; el.innerHTML = `<span>Pick up where you left off: <b>${esc(PG(last).t)}</b></span><button data-res="${last}">Open</button><button class="x" data-resx>Not now</button>`;
  document.body.appendChild(el); el.addEventListener('click', e => { if (e.target.dataset.res) navigate(e.target.dataset.res); el.remove(); }); setTimeout(() => el.remove(), 9000);
}
window.SITE = Object.assign(window.SITE || {}, { ST, eff, render, navigate, PG, store, refreshBasket, motionEff, search, quizModal, resumeOffer, BUILD, veilK, FEAT, featOff, openMega, closeMega, TPLSEL: { tHero: '.thero', tHow: '.thow', tModels: '.tmodels', tSpecs: '.tspecs', tDemo: '.tdemo', tInd: '.tind', tFaq: '.tfaq', tEnq: '.tenq' } });
// a live getter (Object.assign would copy a stale snapshot of X)
Object.defineProperty(window.SITE, 'X', { get: () => X, configurable: true });
FX.init(null);
})();
