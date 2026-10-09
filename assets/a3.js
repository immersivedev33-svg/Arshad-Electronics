/* A3 v2 — Three.js (r128) engine for the Arshad code-built models.
   Mirrors 3d/tools/render.py conventions: mm, Y up, front +Z, right +X, yaw 0 = front, +yaw toward +X.
   v2: one shared WebGL renderer blitted into 2D canvases (no context limit), soft shadows,
   a generated studio environment for steel/paint, and rig() for moving parts (lamps, screens,
   rollers, corona, sealing coil, product flow, cabinet doors, generated interior, x-ray). */
(function(){
'use strict';
const T = window.THREE;
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const cache = {}, texCache = {};
const AMBER = new T.Color(1.0, 0.72, 0.36);
const FACE_ORDER = ['right','left','top','bottom','front','back']; // BoxGeometry material slots px,nx,py,ny,pz,nz
let R = null, RW = 0, RH = 0, ENV = null, ANISO = 4;

/* ---------- shared renderer + generated studio environment ---------- */
function gl(){
  if (R) return R;
  R = new T.WebGLRenderer({ canvas: document.createElement('canvas'), antialias: true, alpha: true });
  R.setPixelRatio(1);
  R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.setScissorTest(true);
  ANISO = Math.min(8, R.capabilities.getMaxAnisotropy());
  ENV = makeEnv();
  return R;
}
function makeEnv(){
  const s = new T.Scene(), geo = new T.SphereGeometry(100, 48, 24), pos = geo.attributes.position, col = [];
  const top = new T.Color(0.96, 0.96, 0.93), hor = new T.Color(0.74, 0.75, 0.70), gnd = new T.Color(0.20, 0.21, 0.18), c = new T.Color();
  for (let i = 0; i < pos.count; i++){
    const y = pos.getY(i) / 100;
    if (y >= 0) c.copy(hor).lerp(top, Math.pow(y, 0.6)); else c.copy(hor).lerp(gnd, Math.min(1, -y * 2.2));
    col.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  s.add(new T.Mesh(geo, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide })));
  const box = (w, h, x, y, z, k) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(k, k, k * 0.97), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  box(70, 34, -45, 62, 40, 2.4); box(34, 64, 72, 18, -30, 1.5); box(90, 10, 0, 22, -88, 1.3); box(40, 20, 30, 40, 80, 1.1);
  const pm = new T.PMREMGenerator(R), t = pm.fromScene(s, 0.035).texture;
  pm.dispose();
  return t;
}
function ensure(w, h){
  if (w <= RW && h <= RH) return;
  RW = Math.max(RW, w, 16); RH = Math.max(RH, h, 16);
  R.setSize(RW, RH, false);
}

function load(id){
  if (!cache[id]) cache[id] = fetch('models/' + id + '.json').then(r => { if (!r.ok) throw new Error('model ' + id); return r.json(); });
  return cache[id];
}
function texture(uri){
  if (!texCache[uri]){
    const t = new T.TextureLoader().load(uri, () => A3._dirtyAll());
    t.anisotropy = ANISO;
    texCache[uri] = t;
  }
  return texCache[uri];
}
function hex(c){ return new T.Color(c || '#c8cac2'); }

function mat(kind, opts){
  // Photo faces stay part self-lit so the photo keeps its own lighting.
  // Plain faces use the studio environment: steel reflects, paint gets a soft sheen.
  let m;
  const color = opts.color || hex('#b9bdc0');
  if (opts.map){
    m = new T.MeshLambertMaterial({ color: new T.Color(1,1,1), map: opts.map, emissive: new T.Color(1,1,1), emissiveMap: opts.map, emissiveIntensity: 0.5 });
  } else if (kind === 'steel'){
    m = new T.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.3, envMap: ENV, envMapIntensity: 1.15, emissive: color.clone(), emissiveIntensity: 0.05 });
  } else if (kind === 'black' || kind === 'rubber'){
    m = new T.MeshStandardMaterial({ color, metalness: 0, roughness: 0.75, envMap: ENV, envMapIntensity: 0.3, emissive: color.clone(), emissiveIntensity: 0.06 });
  } else {
    m = new T.MeshStandardMaterial({ color, metalness: 0.08, roughness: 0.5, envMap: ENV, envMapIntensity: 0.5, emissive: color.clone(), emissiveIntensity: 0.12 });
  }
  if (opts.map && opts.transparent) m.transparent = true;
  m.userData.baseColor = m.color.clone();
  m.userData.baseEmissive = m.emissive ? m.emissive.clone() : null;
  m.userData.baseEI = m.emissiveIntensity;
  m.userData.gen = !!opts.gen;
  return m;
}
const matsOf = mesh => Array.isArray(mesh.material) ? mesh.material : [mesh.material];

