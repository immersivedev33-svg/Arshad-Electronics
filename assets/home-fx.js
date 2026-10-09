/* Arshad Homepage Lab: canvas visuals. Door effects, globe, drawn map, endless backgrounds.
   One rAF drives every visible canvas; each paints a first frame at rest so the page is complete without motion. */
window.FX = (() => {
const TAU = Math.PI * 2;
const imgs = {};
let root = null, motion = 'full', pal = {}, running = false, last = 0, T = 0;
const loops = new Set();
const io = () => loops._io || (loops._io = new IntersectionObserver(es => es.forEach(e => { const L = e.target.__fx; if (L) L.vis = e.isIntersecting; }), { root, rootMargin: '80px' }));
const ro = new ResizeObserver(es => es.forEach(e => { const L = e.target.__fx; if (L) { size(L); L.paint(T); } }));

function img(src){
  if (!src) return null;
  if (!imgs[src]){ const im = new Image(); im.decoding = 'async'; im.onload = () => loops.forEach(L => L.paint(T)); im.src = src; imgs[src] = im; }
  const im = imgs[src]; return im.complete && im.naturalWidth ? im : null;
}
function size(L){
  const r = L.cv.getBoundingClientRect(), d = Math.min(L.dpr || 2, window.devicePixelRatio || 1);
  const w = Math.max(2, Math.round(r.width * d)), h = Math.max(2, Math.round(r.height * d));
  if (L.cv.width !== w || L.cv.height !== h){ L.cv.width = w; L.cv.height = h; }
  L.d = d;
}
function add(cv, draw, o = {}){
  const L = { cv, draw, o, vis: true, dpr: o.dpr || 2, ctx: cv.getContext('2d') };
  L.paint = t => { if (!L.ctx) return; const { width: w, height: h } = cv; L.ctx.save(); draw(L.ctx, w, h, t, L); L.ctx.restore(); };
  cv.__fx = L; loops.add(L); size(L);
  if (!o.fixed){ io().observe(cv); ro.observe(cv); }
  L.paint(o.t0 != null ? o.t0 : 1.3);
  kick(); return L;
}
function remove(L){ if (!L) return; loops.delete(L); try { io().unobserve(L.cv); ro.unobserve(L.cv); } catch(e){} }
function clear(){ [...loops].forEach(L => { if (!L.o.keep) remove(L); }); }
function kick(){ if (!running && motion !== 'off'){ running = true; last = performance.now(); requestAnimationFrame(tick); } }
function tick(now){
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  T += dt * (motion === 'subtle' ? 0.35 : 1);
  loops.forEach(L => { if (!L.vis || document.hidden) return; if (L.o.fps){ if (now - (L.lt || 0) < 1000 / L.o.fps - 2) return; L.lt = now; } L.paint(T); });
  if (motion !== 'off' && loops.size) requestAnimationFrame(tick); else running = false;
}
function setMotion(m){ motion = m; if (m === 'off') loops.forEach(L => L.paint(1.3)); else kick(); }
function setPal(p){ pal = p; loops.forEach(L => L.paint(T)); }
function init(r){ root = r; }

/* helpers */
function cover(ctx, im, w, h, fx = .5, fy = .5){
  const s = Math.max(w / im.naturalWidth, h / im.naturalHeight), iw = im.naturalWidth * s, ih = im.naturalHeight * s;
  const ox = (w - iw) * fx, oy = (h - ih) * fy; ctx.drawImage(im, ox, oy, iw, ih);
  return (u, v) => [ox + u * iw, oy + v * ih];
}
const rnd = (a => () => (a = (a * 16807) % 2147483647) / 2147483647)(7);
function hash(i){ const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function rgba(hex, a){ const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`; }
function mix(h1, h2, t){ const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16); const c = s => Math.round((a >> s & 255) * (1 - t) + (b >> s & 255) * t); return `rgb(${c(16)},${c(8)},${c(0)})`; }
function logoBars(ctx, x, y, s, fill){ // the logo mark at (x,y) top-left, width 440*s
  const P = [[0,299,75,299,220,5,147,5],[257,5,293,5,330,78,220,78],[202,115,348,115,385,188,165,188],[147,226,403,226,440,299,110,299]];
  ctx.fillStyle = fill; P.forEach(p => { ctx.beginPath(); ctx.moveTo(x + p[0]*s, y + p[1]*s); for (let i = 2; i < 8; i += 2) ctx.lineTo(x + p[i]*s, y + p[i+1]*s); ctx.closePath(); ctx.fill(); });
}

/* ---------------- door visuals ---------------- */
const V = {};
V.corona = (ctx, w, h, t, L) => {
  const u = Math.min(w, h), ac = L.o.photo ? '#B9A2FF' : (pal.acFGlow || '#B9A2FF');
  const im = L.o.photo ? img(L.o.photo) : null;
  let A, B;
  if (im){
    const m = cover(ctx, im, w, h, .62, .6);
    ctx.fillStyle = 'rgba(12,14,10,.28)'; ctx.fillRect(0, 0, w, h);
    A = m(.125, .781); B = m(.939, .40);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#171C11'); g.addColorStop(1, '#0B0E08'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // roller
    const ry = h * .6, rh = h * .2, rg = ctx.createLinearGradient(0, ry, 0, ry + rh);
    rg.addColorStop(0, '#6E7566'); rg.addColorStop(.35, '#C9CDBF'); rg.addColorStop(.6, '#8E9585'); rg.addColorStop(1, '#2B3024');
    ctx.fillStyle = rg; ctx.fillRect(w * .04, ry, w * .92, rh);
    // moving film web over the roller
    ctx.fillStyle = 'rgba(235,240,225,.18)'; ctx.fillRect(w * .04, ry - 2, w * .92, 4);
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1;
    for (let i = 0; i < 26; i++){ const x = w * .04 + ((i * 47 + t * 120 * (w / 600)) % (w * .92)); ctx.beginPath(); ctx.moveTo(x, ry + 3); ctx.lineTo(x - 8, ry + rh - 3); ctx.stroke(); }
    // electrode + fins
    ctx.fillStyle = '#2E3527'; ctx.fillRect(w * .06, h * .3, w * .88, h * .1);
    ctx.fillStyle = '#4A5341'; for (let i = 0; i < 12; i++){ ctx.fillRect(w * (.08 + i * .073), h * .4, w * .05, h * .08); }
    ctx.fillStyle = '#7A2E22'; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(w * (.2 + i * .2), h * .27, u * .04, 0, TAU); ctx.fill(); }
    A = [w * .08, h * .54]; B = [w * .92, h * .54];
  }
  // discharge
  ctx.globalCompositeOperation = 'lighter';
  const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  const pulse = .7 + .3 * Math.sin(t * 9) * Math.sin(t * 3.3);
  const glow = ctx.createLinearGradient(A[0] + nx * 24, A[1] + ny * 24, A[0] - nx * 24, A[1] - ny * 24);
  ctx.lineCap = 'round';
  for (let pass = 0; pass < 2; pass++){
    ctx.strokeStyle = rgba(ac, pass ? .9 * pulse : .22 * pulse); ctx.lineWidth = pass ? Math.max(1, u * .004) : u * .03;
    ctx.beginPath();
    const n = 90;
    for (let i = 0; i <= n; i++){
      const f = i / n, j = (hash(i * 3 + Math.floor(t * 24)) - .5) * u * (pass ? .018 : .01);
      const x = A[0] + dx * f + nx * j, y = A[1] + dy * f + ny * j;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  if (!im){ // vertical streamers in drawn mode
    for (let i = 0; i < 34; i++){
      const f = (i + .5) / 34, x0 = A[0] + dx * f, on = hash(i + Math.floor(t * 18) * 13) > .35; if (!on) continue;
      ctx.strokeStyle = rgba(ac, .35 + .5 * hash(i * 7 + Math.floor(t * 30)));
      ctx.lineWidth = Math.max(1, u * .003); ctx.beginPath(); let y = h * .48; ctx.moveTo(x0, y);
      while (y < h * .6){ y += h * .02; ctx.lineTo(x0 + (hash(i * 31 + y + Math.floor(t * 30)) - .5) * u * .025, y); } ctx.stroke();
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  void glow;
};
V.induction = (ctx, w, h, t, L) => {
  const u = Math.min(w, h), amber = '#FFB44A';
  const im = L.o.photo ? img(L.o.photo) : null;
  let C, rx;
  if (im){
    const m = cover(ctx, im, w, h, .3, .5); ctx.fillStyle = 'rgba(10,12,8,.18)'; ctx.fillRect(0, 0, w, h);
    C = m(.34, .425); rx = (m(.72, .43)[0] - m(.2, .43)[0]) / 2;
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#161B10'); g.addColorStop(1, '#0B0E08'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // head
    ctx.fillStyle = '#262D1E'; ctx.fillRect(w * .28, h * .12, w * .5, h * .28);
    ctx.fillStyle = '#3A4430'; ctx.fillRect(w * .28, h * .36, w * .5, h * .05);
    ctx.fillStyle = '#576630'; ctx.fillRect(w * .66, h * .14, w * .1, h * .05);
    // conveyor
    ctx.fillStyle = '#C5CAB9'; ctx.fillRect(0, h * .8, w, h * .04); ctx.fillStyle = '#3A4232'; ctx.fillRect(0, h * .84, w, h * .16);
    // jars
    const jw = w * .13, gap = w * .2, off = (t * w * .06) % gap;
    for (let i = -1; i < 7; i++){
      const x = i * gap + off, y = h * .48, jh = h * .32;
      const under = Math.max(0, 1 - Math.abs((x + jw / 2) - w * .53) / (w * .2));
      ctx.fillStyle = '#E9ECE2'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, jw, jh, 6) : ctx.rect(x, y, jw, jh); ctx.fill();
      ctx.fillStyle = '#C9D08B'; ctx.fillRect(x, y + jh * .3, jw, jh * .45);
      ctx.fillStyle = '#F4F5F0'; ctx.fillRect(x - 3, y - h * .05, jw + 6, h * .06);
      if (under > 0){ ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(amber, .75 * under * (.6 + .4 * Math.sin(t * 8))); ctx.fillRect(x - 3, y - h * .012, jw + 6, h * .014); ctx.globalCompositeOperation = 'source-over'; }
    }
    C = [w * .53, h * .43]; rx = w * .25;
  }
  ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 4; k++){
    const ph = ((t * .55 + k / 4) % 1), a = (1 - ph) * .55;
    ctx.strokeStyle = rgba(amber, a); ctx.lineWidth = Math.max(1, u * .006 * (1 - ph) + 1);
    ctx.beginPath(); ctx.ellipse(C[0], C[1], rx * (.25 + ph * .9), rx * (.05 + ph * .16), 0, 0, TAU); ctx.stroke();
  }
  const gg = ctx.createRadialGradient(C[0], C[1], 0, C[0], C[1], rx * .8);
  gg.addColorStop(0, rgba(amber, .28 + .12 * Math.sin(t * 6))); gg.addColorStop(1, rgba(amber, 0));
  ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(C[0], C[1], rx * .9, rx * .22, 0, 0, TAU); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
};
V.ions = (ctx, w, h, t, L) => {
  const u = Math.min(w, h), ac = pal.acIGlow || '#A7C6D4';
  const im = L.o.photo ? img(L.o.photo) : null;
  if (im){ cover(ctx, im, w, h, .5, .5); ctx.fillStyle = 'rgba(10,13,9,.55)'; ctx.fillRect(0, 0, w, h); }
  else { const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#141A12'); g.addColorStop(1, '#0B0F0A'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  // film web + bar
  ctx.fillStyle = 'rgba(230,236,220,.1)'; ctx.fillRect(0, h * .56, w, h * .1);
  const bx = w * .5; ctx.fillStyle = '#2E3629'; ctx.fillRect(bx - w * .03, h * .1, w * .06, h * .3); ctx.fillStyle = '#51604A'; ctx.fillRect(bx - w * .045, h * .38, w * .09, h * .04);
  ctx.globalCompositeOperation = 'lighter';
  const cone = ctx.createLinearGradient(0, h * .42, 0, h * .6); cone.addColorStop(0, rgba(ac, .28)); cone.addColorStop(1, rgba(ac, 0));
  ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(bx - w * .04, h * .42); ctx.lineTo(bx + w * .04, h * .42); ctx.lineTo(bx + w * .16, h * .64); ctx.lineTo(bx - w * .16, h * .64); ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  const N = 46, r = Math.max(2.5, u * .012);
  ctx.font = `${Math.round(r * 2)}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < N; i++){
    const sp = .05 + hash(i) * .05, x = ((hash(i * 3) + t * sp) % 1) * w * 1.1 - w * .05;
    const y = h * (.58 + (hash(i * 5) - .5) * .08) + Math.sin(t * 2 + i) * u * .01;
    const neutral = x > bx - w * .02 && hash(i * 9) < .92;
    const sign = hash(i * 11) > .5;
    ctx.fillStyle = neutral ? 'rgba(200,210,190,.55)' : (sign ? rgba(ac, .95) : 'rgba(233,160,120,.95)');
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    if (!neutral){ ctx.fillStyle = '#10140C'; ctx.fillText(sign ? '+' : '−', x, y + .5); }
  }
  // ions falling from the bar
  for (let i = 0; i < 26; i++){
    const ph = (t * .8 + hash(i * 17)) % 1, x = bx + (hash(i * 23) - .5) * w * .28 * ph, y = h * .42 + ph * h * .16;
    ctx.fillStyle = hash(i) > .5 ? rgba(ac, 1 - ph) : `rgba(233,160,120,${1 - ph})`; ctx.fillRect(x, y, 2.5, 2.5);
  }
};
V.plasma = (ctx, w, h, t) => {
  const u = Math.min(w, h), ac = pal.acPGlow || '#C9E39A';
  const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#12170D'); g.addColorStop(1, '#090C07'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // electrode plates
  ctx.fillStyle = '#2C3424'; ctx.fillRect(w * .08, h * .18, w * .84, h * .07); ctx.fillRect(w * .08, h * .72, w * .84, h * .07);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++){
    const x = w * (.14 + .72 * ((i / 8 + Math.sin(t * .4 + i) * .04))), y = h * (.48 + Math.sin(t * .9 + i * 1.7) * .09), r = u * (.16 + .06 * Math.sin(t * 1.3 + i));
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(ac, .32)); gr.addColorStop(.5, rgba(ac, .1)); gr.addColorStop(1, rgba(ac, 0));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  for (let i = 0; i < 60; i++){ const ph = (t * .6 + hash(i)) % 1, x = w * (.1 + .8 * hash(i * 7)), y = h * .25 + ph * h * .47; ctx.fillStyle = rgba('#F2F7E6', (1 - Math.abs(ph - .5) * 2) * .7); ctx.fillRect(x, y, 2, 2); }
  ctx.globalCompositeOperation = 'source-over';
  // woven textile passing through
  ctx.strokeStyle = 'rgba(230,236,220,.14)'; ctx.lineWidth = 1;
  const off = (t * 30) % 12;
  for (let x = -12 + off; x < w; x += 12){ ctx.beginPath(); ctx.moveTo(x, h * .45); ctx.lineTo(x + 6, h * .53); ctx.stroke(); }
};

/* ---------------- globe (dot sphere, Mumbai marked) ---------------- */
/* draft round 2: a network on the globe. Points around the world are joined to Mumbai and to their neighbours;
   pulses run along every link. The points are illustrative: the live site gives 35+ countries, not which ones. */
const G = (() => { const pts = []; const n = 1400; for (let i = 0; i < n; i++){ const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); } return pts; })();
const GNET = (() => {
  const d2r = Math.PI / 180, v = (la, lo) => [Math.cos(la * d2r) * Math.cos(lo * d2r), Math.sin(la * d2r), Math.cos(la * d2r) * Math.sin(lo * d2r)];
  const nodes = [v(19.07, 72.88)];
  for (let i = 0; nodes.length < 22 && i < 400; i++){
    const la = -42 + hash(i * 7.3 + 1) * 100, lo = -180 + hash(i * 3.1 + 5) * 360, p = v(la, lo);
    if (nodes.every(q => Math.acos(Math.max(-1, Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2]))) > 0.36)) nodes.push(p);
  }
  const ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  const links = [], has = new Set(), link = (i, j) => { const k = i < j ? i + '-' + j : j + '-' + i; if (i === j || has.has(k)) return; has.add(k); links.push([i, j]); };
  // Mumbai to the ten nearest points, then every point to its two nearest neighbours
  nodes.map((p, i) => [i, ang(nodes[0], p)]).slice(1).sort((a, b) => a[1] - b[1]).slice(0, 10).forEach(([i]) => link(0, i));
  nodes.forEach((p, i) => nodes.map((q, j) => [j, ang(p, q)]).filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j]) => link(i, j)));
  const N = 22;
  const arcs = links.map(([i, j], li) => {
    const a = nodes[i], b = nodes[j], om = ang(a, b), so = Math.sin(om), lift = 0.04 + 0.16 * om / Math.PI, pts = [];
    for (let s = 0; s <= N; s++){
      const u = s / N, ka = Math.sin((1 - u) * om) / so, kb = Math.sin(u * om) / so, h = 1 + lift * Math.sin(Math.PI * u);
      pts.push([(a[0] * ka + b[0] * kb) * h, (a[1] * ka + b[1] * kb) * h, (a[2] * ka + b[2] * kb) * h]);
    }
    return { pts, off: hash(li * 13.7 + 2), sp: 0.16 + hash(li * 5.9 + 9) * 0.12, hub: i === 0 };
  });
  return { nodes, arcs };
})();
function globe(ctx, w, h, t){
  ctx.clearRect(0, 0, w, h);
  const R = Math.min(w, h) * .44, cx = w / 2, cy = h / 2, rot = t * .12 - 1.3, tilt = -.35;
  const dot = pal.brandTx || '#576630';
  const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
  const proj = p => { let x = p[0] * cr - p[2] * sr, z = p[0] * sr + p[2] * cr, y = p[1]; const y2 = y * ct - z * st; z = y * st + z * ct; return [cx + x * R, cy - y2 * R, z]; };
  ctx.strokeStyle = rgba(pal.lineHex || '#C9CDBF', .8); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  G.forEach(p => { const [x, y, z] = proj(p); if (z < 0) return; ctx.fillStyle = dot; ctx.globalAlpha = .12 + z * .5; ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4); });
  // links: front segments bright, the far side faint
  ctx.lineCap = 'round'; ctx.strokeStyle = dot;
  const pulses = [];
  GNET.arcs.forEach(a => {
    const P = a.pts.map(proj);
    for (let s = 1; s < P.length; s++){
      const z = (P[s][2] + P[s - 1][2]) / 2; if (z < -.35) continue;
      ctx.globalAlpha = z > 0 ? (a.hub ? .26 : .16) + z * (a.hub ? .5 : .36) : .05; ctx.lineWidth = a.hub ? 1.4 : 1;
      ctx.beginPath(); ctx.moveTo(P[s - 1][0], P[s - 1][1]); ctx.lineTo(P[s][0], P[s][1]); ctx.stroke();
    }
    const u = (((t || 0) * a.sp + a.off) % 1 + 1) % 1, f = u * (P.length - 1), i0 = Math.floor(f), k = f - i0, q0 = P[i0], q1 = P[Math.min(P.length - 1, i0 + 1)];
    const x = q0[0] + (q1[0] - q0[0]) * k, y = q0[1] + (q1[1] - q0[1]) * k, z = q0[2] + (q1[2] - q0[2]) * k;
    if (z > 0) pulses.push([x, y, z, Math.sin(Math.PI * u)]);
  });
  // pulses travelling along the links
  pulses.forEach(([x, y, z, e]) => {
    ctx.fillStyle = dot; ctx.globalAlpha = (.15 + z * .2) * e; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill();
    ctx.fillStyle = '#F2F4EC'; ctx.globalAlpha = (.45 + z * .55) * e; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill();
  });
  // network points
  GNET.nodes.forEach((p, i) => { if (!i) return; const [x, y, z] = proj(p); if (z < 0) return; ctx.globalAlpha = .35 + z * .6; ctx.fillStyle = dot; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); ctx.strokeStyle = dot; ctx.globalAlpha *= .4; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 6.5, 0, TAU); ctx.stroke(); });
  ctx.globalAlpha = 1;
  const lat = 19.07 * Math.PI / 180, lon = 72.88 * Math.PI / 180;
  const m = proj([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]);
  if (m[2] > -.1){
    const ph = (t * .8) % 1;
    ctx.strokeStyle = rgba(pal.brandHex || '#576630', 1 - ph); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(m[0], m[1], 6 + ph * 26, 0, TAU); ctx.stroke();
    ctx.fillStyle = pal.brandHex || '#576630'; ctx.beginPath(); ctx.arc(m[0], m[1], 6, 0, TAU); ctx.fill();
    ctx.fillStyle = pal.inkHex || '#1B1F14'; ctx.font = `600 ${Math.round(R * .06)}px Inter, sans-serif`; ctx.fillText('Mumbai', m[0] + 12, m[1] - 10);
  }
}

