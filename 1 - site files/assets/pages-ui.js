/* Shared components and page-level quality-of-life features for the product page lab. */
window.PU = (function(){
'use strict';
const D = window.PD;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = { get(k, d){ try { const v = localStorage.getItem('arshad-pp-' + k); return v == null ? d : JSON.parse(v); } catch (e){ return d; } }, set(k, v){ try { localStorage.setItem('arshad-pp-' + k, JSON.stringify(v)); } catch (e){} } };
let cleanups = [];
const onClean = fn => cleanups.push(fn);
function cleanAll(){ cleanups.forEach(f => { try { f(); } catch (e){ console.error(e); } }); cleanups = []; }
let root = null;
const motion = () => (root && root.dataset.motion) || 'full';

/* ---------- toast, save, copy ---------- */
let toastEl = null, toastT;
function toast(msg){
  if (!toastEl){ toastEl = document.createElement('div'); toastEl.className = 'p-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
  toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2200);
}
let dlP = null;
const downloads = () => (dlP = dlP || (window.claude && window.claude.use ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null)));
async function save(filename, data){
  const dl = await downloads();
  if (!dl){ toast('Saving works on the published page'); return; }
  try { await dl.save({ filename, data }); toast('Saved ' + filename); }
  catch (e){ toast(e && e.code === 'declined' ? 'Save cancelled' : 'Couldn’t save: ' + ((e && (e.message || e.code)) || 'unknown')); }
}
async function copy(text, what){
  try { await navigator.clipboard.writeText(text); toast((what || 'Text') + ' copied'); }
  catch (e){ const t = document.createElement('textarea'); t.value = text; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); toast((what || 'Text') + ' copied'); } catch (e2){ toast('Select the text and copy it'); } t.remove(); }
}

/* ---------- units ---------- */
let units = store.get('units', 'site');
function conv(raw, mode){
  if (!raw || mode === 'site') return raw;
  return raw.replace(/(\d[\d,.]*(?:\s*(?:–|-|×|±|to)\s*\d[\d,.]*)*)(\s*)(mm|m\/min|ft\/min)(?![\w/])/g, (m, nums, sp, u) => {
    let f, nu, dp;
    if (mode === 'metric'){ if (u !== 'ft/min') return m; f = 0.3048; nu = 'm/min'; dp = 1; }
    else if (u === 'mm'){ f = 1 / 25.4; nu = 'in'; dp = 1; }
    else if (u === 'm/min'){ f = 1 / 0.3048; nu = 'ft/min'; dp = 0; }
    else return m;
    return nums.replace(/\d[\d,.]*/g, n => { const v = parseFloat(n.replace(/,/g, '')) * f; return dp ? String(+v.toFixed(dp)) : String(Math.round(v)); }) + sp + nu;
  });
}
function setUnits(u){
  units = u; store.set('units', u);
  if (!root) return;
  $$('[data-raw]', root).forEach(el => { el.textContent = conv(el.dataset.raw, u); });
  $$('[data-units]', root).forEach(b => b.setAttribute('aria-pressed', b.dataset.units === u));
}
const cv = raw => `<span data-raw="${esc(raw)}">${esc(conv(raw, units))}</span>`;