function build(data, opts){
  gl();
  opts = opts || {};
  const spec = data.spec, tex = data.tex || {};
  const g = new T.Group();
  g.name = spec.id;
  g.userData = { spec, parts: {}, mats: [], genMats: [], home: {} };
  const def = spec.defaultColor || '#c8cac2';
  spec.parts.forEach(p => {
    let mesh;
    const kind = p.material || 'paint';
    if (p.type === 'box'){
      const geo = new T.BoxGeometry(p.size[0], p.size[1], p.size[2]);
      const mats = FACE_ORDER.map(fn => {
        const fd = (p.faces || {})[fn] || { color: p.color || def };
        return fd.tex && tex[fd.tex]
          ? mat(fd.material || kind, { map: texture(tex[fd.tex]), gen: fd.gen })
          : mat(fd.material || kind, { color: hex(fd.color || p.color || def), gen: fd.gen || p.gen });
      });
      mesh = new T.Mesh(geo, mats);
    } else if (p.type === 'cyl'){
      const geo = new T.CylinderGeometry(p.r, p.r, p.len, p.segments || 28);
      if (p.axis === 'x') geo.rotateZ(Math.PI/2);
      else if (p.axis === 'z') geo.rotateX(Math.PI/2);
      mesh = new T.Mesh(geo, mat(kind, { color: hex(p.color || '#b8bcc0'), gen: p.gen }));
    } else if (p.type === 'card'){
      const geo = new T.PlaneGeometry(p.size[0], p.size[1]);
      const m = mat(kind === 'steel' ? 'paint' : kind, { map: texture(tex[p.tex]), gen: p.gen });
      m.transparent = true; m.alphaTest = 0.5; m.side = T.DoubleSide;
      mesh = new T.Mesh(geo, m);
    } else return;
    mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
    mesh.rotation.y = (p.rotY || 0) * Math.PI / 180;
    mesh.name = p.id || '';
    mesh.userData.part = p;
    mesh.castShadow = p.type !== 'card'; mesh.receiveShadow = true;
    g.userData.parts[mesh.name] = mesh;
    g.userData.home[mesh.name] = mesh.position.clone();
    matsOf(mesh).forEach(m => { g.userData.mats.push(m); if (m.userData.gen) g.userData.genMats.push(m); });
    g.add(mesh);
  });
  const box = new T.Box3().setFromObject(g);
  g.userData.bbox = box;
  g.userData.center = box.getCenter(new T.Vector3());
  g.userData.size = box.getSize(new T.Vector3());
  return g;
}

function setHighlight(g, on){
  g.userData.mats.forEach(m => {
    if (m.userData.live) return;
    const hl = on && m.userData.gen;
    m.color.copy(m.userData.baseColor); if (hl) m.color.multiply(AMBER);
    if (m.emissive && m.userData.baseEmissive){ m.emissive.copy(m.userData.baseEmissive); if (hl) m.emissive.multiply(AMBER); }
  });
}
function setLighting(g, mode){ // 'studio' keeps photo faces bright; 'dramatic' lets scene lights dominate
  g.userData.mats.forEach(m => { if (m.emissive && !m.userData.live) m.emissiveIntensity = mode === 'dramatic' ? m.userData.baseEI * 0.25 : m.userData.baseEI; });
}
function explode(g, k){
  const c = g.userData.center;
  Object.entries(g.userData.parts).forEach(([name, mesh]) => {
    const h = g.userData.home[name];
    if (!h || mesh.parent !== g) return;
    const d = h.clone().sub(c);
    d.y = Math.max(d.y, 0) * 0.6 + d.y * 0.4;
    mesh.position.copy(h).addScaledVector(d, k);
  });
}