/* ---------------- drawn map for the contact card ---------------- */
function map(ctx, w, h, t){
  ctx.fillStyle = pal.surf2Hex || '#ECEEE5'; ctx.fillRect(0, 0, w, h);
  const s = Math.min(w, h);
  // sea on the left (Mahim bay), coast wobble
  ctx.fillStyle = rgba(pal.brandHex || '#576630', .14);
  ctx.beginPath(); ctx.moveTo(0, 0); for (let y = 0; y <= h; y += 10){ ctx.lineTo(w * .28 + Math.sin(y * .012) * s * .05 + Math.sin(y * .05) * 6, y); } ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(pal.inkHex || '#1B1F14', .12); ctx.lineWidth = 1.2;
  for (let i = 0; i < 18; i++){ const y = hash(i) * h; ctx.beginPath(); ctx.moveTo(w * .3, y); ctx.bezierCurveTo(w * .5, y + (hash(i * 3) - .5) * 80, w * .7, y + (hash(i * 5) - .5) * 80, w, y + (hash(i * 7) - .5) * 120); ctx.stroke(); }
  for (let i = 0; i < 14; i++){ const x = w * (.32 + hash(i * 11) * .68); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (hash(i * 13) - .5) * 120, h); ctx.stroke(); }
  ctx.strokeStyle = rgba(pal.brandHex || '#576630', .45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w * .3, h * .15); ctx.bezierCurveTo(w * .55, h * .35, w * .6, h * .55, w, h * .7); ctx.stroke();
  const px = w * .72, py = h * .5, ph = (t * .7) % 1;
  ctx.strokeStyle = rgba(pal.brandHex || '#576630', 1 - ph); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 8 + ph * 34, 0, TAU); ctx.stroke();
  ctx.fillStyle = pal.brandHex || '#576630'; ctx.beginPath(); ctx.arc(px, py - 16, 12, Math.PI, 0); ctx.lineTo(px, py + 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py - 16, 4.5, 0, TAU); ctx.fill();
  ctx.fillStyle = pal.inkHex || '#1B1F14'; ctx.font = `600 ${Math.round(Math.max(12, s * .03))}px Inter, sans-serif`; ctx.fillText('Hammersmith Industrial Estate, Mahim', px - 140, py + 34);
}