/* ---------- shortlist ---------- */
let shortlist = store.get('shortlist', []);
function toggleShort(pid){
  const i = shortlist.indexOf(pid);
  if (i >= 0) shortlist.splice(i, 1); else shortlist.push(pid);
  store.set('shortlist', shortlist); syncShort();
  toast(i >= 0 ? D.P[pid].name + ' removed from your shortlist' : D.P[pid].name + ' added to your shortlist');
}
function syncShort(){
  if (!root) return;
  $$('[data-sl]', root).forEach(b => { const on = shortlist.includes(b.dataset.sl); b.setAttribute('aria-pressed', on); b.textContent = (on ? '★ Shortlisted' : '☆ Shortlist'); });
  $$('.p-fab .n', document).forEach(n => { n.textContent = shortlist.length; });
  if (drawer && !drawer.hidden) drawDrawer();
}
let drawer = null;
function drawDrawer(){
  if (!shortlist.length){ drawer.innerHTML = '<h4>Your shortlist</h4><p class="p-note">Nothing here yet. Use ☆ Shortlist on any product to collect it and compare specs side by side.</p><button class="p-btn sm" type="button" data-x>Close</button>'; }
  else {
    const labels = []; shortlist.forEach(p => D.P[p].spec.forEach(r => { if (!labels.includes(r[0])) labels.push(r[0]); }));
    const val = (p, l) => { const r = D.P[p].spec.find(x => x[0] === l); return r && r[1] ? cv(r[1]) : '<span class="p-note">—</span>'; };
    drawer.innerHTML = `<h4>Your shortlist · ${shortlist.length}</h4><div style="overflow-x:auto"><table><thead><tr><th></th>${shortlist.map(p => `<th>${esc(D.P[p].name)} <button class="p-copy" type="button" data-rm="${p}" aria-label="Remove ${esc(D.P[p].name)}">×</button></th>`).join('')}</tr></thead><tbody>${labels.map(l => `<tr><th>${esc(l)}</th>${shortlist.map(p => `<td>${val(p, l)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <div class="p-actions" style="margin-top:12px"><button class="p-btn sm acc" type="button" data-enqall>Ask about these</button><button class="p-btn sm" type="button" data-csv>Save .csv</button><button class="p-btn sm" type="button" data-x>Close</button></div>`;
  }
}
function openDrawer(on){
  if (!drawer){
    drawer = document.createElement('div'); drawer.className = 'p-drawer'; drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-label', 'Shortlist'); drawer.hidden = true; document.body.appendChild(drawer);
    drawer.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-x]')) openDrawer(false);
      else if (t.dataset.rm) toggleShort(t.dataset.rm);
      else if (t.closest('[data-csv]')) save('arshad-shortlist.csv', specCSV(shortlist));
      else if (t.closest('[data-enqall]')){ openDrawer(false); const f = root && $('[data-enq]', root); if (f){ const m = $('[name=msg]', f); m.value = 'Please send details and a quote for: ' + shortlist.map(p => D.P[p].name).join(', ') + '.'; f.scrollIntoView({ behavior: 'smooth', block: 'center' }); m.focus({ preventScroll: true }); } }
    });
  }
  drawer.hidden = on === undefined ? !drawer.hidden : !on;
  if (!drawer.hidden){ drawDrawer(); drawer.style.fontFamily = root ? getComputedStyle(root).fontFamily : ''; copyVars(drawer); }
}
function copyVars(el){ if (!root) return; const cs = getComputedStyle(root); ['--bg', '--surf', '--surf2', '--ink', '--muted', '--line', '--acc', '--onacc', '--r', '--body'].forEach(v => el.style.setProperty(v, cs.getPropertyValue(v))); }
function specCSV(pids){
  const labels = []; pids.forEach(p => D.P[p].spec.forEach(r => { if (!labels.includes(r[0])) labels.push(r[0]); }));
  const q = s => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
  return [['Spec', ...pids.map(p => D.P[p].name)].map(q).join(','), ...labels.map(l => [l, ...pids.map(p => { const r = D.P[p].spec.find(x => x[0] === l); return r && r[1] ? conv(r[1], units) : 'On request'; })].map(q).join(','))].join('\r\n') + '\r\n';
}
function specText(pid){ const p = D.P[pid]; return p.name + ' — ' + p.sub + '\n' + p.spec.map(r => r[0] + ': ' + (r[1] ? conv(r[1], units) : 'On request')).join('\n') + '\nSource: arshadelectronics.com'; }

