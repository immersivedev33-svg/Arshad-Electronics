/* Six product page builds (copied from pages-build.js without its lab shell) for the Arshad Site Lab. */
(function(){
'use strict';
const U = window.PU, D = window.PD, T = window.THREE;
const { $, $$, esc, cv } = U;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const V3 = (x, y, z) => new T.Vector3(x, y, z);
const box3 = o => new T.Box3().setFromObject(o);
D.P.iqpower = { name: 'IQ Power', sub: 'Simco-Ion static neutralising system', img: null, spec: [['Applications', 'Plastics and packaging lines'], ['Models and specs', null], ['Datasheet', null]] };
D.P.iqeasy = { name: 'IQ Easy', sub: 'Simco-Ion static neutralising bar', img: null, spec: [['Applications', 'Plastics and packaging lines'], ['Bar lengths and specs', null], ['Datasheet', null]] };
const get = id => A3.load(id).then(d => A3.build(d));
const range = (id, label, min, max, step, val, fmt) => `<div class="p-rng"><div class="row"><label for="${id}">${esc(label)}</label><output id="${id}o" for="${id}">${esc(fmt(val))}</output></div><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
function bindRange(r, id, fmt, on){ const i = $('#' + id, r), o = $('#' + id + 'o', r); const f = () => { o.textContent = fmt(+i.value); on(+i.value); }; i.addEventListener('input', f); return { i, get v(){ return +i.value; }, set(v){ i.value = v; f(); } }; }
const IND_ICON = {
  'Food': '<path d="M7 10h10l-1 10H8L7 10z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
  'Cosmetics and personal care': '<rect x="9" y="8" width="6" height="12" rx="1.5"/><path d="M10 8V5h4v3"/>',
  'Pharmaceuticals': '<rect x="7" y="9" width="10" height="11" rx="2"/><path d="M8 9V6h8v3M12 12v5M9.5 14.5h5"/>',
  'Adhesives': '<path d="M9 20h6V11l-3-4-3 4z"/><path d="M12 7V3"/>',
  'Dairy': '<path d="M8 9l2-5h4l2 5v11H8z"/><path d="M8 13h8"/>',
  'Agro-chemicals': '<path d="M12 20c0-6 3-10 7-12-1 6-3 10-7 12zM12 20c0-4-2-7-6-8 1 4 2 7 6 8z"/>',
  'Detergents': '<path d="M8 8h8v12H8z"/><path d="M10 8V5h6"/><circle cx="12" cy="14" r="2"/>',
  'Lubricants': '<path d="M5 11h9l4-3 2 2-4 3v6H5z"/><path d="M9 11V8h3"/>'
};
const indIcon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">${IND_ICON[n] || '<circle cx="12" cy="12" r="7"/>'}</svg>`;

/* ============ 1 · Brezo series — Industrial light, datasheet split ============ */
const BREZO = ['brezop', 'brezoa', 'brezo2', 'brezo3'];
const BFIGS = {
  brezop: [[4, '–6', 'bottles per minute'], ['28–83', ' mm', 'cap diameter'], ['0–350', ' mm', 'head height']],
  brezoa: [[30, ' ft/min', 'line speed'], ['20–120', ' mm', 'cap diameter'], [45, ' °C', 'max ambient']],
  brezo2: [[60, ' ft/min', 'line speed'], ['20–120', ' mm', 'cap diameter'], ['MS or SS 304', '', 'build']],
  brezo3: [['60–80', ' ft/min', 'sealing speed'], ['20–120', ' mm', 'neck diameter'], [2000, ' W', 'max power']]
};
const brezo = {
  id: 'brezo', t: 'Brezo series', vert: 'Fluxosealer · air-cooled sealers', img: 'cut-fluxosealer--brezo--3css.webp', style: 'industrial',
  notes: { layout: 'A · Datasheet split: machine pinned beside collapsible specs, model ladder in the hero', style: 'Industrial light: off-white, olive, amber actions', motion: ['Headline words rise in', 'Figures count up', 'Induction field pulses over the real jar photo', 'Seal steps light in sequence'],
    assets: ['Live 3D Brezo: switch P / A / 2 / 3C SS, run the line (bottles, coil, tower light)', 'Seal check: container, cap, foil gsm, output → which models fit', 'Tamper test: twist the cap off, the foil stays'],
    qol: ['Units: as published / metric / imperial', 'Copy or save the spec as .csv', 'Shortlist + side-by-side compare', 'Compare table with “only differences”', 'Variant buttons fill the enquiry', 'Sticky bar, progress, shortcuts'] },
  render(){
    return `${U.mini('Brezo series', 'Air-cooled induction cap sealers', 'brezo3')}${U.nav('brezo')}${U.crumbs(['Home', 'Fluxosealer induction cap sealers', 'Brezo series'])}
    <div class="p-wrap"><section class="bz-hero" data-hero>
      <div><p class="p-kick">Fluxosealer® · Brezo series</p><h1 class="p-h1">${U.splitWords('Air-cooled induction cap sealers')}</h1>
        <p class="p-lede">${esc(D.sealing.line)} From a hand-held lab sealer to a stainless high-speed line, every Brezo seals foil to the rim without touching the product.</p>
        <div class="bz-ladder" role="tablist" aria-label="Brezo models">${BREZO.map(p => `<button type="button" role="tab" data-m="${p}" aria-selected="${p === 'brezo3'}"><b>${esc(D.P[p].name)}</b><span>${esc(D.P[p].sub)}</span></button>`).join('')}</div>
        <div id="bzFigs"></div>
        <div class="p-actions"><a class="p-btn acc" href="#enq">Get a quote</a><button class="p-btn" type="button" data-sl="brezo3" id="bzSl">☆ Shortlist</button><a class="p-btn" href="#check">Will it seal my container?</a></div></div>
      <div class="p-stage" id="bzStage"><canvas aria-label="3D model of the selected Brezo. Drag to turn."></canvas><div class="p-ov"><div class="p-sbar t"><button class="p-sbtn acc" type="button" data-run>Run the line</button><button class="p-sbtn" type="button" data-gen aria-pressed="false">Show generated faces</button></div><span class="p-cap" id="bzCaption">Drag to turn</span></div></div>
    </section></div>
    <section class="p-sec" id="datasheet"><div class="p-wrap"><div class="bz-split">
      <div class="pin"><button type="button" class="bz-photo" id="bzPhoto" aria-label="Enlarge the product photo"><img id="bzImg" alt=""></button><p class="p-note">Tap the photo to enlarge it.</p></div>
      <div><p class="p-kick" id="bzKick"></p><h2 class="p-h2" id="bzName"></h2><p id="bzDesc" style="color:var(--muted);max-width:620px"></p><div id="bzSpec"></div>
        <div id="bzVarW"><h3 class="p-h3" style="margin-top:30px">Variants and options</h3><div id="bzVar"></div></div>
        <h3 class="p-h3" style="margin-top:30px">Features</h3><div id="bzFeat"></div>
        <div id="bzSafeW"><h3 class="p-h3" style="margin-top:30px">Safety and interlocks</h3><div id="bzSafe"></div></div></div>
    </div></div></section>
    <section class="p-sec" id="how"><div class="p-wrap"><div class="bz-band rv" style="background-image:url(img/jars-hero.jpg)"><div class="field" aria-hidden="true"></div><div class="txt"><p class="p-kick" style="color:#C9D0B6">How the seal is made</p><h2 class="p-h2" style="color:#F4F6EE">No contact. Just a field.</h2><p style="margin:0">${esc(D.sealing.what)}</p></div></div>
      <div class="bz-steps" id="bzSteps"><div><b>Fill</b>Product goes in on your filling line.</div><div><b>Cap</b>The cap goes on with the foil liner inside.</div><div><b>Seal</b>The coil’s field heats the foil and its coating bonds to the rim.</div><div><b>Check</b>No-foil detection rejects any bottle without a liner.</div></div></div></section>
    <section class="p-sec" id="check"><div class="p-wrap"><h2 class="p-h2 rv">Will it seal my container?</h2><p class="p-sub">Three questions. The check uses the figures on this page and Arshad’s five factors for a good seal.</p>
      <div class="p-card bz-check"><div style="display:grid;gap:18px">
        <label class="p-field"><span>Container</span><select id="bzCont">${D.sealing.containers.map(c => `<option>${esc(c)}</option>`).join('')}<option value="x">Something else, or an uneven rim</option></select></label>
        ${range('bzCap', 'Cap diameter', 10, 140, 1, 63, v => v + ' mm')}${range('bzGsm', 'Foil liner', 10, 50, 1, 25, v => v + ' gsm')}
        <p class="p-note" style="margin:0">Speeds are the line speeds Arshad publishes for each model. Arshad presets heating to your line speed and bottle.</p></div>
        <div class="bz-res" id="bzRes" aria-live="polite"></div></div></div></section>
    <section class="p-sec"><div class="p-wrap"><div class="bz-tamper">
      <svg viewBox="0 0 300 320" id="bzTamper" role="img" aria-label="Bottle neck with an induction-sealed foil and a screw cap">
        <defs><linearGradient id="bzFoil" x1="0" x2="1"><stop offset="0" stop-color="#9aa1a6"/><stop offset=".5" stop-color="#f4f6f7"/><stop offset="1" stop-color="#8d949a"/></linearGradient><clipPath id="bzCapClip"><rect x="88" y="0" width="124" height="80" rx="8"/></clipPath></defs>
        <path d="M100 150 h100 v20 c0 10 40 20 40 50 v90 H60 v-90 c0-30 40-40 40-50z" fill="var(--surf)" stroke="var(--ink)" stroke-width="2"/>
        <rect x="100" y="140" width="100" height="14" fill="var(--surf2)" stroke="var(--ink)" stroke-width="2"/>
        <g id="bzFoilG"><rect x="98" y="134" width="104" height="7" rx="2" fill="url(#bzFoil)" stroke="var(--ink)" stroke-width="1"/><path id="bzTear" d="" fill="var(--bg)" stroke="var(--ink)" stroke-width="1"/></g>
        <g id="bzCapG" transform="translate(0,62)"><g clip-path="url(#bzCapClip)"><rect x="88" y="0" width="124" height="80" rx="8" fill="var(--brand)"/><g id="bzRidges" stroke="rgba(0,0,0,.28)" stroke-width="3">${Array.from({ length: 24 }, (_, i) => `<line x1="${80 + i * 8}" y1="6" x2="${80 + i * 8}" y2="74"/>`).join('')}</g></g><rect x="88" y="0" width="124" height="80" rx="8" fill="none" stroke="var(--ink)" stroke-width="2"/></g>
        <text x="150" y="300" text-anchor="middle" font-size="13" fill="var(--muted)" id="bzTxt">Sealed</text>
      </svg>
      <div><h2 class="p-h2 rv">Tamper evident, by design</h2><p class="p-sub">Twist the cap off. The foil stays bonded to the rim, so anyone can see whether a pack has been opened.</p>
        ${range('bzTwist', 'Twist the cap', 0, 100, 1, 0, v => Math.round(v * 5.4) + '°')}
        <div class="p-actions" style="margin-top:14px"><button class="p-btn sm" type="button" id="bzPeel">Try to reseal it</button></div>
        <p class="p-note" id="bzTmsg" aria-live="polite" style="min-height:1.5em"></p>
        <div style="margin-top:18px">${U.list(D.sealing.benefits)}</div></div></div></div></section>
    <section class="p-sec" id="compare"><div class="p-wrap"><h2 class="p-h2 rv">Compare the range</h2><p class="p-sub">Brezo models side by side with the water-cooled Aurae 3. Units follow your setting above.</p>
      <div class="p-chips" style="margin-bottom:12px"><button class="p-chip" type="button" id="bzDiff" aria-pressed="false">Only differences</button></div><div class="cmp-wrap"><table class="cmp all" id="bzCmp"></table></div></div></section>
    <section class="p-sec"><div class="p-wrap"><h2 class="p-h2 rv">Where Brezo sealers work</h2><p class="p-sub">Any capped container with a uniform mouth: ${esc(D.sealing.containers.join(', '))}.</p>
      <div class="ind">${D.sealing.industries.map(n => `<div>${indIcon(n)}<b>${esc(n)}</b></div>`).join('')}</div></div></section>
    ${U.faq(D.faq.sealing)}${U.enquiry({ products: ['brezo3', 'brezo2', 'brezoa', 'brezop', 'aurae3'], fields: [['cap', 'Cap diameter', 'e.g. 38 mm'], ['speed', 'Line speed or output', 'e.g. 40 bottles/min'], ['cont', 'Container', 'e.g. HDPE bottle'], ['foil', 'Foil liner', 'e.g. 25 gsm']] })}${U.footer()}`;
  },
  init(r){
    const st = U.stage3d($('#bzStage canvas', r), { yaw: -32, pitch: 12, fit: 0.95, zoom: true });
    let g = null, rg = null, cur = 'brezo3', tok = 0, gen = false;
    const runB = $('[data-run]', r), genB = $('[data-gen]', r);
    async function show3d(pid){
      const my = ++tok, ng = await get(D.P[pid].m3); if (my !== tok) return;
      if (g) st.remove(g); g = st.add(ng); st.frame([g], 0.95); A3.setHighlight(g, gen);
      rg = A3.rig(g); rg.s.standby = true; rg.s.speed = 0.7;
      if (rg.conv){ rg.s.flow = 0.45; rg.flowSetup(); }
      runB.disabled = !rg.conv; runB.textContent = rg.conv ? 'Run the line' : 'Hand-held: no conveyor';
    }
    st.onFrame(dt => rg ? rg.update(dt) : false);
    runB.onclick = () => { if (!rg) return; rg.s.on = !rg.s.on; runB.textContent = rg.s.on ? 'Stop the line' : 'Run the line'; };
    genB.onclick = () => { gen = !gen; genB.setAttribute('aria-pressed', gen); if (g) A3.setHighlight(g, gen); st.dirty = true; };
    function pick(pid){
      cur = pid; const p = D.P[pid];
      $$('.bz-ladder [data-m]', r).forEach(b => b.setAttribute('aria-selected', b.dataset.m === pid));
      $('#bzFigs', r).innerHTML = U.figs(BFIGS[pid]); $$('#bzFigs [data-count]', r).forEach(el => { const to = +el.dataset.count; el.textContent = to.toLocaleString('en-IN'); });
      $('#bzSl', r).dataset.sl = pid; $('.p-mini [data-sl]', r).dataset.sl = pid; $('.p-mini b', r).textContent = p.name; $('.p-mini .k', r).textContent = p.sub;
      $('#bzImg', r).src = 'img/' + p.img; $('#bzImg', r).alt = p.name + ' product photo'; $('#bzPhoto', r).dataset.zoom = 'img/' + p.img; $('#bzPhoto', r).dataset.alt = p.name;
      $('#bzKick', r).textContent = 'Fluxosealer® · ' + p.sub; $('#bzName', r).textContent = p.name; $('#bzDesc', r).textContent = p.desc;
      $('#bzSpec', r).innerHTML = U.specTable(pid); $('#bzVar', r).innerHTML = U.variants(pid, p.variants); $('#bzVarW', r).hidden = !p.variants.length;
      $('#bzFeat', r).innerHTML = U.list(p.feats); $('#bzSafe', r).innerHTML = U.safety(p.safety); $('#bzSafeW', r).hidden = !p.safety.length;
      const s = $('[data-enq] [name=prod]', r); if (s) s.value = pid;
      U.setUnits(U.units); drawCmp(); show3d(pid);
      $$('[data-sl]', r).forEach(b => { const on = U.store.get('shortlist', []).includes(b.dataset.sl); b.setAttribute('aria-pressed', on); b.textContent = on ? '★ Shortlisted' : '☆ Shortlist'; });
    }
    $$('.bz-ladder [data-m]', r).forEach(b => b.addEventListener('click', () => pick(b.dataset.m)));
    // steps
    let si = 0; const steps = $$('#bzSteps div', r);
    const tick = () => { if (U.motion() === 'off'){ steps.forEach(s => s.classList.add('on')); return; } steps.forEach((s, i) => s.classList.toggle('on', i <= si)); si = (si + 1) % (steps.length + 1); };
    const iv = setInterval(tick, 1100); U.onClean(() => clearInterval(iv)); tick();
    // seal check
    const CM = ['brezop', 'brezoa', 'brezo2', 'brezo3', 'aurae3'];
    const cap = bindRange(r, 'bzCap', v => v + ' mm', check), gsm = bindRange(r, 'bzGsm', v => v + ' gsm', check);
    $('#bzCont', r).addEventListener('change', check);
    function check(){
      const c = cap.v, gs = gsm.v, cont = $('#bzCont', r).value;
      const warn = [];
      if (gs < 20 || gs > 35) warn.push(`Foil at ${gs} gsm is outside the 20–35 gsm Arshad recommends.`);
      if (cont === 'x') warn.push('Induction sealing needs a uniform, flat rim. Send Arshad a sample.');
      const rows = CM.map(pid => {
        const p = D.P[pid], capOk = c >= p.cap[0] && c <= p.cap[1];
        
        const spOk = true, ok = capOk;
        const why = [capOk ? `cap ${c} mm fits ${p.cap[0]}–${p.cap[1]} mm` : `cap range is ${p.cap[0]}–${p.cap[1]} mm`, p.bpm ? `${p.bpm[0]}–${p.bpm[1]} bottles/min, hand-held` : `${p.ftmin} ft/min`].join(' · ');
        return { pid, ok, capOk, spOk, why };
      }).sort((a, b) => (b.ok - a.ok) || (b.capOk - a.capOk));
      $('#bzRes', r).innerHTML = (warn.length ? `<div class="p-note" style="padding:10px 12px;border:1px dashed var(--acc);border-radius:var(--r)">${warn.map(esc).join('<br>')}</div>` : '') +
        rows.map(x => `<button type="button" class="m${x.ok ? '' : ' no'}" data-pickm="${x.pid}" style="text-align:left;cursor:pointer;color:inherit;font:inherit"><img src="img/${D.P[x.pid].img}" alt=""><span><b>${esc(D.P[x.pid].name)}</b><br><span class="why">${esc(x.why)}</span></span><span class="ok">${x.ok ? 'Fits' : x.capOk ? 'Too slow' : 'Cap size'}</span></button>`).join('');
    }
    r.addEventListener('click', e => { const b = e.target.closest('[data-pickm]'); if (!b) return; const pid = b.dataset.pickm; if (pid === 'aurae3'){ SITE.navigate('aurae'); return; } pick(pid); $('#datasheet', r).scrollIntoView({ behavior: 'smooth' }); });
    check();
    // tamper
    const capG = $('#bzCapG', r), rid = $('#bzRidges', r), txt = $('#bzTxt', r), tear = $('#bzTear', r), msg = $('#bzTmsg', r);
    bindRange(r, 'bzTwist', v => Math.round(v * 5.4) + '°', v => {
      const k = v / 100, lift = Math.max(0, (k - 0.55) / 0.45);
      rid.setAttribute('transform', `translate(${(k * 64) % 8},0)`); capG.setAttribute('transform', `translate(${lift * 40},${62 - lift * 70}) rotate(${lift * 14},150,40)`);
      txt.textContent = lift > 0.9 ? 'Cap off · foil still sealed' : k > 0 ? 'Unscrewing…' : 'Sealed';
      msg.textContent = lift > 0.9 ? 'The cap came off, the seal didn’t. The foil stays bonded to the rim.' : '';
    });
    $('#bzPeel', r).onclick = () => { tear.setAttribute('d', 'M118 134 l10 7 l8-7 l9 7 l7-7 l10 7 l8-7 v8 h-52z'); txt.textContent = 'Seal broken'; msg.textContent = 'A torn foil can’t be put back. The next person to open this pack will see it.'; };
    // compare
    function drawCmp(){
      const labels = []; CM.forEach(p => D.P[p].spec.forEach(x => { if (!labels.includes(x[0])) labels.push(x[0]); }));
      const val = (p, l) => { const x = D.P[p].spec.find(y => y[0] === l); return x ? x[1] : undefined; };
      const cell = v => v === undefined ? '<span class="p-note">—</span>' : v === null ? '<span class="p-note">On request</span>' : cv(v);
      $('#bzCmp', r).innerHTML = `<thead><tr><th></th>${CM.map(p => `<th class="${p === cur ? 'cur' : ''}"><img src="img/${D.P[p].img}" alt="">${esc(D.P[p].name)}</th>`).join('')}</tr></thead><tbody>` +
        labels.map(l => { const vs = CM.map(p => String(val(p, l))); const same = vs.every(v => v === vs[0]); return `<tr class="${same ? 'same' : ''}"><th scope="row">${esc(l)}</th>${CM.map(p => `<td class="${p === cur ? 'cur' : ''}">${cell(val(p, l))}</td>`).join('')}</tr>`; }).join('') + '</tbody>';
    }
    const dB = $('#bzDiff', r); dB.onclick = () => { const on = dB.getAttribute('aria-pressed') !== 'true'; dB.setAttribute('aria-pressed', on); $('#bzCmp', r).classList.toggle('all', !on); };
    pick('brezo3');
  }
};

/* ============ 2 · Aurae series — Editorial ============ */
const aurae = {
  id: 'aurae', t: 'Aurae series', vert: 'Fluxosealer · water-cooled sealer', img: 'cut-fluxosealer--aurae3.webp', style: 'editorial',
  notes: { layout: 'D · Editorial: giant type, oversized figures, a long read', style: 'Editorial: cream, Fraunces serif, hairline rules, square buttons', motion: ['Numbers count up', 'Coolant flows through the loop', 'Client names drift in a marquee', 'Industries shift colour on hover'],
    assets: ['Live 3D Aurae 3 with its chiller and coolant loop running', 'Five-factor seal checklist, written out'],
    qol: ['Units toggle on the ledger', 'Copy / save spec', 'Shortlist + compare', 'FAQ search with highlights', 'Enquiry builder'] },
  render(){
    return `${U.mini('Aurae 3', 'Heavy duty · water cooled', 'aurae3')}${U.nav('brezo')}${U.crumbs(['Home', 'Fluxosealer induction cap sealers', 'Aurae series'])}
    <div class="p-wrap"><section class="au-hero" data-hero><div><p class="p-kick">Fluxosealer® · Aurae series</p><h1 class="au-title">Aurae <em>3</em></h1><p class="au-sub">Heavy duty. Water cooled.</p>
      <div class="p-actions"><a class="p-btn acc" href="#enq">Ask for a quote</a><button class="p-btn" type="button" data-sl="aurae3">☆ Shortlist</button></div></div>
      <div class="p-stage" id="auStage"><canvas aria-label="3D model of the Aurae 3 with its chiller. Drag to turn."></canvas><div class="p-ov"><div class="p-sbar t"><button class="p-sbtn acc" type="button" data-flow aria-pressed="true">Cooling loop on</button></div><span class="p-cap">Coolant runs from the chiller to the sealing head and back. Loop drawn for illustration.</span></div></div></section>
      <hr class="au-rule"><div class="au-nums"><div><b><span data-count="80">80</span></b><span>ft/min line speed</span></div><div><b>20–120</b><span>mm cap diameter</span></div><div><b>Water</b><span>cooled, with a chiller</span></div></div></div>
    <section class="p-sec"><div class="p-wrap"><p class="p-kick">Why water</p><div class="au-prose rv">
      <p>${esc(D.P.aurae3.desc)}</p>
      <p>${esc(D.sealing.what)}</p>
      <p>It carries the same essentials as every Fluxosealer: no-foil detection, easy relocation between lines, and plug-and-play setup, built in powder-coated mild steel or SS 304.</p>
      <p>Options include a slat chain conveyor and pneumatic rejection of any bottle that arrives without a foil, with a PLC-based safety interlock available.</p></div></div></section>
    <section class="p-sec"><div class="p-wrap"><h2 class="p-h2 rv">Five things decide a good seal</h2><div class="au-factors">${D.sealing.factors.map(f => `<div class="rv"><b>${esc(f[0])}</b><span>${esc(f[1])}</span></div>`).join('')}</div></div></section>
    <section class="p-sec"><div class="p-wrap p-grid2"><div><h2 class="p-h2 rv">The ledger</h2>${U.specTable('aurae3')}</div><div><h2 class="p-h2 rv">Build it your way</h2>${U.variants('aurae3', D.P.aurae3.variants)}<div style="margin-top:22px">${U.list(D.P.aurae3.feats.concat(D.P.aurae3.safety))}</div></div></div></section>
    <section class="p-sec"><div class="p-wrap"><p class="p-kick">Sealed with Fluxosealer</p><div class="au-inds">${D.sealing.industries.map(n => `<span>${esc(n)}</span>`).join('')}</div></div></section>
    <section class="p-sec"><div class="p-wrap"><blockquote class="au-quote rv">“${esc(D.company.motto)}”</blockquote><p class="p-note">Arshad Electronics, since 1971</p></div></section>
    <section class="p-sec"><div class="marq" aria-label="Our customers"><div>${[...D.clients.sealing, ...D.clients.more, ...D.clients.sealing, ...D.clients.more].map(n => `<span>${esc(n)}</span>`).join('<span aria-hidden="true">·</span>')}</div></div><div class="p-wrap"><p class="p-note"></p></div></section>
    ${U.faq(D.faq.sealing, 'Questions, answered')}${U.enquiry({ products: ['aurae3', 'brezo3', 'brezo2'], title: 'Talk to us about Aurae', fields: [['cap', 'Cap diameter', 'e.g. 110 mm'], ['speed', 'Line speed', 'e.g. 80 ft/min'], ['cont', 'Container', 'e.g. wide-mouth PP jar'], ['water', 'Chilled water on site?', 'Yes / no']] })}${U.footer()}`;
  },
  async init(r){
    const st = U.stage3d($('#auStage canvas', r), { yaw: 22, pitch: 12, fit: 0.9, zoom: true });
    const w = await get('aurae-3'); const P = w.userData.parts, cb = box3(P.chiller), hb = box3(P.sealing_head);
    st.add(w); st.frame([w], 0.9);
    const line = (dz, col) => {
      const pts = [V3(cb.min.x + 80, cb.max.y, cb.min.z + 120 + dz), V3(cb.min.x - 60, cb.max.y + 350, hb.min.z - 60 + dz), V3(hb.max.x + 260, hb.max.y + 120, hb.min.z - 60 + dz), V3(hb.max.x - 40, hb.getCenter(V3()).y, hb.min.z + 40 + dz)];
      const tex = A3.canvasTex(128, 8, (x, W, H) => { x.fillStyle = col; x.fillRect(0, 0, W, H); x.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < W; i += 32) x.fillRect(i, 0, 10, H); });
      tex.wrapS = T.RepeatWrapping; tex.repeat.x = 10;
      w.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 60, 16, 10), new T.MeshBasicMaterial({ map: tex }))); return tex;
    };
    const sup = line(0, '#2F7DE1'), ret = line(-60, '#E0782F');
    let flow = U.motion() !== 'off';
    const fb = $('[data-flow]', r); fb.setAttribute('aria-pressed', flow); fb.textContent = flow ? 'Cooling loop on' : 'Cooling loop off';
    fb.onclick = () => { flow = !flow; fb.setAttribute('aria-pressed', flow); fb.textContent = flow ? 'Cooling loop on' : 'Cooling loop off'; };
    st.onFrame(dt => { if (!flow || U.motion() === 'off') return false; sup.offset.x -= dt * 1.2; ret.offset.x += dt * 1.2; return true; });
  }
};

