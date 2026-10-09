/* Arshad site draft 1 (dark): English / Spanish / Russian for the whole site (round 3, 9 Oct 2026).
   The site is written in English; this swaps every visible string for its translation from i18n-es.js / i18n-ru.js:
   text, placeholders, labels, alt text, the page title and text drawn on canvases. It keeps the English original of
   every node, so switching language (or back to English) always starts from the source text. Strings with numbers are
   looked up as templates ("{0} series fit your line."), so live figures keep working. The choice is remembered. */
window.I18N = (() => {
  'use strict';
  const LANGS = [['en', 'EN', 'English'], ['es', 'ES', 'Español'], ['ru', 'RU', 'Русский']];
  const KEY = 'arshad-draft-lang';
  let lang = 'en';
  try { const q = new URLSearchParams(location.search).get('lang'); lang = q || localStorage.getItem(KEY) || 'en'; } catch (e){}
  if (!LANGS.some(l => l[0] === lang)) lang = 'en';
  const dict = () => (lang === 'es' ? window.I18N_ES : lang === 'ru' ? window.I18N_RU : null) || {};
  const NUM = /\d+(?:[.,]\d+)*/g;
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const miss = window.I18N_MISS || null; // collection mode (QA): untranslated strings land here

  function tr(s){
    if (lang === 'en' || s == null) return s;
    s = String(s); const k = norm(s); if (!k || !/[A-Za-z]/.test(k)) return s;
    const d = dict(); let out = d[k];
    if (out == null && /\d/.test(k)){
      const nums = k.match(NUM); let i = 0; const t = d[k.replace(NUM, () => '{' + (i++) + '}')];
      if (t != null) out = t.replace(/\{(\d+)\}/g, (m, n) => nums[+n] != null ? nums[+n] : m);
    }
    if (out == null){ if (miss) miss.add(/\d/.test(k) ? (() => { let i = 0; return k.replace(NUM, () => '{' + (i++) + '}'); })() : k); return s; }
    return s.match(/^\s*/)[0] + out + s.match(/\s*$/)[0];
  }

  /* ---------- DOM ---------- */
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  const textOrig = new WeakMap(), textSet = new WeakMap(), attrOrig = new WeakMap();
  const skip = el => !el || el.closest('script, style, textarea, noscript, [translate="no"], .langs');
  function doText(n){
    const p = n.parentElement; if (!p || skip(p)) return;
    const cur = n.data;
    if (!textOrig.has(n) || textSet.get(n) !== cur) textOrig.set(n, cur); // new node, or the site changed its text
    const want = tr(textOrig.get(n));
    if (want !== cur) n.data = want;
    textSet.set(n, n.data);
  }
  function doAttrs(el){
    if (skip(el)) return;
    let o = attrOrig.get(el);
    ATTRS.forEach(a => {
      if (!el.hasAttribute(a)) return;
      const cur = el.getAttribute(a); if (!o){ o = {}; attrOrig.set(el, o); }
      if (!o[a] || o[a][1] !== cur) o[a] = [cur, cur];
      const want = tr(o[a][0]);
      if (want !== cur){ busy = true; el.setAttribute(a, want); busy = false; }
      o[a][1] = want;
    });
  }
  function apply(root){
    if (!root) return;
    if (root.nodeType === 3){ doText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) doText(n);
    if (root.nodeType === 1) doAttrs(root);
    root.querySelectorAll('[placeholder],[aria-label],[title],[alt]').forEach(doAttrs);
  }
  let busy = false;
  const mo = new MutationObserver(ms => {
    if (busy) return;
    ms.forEach(m => {
      if (m.type === 'characterData') doText(m.target);
      else if (m.type === 'attributes') doAttrs(m.target);
      else m.addedNodes.forEach(apply);
    });
  });

  /* ---------- canvases: labels drawn on canvases go through the same dictionary ---------- */
  const C2 = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (C2){ ['fillText', 'strokeText', 'measureText'].forEach(f => { const o = C2[f]; C2[f] = function(t, ...a){ return o.call(this, tr(t), ...a); }; }); }

  /* ---------- the switcher (in the site header, see build.py) ---------- */
  const FLAGS = {
    en: '<svg viewBox="0 0 60 40" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0V40M0 20H60" stroke="#fff" stroke-width="12"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="7"/></svg>',
    es: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/></svg>',
    ru: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#fff"/><rect y="13.33" width="60" height="13.34" fill="#0039A6"/><rect y="26.67" width="60" height="13.33" fill="#D52B1E"/></svg>'
  };
  const switcher = () => `<div class="langs" role="group" aria-label="Language">${LANGS.map(([k, s, name]) => `<button type="button" data-lang-set="${k}" lang="${k}" aria-pressed="${k === lang}" aria-label="${name}" title="${name}"><span class="flag">${FLAGS[k]}</span><span class="lc">${s}</span></button>`).join('')}</div>`;
  function set(l){
    if (l === lang || !LANGS.some(x => x[0] === l)) return;
    lang = l; try { localStorage.setItem(KEY, l); } catch (e){}
    document.documentElement.lang = l;
    const y = scrollY;
    if (window.SITE && SITE.render) SITE.render();
    apply(document.body); setTitle();
    document.querySelectorAll('[data-lang-set]').forEach(b => b.setAttribute('aria-pressed', b.dataset.langSet === l));
    requestAnimationFrame(() => scrollTo(0, y));
  }
  let titleEn = null, titleSet = null;
  function setTitle(){ if (titleEn === null || document.title !== titleSet) titleEn = document.title; const t = tr(titleEn); titleSet = t; if (document.title !== t) document.title = t; }
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-lang-set]'); if (b){ e.preventDefault(); set(b.dataset.langSet); } });

  function start(){
    document.documentElement.lang = lang;
    apply(document.body); setTitle();
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    new MutationObserver(setTitle).observe(document.querySelector('title'), { childList: true, characterData: true, subtree: true });
  }
  return { tr, set, start, switcher, get lang(){ return lang; }, LANGS };
})();
