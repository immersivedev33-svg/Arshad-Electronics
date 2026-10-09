/* Arshad site draft 1 (dark): the Site Lab picks this draft is built from (brainstorms/2026-10-09-arshad-final-site.md).
   Source: the user's pasted Picks summary of 2026-10-09, plus the settings that summary never prints, plus the interview decisions. */
/* every page has <base href="../.."> pointing at the site root, so links and assets work wherever the site is hosted;
   pin it to an absolute address so it stays put when the site changes page without reloading */
(() => { const b = document.querySelector('base'); if (b) b.setAttribute('href', b.href); })();
window.DRAFT = (() => {
  const S = {
    // look and type (fonts: Montserrat + Inter + IBM Plex Mono for data: decision Q6)
    look: 'dark', font: 'tech', text: 'cur', accents: 'on', famAcc: 'labels', simco: 'sage', plasma: 'none',
    // product pages: one shared style, the homepage's own look (Q6/Q7); no review tags (Q5)
    uni: 'template', treat: 'site', orig: 0, mview: 'auto', units: 'site', review: 'off',
    tHero: 'split', tHow: 'steps', tModels: 'open', tSpecs: 'panel', tDemo: 'stack', tInd: 'tiles', tFaq: 'list', tEnq: 'split',
    // homepage
    hdr: 'b', hero: 'c', story: 'c', proof: 'b', ind: 'a', why: 'a', cli: 'b', par: 'a', help: 'c', con: 'a',
    // other pages
    hubHero: 'split', hubSeries: 'cards', abTimeline: 'rail', abStrengths: 'grid', abQuotes: 'cards', faqLayout: 'groups',
    // backgrounds: the background itself moves with scroll only (Q8b, patched in the build)
    bg: 'bars', pbg: 'same', veil: 80, sheets: 'curtain',
    // motion full (Q8); depth parallax off (Q8b)
    motion: 'full', trans: 'none', hover: 'lift', click: 'ripple',
    lines: 1, ticks: 1, srail: 1, reveal: 1, parallax: 0,
    torch: 0, magnet: 0, tilt: 0, cursor: 0, scramble: 0, typing: 0, sturn: 0, shift: 0, motif: 0, dividers: 0, glow: 0, grain: 0, grid: 0, spin: 1,
    // interface
    bar: 1, search: 1, fab: 1, wa: 1, rail: 1, prog: 1, keys: 1, drawer: 0, clPill: 0, clSpecs: 0, clInd: 1, clHow: 1,
    // navigation and quality of life (recently viewed removed in round 3)
    mega: 1, crumbs: 1, prevnext: 1, toc: 0, totop: 1, basket: 1, compare3: 1, textsize: 100, vtheme: 0, contrast: 0,
    recent: 0, resume: 1, finder: 1, quiz: 0, share: 1, quick: 1, keybar: 1, gallery: 1, callback: 0, a11y: 1, brochure: 0, lang: 0,
    // assets
    photos: 1, cuts: 1, logos: 1, m3d: 0
  };
  // page pins from the summary (review, motion and treatment pins dropped: those are now site-wide decisions);
  // every individual product page uses the contour lines background (pbg topo); all other pages keep the logo backgrounds
  const pins = {
    fluxomatic: { hubHero: 'photo', pbg: 'bars', hubSeries: 'cards' },
    fluxosealer: { hubHero: 'split' },
    simco: { uni: 'family', mview: 'site', pbg: 'topo' },
    brezo: { uni: 'family', mview: 'auto', pbg: 'topo', tModels: 'open' },
    films: { uni: 'original', pbg: 'topo' },
    woven: { uni: 'template', mview: 'site', tHero: 'split', tHow: 'steps', tInd: 'tiles', pbg: 'topo' },
    objects: { mview: 'auto', pbg: 'topo', tHow: 'steps', tDemo: 'stack', tSpecs: 'panel', tModels: 'panel' },
    aurae: { mview: 'site', uni: 'template', tDemo: 'stack', tSpecs: 'panel', pbg: 'topo' }
  };
  // the live site's addresses (relative to the site root)
  const PATHS = {
    home: '', fluxomatic: 'corona-discharge-treaters/', films: 'corona-discharge-treaters/blown-cast-films/', woven: 'corona-discharge-treaters/woven-fabric/',
    objects: 'corona-discharge-treaters/3d-objects/', fluxosealer: 'induction-cap-sealers/', brezo: 'induction-cap-sealers/fluxosealer-brezo-series/',
    aurae: 'induction-cap-sealers/fluxosealer-aurae-series/', simco: 'simco-ion-static-eliminators/', about: 'about-us/', clients: 'clients/', faq: 'faq/', contact: 'contact-us/'
  };
  const href = id => (id in PATHS ? PATHS[id] : '') || './';
  const idFromPath = () => {
    const rel = location.href.slice(document.baseURI.length).split(/[?#]/)[0].replace(/index\.html$/, '');
    const hit = Object.keys(PATHS).find(k => PATHS[k] === rel || PATHS[k] === rel + '/');
    return hit || 'home';
  };
  return { S, pins, PATHS, href, idFromPath, page: 'home' };
})();