/* ---------- components ---------- */
function nav(active){
  const L = [['films', 'Fluxomatic'], ['brezo', 'Fluxosealer'], ['simco', 'Simco-Ion']];
  return `<div class="p-wrap"><nav class="p-nav" aria-label="Site"><span class="p-logo"><i aria-hidden="true"></i>Arshad</span>
    <span class="p-links">${L.map(([k, t]) => `<a href="#${k}" data-go="${k}"${active === k ? ' class="on" aria-current="page"' : ''}>${t}</a>`).join('')}<a href="https://plasmaright.com/" target="_blank" rel="noopener">Plasmaright ↗</a><a href="#p-faq">FAQ</a><a href="#enq">Contact</a></span>
    <a class="p-btn sm acc" href="#enq">Get a quote</a></nav></div>`;
}
function crumbs(items){ return `<div class="p-wrap"><p class="p-crumb">${items.map((t, i) => i < items.length - 1 ? `<span>${esc(t)}</span> / ` : `<b>${esc(t)}</b>`).join('')}</p></div>`; }
function figs(arr){ // [value, suffix, label, prefix]
  return `<div class="p-figs">${arr.map(f => `<div class="p-fig"><b>${f[3] || ''}${typeof f[0] === 'number' ? `<span data-count="${f[0]}">${f[0].toLocaleString('en-IN')}</span>` : esc(f[0])}${esc(f[1] || '')}</b><span>${esc(f[2])}</span></div>`).join('')}</div>`;
}
function specTable(pid, rows){
  rows = rows || D.P[pid].spec;
  return `<div class="p-spec" data-pid="${pid}"><div class="tb"><div class="p-chips" role="group" aria-label="Units">${[['site', 'As published'], ['metric', 'Metric'], ['imperial', 'Imperial']].map(([k, t]) => `<button type="button" class="p-chip" data-units="${k}" aria-pressed="${units === k}">${t}</button>`).join('')}</div>
    <div class="p-chips"><button type="button" class="p-chip" data-copyspec="${pid}">Copy</button><button type="button" class="p-chip" data-savespec="${pid}">Save .csv</button><button type="button" class="p-chip" data-sl="${pid}" aria-pressed="false">☆ Shortlist</button></div></div>
    <table><tbody>${rows.map(r => `<tr><th scope="row">${esc(r[0])}</th><td>${r[1] ? `<span class="${r[2] ? 'fl' : ''}" title="${r[2] ? 'Figure as published on the current site; Arshad to confirm' : ''}">${cv(r[1])}</span>` : '<span class="nr"><span class="pub">On request</span><span class="rev">Not on the site yet</span></span>'}</td></tr>`).join('')}</tbody></table></div>`;
}
const SHIELD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8.5 12 2.4 2.4 4.6-5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
const safety = items => items && items.length ? `<div class="p-safe">${items.map(s => `<div>${SHIELD}<span>${esc(s)}</span></div>`).join('')}</div>` : '';
const list = items => `<ul class="p-list">${items.map(s => `<li><span>${esc(s)}</span></li>`).join('')}</ul>`;
const variants = (pid, vars) => vars && vars.length ? `<div class="p-var" data-varfor="${pid}">${vars.map(v => `<button type="button" aria-pressed="false" data-var="${esc(v[0])}"><b>${esc(v[0])}</b><span>${esc(v[1])}</span></button>`).join('')}</div>` : '';
function faq(items, title){
  return `<section class="p-sec" id="p-faq"><div class="p-wrap"><h2 class="p-h2 rv">${esc(title || 'Questions buyers ask')}</h2>
    <div class="p-search"><input type="search" placeholder="Search the answers" aria-label="Search questions" data-faqq><span class="p-note" data-faqn></span></div>
    <div class="p-faq">${items.map(q => `<details><summary data-t="${esc(q[0])}">${esc(q[0])}</summary><p data-t="${esc(q[1])}">${esc(q[1])}</p></details>`).join('')}</div></div></section>`;
}
function enquiry(opts){
  const prods = opts.products;
  const f = (id, label, ph, type) => `<label class="p-field"><span>${esc(label)}</span><input name="${id}" type="${type || 'text'}" placeholder="${esc(ph || '')}" autocomplete="off"></label>`;
  return `<section class="p-sec" id="enq"><div class="p-wrap"><div class="p-grid2">
    <div><h2 class="p-h2 rv">${esc(opts.title || 'Ask for a quote')}</h2><p class="p-sub" style="color:var(--muted);max-width:520px">${esc(opts.sub || 'Tell us about your line and Arshad will size the right machine.')}</p>
      <div class="p-card" style="padding:18px 20px;margin-top:18px">
        <div class="p-copyrow"><b style="min-width:64px">Email</b><span>${esc(D.company.email)}</span><button class="p-copy" type="button" data-copy="${esc(D.company.email)}">Copy</button></div>
        ${D.company.phones.map(p => `<div class="p-copyrow"><b style="min-width:64px">Phone</b><span>${esc(p)}</span><button class="p-copy" type="button" data-copy="${esc(p)}">Copy</button></div>`).join('')}
        <p class="p-note" style="margin:10px 0 0">${esc(D.company.addr)}</p>
      </div></div>
    <form class="p-card" data-enq style="padding:20px;display:grid;gap:12px">
      <div class="p-grid2" style="gap:12px">${f('who', 'Your name', 'Name')}${f('co', 'Company', 'Company name')}</div>
      <label class="p-field"><span>Product</span><select name="prod">${prods.map(p => `<option value="${p}">${esc(D.P[p].name)} · ${esc(D.P[p].sub)}</option>`).join('')}<option value="">Not sure yet</option></select></label>
      ${f('variant', 'Variant or options', 'Pick one on the page, or type')}
      <div class="p-grid2" style="gap:12px">${(opts.fields || []).map(x => f(x[0], x[1], x[2], x[3])).join('')}</div>
      <label class="p-field"><span>Message</span><textarea name="msg" placeholder="Anything else about your line"></textarea></label>
      <div class="p-actions" style="margin-top:4px"><button class="p-btn acc" type="submit">Send enquiry</button><button class="p-btn" type="button" data-saveenq>Save as .txt</button></div>
      <p class="p-note" style="margin:0" data-enqok aria-live="polite">Draft site: this form is not connected yet, so nothing is sent.</p>
    </form></div></div></section>`;
}
function claims(){
  return `<div class="p-claims">${D.company.claims.map(c => `<div class="p-fig"><b>${c[0] === 1971 ? '<span>1971</span>' : `<span data-count="${c[0]}">${c[0].toLocaleString('en-IN')}</span>`}${esc(c[1])}</b><span>${esc(c[2])}</span></div>`).join('')}</div>`;
}
function footer(){
  return `<footer class="p-foot"><div class="p-wrap">${claims()}<div class="cols">
    <div><h4>Arshad Electronics</h4><p style="margin:0 0 8px">${esc(D.company.story)}</p><p class="p-note" style="margin:0">${esc(D.company.promise.join(' · '))}</p></div>
    <div><h4>Products</h4><div style="display:grid;gap:4px"><a href="#films" data-go="films">Fluxomatic · blown and cast film</a><a href="#woven" data-go="woven">Fluxomatic · woven fabric</a><a href="#objects" data-go="objects">Fluxomatic · 3D objects and cables</a><a href="#brezo" data-go="brezo">Fluxosealer · Brezo series</a><a href="#aurae" data-go="aurae">Fluxosealer · Aurae series</a><a href="#simco" data-go="simco">Simco-Ion static eliminators</a></div></div>
    <div><h4>Contact</h4><div class="p-copyrow"><span>${esc(D.company.email)}</span><button class="p-copy" type="button" data-copy="${esc(D.company.email)}">Copy</button></div>${D.company.phones.map(p => `<div class="p-copyrow"><span>${esc(p)}</span></div>`).join('')}<p class="p-note">${esc(D.company.addr)}</p></div>
  </div><p class="p-note" style="margin-top:28px">Keyboard: press <b>?</b> for shortcuts. Specs from arshadelectronics.com.</p></div></footer>`;
}
function mini(name, key, pid){
  return `<div class="p-hold"><div class="p-mini" aria-hidden="true"><div class="p-wrap"><b>${esc(name)}</b><span class="k">${esc(key)}</span>${pid ? `<button type="button" class="p-btn sm" data-sl="${pid}" tabindex="-1">☆ Shortlist</button>` : ''}<a class="p-btn sm acc" href="#enq" tabindex="-1">Get a quote</a></div><i class="p-prog"></i></div></div>`;
}
function splitWords(text){ text = window.I18N ? I18N.tr(text) : text; return `<span class="split-words" translate="no">${text.split(' ').map((w, i) => `<span class="w" style="transition-delay:${i * 60}ms">${esc(w)}</span>`).join(' ')}</span>`; }