/* ---------- small canvas helpers ---------- */
function canvasTex(w, h, draw){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = ANISO; t.userData = { canvas: c };
  return t;
}
let haloTex = null;
function halo(color, size){
  haloTex = haloTex || canvasTex(128, 128, (x) => { const g = x.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(0.25,'rgba(255,255,255,.55)'); g.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0,0,128,128); });
  const s = new T.Sprite(new T.SpriteMaterial({ map: haloTex, color, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
  s.scale.setScalar(size);
  return s;
}
function label(text, o){
  o = Object.assign({ size: 60, color: '#1F2612', bg: 'rgba(255,255,255,.92)', font: '600 44px system-ui, sans-serif' }, o || {});
  const c = document.createElement('canvas'), x = c.getContext('2d');
  x.font = o.font; const w = Math.ceil(x.measureText(text).width) + 36;
  c.width = w; c.height = 64; x.font = o.font;
  if (o.bg){ x.fillStyle = o.bg; x.beginPath(); x.rect(0, 0, w, 64); x.fill(); }
  x.fillStyle = o.color; x.textBaseline = 'middle'; x.fillText(text, 18, 34);
  const t = new T.CanvasTexture(c);
  const s = new T.Sprite(new T.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(o.size * w / 64, o.size, 1); s.renderOrder = 10;
  return s;
}

/* ---------- rig: moving parts ---------- */
const LAMP = { green: '#39E36A', amber: '#FFB23A', red: '#FF3B2F' };
const CAB_RE = /^(cabinet|cabinet_upper|panel_upper|body|panel|panel_box|gen_box)$/;
const FLUX_RE = /^(cdt|ws-|cds)/;
function rig(g){
  if (g.userData.rig) return g.userData.rig;
  const P = g.userData.parts, spec = g.userData.spec;
  const rg = { g, lamps: {}, screens: [], rollers: [], corona: [], coils: [], conv: null, cab: null, doorParts: [], fans: [], bottles: [],
    s: { on: false, fault: null, speed: 0.5, power: 0.6, door: 0, xray: 0, corona: 0, seal: 0, flow: 0, sealed: 0 }, t: 0, screenFn: null, onSeal: null };
  g.userData.rig = rg;
  let coronaRoller = null;
  Object.entries(P).forEach(([name, m]) => {
    const p = m.userData.part; let mm;
    if ((mm = name.match(/^(?:tower|beacon)_(green|amber|red)$/)) || name === 'pilot_lamp'){
      const col = mm ? mm[1] : 'amber', h = halo(LAMP[col], Math.max(p.r || 40, 40) * 5);
      h.position.copy(m.position); g.add(h);
      matsOf(m).forEach(x => { x.userData.live = true; });
      (rg.lamps[col] = rg.lamps[col] || []).push({ m, h });
    } else if (/hmi/.test(name) && p.type === 'box'){
      rg.screens.push({ m, orig: m.material[4] });
    } else if (p.type === 'cyl' && /roller/.test(name)){
      const stripes = canvasTex(128, 8, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(0,0,0,.16)'; for (let i = 0; i < w; i += 16) x.fillRect(i, 0, 3, h); });
      stripes.wrapS = T.RepeatWrapping;
      m.material.map = stripes; m.material.needsUpdate = true;
      rg.rollers.push(m);
      if (/^(red_roller|st_roller|roller)$/.test(name) || (!coronaRoller && name === 'orange_roller')) coronaRoller = name === 'orange_roller' && P.red_roller ? coronaRoller : m;
    } else if (/^(seal_coil|induction_coil|coil_housing|coil_head)$/.test(name)){
      rg.coils.push(m); matsOf(m).forEach(x => x.userData.live = true);
    } else if (/^(conveyor|conveyor_bed|conv_bed|conveyor_frame)$/.test(name)){
      rg.conv = m;
    }
    if (CAB_RE.test(name) && p.type === 'box' && (!rg.cab || p.size[0] * p.size[1] > rg.cab.userData.part.size[0] * rg.cab.userData.part.size[1])) rg.cab = m;
  });
  if (P.red_roller) coronaRoller = P.red_roller;
  if (coronaRoller){
    const p = coronaRoller.userData.part;
    const geo = new T.CylinderGeometry(p.r * 1.07, p.r * 1.07, p.len * 0.97, 32, 1, true);
    if (p.axis === 'x') geo.rotateZ(Math.PI/2); else if (p.axis === 'z') geo.rotateX(Math.PI/2);
    const glow = new T.Mesh(geo, new T.MeshBasicMaterial({ color: '#8C6BFF', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    glow.position.copy(coronaRoller.position); g.add(glow);
    const light = new T.PointLight('#8C6BFF', 0, p.len * 1.4); light.position.copy(coronaRoller.position); light.position.y += p.r * 1.5; g.add(light);
    rg.corona.push({ glow, light, roller: coronaRoller });
  }
  if (rg.coils.length){
    const c = rg.coils[0], p = c.userData.part;
    const field = new T.Mesh(new T.PlaneGeometry(p.size[0] * 0.9, p.size[2] * 0.8), new T.MeshBasicMaterial({ color: '#FFB23A', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    field.rotation.x = -Math.PI/2; field.position.set(c.position.x, c.position.y - p.size[1] / 2 - 4, c.position.z); g.add(field);
    rg.field = field;
  }
  if (rg.cab && !FLUX_RE.test(spec.id) && !/brezo-p/.test(spec.id)) rg.cab = rg.cab; // sealers keep the cabinet for x-ray only
  rg.flux = FLUX_RE.test(spec.id);
  Object.assign(rg, RIG_API);
  return rg;
}

const RIG_API = {
  set(k, v){ this.s[k] = v; if (k === 'door') this._door(v); if (k === 'xray') this._xray(v); A3._dirtyAll(); return this; },
  lamp(col, on){
    (this.lamps[col] || []).forEach(({ m, h }) => {
      matsOf(m).forEach(x => { x.emissive.set(on ? LAMP[col] : x.userData.baseEmissive); x.emissiveIntensity = on ? 1.6 : x.userData.baseEI; x.color.copy(x.userData.baseColor); });
      h.material.opacity = on ? 0.85 : 0;
    });
  },
  screen(on){
    this.screens.forEach(sc => {
      if (!sc.tex){
        sc.tex = canvasTex(400, 300, () => {});
        sc.mat = new T.MeshBasicMaterial({ map: sc.tex });
      }
      sc.m.material[4] = on ? sc.mat : sc.orig;
    });
    this._screenOn = on;
  },
  drawScreen(){
    if (!this._screenOn) return;
    this.screens.forEach(sc => {
      const c = sc.tex.userData.canvas, x = c.getContext('2d'), w = c.width, h = c.height, s = this.s;
      if (this.screenFn) this.screenFn(x, w, h, s, this);
      else defaultScreen(x, w, h, s, this);
      sc.tex.needsUpdate = true;
    });
  },
  hasDoor(){ return !!this.cab; },
  _ensureDoor(){
    if (this.leaves || !this.cab) return;
    const g = this.g, cab = this.cab, p = cab.userData.part, [w, h, d] = p.size, P = g.userData.parts;
    const cx = cab.position.x, cy = cab.position.y, cz = cab.position.z, front = cz + d / 2;
    const leaves = [];
    const paint = hex((p.faces && p.faces.left && p.faces.left.color) || p.color || g.userData.spec.defaultColor || '#c8cac2');
    if (P.door){
      const dm = P.door, dp = dm.userData.part, piv = new T.Group();
      piv.position.set(dm.position.x - dp.size[0] / 2, dm.position.y, dm.position.z + dp.size[2] / 2);
      g.add(piv); piv.attach(dm); leaves.push({ piv, sign: -1 });
      this.doorParts.push(dm);
      cab.material = cab.material.slice(); cab.material[4] = new T.MeshBasicMaterial({ visible: false });
    } else {
      const n = w > 1000 ? 2 : 1, fm = cab.material[4];
      for (let i = 0; i < n; i++){
        const lw = w / n, t = 18;
        const side = mat('paint', { color: paint.clone().multiplyScalar(0.85) });
        const mats = [side, side, side, side, fm, side];
        const geo = new T.BoxGeometry(lw, h, t);
        if (n === 2){ const uv = geo.attributes.uv; for (let v = 16; v < 20; v++) uv.setX(v, uv.getX(v) * 0.5 + i * 0.5); } // each leaf shows its half of the photo front
        const leaf = new T.Mesh(geo, mats); leaf.castShadow = true; leaf.name = 'door' + i;
        const piv = new T.Group(), sign = i === 0 ? -1 : 1;
        piv.position.set(i === 0 ? cx - w / 2 : cx + w / 2, cy, front);
        leaf.position.set(i === 0 ? lw / 2 : -lw / 2, 0, -t / 2);
        piv.add(leaf); g.add(piv);
        leaves.push({ piv, sign, leaf });
        mats.forEach(m => g.userData.mats.push(m));
      }
      cab.material = cab.material.slice(); cab.material[4] = new T.MeshBasicMaterial({ visible: false });
      // parts mounted on the door front travel with it
      Object.values(P).forEach(m => {
        if (m === cab) return;
        const q = m.userData.part, z = m.position.z, hz = q.type === 'box' ? q.size[2] / 2 : (q.len || 0) / 2;
        if (z - hz >= front - 6 && Math.abs(m.position.x - cx) < w / 2 && Math.abs(m.position.y - cy) < h / 2){
          const lf = leaves.length === 2 && m.position.x > cx ? leaves[1] : leaves[0];
          lf.piv.attach(m); this.doorParts.push(m);
        }
      });
    }
    this.leaves = leaves;
    this._interior();
  },
  _interior(){
    const g = this.g, cab = this.cab, p = cab.userData.part, [w, h, d] = p.size;
    const I = new T.Group(); I.position.copy(cab.position); I.visible = false; I.name = 'interior';
    const liner = new T.Mesh(new T.BoxGeometry(w - 12, h - 12, d - 12), new T.MeshStandardMaterial({ color: '#4A4F45', roughness: 0.9, side: T.BackSide, emissive: '#4A4F45', emissiveIntensity: 0.35 }));
    I.add(liner);
    const genMat = (c, e) => { const m = new T.MeshStandardMaterial({ color: c, roughness: 0.6, metalness: 0.1, envMap: ENV, envMapIntensity: 0.4, emissive: c, emissiveIntensity: e == null ? 0.25 : e }); m.userData = { baseColor: m.color.clone(), baseEmissive: m.emissive.clone(), baseEI: m.emissiveIntensity, gen: true }; g.userData.mats.push(m); g.userData.genMats.push(m); return m; };
    const plateTex = canvasTex(512, Math.round(512 * h / w), (x, W, H) => drawPlate(x, W, H, this.flux));
    const plate = new T.Mesh(new T.PlaneGeometry(w * 0.88, h * 0.9), new T.MeshLambertMaterial({ map: plateTex, emissive: '#fff', emissiveMap: plateTex, emissiveIntensity: 0.45 }));
    plate.material.userData = { baseColor: new T.Color(1,1,1), baseEmissive: new T.Color(1,1,1), baseEI: 0.45, gen: true }; g.userData.mats.push(plate.material); g.userData.genMats.push(plate.material);
    plate.position.z = -d / 2 + 14; plate.name = 'int_plate'; I.add(plate);
    const parts = [];
    const add = (name, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.name = name; o.castShadow = true; I.add(o); parts.push(o); return o; };
    const zb = -d / 2 + 14;
    if (this.flux){
      const tw = w * 0.34, th = Math.min(h * 0.2, 380), td = d * 0.5;
      const tank = add('int_transformer', new T.BoxGeometry(tw, th, td), genMat('#3E4A3A'), 0, -h / 2 + 30 + th / 2 + h * 0.04, zb + td / 2);
      [-1, 1].forEach(s => add('int_bushing', new T.CylinderGeometry(tw * 0.05, tw * 0.07, th * 0.35, 16), genMat('#EDEBE4', 0.35), s * tw * 0.25, tank.position.y + th / 2 + th * 0.17, zb + td / 2));
      const gw = w * 0.5, gh = Math.min(h * 0.16, 300), gd = d * 0.34;
      add('int_generator', new T.BoxGeometry(gw, gh, gd), genMat('#23261F', 0.2), 0, h * 0.02, zb + gd / 2);
      add('int_plc', new T.BoxGeometry(w * 0.26, h * 0.07, d * 0.18), genMat('#D9DAD2', 0.3), -w * 0.2, h * 0.28, zb + d * 0.09);
      [-1, 1].forEach((s, i) => { const f = add('int_fan' + i, new T.CylinderGeometry(w * 0.075, w * 0.075, 30, 24), genMat('#2A2D27', 0.15), s * w * 0.22, h / 2 - h * 0.1, zb + 30); f.rotation.x = Math.PI / 2; this.fans.push(f); });
    } else {
      add('int_generator', new T.BoxGeometry(w * 0.55, h * 0.3, d * 0.45), genMat('#23261F', 0.2), 0, -h * 0.12, zb + d * 0.225);
      add('int_plc', new T.BoxGeometry(w * 0.3, h * 0.12, d * 0.2), genMat('#D9DAD2', 0.3), -w * 0.15, h * 0.25, zb + d * 0.1);
      const f = add('int_fan0', new T.CylinderGeometry(w * 0.1, w * 0.1, 30, 24), genMat('#2A2D27', 0.15), w * 0.2, h * 0.25, zb + 30); f.rotation.x = Math.PI / 2; this.fans.push(f);
    }
    const lamp = new T.PointLight('#F4F7FF', 0, Math.max(w, h) * 1.6); lamp.position.set(0, h / 2 - 60, d / 2 - 40); I.add(lamp);
    this.interior = I; this.intParts = parts; this.intLamp = lamp;
    g.add(I);
  },
  _door(k){
    if (!this.cab) return;
    this._ensureDoor();
    this.leaves.forEach(l => { l.piv.rotation.y = l.sign * k * 1.85 * (this.leaves.length === 2 ? 1 : 1); });
    this._vis();
  },
  _xray(k){
    if (!this.cab) return;
    this._ensureDoor();
    const mats = matsOf(this.cab).concat(...this.leaves.map(l => l.leaf ? matsOf(l.leaf) : []), ...this.doorParts.map(matsOf));
    mats.forEach(m => { m.transparent = k > 0.001; m.opacity = 1 - 0.86 * k; m.depthWrite = k < 0.5; });
    this._vis();
  },
  _vis(){ if (this.interior){ const open = this.s.door > 0.01 || this.s.xray > 0.01; this.interior.visible = open; this.intLamp.intensity = open ? 0.55 : 0; } },
  flowSetup(){
    if (this.bottles.length || !this.conv) return;
    const g = this.g, P = g.userData.parts, c = this.conv, p = c.userData.part;
    const top = c.position.y + p.size[1] / 2, x0 = c.position.x - p.size[0] / 2 * 0.96, x1 = c.position.x + p.size[0] / 2 * 0.96;
    this.flowRange = [x0, x1];
    if (P.jar_0){
      for (let i = 0; P['jar_' + i]; i++) this.bottles.push({ body: P['jar_' + i], cap: P['jar_cap_' + i], dy: 0 });
    } else {
      const n = Math.max(4, Math.floor((x1 - x0) / 260)), capCols = ['#2F6FD0', '#C8372D', '#F2F0E8', '#2E8B57'];
      for (let i = 0; i < n; i++){
        const b = new T.Mesh(new T.CylinderGeometry(42, 46, 170, 24), mat('paint', { color: hex('#F3F1EA'), gen: true }));
        const cp = new T.Mesh(new T.CylinderGeometry(40, 40, 30, 24), mat('paint', { color: hex(capCols[i % 4]), gen: true }));
        b.castShadow = cp.castShadow = true;
        b.position.set(x0 + (i + 0.5) * (x1 - x0) / n, top + 85, c.position.z);
        cp.position.set(b.position.x, top + 185, c.position.z);
        g.add(b); g.add(cp);
        this.bottles.push({ body: b, cap: cp, dy: 0 });
      }
    }
    this.bottles.forEach(b => { matsOf(b.cap).forEach(m => m.userData.live = true); b.sealed = false; b.capY = b.cap.position.y; b.bodyY = b.body.position.y; });
    const coil = this.coils[0];
    this.coilX = coil ? [coil.position.x - coil.userData.part.size[0] / 2, coil.position.x + coil.userData.part.size[0] / 2] : [(x0 + x1) / 2 - 150, (x0 + x1) / 2 + 150];
  },
  update(dt){
    const s = this.s; this.t += dt;
    let anim = false;
    const run = s.on && !s.fault;
    // lamps: green = running, amber = standby, red = fault
    const blink = (this.t * 2.5 % 1) < 0.55;
    const want = { green: run, amber: s.on && !run ? false : (!s.on && s.standby), red: !!s.fault && blink };
    if (s.on && !s.fault && s.warn) want.amber = blink;
    Object.keys(this.lamps).forEach(c => { const v = !!want[c]; if (this['_l' + c] !== v){ this.lamp(c, v); this['_l' + c] = v; } });
    if (s.fault) anim = true;
    if (run){
      const w = (0.6 + s.speed * 5) * dt;
      this.rollers.forEach(r => { const ax = r.userData.part.axis || 'y'; r.rotation[ax] += w; });
      this.fans.forEach(f => f.rotation.y += dt * 14);
      anim = true;
    }
    this.corona.forEach(c => {
      const k = run ? s.corona : 0, fl = 0.8 + 0.2 * Math.sin(this.t * 37) * Math.sin(this.t * 11.3);
      c.glow.material.opacity = k * 0.55 * fl; c.light.intensity = k * 1.1 * fl;
      if (k) anim = true;
    });
    if (s.flow > 0 && this.conv){
      this.flowSetup();
      const [x0, x1] = this.flowRange, span = x1 - x0, v = run ? s.flow * s.speed * 900 : 0;
      let under = false;
      this.bottles.forEach(b => {
        let x = b.body.position.x + v * dt;
        if (x > x1){ x -= span; b.sealed = false; this.lampCap(b, 0); }
        b.body.position.x = x; b.cap.position.x = x;
        const inCoil = x > this.coilX[0] && x < this.coilX[1];
        if (inCoil && run && s.manual) under = under || s.pressing;
        if (inCoil && run && !s.manual){ under = true; if (!b.sealed){ b.sealed = true; s.sealed++; if (this.onSeal) this.onSeal(b); } this.lampCap(b, 1); }
        else if (b.sealed) this.lampCap(b, Math.max(0, (b.glow || 0) - dt * 1.6));
        if (b.dy){ b.body.position.y = b.bodyY + b.dy; b.cap.position.y = b.capY + b.dy; }
      });
      s.seal = under ? 1 : Math.max(0, s.seal - dt * 3);
      if (v) anim = true;
    }
    if (this.coils.length){
      const k = run ? Math.max(s.seal, s.flow ? 0 : s.corona) : 0;
      if (this._coilK !== k){ this.coils.forEach(c => matsOf(c).forEach(m => { m.emissive.copy(m.userData.baseEmissive).lerp(new T.Color('#FFB23A'), k * 0.7); m.emissiveIntensity = m.userData.baseEI + k * 0.5; })); this._coilK = k; }
      if (this.field) this.field.material.opacity = k * (0.5 + 0.2 * Math.sin(this.t * 20));
    }
    if (this._screenOn){ this._st = (this._st || 0) + dt; if (this._st > 0.2){ this._st = 0; this.drawScreen(); anim = true; } }
    return anim;
  },
  lampCap(b, k){ b.glow = k; matsOf(b.cap).forEach(m => { m.emissive.copy(m.userData.baseEmissive).lerp(new T.Color('#FFC857'), k); m.emissiveIntensity = m.userData.baseEI + k * 0.9; }); }
};

function defaultScreen(x, w, h, s, rg){
  x.fillStyle = '#0B1410'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#1D3326'; x.fillRect(0, 0, w, 44);
  x.fillStyle = '#9FE3B4'; x.font = '700 22px system-ui, sans-serif'; x.fillText(rg.flux ? 'FLUXOMATIC' : 'FLUXOSEALER', 14, 30);
  x.fillStyle = s.fault ? '#FF6B5E' : (s.on ? '#39E36A' : '#FFB23A');
  x.beginPath(); x.arc(w - 26, 22, 9, 0, 7); x.fill();
  x.fillStyle = '#E8F5EC'; x.font = '800 64px system-ui, sans-serif';
  const kw = s.on && !s.fault ? (s.power * (rg.kwMax || 6)).toFixed(1) : '0.0';
  x.fillText(kw, 16, 130); x.font = '600 22px system-ui, sans-serif'; x.fillStyle = '#9FB8A6'; x.fillText('kW output', 18, 160);
  x.fillStyle = '#E8F5EC'; x.font = '800 40px system-ui, sans-serif'; x.fillText(s.on ? Math.round(s.speed * (rg.speedMax || 300)) : '0', 230, 118);
  x.font = '600 20px system-ui, sans-serif'; x.fillStyle = '#9FB8A6'; x.fillText('m/min', 232, 146);
  x.fillStyle = '#1D3326'; x.fillRect(16, 190, w - 32, 18); x.fillStyle = s.fault ? '#FF6B5E' : '#39E36A'; x.fillRect(16, 190, (w - 32) * (s.on && !s.fault ? s.power : 0), 18);
  x.fillStyle = s.fault ? '#FF6B5E' : '#9FB8A6'; x.font = '700 22px system-ui, sans-serif';
  x.fillText(s.fault ? 'FAULT · ' + s.fault : (s.on ? 'RUNNING' : 'READY'), 16, 250);
}
function drawPlate(x, W, H, flux){
  x.fillStyle = '#C5C9C1'; x.fillRect(0, 0, W, H);
  x.fillStyle = 'rgba(0,0,0,.05)'; for (let i = 0; i < 600; i++) x.fillRect(Math.random() * W, Math.random() * H, 2, 1);
  const duct = (x0, y0, w, h) => { x.fillStyle = '#8E948B'; x.fillRect(x0, y0, w, h); x.fillStyle = '#767C73'; const v = h > w; for (let i = 4; i < (v ? h : w) - 4; i += 10) v ? x.fillRect(x0 + 2, y0 + i, w - 4, 3) : x.fillRect(x0 + i, y0 + 2, 3, h - 4); };
  duct(10, 10, W - 20, 22); duct(10, H - 34, W - 20, 22); duct(10, 32, 20, H - 66); duct(W - 30, 32, 20, H - 66);
  const rail = (y, n, kind) => {
    x.fillStyle = '#AEB3AA'; x.fillRect(40, y + 14, W - 80, 10);
    const bw = (W - 90) / n;
    for (let i = 0; i < n; i++){
      const bx = 45 + i * bw;
      if (kind === 'mcb'){ x.fillStyle = '#F2F1EC'; x.fillRect(bx, y, bw - 4, 40); x.fillStyle = i % 5 === 0 ? '#D2432F' : '#2B2E29'; x.fillRect(bx + bw / 2 - 5, y + 12, 8, 14); }
      else if (kind === 'term'){ x.fillStyle = i % 6 === 5 ? '#4F7BC4' : '#9A9C94'; x.fillRect(bx, y + 4, bw - 2, 30); }
      else { x.fillStyle = '#6F746B'; x.fillRect(bx, y - 4, bw - 8, 48); x.fillStyle = '#E5E4DE'; x.fillRect(bx + 6, y + 4, bw - 20, 10); }
    }
  };
  rail(H * 0.14, 12, 'mcb'); rail(H * 0.26, 5, 'cont');
  rail(H - 90, 22, 'term');
  if (flux){
    x.fillStyle = '#F2C230'; x.beginPath(); x.moveTo(W * 0.78, H * 0.4); x.lineTo(W * 0.86, H * 0.4); x.lineTo(W * 0.82, H * 0.33); x.fill();
    x.fillStyle = '#1B1B1B'; x.font = '700 14px system-ui, sans-serif'; x.fillText('!', W * 0.816, H * 0.39);
    x.fillStyle = '#2B2E29'; x.font = '700 16px system-ui, sans-serif'; x.fillText('HV', W * 0.8, H * 0.44);
  }
  x.fillStyle = 'rgba(40,40,40,.55)'; x.font = '600 11px system-ui, sans-serif'; x.fillText('generated interior', 40, H - 44);
}

/* ---------- dimensions + line art ---------- */
function dims(g, o){
  o = Object.assign({ color: '#2B3A12', est: true, off: 160 }, o || {});
  const b = new T.Box3().setFromObject(g), s = b.getSize(new T.Vector3()), G = new T.Group(), off = o.off;
  const lm = new T.LineBasicMaterial({ color: o.color, depthTest: false, transparent: true });
  const seg = (a, c) => { const ge = new T.BufferGeometry().setFromPoints([a, c]); const l = new T.Line(ge, lm); l.renderOrder = 9; G.add(l); };
  const tick = (p, dir) => seg(p.clone().addScaledVector(dir, -40), p.clone().addScaledVector(dir, 40));
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const txt = v => Math.round(v / 10) * 10 + ' mm' + (o.est ? ' est.' : '');
  const lsize = Math.max(s.x, s.y, s.z) * 0.05;
  const L = (t, p) => { const l = label(t, { size: lsize, color: '#fff', bg: o.color }); l.position.copy(p); G.add(l); };
  let a = V(b.min.x, b.min.y, b.max.z + off), c = V(b.max.x, b.min.y, b.max.z + off);
  seg(a, c); tick(a, V(0, 0, 1)); tick(c, V(0, 0, 1)); L(txt(s.x), a.clone().lerp(c, 0.5).add(V(0, lsize * 0.9, 0)));
  a = V(b.max.x + off, b.min.y, b.max.z); c = V(b.max.x + off, b.max.y, b.max.z);
  seg(a, c); tick(a, V(1, 0, 0)); tick(c, V(1, 0, 0)); L(txt(s.y), a.clone().lerp(c, 0.5).add(V(lsize * 2.5, 0, 0)));
  a = V(b.max.x + off, b.min.y, b.min.z); c = V(b.max.x + off, b.min.y, b.max.z);
  seg(a, c); tick(a, V(1, 0, 0)); L(txt(s.z), a.clone().lerp(c, 0.5).add(V(lsize * 2.5, lsize * 0.9, 0)));
  return G;
}
function lineArt(g, on, color){
  g.traverse(m => {
    if (!m.isMesh || !m.userData.part) return;
    if (on && !m.userData.edges){
      const e = new T.LineSegments(new T.EdgesGeometry(m.geometry, 25), new T.LineBasicMaterial({ color: color || '#DDE4C6' }));
      m.add(e); m.userData.edges = e;
    }
    if (m.userData.edges){ m.userData.edges.visible = on; if (color) m.userData.edges.material.color.set(color); }
    matsOf(m).forEach(x => { x.colorWrite = !on; x.depthWrite = true; });
    m.castShadow = !on && m.userData.part.type !== 'card';
  });
}

/* ---------- export: GLB (for AR / sales) ---------- */
let exporterP = null;
function exportGLB(g){ // resolves an ArrayBuffer (.glb, metres, photo faces as base colour maps)
  exporterP = exporterP || new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  return exporterP.then(() => new Promise(res => {
    const out = new T.Group(); out.name = g.name;
    g.updateMatrixWorld(true);
    g.traverse(m => {
      if (!m.isMesh || !m.userData.part) return;
      const conv = x => new T.MeshStandardMaterial({ color: x.map ? 0xffffff : x.color, map: x.map || null, metalness: x.metalness || 0, roughness: x.roughness == null ? 0.8 : x.roughness, transparent: !!x.alphaTest, alphaTest: x.alphaTest || 0, side: x.side, name: x.userData.gen ? 'generated' : 'photo' });
      const c = new T.Mesh(m.geometry, Array.isArray(m.material) ? m.material.map(conv) : conv(m.material));
      c.name = m.name; m.matrixWorld.decompose(c.position, c.quaternion, c.scale);
      c.position.multiplyScalar(0.001); c.scale.multiplyScalar(0.001); // glTF is in metres
      out.add(c);
    });
    new T.GLTFExporter().parse(out, buf => {
      res(buf);
    }, { binary: true, maxTextureSize: 1024 });
  }));
}

/* ---------- stage: 2D canvas fed by the shared renderer, camera + orbit ---------- */
const stages = new Set();
function stage(canvas, o){
  gl();
  o = Object.assign({ yaw: 35, pitch: 14, fov: 30, bg: null, floor: true, auto: false, fit: 1.05, shadows: true, shadowOpacity: 0.26 }, o || {});
  const ctx = canvas.getContext('2d');
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(o.fov, 1, 10, 200000);
  const amb = new T.AmbientLight(0xffffff, 0.42); scene.add(amb);
  const dir = new T.DirectionalLight(0xffffff, 0.36); dir.position.set(-4500, 8000, 5500); scene.add(dir); scene.add(dir.target);
  if (o.shadows){
    dir.castShadow = true; dir.shadow.mapSize.set(2048, 2048); dir.shadow.bias = -0.0006; dir.shadow.normalBias = 1.5;
  }
  const fill = new T.DirectionalLight(0xffffff, 0.12); fill.position.set(5000, 2000, -3000); scene.add(fill);
  let floor = null, ground = null;
  if (o.floor){
    const fm = new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false });
    floor = new T.Mesh(new T.CircleGeometry(1, 64), fm);
    floor.rotation.x = -Math.PI/2; floor.renderOrder = -1; scene.add(floor);
    fm.map = canvasTex(128, 128, (cx) => { const gr = cx.createRadialGradient(64,64,0,64,64,64); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(1,'rgba(0,0,0,0)'); cx.fillStyle = gr; cx.fillRect(0,0,128,128); });
    if (o.shadows){
      ground = new T.Mesh(new T.PlaneGeometry(1, 1), new T.ShadowMaterial({ opacity: o.shadowOpacity }));
      ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground);
    }
  }
  const st = {
    canvas, ctx, scene, camera, amb, dir, fill, floor, ground, o, renderer: gl(),
    target: new T.Vector3(0, 700, 0), yaw: o.yaw, pitch: o.pitch, dist: 5000, radius: 1500, pw: 0, ph: 0,
    minDist: 300, maxDist: 60000, auto: o.auto && !RM, dirty: true, visible: false, hooks: [], tween: null, objects: [], compose: null,
    add(obj){ scene.add(obj); this.objects.push(obj); this.dirty = true; return obj; },
    remove(obj){ scene.remove(obj); this.objects = this.objects.filter(x => x !== obj); this.dirty = true; },
    frame(objs, k){
      const box = new T.Box3(); (objs || this.objects).forEach(ob => box.expandByObject(ob));
      if (box.isEmpty()) return;
      const c = box.getCenter(new T.Vector3()), s = box.getSize(new T.Vector3());
      this.radius = s.length() / 2;
      this.target.copy(c);
      const asp = Math.max(0.3, Math.min(1, camera.aspect || 1)); this.fitK = (k || o.fit); this.dist = this.radius / Math.sin(T.MathUtils.degToRad(camera.fov) / 2) * this.fitK / asp;
      this.shadowFit(box);
      this.dirty = true;
    },
    shadowFit(box){
      const c = box.getCenter(new T.Vector3()), s = box.getSize(new T.Vector3()), r = Math.max(s.length() / 2, 300);
      if (floor){ floor.scale.setScalar(Math.max(s.x, s.z) * 0.85); floor.position.set(c.x, box.min.y + 1, c.z); }
      if (ground){ ground.scale.setScalar(r * 12); ground.position.set(c.x, box.min.y + 0.5, c.z); }
      dir.target.position.copy(c);
      dir.position.copy(c).add(new T.Vector3(-4500, 8000, 5500).normalize().multiplyScalar(r * 4));
      const sc = dir.shadow.camera; sc.left = sc.bottom = -r * 1.35; sc.right = sc.top = r * 1.35; sc.near = r * 0.5; sc.far = r * 8; sc.updateProjectionMatrix();
    },
    view(yaw, pitch, ms){
      if (RM || !ms){ this.yaw = yaw; this.pitch = pitch; this.dirty = true; return; }
      let dy = ((yaw - this.yaw) % 360 + 540) % 360 - 180;
      this.tween = { y0: this.yaw, p0: this.pitch, dy, dp: pitch - this.pitch, t0: performance.now(), ms };
    },
    onFrame(fn){ this.hooks.push(fn); },
    place(){
      const y = T.MathUtils.degToRad(this.yaw), p = T.MathUtils.degToRad(this.pitch);
      camera.position.set(
        this.target.x + this.dist * Math.sin(y) * Math.cos(p),
        this.target.y + this.dist * Math.sin(p),
        this.target.z + this.dist * Math.cos(y) * Math.cos(p));
      camera.lookAt(this.target);
    },
    project(v){ const p = v.clone().project(camera); return { x: (p.x + 1) / 2 * this.cw, y: (1 - p.y) / 2 * this.ch, z: p.z }; },
    ray(e){ const r = canvas.getBoundingClientRect(), v = new T.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), rc = new T.Raycaster(); rc.setFromCamera(v, camera); return rc; },
    draw(w, h){ // render this stage's scene into the shared renderer; returns its canvas (region top-left w×h)
      w = w || this.pw; h = h || this.ph; ensure(w, h);
      const y = RH - h; R.setViewport(0, y, w, h); R.setScissor(0, y, w, h);
      if (o.bg != null) R.setClearColor(o.bg, 1); else R.setClearColor(0x000000, 0);
      R.render(scene, camera);
      return R.domElement;
    },
    render(){
      if (!this.pw) return;
      this.place();
      if (this.compose) this.compose(ctx, () => this.draw());
      else { const src = this.draw(); ctx.clearRect(0, 0, this.pw, this.ph); ctx.drawImage(src, 0, 0, this.pw, this.ph, 0, 0, this.pw, this.ph); }
    },
    snapshot(W, H){ // hi-res still, returns a canvas
      const a = camera.aspect; camera.aspect = W / H; camera.updateProjectionMatrix(); this.place();
      const src = this.draw(W, H), c = document.createElement('canvas'); c.width = W; c.height = H;
      c.getContext('2d').drawImage(src, 0, 0, W, H, 0, 0, W, H);
      camera.aspect = a; camera.updateProjectionMatrix(); this.dirty = true;
      return c;
    },
    resize(){
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.cw = r.width; this.ch = r.height;
      this.pw = canvas.width = Math.round(r.width * dpr); this.ph = canvas.height = Math.round(r.height * dpr);
      const prev = Math.max(0.3, Math.min(1, camera.aspect || 1)); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); const now = Math.max(0.3, Math.min(1, camera.aspect)); if (this.fitK) this.dist *= prev / now; this.dirty = true;
    },
    dispose(){
      stages.delete(this); if (this._obs) this._obs.forEach(o => o.disconnect());
      // free this stage's GPU geometry, materials and one-off textures (the shared environment and cached photo textures stay)
      const keep = new Set([ENV, ...Object.values(texCache)]);
      scene.traverse(n => {
        if (n.geometry) n.geometry.dispose();
        (Array.isArray(n.material) ? n.material : n.material ? [n.material] : []).forEach(m => { Object.keys(m).forEach(k => { const v = m[k]; if (v && v.isTexture && !keep.has(v)) v.dispose(); }); m.dispose(); });
      });
      if (dir.shadow && dir.shadow.map){ dir.shadow.map.dispose(); dir.shadow.map = null; }
    }
  };
  // orbit input: drag rotates (horizontal only for touch so the page still scrolls), wheel zooms
  let drag = null;
  canvas.addEventListener('pointerdown', e => { if (o.noOrbit) return; drag = { x: e.clientX, y: e.clientY, yaw: st.yaw, pitch: st.pitch, touch: e.pointerType === 'touch' }; st.auto = false; st.tween = null; if (e.pointerType !== 'touch') canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!drag) return;
    st.yaw = drag.yaw - (e.clientX - drag.x) * 0.4;
    if (!drag.touch) st.pitch = Math.max(-5, Math.min(85, drag.pitch + (e.clientY - drag.y) * 0.3));
    st.dirty = true;
  });
  ['pointerup','pointercancel','pointerleave'].forEach(ev => canvas.addEventListener(ev, () => { drag = null; }));
  canvas.addEventListener('wheel', e => { if (!o.zoom) return; e.preventDefault(); st.dist = Math.max(st.radius * 0.5, Math.min(st.radius * 8, st.dist * (1 + Math.sign(e.deltaY) * 0.1))); st.dirty = true; }, { passive: false });
  canvas.tabIndex = 0;
  canvas.addEventListener('keydown', e => {
    const k = { ArrowLeft: [-10,0], ArrowRight: [10,0], ArrowUp: [0,5], ArrowDown: [0,-5] }[e.key];
    if (!k || o.noOrbit) return; e.preventDefault(); st.auto = false; st.yaw += k[0]; st.pitch = Math.max(-5, Math.min(85, st.pitch + k[1])); st.dirty = true;
  });
  st._obs = [new ResizeObserver(() => st.resize()), new IntersectionObserver(es => { st.visible = es[0].isIntersecting; if (st.visible) st.dirty = true; })];
  st._obs.forEach(o => o.observe(canvas));
  st.resize();
  stages.add(st);
  return st;
}

let last = performance.now();
function step(now, dt, force){
  stages.forEach(st => {
    if (!st.visible && !force) return;
    if (st.tween){
      const k = Math.min(1, (now - st.tween.t0) / st.tween.ms), e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
      st.yaw = st.tween.y0 + st.tween.dy * e; st.pitch = st.tween.p0 + st.tween.dp * e; st.dirty = true;
      if (k >= 1) st.tween = null;
    }
    if (st.auto){ st.yaw += dt * 12; st.dirty = true; }
    let anim = false;
    st.hooks.forEach(fn => { if (fn(dt, now) === true) anim = true; });
    if (anim) st.dirty = true;
    if (!st.dirty && !force) return;
    st.render(); st.dirty = false;
  });
}
function loop(now){
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!document.hidden) step(now, dt, false);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

window.A3 = { stages, load, build, stage, setHighlight, setLighting, explode, rig, dims, lineArt, label, halo, exportGLB, canvasTex, RM, LAMP,
  get env(){ gl(); return ENV; }, _dirtyAll(){ stages.forEach(s => s.dirty = true); },
  _step(n, dt){ let t = performance.now(); for (let i = 0; i < (n || 1); i++){ t += (dt || 0.033) * 1000; step(t, dt || 0.033, true); } } }; // test hook: advance frames without rAF
})();
