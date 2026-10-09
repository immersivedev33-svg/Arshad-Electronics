/* Arshad site draft 1 (dark): starts the site with the baked-in picks (this replaces the Site Lab's drawer, site-lab.js). */
(() => {
'use strict';
const SITE = window.SITE, ST = SITE.ST, C = window.DRAFT;
const $ = (s, r = document) => r.querySelector(s);

ST.S = Object.assign({}, window.SD.DEFAULTS, C.S);
ST.pins = JSON.parse(JSON.stringify(C.pins));
ST.feat = {};
ST.cur = SITE.PG(C.page) ? C.page : C.idFromPath();
try { history.replaceState({ p: ST.cur }, '', location.href); } catch (e){}

/* links to a section on the same page (#enq, #s-con, ...): <base> points them at the site root, so scroll here instead of leaving */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a || a.dataset.page || e.defaultPrevented) return;
  const id = a.getAttribute('href').slice(1);
  e.preventDefault();
  const el = id ? document.getElementById(id) : null;
  if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  else if (!id || id === 'top') scrollTo({ top: 0, behavior: 'smooth' });
});

I18N.start();
SITE.render();
setTimeout(() => SITE.resumeOffer(), 900);
})();