/* ---------- canvas loop helper: runs only while visible and motion allows ---------- */
function loop(canvas, draw){
  let vis = false, raf = 0, alive = true, last = performance.now(), t = 0, W = 0, H = 0, dpr = 1;
  const ctx = canvas.getContext('2d');
  const size = () => { const r = canvas.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; canvas.width = Math.max(1, Math.round(W * dpr)); canvas.height = Math.max(1, Math.round(H * dpr)); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const frame = now => {
    raf = 0; if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const m = motion(); t += m === 'off' ? 0 : dt * (m === 'subtle' ? 0.5 : 1);
    draw(ctx, W, H, t, m === 'off' ? 0 : dt);
    if (vis && m !== 'off') raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && alive){ last = performance.now(); raf = requestAnimationFrame(frame); } };
  const io = new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) kick(); }); io.observe(canvas);
  const paint = () => { if (W && H) draw(ctx, W, H, t, 0); };
  const ro = new ResizeObserver(() => { size(); paint(); kick(); }); ro.observe(canvas);
  size(); paint();
  onClean(() => { alive = false; io.disconnect(); ro.disconnect(); if (raf) cancelAnimationFrame(raf); });
  return { kick(){ paint(); kick(); }, get t(){ return t; }, step(dt){ t += dt; draw(ctx, W, H, t, dt); } };
}