/* ============ 3 · Blown & cast film — Dark showroom, finder first ============ */
const FILMS = ['mnl', 'mnlaba', 'mml', 'mmlibc', 'cmbr', 'ncf'];
const BLOWN = { mnl: 1, mnlaba: 1, mml: 1, mmlibc: 1 };
const films = {
  id: 'films', t: 'Blown and cast film', vert: 'Fluxomatic · corona treaters', img: 'cut-fluxomatic-cdt--mml-ibc-2.webp', style: 'showroom',
  notes: { layout: 'C · Finder first: your width, speed and film pick the series, then the detail opens', style: 'Dark showroom: near-black olive, lit machines, deep shadows', motion: ['Slow push-in on the real corona photo', 'The photo’s own discharge line flickers', 'Power flows between the system parts', 'Series cards dim and brighten as you filter'],
    assets: ['Series finder over all six film series', 'Live 3D treater with corona glow that follows your speed', 'Dyne test: drops bead on untreated film and flatten when treated', 'Generator power formula from Arshad’s FAQ, filled with your numbers'],
    qol: ['Finder values pre-fill the enquiry', 'Units toggle', 'Copy / save spec', 'Shortlist + compare across series', 'FAQ search'] },
  render(){
    return `${U.mini('Fluxomatic film treaters', 'Corona treaters for blown and cast film', null)}${U.nav('films')}
    <section class="fm-hero" data-hero><div class="ph"><svg class="glow" viewBox="0 0 720 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="fmBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>
      <polyline class="fm-flick" points="92,418 200,384 330,338 450,299 560,262 668,222" fill="none" stroke="#9D7BFF" stroke-width="10" filter="url(#fmBlur)"/><polyline class="fm-flick2" points="92,418 200,384 330,338 450,299 560,262 668,222" fill="none" stroke="#E6DDFF" stroke-width="1.6"/></svg></div>
      <div class="p-wrap txt"><p class="p-kick">Fluxomatic® · corona discharge treaters</p><h1 class="p-h1">${U.splitWords('Blown and cast film treaters')}</h1>
        <p class="p-lede">${esc(D.corona.line)} Six series, from 500 mm printing lines to 2600 mm lamination lines running at 300 m/min.</p>
        <div class="p-actions"><a class="p-btn acc" href="#finder">Find your series</a><a class="p-btn" href="#how">How corona works</a></div>
        <p class="p-note" style="margin-top:14px">The violet corona discharge along a treater roller.</p></div></section>
    <style>.fm-hero .ph{background-position:center}.fm-hero .ph svg{position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:screen}
      .fm-flick{animation:flick 1.4s steps(9) infinite}.fm-flick2{animation:flick 0.9s steps(7) infinite reverse}@keyframes flick{0%{opacity:.35}20%{opacity:.95}35%{opacity:.55}50%{opacity:1}70%{opacity:.45}85%{opacity:.85}100%{opacity:.6}}</style>
    <section class="p-sec" id="finder"><div class="p-wrap"><h2 class="p-h2 rv">Find your series</h2><p class="p-sub">Set your line. Series that fit light up with the reason; pick one to open it.</p>
      <div class="fm-finder"><div class="p-card fm-ctl">
        <div><div class="p-note" style="margin-bottom:6px">Line</div><div class="p-chips" id="fmLine"><button type="button" class="p-chip" data-v="blown" aria-pressed="true">Blown film extruder</button><button type="button" class="p-chip" data-v="conv" aria-pressed="false">Printing / lamination machine</button></div></div>
        <div><div class="p-note" style="margin-bottom:6px">Film</div><div class="p-chips" id="fmFilm"><button type="button" class="p-chip" data-v="nc" aria-pressed="true">Non-conductive</button><button type="button" class="p-chip" data-v="c" aria-pressed="false">Conductive / metallised</button></div></div>
        <div><div class="p-note" style="margin-bottom:6px">For</div><div class="p-chips" id="fmApp"><button type="button" class="p-chip" data-v="Printing" aria-pressed="true">Printing</button><button type="button" class="p-chip" data-v="Lamination" aria-pressed="false">Lamination</button><button type="button" class="p-chip" data-v="Coating" aria-pressed="false">Coating</button></div></div>
        ${range('fmW', 'Web width', 300, 2800, 50, 1000, v => v + ' mm')}${range('fmV', 'Line speed', 10, 320, 5, 60, v => v + ' m/min')}
        <p class="p-note" id="fmCount" aria-live="polite" style="margin:0"></p></div>
        <div class="fm-cards" id="fmCards"></div></div></div></section>
    <section class="p-sec fm-detail" id="series"><div class="p-wrap"><div class="p-grid2">
      <div><div class="p-stage" id="fmStage"><canvas aria-label="3D model of the selected series. Drag to turn."></canvas><div class="p-ov"><div class="p-sbar t"><button class="p-sbtn acc" type="button" data-run aria-pressed="true">Corona on</button></div><span class="p-cap" id="fmCap"></span></div></div>
        <div class="p-card" style="padding:16px 18px;margin-top:14px"><div class="p-note">Safety and interlocks</div><div id="fmSafe" style="margin-top:10px"></div></div></div>
      <div><p class="p-kick" id="fmKick"></p><h2 class="p-h2" id="fmName"></h2><p id="fmDesc" style="color:var(--muted)"></p><div id="fmSpec"></div><div id="fmVar" style="margin-top:18px"></div><h3 class="p-h3" style="margin-top:26px">Built with</h3><div id="fmFeat"></div></div></div></div></section>
    <section class="p-sec" id="how"><div class="p-wrap"><h2 class="p-h2 rv">How corona treatment works</h2><p class="p-sub">${esc(D.corona.what)}</p>
      <div class="fm-sys">${D.corona.system.map(s => `<div class="rv"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>
      <div class="fm-dyne" style="margin-top:36px"><canvas id="fmDyne" aria-label="Water drops on film: beaded before treatment, spread flat after"></canvas>
        <div><h3 class="p-h3">See the difference on the film</h3><p class="p-note">Drag to treat the film. Drops that bead up won’t let ink wet out; after treatment they spread flat, and ink and adhesive bond.</p>
          ${range('fmT', 'Treatment', 0, 100, 1, 0, v => v ? 'On, ' + v + '%' : 'Untreated')}
          <p class="p-note" style="margin-top:10px">${esc(D.corona.lasting)} Drawing is illustrative.</p></div></div></div></section>
    <section class="p-sec fm-pen-sec"><div class="p-wrap"><h2 class="p-h2 rv">The dyne pen test</h2><p class="p-sub">Draw across the film. On the untreated half your ink beads up; on the corona-treated half it lays flat in a smooth line, so print and adhesive bond.</p>
      <div class="fm-pen"><canvas id="fmPen" aria-label="A film split into untreated and corona-treated halves. Ink drawn on the untreated half breaks into beads; on the treated half it stays a smooth line."></canvas></div>
      <div class="p-actions" style="margin-top:14px;align-items:center"><button class="p-btn sm" type="button" id="fmPenClear">Clear the film</button><span class="p-note" style="margin:0">Press and drag anywhere on the film. Drawing is illustrative.</span></div></div></section>
    <section class="p-sec"><div class="p-wrap p-grid2"><div><h2 class="p-h2 rv">What it treats</h2><div class="p-chips">${D.corona.substrates.map(s => `<span class="p-chip">${esc(s)}</span>`).join('')}</div><h3 class="p-h3" style="margin-top:26px">Where it’s used</h3><div class="p-chips">${D.corona.applications.map(s => `<span class="p-chip">${esc(s)}</span>`).join('')}</div></div>
      <div><h2 class="p-h2 rv">Why Fluxomatic</h2>${U.list(D.corona.benefits)}</div></div></section>
    ${U.faq(D.faq.corona)}${U.enquiry({ products: FILMS, title: 'Size a treater for your line', sub: 'Arshad needs six things to size a treater. The finder above has already filled in two.', fields: [['material', 'Material', 'e.g. LDPE blown film'], ['width', 'Maximum width', 'e.g. 1300 mm'], ['speed', 'Maximum line speed', 'e.g. 120 m/min'], ['sides', 'Sides treated', 'One or both'], ['gauge', 'Gauge range', 'e.g. 20–80 micron'], ['app', 'Application', 'e.g. lamination']] })}${U.footer()}`;
  },
  init(r){
    const st = U.stage3d($('#fmStage canvas', r), { yaw: 28, pitch: 14, fit: 0.95, zoom: true });
    let g = null, rg = null, cur = null, tok = 0, on = true;
    const f = { line: 'blown', film: 'nc', app: 'Printing', sides: 1 };
    const W = bindRange(r, 'fmW', v => v + ' mm', upd), S = bindRange(r, 'fmV', v => v + ' m/min', upd), Dy = { v: 8 };
    const chipGroup = (id, key) => $$('#' + id + ' [data-v]', r).forEach(b => b.addEventListener('click', () => { f[key] = key === 'sides' ? +b.dataset.v : b.dataset.v; $$('#' + id + ' [data-v]', r).forEach(x => x.setAttribute('aria-pressed', x === b)); upd(); }));
    chipGroup('fmLine', 'line'); chipGroup('fmFilm', 'film'); chipGroup('fmApp', 'app'); chipGroup('fmSides', 'sides');
    function fit(pid){
      const p = D.P[pid], why = [];
      if (f.line === 'blown' && !BLOWN[pid]) why.push('for printing and lamination machines');
      if (f.line === 'conv' && BLOWN[pid]) why.push('for blown film extruders');
      if (f.film === 'c' && !p.conductive) why.push('non-conductive film only');
      if (W.v < p.w[0]) why.push(`from ${p.w[0]} mm wide`); if (W.v > p.w[1]) why.push(`up to ${p.w[1]} mm wide`);
      if (S.v > p.v) why.push(`up to ${p.v} m/min`);
      if (!p.app.includes(f.app)) why.push(`for ${p.app.join(' and ').toLowerCase()}`);
      return why;
    }
    function upd(){
      const res = FILMS.map(pid => ({ pid, why: fit(pid) })).sort((a, b) => a.why.length - b.why.length);
      const n = res.filter(x => !x.why.length).length;
      $('#fmCount', r).textContent = n ? `${n} series fit your line.` : 'Nothing fits exactly. Ask Arshad: most series are built to order.';
      $('#fmCards', r).innerHTML = res.map(({ pid, why }) => { const p = D.P[pid], a = p.w[0] / 2800 * 100, b = (p.w[1] - p.w[0]) / 2800 * 100;
        return `<button type="button" class="p-card fm-card${why.length ? ' no' : ''}" data-s="${pid}" aria-pressed="${pid === cur}"><img src="img/${p.img}" alt=""><b>${esc(p.name)}</b><span>${esc(p.sub)} · up to ${p.v} m/min</span><span class="bar" aria-hidden="true"><i style="left:${a}%;width:${b}%"></i><u style="left:${clamp(W.v / 2800 * 100, 0, 100)}%"></u></span><span class="fit">${why.length ? esc(why[0]) : 'Fits your line'}</span></button>`; }).join('');
      if (!cur || fit(cur).length) pickS(res[0].pid, true);
      const e = $('[data-enq]', r); if (e){ e.width.value = W.v + ' mm'; e.speed.value = S.v + ' m/min'; e.sides.value = f.sides === 2 ? 'Both sides' : 'One side'; e.app.value = f.app; }
      form(); if (rg) rg.s.corona = on ? clamp(0.25 + S.v / 320, 0.25, 1) : 0;
    }
    function form(){
      const w = W.v / 1000, k = f.sides * w * S.v * Dy.v / 1000;
      const ff = $('#fmForm', r); if (ff) ff.innerHTML = `Power = sides × width × line speed × Δdyne × A / 1000<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = <b>${f.sides}</b> × <b>${w.toFixed(2)}</b> m × <b>${S.v}</b> m/min × <b>${Dy.v}</b> × A / 1000<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = <b>${k.toFixed(2)} × A</b>`;
    }
    r.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) pickS(b.dataset.s); });
    async function pickS(pid, quiet){
      cur = pid; const p = D.P[pid];
      $$('#fmCards [data-s]', r).forEach(b => b.setAttribute('aria-pressed', b.dataset.s === pid));
      $('#fmKick', r).textContent = 'Fluxomatic® · ' + p.sub; $('#fmName', r).textContent = p.name; $('#fmDesc', r).textContent = p.desc;
      $('#fmSpec', r).innerHTML = U.specTable(pid); $('#fmVar', r).innerHTML = U.variants(pid, p.variants); $('#fmFeat', r).innerHTML = U.list(p.feats); $('#fmSafe', r).innerHTML = U.safety(p.safety);
      $('.p-mini b', r).textContent = p.name; $('.p-mini .k', r).textContent = p.sub + ' · ' + p.spec[0][1];
      const s = $('[data-enq] [name=prod]', r); if (s) s.value = pid;
      U.setUnits(U.units); $$('[data-sl]', r).forEach(b => { const on2 = U.store.get('shortlist', []).includes(b.dataset.sl); b.setAttribute('aria-pressed', on2); b.textContent = on2 ? '★ Shortlisted' : '☆ Shortlist'; });
      if (!quiet) $('#series', r).scrollIntoView({ behavior: U.motion() === 'off' ? 'auto' : 'smooth' });
      const my = ++tok, ng = await get(p.m3); if (my !== tok) return;
      if (g) st.remove(g); g = st.add(ng); st.frame([g], 0.95); A3.setLighting(g, 'dramatic'); st.amb.intensity = 0.22; st.dir.intensity = 0.9;
      rg = A3.rig(g); rg.s.on = on; rg.s.speed = clamp(S.v / p.v, 0.2, 1); rg.s.corona = on ? clamp(0.25 + S.v / 320, 0.25, 1) : 0;
      $('#fmCap', r).textContent = p.name + (rg.corona.length ? ' · violet glow shows the treatment zone' : ' · drag to turn');
    }
    const rb = $('[data-run]', r); rb.onclick = () => { on = !on; rb.setAttribute('aria-pressed', on); rb.textContent = on ? 'Corona on' : 'Corona off'; if (rg){ rg.s.on = on; rg.s.corona = on ? clamp(0.25 + S.v / 320, 0.25, 1) : 0; } };
    st.onFrame(dt => rg ? rg.update(dt) : false);
    upd();
    window.DRAFTX.pen(r);
    // dyne canvas
    const tr = bindRange(r, 'fmT', v => v ? 'On, ' + v + '%' : 'Untreated', () => dl.kick());
    const drops = Array.from({ length: 9 }, (_, i) => ({ x: 0.08 + i * 0.105, r: 16 + (i * 7) % 12 }));
    const dl = U.loop($('#fmDyne', r), (x, w, h, t) => {
      const k = tr.v / 100, cs = getComputedStyle(r), acc = cs.getPropertyValue('--glow').trim() || '#8C6BFF';
      x.clearRect(0, 0, w, h);
      const fy = h * 0.66; x.fillStyle = 'rgba(200,210,190,.16)'; x.fillRect(0, fy, w, h - fy);
      x.fillStyle = 'rgba(230,234,217,.35)'; x.fillRect(0, fy, w, 2);
      if (k > 0){ x.fillStyle = acc; x.globalAlpha = 0.18 + 0.12 * Math.sin(t * 12); x.fillRect(0, fy - 3, w, 3); x.globalAlpha = 1; }
      drops.forEach((d, i) => {
        const cx = d.x * w, R = d.r * (w / 700 + 0.4), kk = clamp(k * 1.15 - i * 0.02, 0, 1), wob = Math.sin(t * 2 + i) * 0.03;
        const rx = R * (1 + kk * 1.9), ry = R * (1 - kk * 0.78 + wob);
        const gr = x.createRadialGradient(cx - rx * 0.3, fy - ry * 0.9, 1, cx, fy - ry * 0.5, rx * 1.2); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(0.4, 'rgba(150,200,255,.55)'); gr.addColorStop(1, 'rgba(80,140,220,.25)');
        x.fillStyle = gr; x.beginPath(); x.ellipse(cx, fy, rx, ry, 0, Math.PI, 0); x.closePath(); x.fill();
        x.strokeStyle = 'rgba(200,225,255,.6)'; x.lineWidth = 1; x.stroke();
      });
      x.fillStyle = '#C9D0B6'; x.font = '600 13px IBM Plex Mono, monospace'; x.fillText(k ? 'Treated: drops wet out' : 'Untreated: drops bead up', 14, 22);
    });
  }
};

/* ============ 4 · Woven fabric — Blueprint, technical drawing ============ */
const woven = {
  id: 'woven', t: 'Woven fabric', vert: 'Fluxomatic · FTS-WS', img: 'cut-fluxomatic-cdt-ws.webp', style: 'blueprint',
  notes: { layout: 'F · Technical drawing: the page is a drawing sheet with a title block and parts list', style: 'Blueprint: grid ground, mono type, square corners, line art', motion: ['Line-art model turns slowly', 'Width ruler stretches the station to scale', 'Fabric runs under the electrode; the pre-lump sensor reacts', 'Magnifier over the real fabric photo'],
    assets: ['3D FTS-WS as line art with dimensions', 'Width ruler 500–5100 mm against a 1.7 m person', 'Pre-lump sensor demo: a lump arrives, the electrode lifts', 'Fabric magnifier'],
    qol: ['Units toggle on the parts list', 'Copy / save spec', 'Shortlist', 'Enquiry with width and speed'] },
  render(){
    const P = D.P.ws;
    return `${U.mini('FTS-WS', 'Woven fabric · up to 5100 mm · 300 m/min', 'ws')}${U.nav('films')}${U.crumbs(['Home', 'Fluxomatic corona treaters', 'Woven fabric'])}
    <div class="p-wrap"><div class="wv-sheet" data-hero><div class="wv-head"><div class="l"><p class="p-kick">Fluxomatic® · woven fabric</p><h1 class="p-h1">FTS-WS</h1><p class="p-lede">${esc(P.desc)}</p>
      ${U.figs([[5100, ' mm', 'maximum width'], [300, ' m/min', 'line speed'], ['PLC', '', 'safety interlock']])}
      <div class="p-actions"><a class="p-btn acc" href="#enq">Get a quote</a><button class="p-btn" type="button" data-sl="ws">☆ Shortlist</button></div></div>
      <div class="p-stage" id="wvStage"><canvas aria-label="Line drawing of the FTS-WS generator cabinet. Drag to turn."></canvas><div class="p-ov"><div class="p-sbar t"><button class="p-sbtn" type="button" data-line aria-pressed="true">Line drawing</button><button class="p-sbtn" type="button" data-dims aria-pressed="true">Dimensions</button></div></div></div></div>
      <div class="wv-tb"><div><b>Drawing</b>FTS-WS generator cabinet</div><div><b>Scale</b>n.t.s.</div><div><b>Sizes</b>estimated from photo</div><div><b>Source</b>Arshad photo, code-built</div></div></div></div>
    
    <section class="p-sec wv-lump"><div class="p-wrap p-grid2"><div><h2 class="p-h2 rv">A lump won’t break the electrode</h2><p class="p-sub">Woven fabric carries knots and joins. The pre-lump sensor sees them coming and lifts the electrode clear, then brings it back.</p>
        <div class="p-actions"><button class="p-btn acc sm" type="button" id="wvSend">Send a lump</button><button class="p-btn sm" type="button" id="wvAuto" aria-pressed="true">Automatic</button></div><p class="p-note" id="wvState" aria-live="polite" style="margin-top:12px">Running · electrode down</p></div>
      <canvas id="wvLump" aria-label="Side view: fabric running under the electrode, sensor ahead of it"></canvas></div></section>
    <section class="p-sec"><div class="p-wrap p-grid2"><div><h2 class="p-h2 rv">Parts list</h2><div class="p-spec"><table class="wv-parts"><tbody>${[['Generator', 'IGBT, sized to your fabric, width and speed'], ['HV transformer', 'Oil-cooled'], ['Electrode assembly', 'Pneumatic, fin type, micro gap adjustment'], ['Treater rollers', 'Dynamically balanced aluminium, dielectric sleeve'], ['Guide rollers', 'Entry and exit'], ['Pre-lump sensor', 'Protects the electrodes'], ['Ozone extraction', 'Draws ozone away from the operator']].map((x, i) => `<tr><td class="mono">${String(i + 1).padStart(2, '0')}</td><th scope="row">${esc(x[0])}</th><td>${esc(x[1])}</td></tr>`).join('')}</tbody></table></div></div>
      <div><h2 class="p-h2 rv">Specification</h2>${U.specTable('ws')}<h3 class="p-h3" style="margin-top:26px">Safety and interlocks</h3>${U.safety(D.P.ws.safety)}</div></div></section>
    
    ${U.faq(D.faq.corona)}${U.enquiry({ products: ['ws'], fields: [['width', 'Fabric width', 'e.g. 3200 mm'], ['speed', 'Line speed', 'e.g. 150 m/min'], ['material', 'Fabric', 'e.g. PP woven, 60 gsm'], ['sides', 'Sides treated', 'One or both']] })}${U.footer()}`;
  },
  async init(r){
    const st = U.stage3d($('#wvStage canvas', r), { yaw: 32, pitch: 16, fov: 18, fit: 0.9, shadows: false, floor: false, zoom: true });
    const g = st.add(await get('cdt-ws')); A3.lineArt(g, true, '#DDE4C6');
    const dg = A3.dims(g, { color: '#F2A93B', est: true }); st.add(dg); st.frame([g, dg], 0.95);
    let line = true;
    $('[data-line]', r).onclick = e => { line = !line; e.currentTarget.setAttribute('aria-pressed', line); A3.lineArt(g, line, '#DDE4C6'); st.dirty = true; };
    $('[data-dims]', r).onclick = e => { dg.visible = !dg.visible; e.currentTarget.setAttribute('aria-pressed', dg.visible); st.dirty = true; };
    // ruler
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), mm = 0.14;
    const draw = W => {
      const ink = '#DDE4C6', acc = '#F2A93B', x0 = 150, gy = 262, w = W * mm, h = 1000 * mm;
      const person = `<g transform="translate(40,${gy - 1700 * mm})" fill="none" stroke="${ink}" stroke-width="1.5"><circle cx="18" cy="14" r="12"/><path d="M4 32h28l4 70M4 32l-4 70M10 32v176M26 32v176"/></g><text x="58" y="${gy + 18}" fill="${ink}" font-size="12" text-anchor="middle">1.7 m</text>`;
      svg.innerHTML = `<line x1="0" y1="${gy}" x2="1000" y2="${gy}" stroke="${ink}" stroke-width="1"/>${person}
        <rect x="${x0}" y="${gy - h}" width="${w}" height="${h}" fill="rgba(221,228,198,.05)" stroke="${ink}" stroke-width="1.5"/>
        <line x1="${x0 + 10}" y1="${gy - h * 0.62}" x2="${x0 + w - 10}" y2="${gy - h * 0.62}" stroke="${acc}" stroke-width="3"/>
        <line x1="${x0 + 10}" y1="${gy - h * 0.35}" x2="${x0 + w - 10}" y2="${gy - h * 0.35}" stroke="${ink}" stroke-width="6" opacity=".6"/>
        <line x1="${x0}" y1="${gy - h - 22}" x2="${x0 + w}" y2="${gy - h - 22}" stroke="${acc}" stroke-width="1"/><line x1="${x0}" y1="${gy - h - 30}" x2="${x0}" y2="${gy - h - 14}" stroke="${acc}"/><line x1="${x0 + w}" y1="${gy - h - 30}" x2="${x0 + w}" y2="${gy - h - 14}" stroke="${acc}"/>
        <text x="${x0 + w / 2}" y="${gy - h - 30}" fill="${acc}" font-size="15" text-anchor="middle">${W} mm fabric</text>
        <g transform="translate(${1000 - 40 - 1000 * mm},${gy + 24})"><line x1="0" y1="0" x2="${1000 * mm}" y2="0" stroke="${ink}"/><line x1="0" y1="-5" x2="0" y2="5" stroke="${ink}"/><line x1="${1000 * mm}" y1="-5" x2="${1000 * mm}" y2="5" stroke="${ink}"/><text x="${500 * mm}" y="-8" fill="${ink}" font-size="11" text-anchor="middle">1 m</text></g>`;
    };
    draw(3200);
    // lump demo
    let lump = null, auto = true, lift = 0, next = 3, state = '';
    $('#wvSend', r).onclick = () => { if (!lump) lump = { x: -40 }; lp.kick(); };
    const ab = $('#wvAuto', r); ab.onclick = () => { auto = !auto; ab.setAttribute('aria-pressed', auto); };
    const lp = U.loop($('#wvLump', r), (x, w, h, t, dt) => {
      const ink = '#DDE4C6', acc = '#F2A93B', fy = h * 0.68, ex = w * 0.62, sx = w * 0.36;
      if (auto && !lump && (next -= dt) <= 0){ lump = { x: -40 }; next = 5.5; }
      if (lump){ lump.x += dt * w * 0.22; if (lump.x > w + 40) lump = null; }
      const near = lump && lump.x > sx - 10 && lump.x < ex + 60;
      lift = clamp(lift + (near ? 1 : -0.6) * dt * 3, 0, 1);
      x.clearRect(0, 0, w, h);
      // fabric
      x.strokeStyle = ink; x.lineWidth = 2; x.beginPath(); x.moveTo(0, fy); x.lineTo(w, fy); x.stroke();
      x.lineWidth = 1; x.globalAlpha = 0.5; const off = (t * w * 0.22) % 16;
      for (let i = -16; i < w; i += 16){ x.beginPath(); x.moveTo(i + off, fy - 3); x.lineTo(i + off + 8, fy + 3); x.stroke(); }
      x.globalAlpha = 1;
      if (lump){ x.fillStyle = ink; x.beginPath(); x.ellipse(lump.x, fy - 7, 16, 9, 0, Math.PI, 0); x.fill(); }
      // roller
      x.beginPath(); x.arc(ex, fy + 30, 30, 0, Math.PI * 2); x.stroke(); x.beginPath(); x.moveTo(ex, fy + 30); x.lineTo(ex + Math.cos(t * 5) * 30, fy + 30 + Math.sin(t * 5) * 30); x.stroke();
      // electrode
      const ey = fy - 14 - lift * 44;
      x.strokeStyle = acc; x.lineWidth = 2; x.strokeRect(ex - 50, ey - 18, 100, 16);
      x.beginPath(); x.moveTo(ex, ey - 18); x.lineTo(ex, 12); x.stroke();
      if (lift < 0.15){ x.fillStyle = 'rgba(157,123,255,' + (0.35 + 0.25 * Math.sin(t * 40)) + ')'; x.fillRect(ex - 48, ey - 2, 96, fy - ey); }
      // sensor
      x.strokeStyle = ink; x.strokeRect(sx - 10, fy - 70, 20, 26); x.setLineDash([4, 4]); x.strokeStyle = near ? acc : 'rgba(221,228,198,.5)'; x.beginPath(); x.moveTo(sx, fy - 44); x.lineTo(sx, fy); x.stroke(); x.setLineDash([]);
      x.fillStyle = ink; x.font = '12px IBM Plex Mono, monospace'; x.fillText('pre-lump sensor', sx - 52, fy - 78); x.fillText('electrode', ex - 32, 26);
      const s = near ? 'Lump detected · electrode lifted' : lift > 0.05 ? 'Clear · electrode returning' : 'Running · electrode down';
      if (s !== state){ state = s; $('#wvState', r).textContent = s; }
    });
    // zoom
    const z = document.createElement('div'), lens = document.createElement('div');
    z.addEventListener('pointermove', e => { const b = z.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top; lens.style.display = 'block'; lens.style.left = (px - 75) + 'px'; lens.style.top = (py - 75) + 'px'; lens.style.backgroundSize = (b.width * 2.6) + 'px ' + (b.height * 2.6) + 'px'; lens.style.backgroundPosition = `${-(px * 2.6 - 75)}px ${-(py * 2.6 - 75)}px`; });
    z.addEventListener('pointerleave', () => { lens.style.display = 'none'; });
  }
};

/* ============ 5 · 3D objects and cables — Soft depth ============ */
const objects = {
  id: 'objects', t: '3D objects and cables', vert: 'Fluxomatic · FTS-3D / FTS-CBL', img: 'cut-fluxomatic-cds-3d.webp', style: 'soft',
  notes: { layout: 'Tabs over one stage: flat parts, pipes and cables share the hero', style: 'Soft depth: large radius, floating cards, soft shadows', motion: ['Cards float on hover', 'Parts ride the conveyor under the head', 'Ink-jet print sweeps across the cable'],
    assets: ['Live 3D FTS-3D with parts or a pipe running under the electrode', 'Cable demo: treated vs untreated ink-jet print', 'Print test that shows beading vs crisp marks'],
    qol: ['3D and CBL specs as tabs', 'Units, copy, save, shortlist', 'Enquiry with object size'] },
  render(){
    return `${U.mini('FTS-3D and FTS-CBL', 'Corona treaters for parts, pipes and cables', '3d')}${U.nav('films')}${U.crumbs(['Home', 'Fluxomatic corona treaters', '3D objects'])}
    <div class="p-wrap"><section class="ob-hero" data-hero><p class="p-kick">Fluxomatic® · 3D objects and cables</p><h1 class="p-h1">${U.splitWords('Corona treaters for 3D objects and cables')}</h1>
      <p class="p-lede">The system is designed for plastic moulded articles and cables. It consists of the generator, an oil-cooled high voltage transformer, an electrode assembly and an ozone extraction system.</p>
      <div class="ob-tabs" role="tablist" aria-label="What you treat"><button type="button" role="tab" data-k="part" aria-selected="true">Flat parts</button><button type="button" role="tab" data-k="pipe" aria-selected="false">Pipes</button><button type="button" role="tab" data-k="cable" aria-selected="false">Cables</button></div>
      <div class="p-stage ob-stage"><canvas class="c3" aria-label="3D model of the FTS-3D treater with parts on a conveyor. Drag to turn."></canvas><canvas class="flat" aria-label="Cable running through the treater and an ink-jet printer"></canvas><div class="p-ov"><div class="p-sbar t"><button class="p-sbtn acc" type="button" data-tr aria-pressed="true">Treater on</button></div><span class="p-cap" id="obCap">Conveyor and parts are drawn for illustration</span></div></div></section></div>
    <section class="p-sec"><div class="p-wrap p-grid2"><div><h2 class="p-h2 rv">Why treat before printing</h2><p class="p-sub">Untreated plastic has low surface energy: ink pulls into beads and rubs off. After corona treatment the same print lies flat and holds.</p><div class="ob-print"><canvas id="obPrint" aria-label="Print test: beaded ink on untreated plastic, crisp print on treated plastic"></canvas></div></div>
      <div><h2 class="p-h2 rv">What it handles</h2><div class="p-grid2" style="gap:12px">${[['3D series', 'Used for treatment on flat plastic moulded articles and pipes prior to printing'], ['Conveyor', 'An insulated, customised conveyor system is provided for flat or round objects'], ['CBL series', 'Used for treatment on cables prior to ink-jet printing'], ['Interlock', 'PLC based safety interlock system']].map(x => `<div class="p-card ob-float" style="padding:18px"><b>${esc(x[0])}</b><p class="p-note" style="margin:6px 0 0">${esc(x[1])}</p></div>`).join('')}</div></div></div></section>
    <section class="p-sec"><div class="p-wrap"><h2 class="p-h2 rv">Specifications</h2><div class="p-chips" style="margin-bottom:14px" role="tablist"><button class="p-chip" type="button" data-spec="3d" aria-pressed="true">FTS-3D · parts and pipes</button><button class="p-chip" type="button" data-spec="cbl" aria-pressed="false">FTS-CBL · cables</button></div>
      <div class="p-grid2"><div class="p-card" style="padding:8px 22px 18px" id="obSpec"></div><div class="p-card" style="padding:20px 22px"><h3 class="p-h3">Safety and interlocks</h3>${U.safety(D.P['3d'].safety)}<h3 class="p-h3" style="margin-top:20px">Variants</h3>${U.variants('3d', D.P['3d'].variants)}</div></div></div></section>
    ${U.faq(D.faq.corona)}${U.enquiry({ products: ['3d', 'cbl'], fields: [['object', 'Part, pipe or cable', 'e.g. PP cap, 40 mm'], ['size', 'Size range', 'e.g. 20–200 mm'], ['speed', 'Line speed', 'e.g. 30 m/min'], ['print', 'Printing process', 'e.g. ink-jet']] })}${U.footer()}`;
  },
  async init(r){
    const c3 = $('canvas.c3', r), flat = $('canvas.flat', r);
    const st = U.stage3d(c3, { yaw: 30, pitch: 16, fit: 0.9, zoom: true });
    const g = st.add(await get('cds-3d'));
    const hb = box3(g.userData.parts.head), hc = hb.getCenter(V3()), top = hb.min.y - 240, x0 = hb.min.x - 900, x1 = hb.max.x + 900, zc = hc.z;
    const mk = c => { const m = new T.MeshStandardMaterial({ color: c, roughness: 0.55, envMap: A3.env, envMapIntensity: 0.5, emissive: c, emissiveIntensity: 0.12 }); m.userData = { baseColor: m.color.clone(), baseEmissive: m.emissive.clone(), baseEI: 0.12, gen: true }; return m; };
    const belt = new T.Mesh(new T.BoxGeometry(x1 - x0, 60, 360), mk('#7A8174')); belt.position.set((x0 + x1) / 2, top - 30, zc); belt.receiveShadow = true; g.add(belt);
    [x0 + 60, x1 - 60].forEach(x => [-150, 150].forEach(dz => { const l = new T.Mesh(new T.BoxGeometry(40, top - 60, 40), mk('#9AA095')); l.position.set(x, (top - 60) / 2, zc + dz); l.castShadow = true; g.add(l); }));
    const glow = new T.Mesh(new T.PlaneGeometry(hb.max.x - hb.min.x - 120, 260), new T.MeshBasicMaterial({ color: '#8C6BFF', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    glow.rotation.x = -Math.PI / 2; glow.position.set(hc.x, hb.min.y - 6, zc); g.add(glow);
    st.frame([g], 0.9);
    let kind = 'part', on = true, objs = [];
    const tc = new T.Color('#B7B0E8');
    function make(k){
      objs.forEach(o => g.remove(o.m)); objs = [];
      if (k === 'part') for (let x = x0 + 150; x < x1 - 100; x += 520){ const m = new T.Mesh(new T.BoxGeometry(260, 90, 180), mk('#E4DDCB')); m.position.set(x, top + 45, zc); m.castShadow = true; g.add(m); objs.push({ m }); }
      else if (k === 'pipe'){ const tex = A3.canvasTex(256, 16, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(0,0,0,.22)'; for (let i = 0; i < w; i += 64) x.fillRect(i, 0, 10, h); }); tex.wrapS = tex.wrapT = T.RepeatWrapping;
        const m = new T.Mesh(new T.CylinderGeometry(55, 55, x1 - x0 + 800, 32), mk('#3D6FB6')); m.material.map = tex; m.geometry.rotateZ(Math.PI / 2); m.position.set((x0 + x1) / 2, top + 55, zc); m.castShadow = true; g.add(m); objs.push({ m, tex }); }
    }
    function tab(k){
      kind = k; $$('.ob-tabs [data-k]', r).forEach(b => b.setAttribute('aria-selected', b.dataset.k === k));
      c3.style.display = k === 'cable' ? 'none' : 'block'; flat.style.display = k === 'cable' ? 'block' : 'none';
      $('#obCap', r).textContent = k === 'cable' ? 'Cable through the treater, then the ink-jet printer. Drawn for illustration.' : 'Conveyor and parts are drawn for illustration';
      if (k !== 'cable') make(k); else cl.kick();
      spec(k === 'cable' ? 'cbl' : '3d');
    }
    $$('.ob-tabs [data-k]', r).forEach(b => b.addEventListener('click', () => tab(b.dataset.k)));
    const tb = $('[data-tr]', r); tb.onclick = () => { on = !on; tb.setAttribute('aria-pressed', on); tb.textContent = on ? 'Treater on' : 'Treater off'; cl.kick(); pr.kick(); };
    let t = 0;
    st.onFrame(dt => {
      if (kind === 'cable') return false;
      const m = U.motion(); if (m === 'off') return false; t += dt;
      glow.material.opacity = on ? 0.5 * (0.8 + 0.2 * Math.sin(t * 41) * Math.sin(t * 13)) : 0;
      objs.forEach(o => {
        if (o.tex){ o.tex.offset.y -= dt * 0.8; o.m.rotation.x += dt * 0.6; return; }
        o.m.position.x += 380 * dt * (m === 'subtle' ? 0.5 : 1);
        if (o.m.position.x > x1 - 60){ o.m.position.x = x0 + 60; o.tr = false; o.m.material.color.copy(o.m.material.userData.baseColor); }
        if (on && !o.tr && o.m.position.x > hc.x){ o.tr = true; o.m.material.color.copy(o.m.material.userData.baseColor).lerp(tc, 0.45); }
      });
      return true;
    });
    // cable canvas
    const word = 'ARSHAD 1971  2.5 SQ MM  ';
    const cl = U.loop(flat, (x, w, h, tt) => {
      x.clearRect(0, 0, w, h); const cy = h * 0.55, hx = w * 0.3, px = w * 0.62, sp = 90, off = (tt * sp) % 26;
      x.fillStyle = '#26301A'; x.fillRect(0, cy - 12, w, 24);
      x.fillStyle = 'rgba(255,255,255,.08)'; for (let i = -26; i < w; i += 26) x.fillRect(i + off, cy - 12, 2, 24);
      x.fillStyle = '#DCE2CF'; x.strokeStyle = '#6E7F4A'; x.lineWidth = 2;
      x.fillRect(hx - 60, cy - 70, 120, 44); x.strokeRect(hx - 60, cy - 70, 120, 44); x.fillStyle = '#26301A'; x.font = '600 12px Instrument Sans, sans-serif'; x.fillText('treater head', hx - 36, cy - 44);
      if (on){ x.fillStyle = 'rgba(140,107,255,' + (0.35 + 0.2 * Math.sin(tt * 40)) + ')'; x.fillRect(hx - 56, cy - 26, 112, 14); }
      x.fillStyle = '#DCE2CF'; x.fillRect(px - 36, cy - 76, 72, 50); x.strokeRect(px - 36, cy - 76, 72, 50); x.fillStyle = '#26301A'; x.fillText('ink-jet', px - 20, cy - 48);
      x.save(); x.beginPath(); x.rect(px, cy - 12, w - px, 24); x.clip();
      x.font = '700 13px IBM Plex Mono, monospace';
      const chars = (word + word + word + word).split('');
      let cx = px - (tt * sp) % (word.length * 9) + 4;
      chars.forEach((ch, i) => { const X = cx + i * 9 + (tt * sp) % (word.length * 9); if (X < px || X > w) return;
        if (on){ x.fillStyle = '#F4F6EE'; x.fillText(ch, X, cy + 5); }
        else { x.fillStyle = 'rgba(244,246,238,.8)'; if (ch !== ' ') for (let k = 0; k < 3; k++){ x.beginPath(); x.arc(X + 2 + k * 2.2, cy - 3 + ((i * 7 + k * 5) % 9), 1.4, 0, 7); x.fill(); } } });
      x.restore();
      x.fillStyle = '#5C6848'; x.font = '600 13px Instrument Sans, sans-serif'; x.fillText(on ? 'Treated cable: print is crisp and holds' : 'Untreated cable: ink beads into dots', 16, h - 20);
    });
    // print test
    const pr = U.loop($('#obPrint', r), (x, w, h, tt) => {
      x.clearRect(0, 0, w, h); const rows = [['Untreated', false], ['Treated', true]], sweep = (tt * 0.35) % 1.4;
      rows.forEach(([lab, tr], i) => {
        const y = 24 + i * (h / 2); x.fillStyle = '#5C6848'; x.font = '600 12px Instrument Sans, sans-serif'; x.fillText(lab, 14, y);
        x.save(); x.beginPath(); x.rect(14, y + 8, (w - 28) * Math.min(1, sweep), h / 2 - 36); x.clip();
        x.font = '800 ' + Math.round(h / 5.2) + 'px Archivo, sans-serif'; const txt = 'FLUXOMATIC';
        if (tr){ x.fillStyle = '#26301A'; x.fillText(txt, 14, y + h / 2 - 34); }
        else { x.fillStyle = 'rgba(38,48,26,.75)'; const tw = x.measureText(txt).width; for (let k = 0; k < 260; k++){ const X = 14 + ((k * 37) % Math.max(1, Math.round(tw))), Y = y + 12 + ((k * 53) % Math.round(h / 2 - 50)); x.beginPath(); x.arc(X, Y, 1.2 + (k % 3), 0, 7); x.fill(); } }
        x.restore();
      });
    });
    function spec(pid){ $$('[data-spec]', r).forEach(b => b.setAttribute('aria-pressed', b.dataset.spec === pid)); $('#obSpec', r).innerHTML = U.specTable(pid); U.setUnits(U.units); $$('#obSpec [data-sl]', r).forEach(b => { const o = U.store.get('shortlist', []).includes(b.dataset.sl); b.setAttribute('aria-pressed', o); b.textContent = o ? '★ Shortlisted' : '☆ Shortlist'; }); }
    $$('[data-spec]', r).forEach(b => b.addEventListener('click', () => spec(b.dataset.spec)));
    tab('part');
  }
};

/* ============ 6 · Simco-Ion — Ion style, symptom first ============ */
const SYM = [['dust', 'Dust sticks to the film', 'Charged film pulls dust and flakes out of the air.'], ['cling', 'Film clings and wraps', 'Layers attract each other and won’t lie flat.'], ['stack', 'Sheets stick together', 'Cut sheets and labels lift two at a time.'], ['shock', 'Operators get shocks', 'Charge builds up and jumps to the nearest hand.']];
const simco = {
  id: 'simco', t: 'Simco-Ion', vert: 'Static eliminators · distributed', img: null, style: 'ion',
  notes: { layout: 'Symptom first: pick the problem on your line, switch the ion bar on to see the fix', style: 'Ion: slate and cyan, kept apart from Arshad’s own olive because it’s a distributed brand', motion: ['Charged particles drift and stick', 'Ions stream from the bar and neutralise the charge', 'Charge meter falls when the bar is on'],
    assets: ['Static simulator with four symptoms: dust, cling, sticking sheets, shocks', 'Application finder across plastics and packaging'],
    qol: ['Pick a process to highlight it', 'Enquiry asks for the problem and process', 'Clear note that specs come from Simco-Ion'] },
  render(){
    return `${U.mini('Simco-Ion', 'Static eliminators · authorised distributor in India', null)}${U.nav('simco')}${U.crumbs(['Home', 'Simco-Ion static eliminators'])}
    <div class="p-wrap"><section class="io-hero" data-hero><div><p class="p-kick">Simco-Ion · static eliminators</p><h1 class="p-h1">${U.splitWords('Simco-Ion static eliminators')}</h1>
      <p class="p-lede">${esc(D.simco.line)} Listed here are products suitable for plastic and packaging solutions. Pick what you see on your line.</p>
      <div class="io-sym" role="group" aria-label="What you see">${SYM.map((s, i) => `<button type="button" data-sym="${s[0]}" aria-pressed="${i === 0}"><b>${esc(s[1])}</b><span>${esc(s[2])}</span></button>`).join('')}</div></div>
      <div class="p-stage io-stage"><canvas id="ioC" aria-label="Simulation of static charge on a moving film and an ionising bar"></canvas><div class="p-ov"><div class="p-sbar b"><button class="p-sbtn acc" type="button" data-ion aria-pressed="false">Switch the ion bar on</button></div></div></div></section></div>
    <section class="p-sec"><div class="p-wrap"><h2 class="p-h2 rv">Two ways to control it</h2><div class="io-apps">${D.simco.products.map((p, i) => `<div class="p-card"><img src="img/${i ? 'mood-simco-packaging.jpg' : 'mood-simco-plastic.jpg'}" alt="${i ? 'Blister packs' : 'Plastic granules'}: application photo, not the product"><p class="p-kick" style="margin-bottom:4px">${esc(p[1])}</p><h3 class="p-h2" style="font-size:32px">${esc(p[0])}</h3><p class="p-note" style="font-size:15px">${esc(p[2])}</p><div class="p-actions" style="margin-top:12px"><button class="p-btn sm acc" type="button" data-ask="${i ? 'iqeasy' : 'iqpower'}">Ask for the datasheet</button></div></div>`).join('')}</div>
      <p class="p-note" style="margin-top:14px">Models, specs and datasheets come from Simco-Ion; see <a href="https://www.simco-ion.com/" target="_blank" rel="noopener">simco-ion.com ↗</a>.</p></div></section>
    <section class="p-sec"><div class="p-wrap"><h2 class="p-h2 rv">Where static costs you</h2><p class="p-sub">Pick your process; both IQ products serve these lines.</p>
      <div class="p-grid2"><div class="p-card" style="padding:20px"><h3 class="p-h3">Static control solutions for plastic applications</h3><p class="p-note" style="margin:6px 0 14px">${esc(D.simco.plasticsP)}</p><div class="p-chips">${D.simco.plastics.map(s => `<button type="button" class="p-chip" data-proc="${esc(s)}" aria-pressed="false">${esc(s)}</button>`).join('')}</div></div>
      <div class="p-card" style="padding:20px"><h3 class="p-h3">Static control solutions for packaging</h3><p class="p-note" style="margin:6px 0 14px">${esc(D.simco.packagingP)}</p><div class="p-chips">${D.simco.packaging.map(s => `<button type="button" class="p-chip" data-proc="${esc(s)}" aria-pressed="false">${esc(s)}</button>`).join('')}</div></div></div></div></section>
    ${U.enquiry({ products: ['iqpower', 'iqeasy'], title: 'Tell us about the static', sub: 'Describe the problem and the process; Arshad matches the right Simco-Ion product.', fields: [['problem', 'What you see', 'e.g. dust on film'], ['process', 'Process', 'e.g. film extrusion'], ['width', 'Web or bar width', 'e.g. 1600 mm'], ['speed', 'Line speed', 'e.g. 200 m/min']] })}${U.footer()}`;
  },
  init(r){
    let sym = 'dust', ion = false, q = 0.9;
    $$('[data-sym]', r).forEach(b => b.addEventListener('click', () => { sym = b.dataset.sym; $$('[data-sym]', r).forEach(x => x.setAttribute('aria-pressed', x === b)); const e = $('[data-enq]', r); if (e) e.problem.value = SYM.find(s => s[0] === sym)[1]; lp.kick(); }));
    const ib = $('[data-ion]', r); ib.onclick = () => { ion = !ion; ib.setAttribute('aria-pressed', ion); ib.textContent = ion ? 'Switch the ion bar off' : 'Switch the ion bar on'; lp.kick(); };
    r.addEventListener('click', e => {
      const p = e.target.closest('[data-proc]'); if (p){ const on = p.getAttribute('aria-pressed') !== 'true'; $$('[data-proc]', r).forEach(x => x.setAttribute('aria-pressed', x === p && on)); const f = $('[data-enq]', r); if (f) f.process.value = on ? p.dataset.proc : ''; }
      const a = e.target.closest('[data-ask]'); if (a){ const f = $('[data-enq]', r); f.prod.value = a.dataset.ask; f.msg.value = 'Please send the ' + D.P[a.dataset.ask].name + ' datasheet.'; $('#enq', r).scrollIntoView({ behavior: 'smooth' }); }
    });
    const N = 120, pts = Array.from({ length: N }, (_, i) => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, s: 1 + (i % 3) }));
    const ions = Array.from({ length: 60 }, () => ({ x: Math.random(), y: 0.1, s: Math.random() < 0.5 ? 1 : -1, v: 0.2 + Math.random() * 0.3 }));
    const lp = U.loop($('#ioC', r), (x, w, h, t, dt) => {
      q = clamp(q + (ion ? -0.9 : 0.25) * dt, 0.03, 1);
      x.clearRect(0, 0, w, h);
      const cyan = '#3FD0E0', ink = '#E4EEF2', mut = '#93A7B0', fy = h * 0.58;
      // ion bar
      x.fillStyle = ion ? cyan : '#2A3A44'; x.fillRect(w * 0.12, h * 0.1, w * 0.76, 10);
      x.fillStyle = mut; x.font = '600 12px Instrument Sans, sans-serif'; x.fillText(ion ? 'Ion bar on' : 'Ion bar off', w * 0.12, h * 0.1 - 8);
      if (ion) ions.forEach(o => { o.y += o.v * dt; if (o.y > fy / h){ o.y = 0.12; o.x = 0.12 + Math.random() * 0.76; } x.fillStyle = o.s > 0 ? '#FF9E7A' : cyan; x.font = '700 12px IBM Plex Mono, monospace'; x.fillText(o.s > 0 ? '+' : '−', o.x * w, o.y * h); });
      // film or subject
      const drawCharges = (y0, len) => { x.fillStyle = '#FF6B5E'; x.font = '700 13px IBM Plex Mono, monospace'; const n = Math.round(q * 18); for (let i = 0; i < n; i++) x.fillText('−', w * 0.08 + ((i * 97 + t * 40) % (len)), y0 - 6); };
      if (sym === 'dust'){
        x.fillStyle = '#7FA6B5'; x.fillRect(0, fy, w, 8); drawCharges(fy, w * 0.84);
        pts.forEach(p => { const px = p.x * w, py = p.y * h, dy = fy - py; p.vy += (dy > 0 ? 1 : -1) * q * 60 * dt / Math.max(0.3, Math.abs(dy) / 60) - (1 - q) * 0 + 12 * dt * (1 - q); p.vx += (Math.random() - 0.5) * 30 * dt; p.vx *= 0.96; p.vy *= 0.94; p.x += p.vx * dt / w * 40; p.y += p.vy * dt / h * 40;
          if (q > 0.35 && Math.abs(py - fy) < 6){ p.y = (fy - 2) / h; p.vy = 0; } if (p.y > 1.02 || p.x < -0.02 || p.x > 1.02){ p.x = Math.random(); p.y = 0.2 + Math.random() * 0.25; p.vy = 0; }
          x.fillStyle = 'rgba(228,238,242,.75)'; x.beginPath(); x.arc(p.x * w, p.y * h, p.s, 0, 7); x.fill(); });
      } else if (sym === 'cling'){
        const gap = 10 + (1 - q) * 70;
        [0, 1].forEach(k => { x.strokeStyle = k ? '#7FA6B5' : '#A9CBD6'; x.lineWidth = 4; x.beginPath(); for (let i = 0; i <= 40; i++){ const X = w * 0.1 + i / 40 * w * 0.8, bow = Math.sin(i / 40 * Math.PI) * (k ? -1 : 1) * (gap / 2 - 6 * q) ; x.lineTo(X, fy - 40 + bow + (k ? gap / 2 : -gap / 2) + Math.sin(t * 2 + i / 5) * 2); } x.stroke(); });
        drawCharges(fy - 40 - gap / 2, w * 0.8);
      } else if (sym === 'stack'){
        const lift = (Math.sin(t * 1.4) * 0.5 + 0.5) * 60;
        for (let i = 0; i < 6; i++){ const follow = i === 0 ? lift : lift * Math.pow(q, i) * 0.9; x.fillStyle = i ? '#5E8797' : '#A9CBD6'; x.fillRect(w * 0.25, fy + i * 10 - follow, w * 0.5, 6); }
        drawCharges(fy - lift - 4, w * 0.5);
        x.fillStyle = mut; x.fillText(q > 0.4 ? 'Two sheets lift at once' : 'One sheet at a time', w * 0.25, fy + 90);
      } else {
        x.strokeStyle = '#7FA6B5'; x.lineWidth = 3; x.beginPath(); x.arc(w * 0.45, fy, 44, 0, 7); x.stroke(); drawCharges(fy - 50, 120);
        const hx = w * 0.72 + Math.sin(t) * 30, hy = fy - 20;
        x.fillStyle = '#C9B5A5'; x.beginPath(); x.ellipse(hx, hy, 26, 14, -0.3, 0, 7); x.fill(); x.fillRect(hx + 10, hy - 6, 90, 14);
        if (q > 0.45 && Math.sin(t * 3) > 0.7){ x.strokeStyle = '#FFF6A0'; x.lineWidth = 2; x.beginPath(); x.moveTo(w * 0.45 + 44, fy - 6); for (let i = 1; i < 6; i++) x.lineTo(lerp(w * 0.45 + 44, hx - 24, i / 6), fy - 6 + (i % 2 ? -10 : 10) - (hy - fy) * i / 6); x.lineTo(hx - 24, hy); x.stroke(); }
      }
      // meter
      x.fillStyle = mut; x.font = '600 12px Instrument Sans, sans-serif'; x.fillText('Surface charge (illustrative)', 16, h - 34);
      x.fillStyle = '#243139'; x.fillRect(16, h - 26, w * 0.4, 8); x.fillStyle = q > 0.4 ? '#FF6B5E' : cyan; x.fillRect(16, h - 26, w * 0.4 * q, 8);
    });
  }
};

/* ============ export for the site lab ============ */
const BUILDS = [brezo, aurae, films, woven, objects, simco];
const STY = [['industrial', 'Industrial light', '#F4F6EE'], ['showroom', 'Dark showroom', '#0D1108'], ['blueprint', 'Blueprint', '#172010'], ['editorial', 'Editorial', '#F1ECDF'], ['soft', 'Soft depth', '#EEF1E7'], ['ion', 'Ion', '#0D1418']];
window.PB = { BUILDS, STY };
})();
