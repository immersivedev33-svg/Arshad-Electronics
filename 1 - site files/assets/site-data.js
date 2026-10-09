/* Arshad Site Lab: site-wide content copied from arshadelectronics.com (checked 7 Oct 2026), page registry and new options. */
window.SD = (() => {

const PAGES = [
  // id, nav label, group, title for tabs / crumbs, product build id (if any), family
  { id: 'home', t: 'Home', kind: 'home' },
  { id: 'fluxomatic', t: 'Fluxomatic', kind: 'hub', fam: 'F', crumb: ['Products', 'Fluxomatic corona discharge treaters'] },
  { id: 'films', t: 'Blown / cast film', kind: 'product', fam: 'F', parent: 'fluxomatic', crumb: ['Products', 'Fluxomatic', 'Blown and cast film'], photo: 'img/corona-hero.jpg', cut: 'cut-fluxomatic-cdt--mml-ibc-2.webp', fx: 'corona' },
  { id: 'woven', t: 'Woven fabric', kind: 'product', fam: 'F', parent: 'fluxomatic', crumb: ['Products', 'Fluxomatic', 'Woven fabric'], photo: 'img/mood-woven-fabric.jpg', cut: 'cut-fluxomatic-cdt-ws.webp', fx: 'corona' },
  { id: 'objects', t: '3D objects & cables', kind: 'product', fam: 'F', parent: 'fluxomatic', crumb: ['Products', 'Fluxomatic', '3D objects and cables'], photo: 'img/mood-treater-frame.jpg', cut: 'cut-fluxomatic-cds-3d.webp', fx: 'corona' },
  { id: 'fluxosealer', t: 'Fluxosealer', kind: 'hub', fam: 'S', crumb: ['Products', 'Fluxosealer induction cap sealers'] },
  { id: 'brezo', t: 'Brezo series', kind: 'product', fam: 'S', parent: 'fluxosealer', crumb: ['Products', 'Fluxosealer', 'Brezo series'], photo: 'img/jars-hero.jpg', cut: 'cut-fluxosealer--brezo--3css.webp', fx: 'induction' },
  { id: 'aurae', t: 'Aurae series', kind: 'product', fam: 'S', parent: 'fluxosealer', crumb: ['Products', 'Fluxosealer', 'Aurae series'], photo: 'img/mood-aurae3.jpg', cut: 'cut-fluxosealer--aurae3.webp', fx: 'induction' },
  { id: 'simco', t: 'Simco-Ion', kind: 'product', fam: 'I', crumb: ['Products', 'Simco-Ion static eliminators'], photo: 'img/mood-simco-plastic.jpg', cut: null, fx: 'ions' },
  { id: 'about', t: 'About us', kind: 'about', crumb: ['About us'] },
  { id: 'clients', t: 'Clients', kind: 'clients', crumb: ['Clients'] },
  { id: 'faq', t: 'FAQ', kind: 'faq', crumb: ['FAQ'] },
  { id: 'contact', t: 'Contact', kind: 'contact', crumb: ['Contact us'] }
];
const PRODUCT_ORDER = ['films', 'woven', 'objects', 'brezo', 'aurae', 'simco'];

const ABOUT = {
  eb: 'Our history',
  h: 'Established in 1971',
  history: 'Established in the year 1971, our company had been innovative in producing the latest technology and the most advanced systems of Corona Surface Treaters and Induction Cap Sealers in India. Built on solid fundamentals of the late Mr. A G Moolji, Arshad Electronics carries his legacy of precision and quality with a success streak of 50 years.',
  focus: 'Our focus is to deliver the best product at the best price with timely service. To ensure customer satisfaction, we have established an after sales service backup in major cities in India as well as other countries.',
  motto: 'Providing Solutions for Better Printing and Packaging is our motto. We ensure our clients benefit from our products by enhancing their existing systems thus improving productivity and saving costs.',
  values: ['Quality', 'Accuracy', 'Safety', 'Reliance'],
  expertise: 'We focus on offering reliable, practical and customised solutions to ensure ease of use and maintenance. We have an experienced and dedicated tech team that ensures quality, after sales service and timely support.',
  strengths: [
    ['R&D centre', 'Our focus is on developing and deploying new, innovative technology which helps improve the machine usability and overall productivity.'],
    ['Reliable technology', 'Each component is specifically chosen to ensure longevity and performance over time.'],
    ['Easy maintenance', 'Easy changeover of spare parts which results in lesser downtime and high productivity.'],
    ['Rugged built systems', 'Our machines are rugged and durable, specifically designed keeping in mind industrial standards and environments.'],
    ['Indigenous design', 'Our machines are designed to perform in local, industrial environments.'],
    ['Efficient output', 'Each machine is engineered and tuned for maximum performance with less power draw.'],
    ['Quality after sales service', 'Our technical service department offers quality after sales service and technical support by personnel that have huge experience.'],
    ['Low-cost spares', 'Spares used in our machines are non-proprietary, hence making them cost effective.'],
    ['Service network', 'Our service network is accessible all over India.']
  ],
  presence: 'We are celebrating 50 years of excellence in the printing and packaging industry. Our vast experience in the domestic as well as international market makes Arshad Electronics Pvt. Ltd. one of the leading solution providers in the printing as well as packaging industry.',
  numbers: [[10000, '+', 'local installations'], [1000, '+', 'exports'], [35, '+', 'countries'], [4, '', 'service centres']],
  centres: ['Mumbai', 'Ahmedabad', 'Hyderabad', 'Delhi']
};
const TIMELINE = [
  ['1971', 'Pioneered the corona treater for plastic films in India'],
  ['1994', 'Introduced the solid-state induction cap sealer'],
  ['2000', 'Launched the IGBT-based induction cap sealer'],
  ['2001', 'Introduced Arshad Ozonics® ozone generators'],
  ['2004', 'PLC-based high-speed induction sealer for dairy products'],
  ['2008', 'MOSFET-based air-cooled induction cap sealers'],
  ['2010', 'Wad inserting machine'],
  ['2012', 'Wide-mouth 150 mm induction cap sealers'],
  ['2013', '3300 mm wide-web corona treater for woven fabric'],
  ['2016', 'High-speed air-cooled induction sealer'],
  ['2017', 'Plasma treater for the textile industry'],
  ['2018', '2500 mm corona treater for IBC blown film lines'],
  ['2019', 'Corona treater for cables']
];
const TESTIMONIALS = [
  ['We are using your induction sealing machine since the last eight years and we are very satisfied with working of the machine in terms of quality, service and consistency.', 'Pravin Walecha', 'Bajaj Foods'],
  ['We have been purchasing Arshad Fluxosealer induction sealer since 2 years and the performance and customer support we found from Arshad Electronics is very excellent.', 'Piyush Dave', 'National Pharma Machinery'],
  ['We are using Arshad Fluxosealer induction sealer since last 10 years and are satisfied with the performance of the machine and the timely service provided.', 'Mr. Manish', 'Vimal Pesticides'],
  ['Your treaters are the best.', 'Mr. Rizwan', 'Zubairi Plastics, UAE']
];
const CONTACT = {
  intro: 'If you need any help regarding extra information, or need a quote for machines according to your unique requirement, please feel free to send us a message.',
  phones: ['+91 22 2445 1709', '+91 22 2446 2628', '+91 22 2445 8223'],
  mobile: '+91 90046 17373',
  emails: ['sales@arshadelectronics.com', 'amoolji@arshadelectronics.com'],
  addr: '305, Hammersmith Industrial Estate, Off S.T. Rd., Mahim, Mumbai 400016, Maharashtra, India'
};
const HUBS = {
  fluxomatic: {
    fam: 'F', brand: 'Fluxomatic®', h: 'Corona discharge treaters',
    lede: 'Achieve perfect treatment for perfect bonding.',
    intro: [
      'Corona treaters provide high-speed oxidation of the film surface. The energy created by corona discharge breaks down the atomic structure and creates an ozone-rich zone, improving the surface characteristics. The treated surface goes back to its original dyne state after some time; the effect lasts for up to a month depending on the formulation.',
      'Corona treatment improves the bondability, wettability and printability of polymers, particularly polyolefin films, because it allows continuous treatment in a single step and is a simple process to perform.',
      'Our Fluxomatic corona discharge treaters use the latest IGBT technology for the best performance at low power.'
    ],
    series: ['films', 'woven', 'objects'],
    apps: ['Blown films', 'Printing & UV', 'Aseptic packaging', 'Lamination & coating', 'Sheet extrusions'],
    subs: ['Monolayer', 'Multilayer', 'Metallized', 'Cast films', 'BOPP', 'Woven fabric', 'Polyester'],
    whatTitle: 'What can be corona treated?',
    what: 'Treating works best when a substrate is treated at the time of extrusion and in-line prior to converting. Corona treating increases quality and productivity through improved print quality, faster press speeds and less scrap.'
  },
  fluxosealer: {
    fam: 'S', brand: 'Fluxosealer®', h: 'Induction cap sealers',
    lede: 'Keep your product fresh, safe and secure.',
    intro: [
      'The process of sealing an aluminium foil on the bottle mouth by the use of an electromagnetic field is called induction sealing. Products packed in plastic containers such as pharmaceuticals, food, agrochemicals and lubricants are now being induction sealed. It is a fast and easy way to ensure that your product is safe from contamination and duplication.',
      'The aim of Arshad Electronics is to help manufacturers achieve the perfect induction seal, to protect their products, improve productivity and guard their reputation.',
      'Fluxosealer® induction cap sealers come in two categories: the Brezo series of air-cooled systems and the Aurae series of water-cooled systems.'
    ],
    series: ['brezo', 'aurae'],
    apps: ['Food', 'Cosmetics & personal care', 'Pharmaceuticals', 'Adhesives', 'Dairy products', 'Agro-chemicals', 'Detergents', 'Lubricants'],
    advantages: ['Leak proof sealing', 'Tamper evident', 'Increased shelf life', 'Airtight hermetic seal', 'Enhanced customer confidence', 'Protects product freshness & integrity'],
    whatTitle: 'Advantages of induction sealing',
    what: 'Induction cap sealing safeguards your products against tampering and maintains their quality. It guarantees the safety and integrity of your goods, preserves their original state, and ensures product freshness with a longer shelf life.'
  }
};
/* Full FAQ from the live /faq/ page (placeholder intro text on the live page left out). */
const FAQ = [
  ['corona', 'What is corona treatment?', 'Corona (Latin, ‘crown’) is a type of plasma that surrounds the Sun and other celestial bodies, including the earth. We generate the same by applying high voltage at high frequency between a conducting material and an earthed dielectric material. The air in between gets ionised and corona discharge takes place. During this process, atmospheric oxygen is broken down to nascent oxygen and ozone: 2O₂ → O + O₃. The film that enters the corona treater is oxidised by the nascent oxygen, and the treated film is ready for printing, lamination or coating. The machine is called a surface oxidising unit, more commonly a corona treater. It is ancillary equipment installed on blown film lines, laminators, printing machines and coating machines. For non-conductive plastic films there is an electrode system and a roller covered with dielectric material; the film passes through and is exposed to corona discharge.'],
  ['corona', 'What data is required for effective corona treatment?', 'To offer the optimum model we need: material; application (printing, lamination or coating); maximum width; number of sides; maximum line speed; minimum–maximum gauge. Using this data, the power requirement of the generator is determined. It also depends on electrode design and contact time. Power (kW) = no. of sides × width (m) × line speed (m/min) × change in dyne level × A / 1000, where A is 1–5 depending on the material treated, slip additives and film temperature.'],
  ['corona', 'What is a corona treater system?', 'The system consists of a generator, a high-voltage transformer, the electrode assembly and an ozone extraction system. There are two basic types: for non-conductive film and for conductive film. Non-conductive is further classified into freshly prepared, cold film and woven fabric. The electrode assembly is designed for the substrate, maximum width and speed; roller diameters and electrodes are selected to suit the process, and power depends on the application and additives. We focus more on electrode design than on generator power, as we strive to give more treatment at less power.'],
  ['sealing', 'What is induction cap sealing?', 'Induction sealing is a simple process by which an aluminium foil disc is sealed on the mouth of a bottle to ensure the safety of the product inside. The foil disc is placed inside the cap and the bottle passes under the induction sealer after filling and capping. The seal evenly seals the rim of the container while the container is capped and the seal is electronically heated, giving proper and uniform adhesion to the bottle mouth.'],
  ['sealing', 'How does it keep the product fresh?', 'The container is sealed with an aluminium foil coated with a suitable polyethylene film that melts while heating and fuses with the bottle mouth on cooling, as the bottle exits the sealer. This forms an airtight seal, so the product’s freshness or aroma is maintained, shelf life increases and consumer confidence grows.'],
  ['sealing', 'Is an induction seal a strong seal?', 'Yes, when sealed with the right equipment. It depends on parameters such as foil thickness, sealing layer thickness, application and product nature. We encourage clients to run a drop test and a seal-strength check, as bottles and boxes in transit face falls, bumpy roads and improper handling; a leak can mean recalling a whole batch.'],
  ['sealing', 'Why is induction sealing a better choice?', 'Leak proof: the seal contacts the mouth uniformly, giving a 100% seal and avoiding recall costs. Increased shelf life: an airtight barrier reduces spoilage and evaporation. Pilfer proof: a sealed container is a less likely target. Tamper evident: the foil shows if the product has been tampered with. Enhanced customer confidence: the user sees the seal and trusts the product is unadulterated and fresh.'],
  ['sealing', 'What decides a good seal?', 'Foil structure: we recommend 20–35 gsm foil; foils below this need a low-temperature heat-sealable layer and suit high speeds with small necks. Neck surface: the mouth must be uniform and smooth for full contact. Neck diameter: the larger the diameter, the more heating is required. Dwell time: the seconds the foil spends under the coil while the sealing layer melts and welds. Closure torque: the cap must press the foil evenly onto the mouth.'],
  ['sealing', 'What can be induction sealed?', 'Any container with a cap and a uniform mouth surface, where the cap closes fully and applies proper torque to the wad: HDPE bottles, HDPE jars, LDPE bottles, PET bottles, polypropylene (PP) jars and bottles, and glass bottles.']
];

/* ---------- new site-level options ---------- */
const TREAT = [['page', 'Page default'], ['industrial', 'Industrial'], ['showroom', 'Showroom'], ['blueprint', 'Blueprint'], ['editorial', 'Editorial'], ['soft', 'Soft depth'], ['ion', 'Ion']];
const UNI = [['original', 'Original', 'Each page keeps its own one-off layout'], ['parts', 'Shared parts', 'Same hero, header, specs, enquiry and footer; the rest stays'], ['family', 'Per family', 'One section order for Fluxomatic, one for Fluxosealer, one for Simco'], ['template', 'Full template', 'One section order for every product page']];
const TPL = [
  ['tHero', 'Product hero', [['split', 'Split'], ['banner', 'Banner'], ['overlay', 'Overlay'], ['own', 'Page’s own', 'The hero this page has in the Product Pages lab']]],
  ['tHow', 'How it works', [['steps', 'Steps'], ['cards', 'Cards'], ['line', 'Line']]],
  ['tModels', 'Models / series', [['open', 'Open'], ['panel', 'Panel']]],
  ['tSpecs', 'Specs', [['open', 'Open'], ['panel', 'Panel']]],
  ['tDemo', 'Live demos', [['stack', 'Stacked'], ['tabs', 'Tabs'], ['grid', 'Grid']]],
  ['tInd', 'Industries', [['tiles', 'Tiles'], ['chips', 'Chips'], ['list', 'List'], ['own', 'Page’s own', 'The industries block this page has in the Product Pages lab (Brezo, Aurae)']]],
  ['tFaq', 'FAQ', [['list', 'List'], ['cols', 'Two columns']]],
  ['tEnq', 'Enquiry', [['split', 'Split'], ['card', 'Card']]]
];
const PAGE_LAYOUTS = {
  hub: [['hubHero', 'Hub hero', [['split', 'Split'], ['photo', 'Photo'], ['type', 'Big type']]], ['hubSeries', 'Series', [['cards', 'Cards'], ['rail', 'Sideways rail'], ['list', 'List']]]],
  about: [['abTimeline', 'Timeline', [['rail', 'Rail'], ['vertical', 'Vertical'], ['chapters', 'Chapters']]], ['abStrengths', 'Strengths', [['grid', 'Grid'], ['list', 'List']]], ['abQuotes', 'Testimonials', [['cards', 'Cards'], ['slider', 'Slider']]]],
  clients: [['cli', 'Client logos', [['a', 'Split wall'], ['b', 'Marquee'], ['c', 'Filterable']]], ['abQuotes', 'Testimonials', [['cards', 'Cards'], ['slider', 'Slider']]]],
  faq: [['faqLayout', 'FAQ layout', [['groups', 'Grouped'], ['tabs', 'Tabs'], ['cols', 'Two columns']]]],
  contact: [['con', 'Contact block', [['a', 'Form + details'], ['b', 'Call-to-action band'], ['c', 'Card on a drawn map']]]]
};
const PBG = [['calm', 'Calm', 'Plain page colour'], ['same', 'Same as homepage', 'Whatever endless background the homepage uses'], ['family', 'Family motif', 'Film web for Fluxomatic, field rings for Fluxosealer, ions for Simco'], ['bars', 'Logo bars, quiet'], ['field', 'Technical field, quiet'], ['topo', 'Contours, quiet'], ['ribbon', 'Film ribbon, quiet'], ['line', 'Production line, quiet']];
const LAYER = [['flat', 'Flat'], ['rise', 'Rise over'], ['stack', 'Stacked sheets'], ['cards', 'Inset cards'], ['glass', 'Glass panels'], ['curtain', 'Curtain reveal'], ['offset', 'Offset paper'], ['bands', 'Parallax bands']];
const TRANS = [['none', 'None'], ['fade', 'Cross-fade'], ['wipe', 'Logo-bar wipe'], ['slide', 'Slide'], ['grow', 'Image grows into hero']];
const HOVER = [['none', 'None'], ['lift', 'Lift'], ['tilt', 'Tilt to pointer'], ['glow', 'Glow edge'], ['underline', 'Underline sweep']];
const CLICK = [['none', 'None'], ['ripple', 'Ripple'], ['sink', 'Press sink'], ['burst', 'Logo-bar burst']];

/* ---------- site lab defaults: your saved Homepage picks (db v308) + new options ---------- */
const DEFAULTS = {
  // homepage options (from saved picks)
  look: 'dark', font: 'logo', text: 'neu', accents: 'on', simco: 'sage', plasma: 'none',
  hdr: 'b', hero: 'c', story: 'c', proof: 'b', ind: 'a', why: 'a', cli: 'b', par: 'a', help: 'c', con: 'a',
  motion: 'subtle', sheets: 'stack', parallax: 1, motif: 0, grain: 0, grid: 0, glow: 0, reveal: 1, dividers: 0,
  clPill: 0, clSpecs: 0, clInd: 1, clHow: 1,
  bar: 1, drawer: 0, rail: 1, fab: 1, search: 1, keys: 1, prog: 1,
  photos: 1, cuts: 1, logos: 1, m3d: 0, bg: 'bars', review: 'on',
  // product page options (Product Pages lab)
  treat: 'page', orig: 0, units: 'site',
  // new: uniformity + template layouts
  uni: 'template', tHero: 'split', tHow: 'steps', tModels: 'open', tSpecs: 'panel', tDemo: 'stack', tInd: 'tiles', tFaq: 'list', tEnq: 'split',
  // new: other pages' layouts
  hubHero: 'split', hubSeries: 'cards', abTimeline: 'rail', abStrengths: 'grid', abQuotes: 'cards', faqLayout: 'groups',
  // new: machine view, backgrounds, accent strength
  mview: 'auto', pbg: 'calm', veil: 85, famAcc: 'labels',
  // new: effects
  trans: 'fade', torch: 0, magnet: 0, tilt: 0, cursor: 0, lines: 1, ticks: 0, scramble: 0, typing: 0, srail: 1, sturn: 0, shift: 0, spin: 1, hover: 'lift', click: 'ripple',
  // new: quality of life
  crumbs: 1, mega: 1, prevnext: 1, toc: 0, totop: 1, basket: 1, compare3: 1, textsize: 100, vtheme: 0, contrast: 0, recent: 1, resume: 1, finder: 1, quiz: 0,
  share: 1, quick: 1, keybar: 1, gallery: 1, callback: 0, wa: 1, a11y: 1, brochure: 0, lang: 0
};

const PRESETS = [
  ['saved', 'Your saved picks', 'Homepage picks site-wide; endless background on home only', {}],
  ['clean', 'Clean light', 'All light, four doors, calm product pages', { look: 'light', hdr: 'a', hero: 'a', story: 'a', proof: 'a', cli: 'a', motion: 'full', sheets: 'rise', bg: 'off', simco: 'steel', plasma: 'green', motif: 1, drawer: 1, clPill: 1, clInd: 0, clHow: 0, rail: 0 }],
  ['showroom', 'Dark showroom', 'Dark hero, family motif behind product pages', { look: 'lightdark', hero: 'd', story: 'c', proof: 'b', ind: 'b', why: 'b', glow: 1, pbg: 'family', sheets: 'glass', bg: 'off' }],
  ['uniform', 'One template, green', 'Green blocks, full template on every product page', { look: 'green', font: 'wide', hdr: 'c', hero: 'b', story: 'b', uni: 'template', tHero: 'banner', tDemo: 'tabs', famAcc: 'strong', bg: 'off', sheets: 'rise' }],
  ['endless', 'Endless everywhere', 'Homepage endless background carried through every page', { bg: 'line', pbg: 'same', veil: 80, sheets: 'flat', hdr: 'b' }]
];

const IDEAS_SITE = {
  ux: [
    ['uni', 'Uniformity levels for product pages', 'Original, shared parts, per family or one full template, switchable site-wide or per page.', 'Product pages', 'in', { uni: 'template' }],
    ['pins', 'Pin a setting to one page', 'Any site-wide option can be overridden on just the page you are on.', 'Whole site', 'in', null],
    ['crumbs', 'Breadcrumbs + previous / next product', 'Know where you are and step through the range.', 'Product pages', 'in', { crumbs: 1, prevnext: 1 }],
    ['toc', 'Contents that follow you', 'A sticky list of the page’s sections with the current one lit.', 'Long pages', 'in', { toc: 1 }],
    ['basket', 'One shortlist across the site', 'Shortlist from any page; compare and send one enquiry for all of it.', 'Whole site', 'in', { basket: 1 }],
    ['comfort', 'Comfort settings for visitors', 'Units, text size, light/dark switch, high contrast and reduce motion in one panel.', 'Header', 'in', { vtheme: 1 }],
    ['recent', 'Recently viewed + pick up where you left off', 'Returning visitors get back to the product they were reading.', 'Header, home', 'in', { recent: 1, resume: 1 }],
    ['finder', 'Product finder from any page', 'A floating “Find a machine” button opens the three-step finder anywhere.', 'Whole site', 'in', { finder: 1 }],
    ['share', 'Share this page / model', 'Copies a link straight to the page you are on.', 'Product pages', 'in', { share: 1 }],
    ['callback', 'Request a call back', 'A tiny form: name, phone, best time.', 'Whole site', 'in', { callback: 1 }],
    ['a11y', 'Accessibility pack', 'Skip link, strong focus rings and bigger touch targets.', 'Whole site', 'in', { a11y: 1 }],
    ['lang', 'English / हिंदी', 'Language switch; needs Hindi copy from Arshad.', 'Header', 'need', { lang: 1 }],
    ['brochure', 'Brochure download', 'Download the catalogue PDF; needs the PDF from Arshad.', 'Product pages', 'need', { brochure: 1 }]
  ],
  assets: [
    ['treat', 'Product styles as recoloured treatments', 'Industrial, showroom, blueprint, editorial, soft and ion keep their shape but wear the site’s greens.', 'Product pages', 'in', { treat: 'blueprint' }],
    ['pbg', 'Endless backgrounds behind product pages', 'Quiet versions of the homepage backgrounds and a family motif, under a reading veil.', 'Product pages', 'in', { pbg: 'family' }],
    ['layers', 'More ways to layer sections', 'Inset cards, glass panels, curtain reveal, offset paper and parallax bands.', 'Whole site', 'in', { sheets: 'cards' }],
    ['trans', 'Page transitions', 'Cross-fade, logo-bar wipe, slide, or the product image growing into the next hero.', 'Between pages', 'in', { trans: 'wipe' }],
    ['cursor', 'Cursor effects', 'Torch on dark sections, magnetic buttons, tilt cards and a labelled cursor.', 'Whole site', 'in', { torch: 1, magnet: 1, tilt: 1, cursor: 1 }],
    ['text', 'Text and number motion', 'Headlines rise line by line, specs tick in, figures scramble then settle, the motto types in.', 'Whole site', 'in', { lines: 1, ticks: 1, scramble: 1, typing: 1 }],
    ['scroll', 'Scroll-driven effects', 'Sideways series rail, machines that turn with scroll, colour that shifts by section.', 'Hubs, product pages', 'in', { srail: 1, sturn: 1, shift: 1 }],
    ['click', 'Click and hover feedback', 'Lift, tilt, glow or underline on hover; ripple, sink or logo-bar burst on click.', 'Whole site', 'in', { hover: 'tilt', click: 'burst' }],
    ['famacc', 'Family accent strength', 'From no accent to a coloured strip and section markers for each family.', 'Product pages, hubs', 'in', { famAcc: 'strong' }],
    ['mview', '3D or photo per page', '3D models by default on product pages; photo + drawn effect as the alternative, per page.', 'Product pages', 'in', { mview: 'photo' }],
    ['timeline', 'Real timeline, 1971 → 2019', 'Thirteen dated milestones from the About page, as rail, vertical or chapters.', 'About, home', 'in', { abTimeline: 'chapters' }],
    ['video', 'Scroll-scrubbed line footage', 'Real footage of a line, scrubbed by scroll.', 'Home or hubs', 'need', null]
  ]
};

return { PAGES, PRODUCT_ORDER, ABOUT, TIMELINE, TESTIMONIALS, CONTACT, HUBS, FAQ, TREAT, UNI, TPL, PAGE_LAYOUTS, PBG, LAYER, TRANS, HOVER, CLICK, DEFAULTS, PRESETS, IDEAS_SITE };
})();