/* ---------------- endless backgrounds ----------------
   draw(ctx,w,h,t,S) with S = {y: scroll px, p: progress 0..1, mx, my: pointer -1..1} */
const BG = {};
const bgCol = () => ({ bg: pal.bgHex || '#F5F5EF', ink: pal.inkHex || '#1B1F14', brand: pal.brandHex || '#576630', tx: pal.brandTxHex || '#576630', line: pal.lineHex || '#D8DBCD', dark: pal.dark });

BG.line = (ctx, w, h, t, S) => {
  const c = bgCol(), d = c.dark;
  const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, d ? '#0E120A' : mix(c.bg, '#FFFFFF', .4)); sky.addColorStop(1, d ? '#181E12' : mix(c.bg, c.line, .5));
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  const X = S.y * 1.35 + t * 18, U = Math.min(w, h) / 900 * (window.devicePixelRatio > 1 ? 1.4 : 1);
  // far: arched roof ribs (like the factory in the corona photo)
  ctx.strokeStyle = d ? 'rgba(200,210,180,.07)' : rgba(c.brand, .08); ctx.lineWidth = 2 * U;
  const rib = 90 * U, o1 = -(X * .15) % rib;
  for (let x = o1 - rib; x < w + rib; x += rib){ ctx.beginPath(); ctx.moveTo(x, h * .05); ctx.quadraticCurveTo(x + rib * .3, h * .22, x + rib * .1, h * .36); ctx.stroke(); }
  ctx.fillStyle = d ? 'rgba(200,210,180,.05)' : rgba(c.brand, .05); ctx.fillRect(0, h * .36, w, 2 * U);
  // mid: line base
  const base = h * (.66 + S.my * .01), web = base - 70 * U;
  ctx.fillStyle = d ? '#20271A' : mix(c.bg, c.brand, .12); ctx.fillRect(0, base, w, h - base);
  ctx.fillStyle = d ? '#2B3322' : mix(c.bg, c.brand, .22); ctx.fillRect(0, base, w, 4 * U);
  // stations along the world
  const SP = 760 * U, labels = ['Unwind', 'Corona treater', 'Printing', 'Lamination', 'Pouch & fill', 'Induction sealer', 'Packed'];
  const first = Math.floor((X - w * .2) / SP) - 1;
  // film web (changes after corona)
  for (let k = first; k < first + Math.ceil(w / SP) + 3; k++){
    const sx = k * SP - X, kind = ((k % 7) + 7) % 7;
    const segStart = sx, segEnd = sx + SP;
    if (kind <= 3){
      const treated = kind >= 1;
      ctx.fillStyle = treated ? (d ? 'rgba(210,220,190,.55)' : rgba(c.brand, .35)) : (d ? 'rgba(210,220,190,.3)' : rgba(c.ink, .18));
      ctx.fillRect(segStart, web, SP, 5 * U);
      if (treated){ ctx.fillStyle = d ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.7)'; for (let i = 0; i < 6; i++){ const fx = segStart + ((i * 140 * U + t * 90 * U) % SP); ctx.fillRect(fx, web + 1 * U, 30 * U, 2 * U); } }
    } else {
      // conveyor with jars
      ctx.fillStyle = d ? '#3A4430' : mix(c.bg, c.ink, .25); ctx.fillRect(segStart, web + 30 * U, SP, 8 * U);
      for (let j = 0; j < 7; j++){
        const jx = segStart + j * 108 * U + ((t * 40 * U) % (108 * U)), jy = web - 26 * U;
        ctx.fillStyle = d ? '#DADFCF' : '#FFFFFF'; ctx.fillRect(jx, jy, 44 * U, 56 * U);
        ctx.fillStyle = d ? '#9FAE6A' : '#C9D08B'; ctx.fillRect(jx, jy + 18 * U, 44 * U, 22 * U);
        ctx.fillStyle = d ? '#E8ECDF' : '#F1F2EC'; ctx.fillRect(jx - 3 * U, jy - 9 * U, 50 * U, 10 * U);
        ctx.strokeStyle = rgba(c.ink, .15); ctx.strokeRect(jx, jy, 44 * U, 56 * U);
      }
    }
    // machine body
    const mx = sx + SP * .35, mw = 220 * U, lab = labels[kind];
    ctx.fillStyle = d ? '#2A3321' : mix(c.bg, c.brand, .35);
    if (kind === 0){ ctx.beginPath(); ctx.arc(mx + 60 * U, web - 20 * U, 70 * U, 0, TAU); ctx.fill(); ctx.fillStyle = d ? '#46523A' : c.brand; ctx.beginPath(); ctx.arc(mx + 60 * U, web - 20 * U, 16 * U, 0, TAU); ctx.fill(); }
    if (kind === 1){
      ctx.fillStyle = d ? '#303A26' : c.brand; ctx.fillRect(mx, web - 150 * U, mw, 120 * U);
      ctx.fillStyle = d ? '#414C35' : mix(c.brand, '#000000', .25); ctx.fillRect(mx + 10 * U, web - 30 * U, mw - 20 * U, 18 * U);
      ctx.fillStyle = d ? '#6B7560' : mix(c.bg, c.ink, .35); ctx.beginPath(); ctx.arc(mx + mw / 2, web + 34 * U, 34 * U, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = d ? 'lighter' : 'source-over';
      ctx.strokeStyle = rgba(pal.acFHex || '#7157B8', .6 + .3 * Math.sin(t * 20)); ctx.lineWidth = 2 * U;
      ctx.beginPath(); for (let i = 0; i <= 40; i++){ const x = mx + 14 * U + (mw - 28 * U) * i / 40, y = web - 8 * U + (hash(i + Math.floor(t * 20)) - .5) * 8 * U; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    if (kind === 2 || kind === 3){
      ctx.fillStyle = d ? '#2A3321' : mix(c.bg, c.brand, .3); ctx.fillRect(mx, web - 170 * U, mw * .9, 150 * U);
      [0, 1, 2].forEach(i => { ctx.fillStyle = d ? '#56604A' : mix(c.bg, c.ink, .3); ctx.beginPath(); ctx.arc(mx + (40 + i * 60) * U, web - 40 * U, 22 * U, 0, TAU); ctx.fill(); });
      if (kind === 2){ ['#576630', '#8C9671', '#3A4520'].forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(mx + (28 + i * 60) * U, web - 120 * U, 24 * U, 40 * U); }); }
    }
    if (kind === 4){ ctx.fillStyle = d ? '#2A3321' : mix(c.bg, c.brand, .3); ctx.fillRect(mx, web - 210 * U, 150 * U, 160 * U); ctx.fillStyle = d ? '#46523A' : c.brand; ctx.fillRect(mx + 60 * U, web - 50 * U, 12 * U, 30 * U); }
    if (kind === 5){
      ctx.fillStyle = d ? '#303A26' : c.brand; ctx.fillRect(mx, web - 130 * U, mw, 84 * U);
      ctx.fillStyle = d ? '#1E2517' : mix(c.brand, '#000000', .35); ctx.fillRect(mx, web - 50 * U, mw, 14 * U);
      for (let k2 = 0; k2 < 3; k2++){ const ph = (t * .6 + k2 / 3) % 1; ctx.strokeStyle = rgba(pal.acSHex || '#A86E16', (1 - ph) * .7); ctx.lineWidth = 2 * U; ctx.beginPath(); ctx.ellipse(mx + mw / 2, web - 34 * U, (30 + ph * 110) * U, (5 + ph * 14) * U, 0, 0, TAU); ctx.stroke(); }
    }
    if (kind === 6){ for (let b = 0; b < 3; b++){ ctx.fillStyle = d ? '#6B5A3A' : '#C8B48A'; ctx.fillRect(mx + b * 70 * U, web - (40 + b % 2 * 50) * U, 64 * U, 64 * U); ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.strokeRect(mx + b * 70 * U, web - (40 + b % 2 * 50) * U, 64 * U, 64 * U); } }
    // station label
    ctx.fillStyle = d ? 'rgba(220,228,205,.55)' : rgba(c.ink, .45); ctx.font = `600 ${Math.round(13 * U * 1.3)}px "IBM Plex Mono", monospace`;
    ctx.fillText(String(kind + 1).padStart(2, '0') + '  ' + lab.toUpperCase(), mx, base + 34 * U);
  }
  // near: posts passing fast, blurred
  ctx.fillStyle = d ? 'rgba(0,0,0,.35)' : rgba(c.ink, .06);
  const pst = 520 * U, o3 = -(X * 1.8) % pst;
  for (let x = o3 - pst; x < w + pst; x += pst){ ctx.fillRect(x, 0, 26 * U, h); }
};
BG.bars = (ctx, w, h, t, S) => {
  const c = bgCol(); ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);
  const cam = S.y * .004 + t * .05, N = 70, f = Math.min(w, h) * .9;
  const items = [];
  for (let i = 0; i < N; i++){
    let z = ((hash(i) * 12 - cam) % 12 + 12) % 12 + .4;
    const x = (hash(i * 3) - .5) * 9, y = (hash(i * 5) - .5) * 6;
    items.push([z, x, y, i]);
  }
  items.sort((a, b) => b[0] - a[0]);
  items.forEach(([z, x, y, i]) => {
    const s = f / z / 440 * (.35 + hash(i * 7) * .5), sx = w / 2 + (x - S.mx * .5) * f / z - 220 * s, sy = h / 2 + (y - S.my * .4) * f / z - 150 * s;
    const a = Math.min(1, (12 - z) / 4) * Math.min(1, z / 1.2);
    ctx.globalAlpha = a * (c.dark ? .55 : .5);
    logoBars(ctx, sx, sy, s, mix(c.bg, c.dark ? c.tx : c.brand, Math.max(.15, 1 - z / 12)));
  });
  ctx.globalAlpha = 1;
};
BG.tunnel = (ctx, w, h, t, S) => {
  const c = bgCol(); ctx.fillStyle = c.dark ? '#0B0E08' : '#141810'; ctx.fillRect(0, 0, w, h);
  const srcs = ['img/mood-roller-drive.jpg', 'img/mood-treater-frame.jpg', 'img/mood-sealer-ics.jpg', 'img/mood-woven-fabric.jpg', 'img/mood-aurae3.jpg', 'img/mood-simco-plastic.jpg', 'img/mood-timeline.jpg', 'img/photo-jar50.jpg'];
  const cam = S.y * .006 + t * .04, f = Math.min(w, h) * 1.1, L = 16;
  // perspective guide lines
  ctx.strokeStyle = 'rgba(200,210,180,.08)'; ctx.lineWidth = 1;
  for (let i = 0; i < 16; i++){ const a = i / 16 * TAU; ctx.beginPath(); ctx.moveTo(w / 2, h / 2); ctx.lineTo(w / 2 + Math.cos(a) * w, h / 2 + Math.sin(a) * w); ctx.stroke(); }
  const items = [];
  for (let i = 0; i < 16; i++){ const z = ((i * 1.1 - cam) % L + L) % L + .6; items.push([z, i]); }
  items.sort((a, b) => b[0] - a[0]);
  items.forEach(([z, i]) => {
    const im = img(srcs[i % srcs.length]); if (!im) return;
    const side = i % 2 ? 1 : -1, px = side * (1.25 + hash(i) * .5) - S.mx * .3, py = (hash(i * 3) - .5) * 1.2 - S.my * .2;
    const sc = f / z, ww = 1.1 * sc, hh = ww * im.naturalHeight / im.naturalWidth;
    const x = w / 2 + px * sc - ww / 2, y = h / 2 + py * sc - hh / 2;
    ctx.globalAlpha = Math.min(1, (L - z) / 5) * Math.min(1, (z - .6) / .8) * .9;
    ctx.drawImage(im, x, y, ww, hh);
    ctx.fillStyle = `rgba(20,24,16,${Math.min(.7, z / L)})`; ctx.fillRect(x, y, ww, hh);
  });
  ctx.globalAlpha = 1;
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .2, w / 2, h / 2, Math.max(w, h) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
};
BG.field = (ctx, w, h, t, S) => {
  const c = bgCol(); ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);
  const hz = h * (.42 + S.my * .02), vx = w / 2 + S.mx * w * .05, U = window.devicePixelRatio || 1;
  ctx.strokeStyle = rgba(c.dark ? '#C9D2A6' : c.brand, c.dark ? .14 : .16); ctx.lineWidth = 1;
  for (let i = -24; i <= 24; i++){ ctx.beginPath(); ctx.moveTo(vx + i * 12, hz); ctx.lineTo(vx + i * w * .09, h); ctx.stroke(); }
  const off = (S.y * .02 + t * .15) % 1;
  for (let k = 0; k < 22; k++){ const z = (k + 1 - off), y = hz + (h - hz) * (1 / (z * .35 + .4)) * .4; if (y > h || y < hz) continue; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  // ceiling grid mirrored, fainter
  ctx.strokeStyle = rgba(c.dark ? '#C9D2A6' : c.brand, .06);
  for (let i = -24; i <= 24; i++){ ctx.beginPath(); ctx.moveTo(vx + i * 12, hz); ctx.lineTo(vx + i * w * .09, 0); ctx.stroke(); }
  // ruler on the left edge: film width scale 0..5100 mm tied to scroll
  const rx = 18 * U; ctx.fillStyle = rgba(c.dark ? '#C9D2A6' : c.ink, .5); ctx.font = `${Math.round(10 * U)}px "IBM Plex Mono", monospace`;
  const mm = Math.round(S.p * 5100);
  for (let i = 0; i < 60; i++){ const y = (i * 22 * U - (S.y * .5) % (22 * U)); const big = (i + Math.floor(S.y * .5 / (22 * U))) % 5 === 0; ctx.fillRect(rx, y, big ? 14 * U : 7 * U, 1 * U); }
  ctx.fillText(`WIDTH ${String(mm).padStart(4, '0')} MM`, rx + 20 * U, h * .5);
  // particles drifting
  for (let i = 0; i < 90; i++){ const x = (hash(i) * w + t * 8 * (1 + hash(i * 2))) % w, y = (hash(i * 3) * h - S.y * .08 * (1 + hash(i * 4))) % h; ctx.fillStyle = rgba(c.dark ? '#DDE6C5' : c.brand, .25 + hash(i * 5) * .3); ctx.fillRect(x, (y + h) % h, 2 * U, 2 * U); }
};
BG.ions = (ctx, w, h, t, S) => {
  const c = bgCol(); ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);
  const U = window.devicePixelRatio || 1, N = 120, pos = rgba(c.dark ? '#AFC4CF' : '#4F6B78', .7), neg = rgba(c.dark ? '#E4B08C' : '#9A5B33', .7), neu = rgba(c.dark ? '#C9D2A6' : c.brand, .35);
  ctx.font = `${Math.round(9 * U)}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < N; i += 2){
    // pair i (+) and i+1 (−) approach, meet, fade, respawn
    const per = 7 + hash(i) * 6, ph = ((t + S.y * .004) / per + hash(i * 3)) % 1;
    const cx = hash(i * 5) * w + S.mx * 20 * U, cy = hash(i * 7) * h + S.my * 20 * U, sep = (1 - ph) * 90 * U, ang = hash(i * 9) * TAU;
    const met = ph > .82;
    if (met){ ctx.fillStyle = neu; ctx.beginPath(); ctx.arc(cx, cy, 3.5 * U, 0, TAU); ctx.fill(); continue; }
    const ax = cx + Math.cos(ang) * sep, ay = cy + Math.sin(ang) * sep, bx = cx - Math.cos(ang) * sep, by = cy - Math.sin(ang) * sep;
    ctx.strokeStyle = rgba(c.dark ? '#C9D2A6' : c.brand, .06 + ph * .12); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = pos; ctx.beginPath(); ctx.arc(ax, ay, 5 * U, 0, TAU); ctx.fill(); ctx.fillStyle = c.bg; ctx.fillText('+', ax, ay);
    ctx.fillStyle = neg; ctx.beginPath(); ctx.arc(bx, by, 5 * U, 0, TAU); ctx.fill(); ctx.fillStyle = c.bg; ctx.fillText('−', bx, by);
  }
};
BG.ribbon = (ctx, w, h, t, S) => {
  const c = bgCol(); ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);
  const ph = S.y * .003 + t * .25, W = Math.min(w, h) * .2;
  for (let layer = 2; layer >= 0; layer--){
    const amp = h * (.14 + layer * .05), yc = h * (.35 + layer * .18) + S.my * 10, off = ph * (1 + layer * .3) + layer;
    const col = layer === 0 ? (c.dark ? '#8C9671' : c.brand) : mix(c.bg, c.dark ? '#8C9671' : c.brand, .25 + (2 - layer) * .12);
    for (let x = -20; x < w + 20; x += 6){
      const y1 = yc + Math.sin(x / w * 5 + off) * amp, tw = Math.cos(x / w * 3.2 + off * 1.3), y2 = y1 + W * (.25 + .75 * Math.abs(tw)) * (layer ? .6 : 1);
      const sheen = Math.pow(Math.max(0, Math.sin(x / w * 9 - off * 3)), 12);
      ctx.fillStyle = col; ctx.globalAlpha = layer ? .5 : .85; ctx.fillRect(x, y1, 7, y2 - y1);
      if (sheen > .02){ ctx.fillStyle = `rgba(255,255,255,${sheen * .35})`; ctx.fillRect(x, y1, 7, y2 - y1); }
    }
  }
  ctx.globalAlpha = 1;
};
BG.topo = (ctx, w, h, t, S) => {
  const c = bgCol(); ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);
  const U = window.devicePixelRatio || 1, off = S.y * .15 * U;
  ctx.lineWidth = 1.2 * U;
  for (let k = 0; k < 34; k++){
    const base = (k * 34 * U - off) % (h + 200 * U) - 100 * U;
    ctx.strokeStyle = rgba(c.dark ? '#AFBF80' : c.brand, k % 5 === 0 ? .32 : .14);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8 * U){
      const y = base + Math.sin(x * .004 / U + k * .5 + t * .1) * 30 * U + Math.sin(x * .011 / U - k * .3 + t * .07) * 14 * U + Math.sin((x + k * 60) * .0017 / U) * 60 * U;
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
};

/* induction field rings drifting down the page (added for the Site Lab's Fluxosealer pages) */
BG.rings = (ctx, w, h, t, S) => {
  const c = bgCol(); ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);
  const U = window.devicePixelRatio || 1, amber = pal.acSHex || '#A86E16';
  for (let i = 0; i < 14; i++){
    const cx = (hash(i * 3) * 1.2 - 0.1) * w + S.mx * 14 * U, cy = ((hash(i * 7) * h - S.y * 0.18 * U * (0.6 + hash(i))) % (h + 300 * U) + h + 300 * U) % (h + 300 * U) - 150 * U;
    const R = (60 + hash(i * 5) * 140) * U;
    for (let k = 0; k < 4; k++){
      const ph = ((t * 0.18 + hash(i * 11) + k / 4) % 1);
      ctx.strokeStyle = rgba(k % 2 ? amber : (c.dark ? '#AFBF80' : c.brand), (1 - ph) * (c.dark ? 0.32 : 0.22));
      ctx.lineWidth = 1.4 * U; ctx.beginPath(); ctx.ellipse(cx, cy, R * (0.3 + ph), R * (0.3 + ph) * 0.32, 0, 0, TAU); ctx.stroke();
    }
  }
};

let bgL = null, bgKind = 'off';
function setBg(cv, kind, getS){
  if (bgL){ remove(bgL); bgL = null; }
  bgKind = kind;
  const x = cv.getContext('2d');
  if (kind === 'off' || !BG[kind]){ x.clearRect(0, 0, cv.width, cv.height); cv.hidden = true; return; }
  cv.hidden = false;
  // the page background is a full-window canvas behind everything: draw it at 1x and at most 30 times a second while idle (scrolling repaints it straight away)
  bgL = add(cv, (ctx, w, h) => BG[kind](ctx, w, h, 0, getS()), { fixed: true, dpr: 1, keep: true, fps: 2 });
  const rs = () => { size(bgL); bgL.paint(T); };
  if (!cv.__ro){ cv.__ro = new ResizeObserver(() => bgL && rs()); cv.__ro.observe(cv); }
}
function bgPaint(){ if (bgL){ bgL.lt = performance.now(); bgL.paint(T); } }

return { init, add, remove, clear, setMotion, setPal, setBg, bgPaint, V, BG, globe, map, img, logoBars, get time(){ return T; } };
})();