/* 3D stage wrapper that is disposed with the page */
function stage3d(canvas, o){ const st = A3.stage(canvas, Object.assign({ auto: motion() === 'full' }, o)); onClean(() => { st.dispose(); }); return st; }

/* ---------- wire a freshly rendered page ---------- */
function wire(r, ctx){
  root = r; ctx = ctx || {};
  syncShort(); setUnits(units);
  // reveals + split words + counters
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv, .split-words, .p-figs, .p-claims, .au-nums', r).forEach(el => io.observe(el));
  onClean(() => io.disconnect());
  // mini bar + progress
  const hold = $('.p-mini', r), prog = $('.p-prog', r), hero = $('[data-hero]', r);
  if (hold && hero){
    const hio = new IntersectionObserver(es => { const on = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; hold.classList.toggle('on', on); hold.setAttribute('aria-hidden', !on); $$('a,button', hold).forEach(x => x.tabIndex = on ? 0 : -1); }); hio.observe(hero);
    onClean(() => hio.disconnect());
  }
  const onScroll = () => { if (!prog) return; const b = r.getBoundingClientRect(); const p = Math.min(1, Math.max(0, -b.top / Math.max(1, b.height - innerHeight))); prog.style.width = (p * 100) + '%'; };
  addEventListener('scroll', onScroll, { passive: true }); onClean(() => removeEventListener('scroll', onScroll));
  // clicks
  const click = e => {
    const t = e.target, b = t.closest('button, a');
    if (!b || !r.contains(b)) return;
    if (b.dataset.units){ setUnits(b.dataset.units); return; }
    if (b.dataset.sl){ toggleShort(b.dataset.sl); return; }
    if (b.dataset.copyspec){ copy(specText(b.dataset.copyspec), 'Spec'); return; }
    if (b.dataset.savespec){ save(`arshad-${D.P[b.dataset.savespec].name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spec.csv`, specCSV([b.dataset.savespec])); return; }
    if (b.dataset.copy){ copy(b.dataset.copy); return; }
    if (b.dataset.var){ const box = b.closest('[data-varfor]'); $$('[data-var]', box).forEach(x => x.setAttribute('aria-pressed', x === b ? String(b.getAttribute('aria-pressed') !== 'true') : 'false')); const f = $('[data-enq]', r); if (f){ $('[name=variant]', f).value = b.getAttribute('aria-pressed') === 'true' ? b.dataset.var : ''; const s = $('[name=prod]', f); if ([...s.options].some(o => o.value === box.dataset.varfor)) s.value = box.dataset.varfor; } toast(b.dataset.var + ' noted in your enquiry'); return; }
    if (b.dataset.go && ctx.go){ e.preventDefault(); ctx.go(b.dataset.go); return; }
    if (b.dataset.zoom){ lightbox(b.dataset.zoom, b.dataset.alt); return; }
    if (b.hasAttribute('data-saveenq')){ save('arshad-enquiry.txt', enqText($('[data-enq]', r))); return; }
    const href = b.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1){ const tgt = r.querySelector(href); if (tgt){ e.preventDefault(); tgt.scrollIntoView({ behavior: motion() === 'off' ? 'auto' : 'smooth', block: 'start' }); } }
  };
  r.addEventListener('click', click);
  // enquiry
  const form = $('[data-enq]', r);
  if (form) form.addEventListener('submit', e => { e.preventDefault(); const ok = $('[data-enqok]', form); ok.textContent = form.who && !form.who.value.trim() ? 'Add your name so the team can reply.' : 'Thanks, we’ll be in touch. (Draft site: this form is not connected yet, so nothing was sent.)'; });
  // faq search
  const fq = $('[data-faqq]', r);
  if (fq) fq.addEventListener('input', () => {
    const q = fq.value.trim().toLowerCase(), items = $$('.p-faq details', r); let n = 0;
    items.forEach(d => { const s = $('summary', d), p = $('p', d); const hit = !q || (s.dataset.t + ' ' + p.dataset.t).toLowerCase().includes(q); d.hidden = !hit; if (hit) n++;
      [s, p].forEach(el => { el.innerHTML = q ? esc(el.dataset.t).replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>') : esc(el.dataset.t); });
      if (q && hit) d.open = true; });
    $('[data-faqn]', r).textContent = q ? n + ' of ' + items.length : '';
  });
  // floating buttons
  const fab = document.createElement('div'); fab.className = 'p-fab';
  fab.innerHTML = `<button type="button" data-top aria-label="Back to top" hidden>↑</button><button type="button" data-short>Shortlist<span class="n">${shortlist.length}</span></button>`;
  document.body.appendChild(fab); copyVars(fab);
  fab.addEventListener('click', e => { if (e.target.closest('[data-short]')) openDrawer(); if (e.target.closest('[data-top]')) r.scrollIntoView({ behavior: 'smooth' }); });
  const topBtn = $('[data-top]', fab);
  const fabVis = () => { const b = r.getBoundingClientRect(); fab.style.display = b.bottom > 120 && b.top < innerHeight - 80 ? 'flex' : 'none'; topBtn.hidden = b.top > -600; };
  addEventListener('scroll', fabVis, { passive: true }); fabVis();
  onClean(() => { removeEventListener('scroll', fabVis); fab.remove(); if (drawer) drawer.hidden = true; });
  // keyboard
  const key = e => {
    if ((e.target.closest && e.target.closest('input, textarea, select')) || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === '?'){ help(); e.preventDefault(); }
    else if (k === 'u'){ const o = ['site', 'metric', 'imperial']; setUnits(o[(o.indexOf(units) + 1) % 3]); toast('Units: ' + { site: 'as published', metric: 'metric', imperial: 'imperial' }[units]); }
    else if (k === 's'){ openDrawer(); }
    else if (k === 'e'){ const f = $('#enq', r); if (f){ f.scrollIntoView({ behavior: 'smooth' }); } }
    else if (k === 'escape'){ openDrawer(false); const h = $('.p-help'); if (h) h.remove(); const l = $('.p-lightbox'); if (l) l.remove(); }
  };
  addEventListener('keydown', key); onClean(() => removeEventListener('keydown', key));
}
function countUp(el){
  const to = +el.dataset.count, m = motion();
  if (m === 'off' || !to){ el.textContent = to.toLocaleString('en-IN'); return; }
  const t0 = performance.now(), dur = m === 'subtle' ? 500 : 1300;
  const step = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e).toLocaleString('en-IN'); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function enqText(f){
  const g = n => { const el = f.querySelector(`[name=${n}]`); return el ? el.value.trim() : ''; };
  const pid = g('prod'), lines = ['To: ' + D.company.email, 'Subject: Enquiry — ' + (pid ? D.P[pid].name : 'Arshad equipment'), ''];
  lines.push('Product: ' + (pid ? D.P[pid].name + ' (' + D.P[pid].sub + ')' : 'Not sure yet'));
  if (g('variant')) lines.push('Variant / options: ' + g('variant'));
  $$('input', f).forEach(i => { if (!['who', 'co', 'variant'].includes(i.name) && i.value.trim()) lines.push(i.closest('label').querySelector('span').textContent + ': ' + i.value.trim()); });
  if (g('msg')) lines.push('', g('msg'));
  lines.push('', g('who') || '[Your name]', g('co') || '[Company]');
  return lines.join('\n');
}
function help(){
  const h = document.createElement('div'); h.className = 'p-help'; h.setAttribute('role', 'dialog'); h.setAttribute('aria-label', 'Keyboard shortcuts');
  h.innerHTML = `<div><h3 style="margin:0 0 10px">Keyboard shortcuts</h3>${[['?', 'Show this list'], ['U', 'Switch units'], ['S', 'Open your shortlist'], ['E', 'Jump to the enquiry'], ['Esc', 'Close panels']].map(([k, t]) => `<div class="row"><span>${t}</span><kbd>${k}</kbd></div>`).join('')}<button class="p-btn sm" type="button" style="margin-top:14px">Close</button></div>`;
  copyVars(h.firstChild); h.addEventListener('click', e => { if (e.target === h || e.target.closest('button')) h.remove(); }); document.body.appendChild(h); h.querySelector('button').focus();
}
function lightbox(src, alt){
  const l = document.createElement('div'); l.className = 'p-lightbox'; l.setAttribute('role', 'dialog'); l.innerHTML = `<img src="${esc(src)}" alt="${esc(alt || '')}">`;
  l.addEventListener('click', () => l.remove()); document.body.appendChild(l);
}
return { $, $$, esc, store, onClean, cleanAll, motion, toast, save, copy, conv, cv, nav, crumbs, figs, specTable, safety, list, variants, faq, enquiry, footer, mini, splitWords, loop, stage3d, wire, setUnits, get units(){ return units; }, D,
  /* used by the site lab: one shortlist shared across every page */
  get shortlist(){ return shortlist; }, toggleShort, openDrawer, syncShort, specCSV, specText, enqText, help, lightbox };
})();
