/* Arshad Homepage Lab: content, options, presets and ideas. Facts come from arshadelectronics.com (checked 2026-10-01). */
window.HD = (() => {
const P = window.PD.P;

/* Text: cur = the live site's wording (casing fixed, repeats removed); neu = rewritten. Facts identical in both. */
const T = {
  cur: {
    heroEb: 'Arshad Electronics Pvt. Ltd. · Since 1971',
    heroH: 'Corona Surface Treaters and Induction Cap Sealers in India',
    heroL: 'We provide the best solutions for printing & packaging. Our presence is spread worldwide and our machines are installed in more than 35 countries.',
    doorsQ: 'Our products',
    F: ['Corona Discharge Treaters', 'Achieve better bonding for long-lasting printability and lamination.'],
    S: ['Induction Cap Sealers', 'Keep your product fresh, safe and secure!'],
    I: ['Static Eliminators', 'Simco-Ion static eliminators, from an authorised Simco-Ion distributor in India.'],
    Pl: ['Plasma Treaters', 'Plasmaright plasma treaters.'],
    storyEb: 'What we do',
    storyH: 'Celebrating 50 years of excellence',
    storyP: 'Arshad Electronics Pvt Ltd. is celebrating 50 years of excellence. Built on solid fundamentals of the late Mr. A G Moolji, Arshad Electronics carries his legacy of precision and quality. Our company has been innovative in producing the latest technology and the most advanced systems of corona surface treaters and induction cap sealers in India.',
    proofEb: 'Statistics', proofH: 'What we have done',
    indEb: 'We provide the best', indH: 'Solutions for printing & packaging',
    whyEb: 'Quality', whyH: 'We are a quality driven company with fast & reliable service',
    why: [
      ['In-house manufacturing', 'In-house manufacturing helps us achieve greater power over quality assurance & build times & enables us to improve our efficiency & competitiveness.'],
      ['Quality control', 'We implement a well documented quality control process which ensures the best possible final product we can offer.'],
      ['After sales service', 'Our customer service department are available to you at all times. Our highly qualified service engineers provide support on a global scale.'],
      ['User friendly systems', 'Our easy to use systems ensure that you get the best user experience with our machines.']
    ],
    cliEb: 'Clients', cliH: 'Our esteemed clients',
    parEb: 'Affiliations', parH: 'Our affiliations',
    parP: 'Consistency, dependability, trust, honesty and morality are a few of the qualities that we ensure our business reflects. For a wider variety of solutions for our customers we have affiliated with a few other companies.',
    helpEb: 'FAQ’s', helpH: 'Frequently asked questions',
    conEb: 'Contact', conH: 'Feel free to get in touch with us!', conP: 'Tell us what you need and our team will get back to you.'
  },
  neu: {
    heroEb: 'Arshad Electronics · Mumbai · Since 1971',
    heroH: 'Machines that make packaging print, bond and seal.',
    heroL: 'Corona treaters, induction cap sealers, static control and plasma. Built in-house in Mumbai and installed in more than 35 countries.',
    doorsQ: 'Choose a product family',
    F: ['Corona treaters', 'Make inks, coatings and adhesives stick to film, fabric and moulded parts.'],
    S: ['Induction cap sealers', 'Leak-proof, tamper-evident seals on bottles and jars, from hand-held to high speed.'],
    I: ['Static control', 'Remove the static and dust that stop film, sheets and packs running cleanly.'],
    Pl: ['Plasma treaters', 'Plasma treatment for textiles and grains, on the Plasmaright site.'],
    storyEb: 'Our story',
    storyH: 'Fifty years of doing it properly',
    storyP: 'Arshad Electronics is built on the fundamentals set by the late Mr A G Moolji: precision and quality in every machine. Since 1971 we have designed and built corona treaters and induction cap sealers in Mumbai, and we still make them in-house.',
    proofEb: 'In numbers', proofH: 'Running on lines in 35+ countries',
    indEb: 'Industries', indH: 'Who we build for',
    whyEb: 'Why Arshad', whyH: 'Built, checked and serviced by the people who make it',
    why: [
      ['Made in-house', 'We build our machines ourselves, so we control quality and build times.'],
      ['Quality checked', 'A documented quality control process checks every machine before it ships.'],
      ['Service that answers', 'Our service engineers support installations in India and abroad.'],
      ['Easy to run', 'Controls designed for the people on your line, not just the engineers.']
    ],
    cliEb: 'Clients', cliH: 'Trusted on these lines',
    parEb: 'Partners', parH: 'Our affiliations',
    parP: 'Consistency, dependability, trust, honesty and morality are qualities we make sure our business reflects. Our customers come first, and we believe in giving them the best product and service. For a wider variety of solutions, we have affiliated with a few other companies.',
    helpEb: 'Help me choose', helpH: 'Not sure which machine you need?',
    conEb: 'Contact', conH: 'Tell us about your line', conP: 'Send your material, width and speed, or your container and cap size. We will size the right machine.'
  }
};

const BRANDS = [
  { k: 'F', name: 'Fluxomatic', ac: 'F', vis: 'corona', photo: 'img/corona-hero.jpg', photoLbl: 'Corona discharge, real photo', cut: 'img/cut-fluxomatic-cdt-mnl.webp', m3: 'cdt-mnl',
    subs: ['Blown / cast film', 'Woven fabric', '3D objects & cables'],
    list: [['FTS-MNL', 'Monolayer blown film'], ['FTS-MML', 'Multilayer blown film'], ['FTS-NCF', 'Non-conductive film'], ['FTS-WS', 'Woven fabric, up to 5100 mm'], ['FTS-3D', 'Moulded parts and pipes']],
    specs: ['500–5100 mm wide', 'up to 300 m/min', 'IGBT generators'],
    ind: ['Films', 'Printing', 'Lamination', 'Woven sacks', 'Cables & pipes'],
    how: ['Generator', 'HV transformer', 'Electrode', 'Treated film'],
    products: ['mnl', 'mnlaba', 'mml', 'mmlibc', 'cmbr', 'ncf', 'ws', '3d', 'cbl'] },
  { k: 'S', name: 'Fluxosealer', ac: 'S', vis: 'induction', photo: 'img/jars-hero.jpg', photoLbl: 'Jars under the sealing head', cut: 'img/cut-fluxosealer--brezo--2.webp', m3: 'brezo-2',
    subs: ['Brezo series', 'Aurae series'],
    list: [['Brezo P', 'Hand-held, 4–6 bottles/min'], ['Brezo A', 'Online, compact'], ['Brezo 2', 'Online, high speed'], ['Brezo 3C SS', 'Online, stainless'], ['Aurae 3', 'Heavy duty, water cooled']],
    specs: ['20–120 mm caps', 'up to 80 ft/min', 'air or water cooled'],
    ind: ['Food', 'Pharma', 'Dairy', 'Lubricants', 'Agro-chemicals'],
    how: ['Filled & capped', 'Coil field', 'Foil heats', 'Sealed rim'],
    products: ['brezop', 'brezoa', 'brezo2', 'brezo3', 'aurae3'] },
  { k: 'I', name: 'Simco-Ion', ac: 'I', vis: 'ions', photo: 'img/mood-simco-plastic.jpg', photoLbl: 'Application photo, not a product', cut: null,
    subs: ['IQ Power', 'IQ Easy'],
    list: [['IQ Power', 'Static neutralising system'], ['IQ Easy', 'Static neutralising bar']],
    specs: ['Authorised distributor', 'plastics & packaging'],
    ind: ['Film extrusion', 'Printing', 'Labelling', 'Form-fill-seal'],
    how: ['Charged web', 'Ion bar', 'Neutral web'],
    products: [] },
  { k: 'Pl', name: 'Plasmaright', ac: 'P', vis: 'plasma', photo: null, photoLbl: 'Drawn visual, photos to come', cut: null, ext: 'https://plasmaright.com/',
    subs: ['Textiles', 'Grains'],
    list: [['Plasmaright', 'Plasma treaters, on their own site']],
    specs: ['textiles', 'grains'],
    ind: ['Textiles', 'Grains'],
    how: ['Gas', 'Plasma', 'Treated surface'],
    products: [] }
];

/* One-question finders per door (answers route to real products on the site) */
const FINDER = {
  F: { q: 'What do you treat?', a: [
    ['Blown film, printing', ['mnl', 'mnlaba'], 'FTS-MNL for monolayer, FTS-MNL-ABA for A-B-A lines.'],
    ['Blown film, lamination', ['mml', 'mmlibc'], 'FTS-MML, or FTS-MML-IBC on IBC extruders.'],
    ['Film on a printing or laminating machine', ['ncf', 'cmbr'], 'FTS-NCF, or FTS-CM-BR for conductive film.'],
    ['Woven fabric', ['ws'], 'FTS-WS, up to 5100 mm wide with a pre-lump sensor.'],
    ['Moulded parts, pipes or cables', ['3d', 'cbl'], 'FTS-3D on an insulated conveyor, FTS-CBL for cables.'] ] },
  S: { q: 'How do you seal?', a: [
    ['By hand, low volume or lab', ['brezop'], 'Brezo P, hand-held, 4–6 bottles a minute.'],
    ['Online, compact line', ['brezoa'], 'Brezo A, compact, runs in ambient temperatures up to 45 °C.'],
    ['Online, high speed', ['brezo2', 'brezo3'], 'Brezo 2, or Brezo 3C SS for continuous filling and capping lines.'],
    ['Wide mouths, special caps, non-stop', ['aurae3'], 'Aurae 3, water cooled, heavy duty.'] ] },
  I: { q: 'What is the problem?', a: [
    ['Dust on film or packs', [], 'A Simco-Ion ionising bar such as IQ Easy near the problem point.'],
    ['Film clings or sheets stick', [], 'IQ Power, a monitored static neutralising system.'],
    ['Operators get shocks', [], 'Static elimination at the rewind or cutting station.'] ] }
};

const INDUSTRIES = [
  ['Films & flexible packaging', 'F I', 'film'], ['Printing & lamination', 'F I', 'print'], ['Woven sacks & fabric', 'F', 'fabric'],
  ['Moulded parts, pipes & cables', 'F', 'cable'], ['Food & edible oil', 'S', 'jar'], ['Dairy', 'S', 'bottle'],
  ['Pharmaceuticals', 'S', 'pill'], ['Cosmetics & personal care', 'S', 'tube'], ['Adhesives', 'S', 'drop'],
  ['Agro-chemicals', 'S', 'leaf'], ['Lubricants', 'S', 'can'], ['Detergents', 'S', 'bottle'],
  ['Plastics processing', 'I', 'film'], ['Textiles & grains', 'P', 'grain']
];

/* Client logos as shown on the current homepage; the site groups them by product. sector = our grouping for the filter. */
const CLIENTS = [
  ['Kabra ExtrusionTechnik', 'F', 'Packaging & film'], ['Huhtamaki', 'F', 'Packaging & film'], ['Larsen & Toubro', 'F', 'Engineering'], ['Windsor Machines', 'F', 'Packaging & film'],
  ['Zydus Cadila', 'F', 'Pharma'], ['Zubairi Plastics', 'F', 'Packaging & film'], ['Mantra Packaging', 'F', 'Packaging & film'], ['Kamakshi Flexiprint', 'F', 'Packaging & film'], ['Vishakha Polyfab', 'F', 'Packaging & film'],
  ['Marico', 'S', 'Food & consumer'], ['Pidilite', 'S', 'Chemicals & agro'], ['Castrol India', 'S', 'Oil & lubricants'], ['Mother Dairy', 'S', 'Food & consumer'], ['Adani Wilmar', 'S', 'Food & consumer'],
  ['Bayer Crop Science', 'S', 'Chemicals & agro'], ['Indian Oil', 'S', 'Oil & lubricants'], ['Bharat Petroleum', 'S', 'Oil & lubricants'], ['Hindustan Petroleum', 'S', 'Oil & lubricants'],
  ['Tide Water Oil (Veedol)', 'S', 'Oil & lubricants'], ['Rallis India', 'S', 'Chemicals & agro'], ['Atul', 'S', 'Chemicals & agro'], ['Alembic', 'S', 'Pharma'], ['Plethico Pharmaceuticals', 'S', 'Pharma'],
  ['Cargill', 'S', 'Food & consumer'], ['Areej', 'S', 'Food & consumer']
];
const LOGO = {
  'Kabra ExtrusionTechnik': 'Kabra_ExtrusionTechnik_Logo', 'Huhtamaki': 'Huhtamaki_Logo', 'Larsen & Toubro': 'Larsen__Toubro_Logo', 'Windsor Machines': 'Windsor_Machines_Logo',
  'Zydus Cadila': 'Zydus_Cadila_Logo', 'Zubairi Plastics': 'Zubairi_Plastics_Logo', 'Mantra Packaging': 'Mantra_Packaging_Logo', 'Kamakshi Flexiprint': 'Kamakshi_Flexiprint_Logo', 'Vishakha Polyfab': 'Vishakha_Polyfab_Logo',
  'Marico': 'Marico_Logo', 'Pidilite': 'Pidilite_Logo', 'Castrol India': 'Castrol_Logo', 'Mother Dairy': 'Mother_Dairy_Logo', 'Adani Wilmar': 'Adani_Wilmar_Logo', 'Bayer Crop Science': 'Bayer_Crop_Science_Logo',
  'Indian Oil': 'Indian_Oil_Logo', 'Bharat Petroleum': 'Bharat_Petroleum_Logo', 'Hindustan Petroleum': 'Hindustan_Petroleum_Logo', 'Tide Water Oil (Veedol)': 'Tide_Water_Oil_Veedol_Logo', 'Rallis India': 'Rallis_India_Logo',
  'Atul': 'Atul_Logo', 'Alembic': 'Alembic_Logo', 'Plethico Pharmaceuticals': 'Plethico_Pharmaceuticals_Logo', 'Cargill': 'Cargill_Logo', 'Areej': 'Areej_Logo',
  'Simco-Ion': 'Simco-Ion_Logo', 'Cezor': 'Cezor_logo', 'Anvertech': 'Anvertech_Logo'
};
/* as on the current site's "Our affiliations": logo and a link to their site, in the site's order */
const PARTNERS = [
  ['Anvertech', 'Affiliate', 'https://anvertechsolutions.com/', 'anvertechsolutions.com'],
  ['Cezor', 'Affiliate', 'https://www.cezor.in/', 'cezor.in'],
  ['Simco-Ion', 'Authorised distributor of Simco-Ion static eliminators', 'https://www.simco-ion.com/', 'simco-ion.com']
];

const STORY = [
  { yr: '1971', t: 'Founded in Mumbai', p: 'Built on the fundamentals set by the late Mr A G Moolji: precision and quality.' },
  { yr: '—', t: 'Milestone', p: 'First export installation, first Fluxosealer, or a new plant. Date and detail needed.', todo: true },
  { yr: '2021', t: '50 years', p: 'Celebrating 50 years of excellence, marked on the "Celebrating 50 years" Fluxosealer jar.' },
  { yr: '—', t: 'Milestone', p: 'Another milestone from Arshad’s history. Date and detail needed.', todo: true },
  { yr: 'Today', t: '10,000+ installations', p: 'Running in more than 35 countries, built in a 10,000 sq ft plant in Mahim, Mumbai.' }
];

const LOOKS = [
  ['light', 'All light', '#F5F5EF', '#576630', '#1B1F14'],
  ['lightdark', 'Light, dark hero', '#141810', '#576630', '#C9D5A2'],
  ['dark', 'All dark', '#11150C', '#AFBF80', '#2C3322'],
  ['green', 'Green blocks', '#576630', '#FFFFFF', '#F5F5EF'],
  ['sage', 'Sage tint', '#E4E6DE', '#576630', '#8C9671'],
  ['duotone', 'Green duotone', '#F3F4EE', '#576630', '#8C9671'],
  ['blueprint', 'Blueprint green', '#26301A', '#C9D2A6', '#47562F'],
  ['paper', 'Paper & ink', '#FFFFFF', '#101210', '#576630']
];
const FONTS = [
  ['logo', 'Logo match', 'Montserrat ExtraBold + Inter'],
  ['wide', 'Wide geometric', 'Archivo Expanded + Archivo'],
  ['raleway', 'Current site', 'Raleway throughout'],
  ['tech', 'Technical', 'Montserrat + Inter + Plex Mono'],
  ['manrope', 'Soft modern', 'Manrope throughout']
];
const SECTIONS = [
  ['hdr', 'Header', [['a', 'Bar + contact strip'], ['b', 'Floating pill'], ['c', 'Mega menu']]],
  ['hero', 'Hero + brand doors', [['a', 'Four doors'], ['b', 'Two big, two small'], ['c', 'Expanding panels'], ['d', 'Picker + stage']]],
  ['story', 'Brand story', [['a', 'Timeline'], ['b', 'Photo + motto'], ['c', 'Scroll chapters']]],
  ['proof', 'Proof numbers', [['a', 'Number row'], ['b', 'Dot globe'], ['c', 'Ticker band']]],
  ['ind', 'Industries', [['a', 'Chips + brands'], ['b', 'Matrix'], ['c', 'Icon tiles']]],
  ['why', 'Why Arshad', [['a', 'Four points'], ['b', 'Photo + list'], ['c', 'Motto first']]],
  ['cli', 'Clients', [['a', 'Split wall'], ['b', 'Marquee'], ['c', 'Filterable']]],
  ['par', 'Partners', [['a', 'Cards'], ['b', 'Logo row']]],
  ['help', 'Help me choose + FAQ', [['a', 'Wizard'], ['b', 'FAQ'], ['c', 'Both']]],
  ['con', 'Contact', [['a', 'Form + details'], ['b', 'Call-to-action band'], ['c', 'Card on a drawn map']]]
];
const BGS = [
  ['off', 'Off', 'Normal page'],
  ['line', 'Production line', 'Film runs past every machine'],
  ['bars', 'Logo-bar landscape', 'The logo’s bars in depth'],
  ['tunnel', 'Photo depth tunnel', 'Mood shots at depth'],
  ['field', 'Technical field', 'Grid, rulers, particles'],
  ['ions', 'Ion drift', 'Charges pairing up'],
  ['ribbon', 'Film ribbon', 'One flowing web'],
  ['topo', 'Contour lines', 'Slow green contours']
];

const BASE = { look: 'light', font: 'logo', text: 'neu', accents: 'on', simco: 'steel', plasma: 'green',
  hdr: 'a', hero: 'a', story: 'a', proof: 'a', ind: 'a', why: 'a', cli: 'a', par: 'a', help: 'c', con: 'a',
  motion: 'full', sheets: 'rise', parallax: 1, motif: 1, grain: 0, grid: 0, glow: 0, reveal: 1, dividers: 0,
  clPill: 1, clSpecs: 0, clInd: 0, clHow: 0,
  bar: 1, drawer: 1, rail: 0, fab: 1, search: 1, keys: 1, prog: 1,
  photos: 1, cuts: 1, logos: 1, m3d: 0, bg: 'off', review: 'on' };
const PRESETS = [
  ['clean', 'Clean light', 'Default. All light, four doors, timeline.', {}],
  ['darkhero', 'Dark hero', 'Picker + stage on a dark hero, scroll chapters, globe.', { look: 'lightdark', hero: 'd', story: 'c', proof: 'b', ind: 'b', why: 'b', cli: 'b', help: 'a', con: 'b', glow: 1, rail: 1 }],
  ['night', 'Night shift', 'All dark, technical type, expanding panels.', { look: 'dark', font: 'tech', hdr: 'b', hero: 'c', proof: 'c', ind: 'c', why: 'c', cli: 'c', con: 'c', grain: 1, grid: 1, sheets: 'stack' }],
  ['green', 'Green blocks', 'Bold logo-green bands, wide type.', { look: 'green', font: 'wide', hdr: 'c', hero: 'b', story: 'b', why: 'a', cli: 'a', help: 'c', con: 'b', dividers: 1 }],
  ['endless', 'Endless line', 'Separate option: sections float over one continuous production line.', { bg: 'line', sheets: 'flat', story: 'c', proof: 'a', hdr: 'b', rail: 1 }]
];

/* Ideas: two tracks. on = a state patch that shows it in the live page; status: in (built in lab), concept, need (needs material). */
const IDEAS = {
  ux: [
    ['doors', 'Smart brand doors', 'Hovering a door previews its range; a one-question finder suggests a series and adds it to the enquiry.', 'Hero', 'in', { hero: 'a' }],
    ['stage', 'Picker + live stage', 'Pick a brand on the left and a large animated stage on the right swaps to it, with the finder built in.', 'Hero', 'in', { hero: 'd' }],
    ['drawer', 'Product drawer + quick view', 'Doors open a side drawer with every product, a spec quick view and an "add to enquiry" button, without leaving the homepage.', 'Hero, search', 'in', { drawer: 1 }],
    ['bar', 'Enquiry bar that follows you', 'A bar appears after the hero, collects what you added and opens a pre-filled enquiry.', 'Whole page', 'in', { bar: 1 }],
    ['search', 'Search everything (/ or Ctrl K)', 'One box for products, FAQ answers and sections.', 'Header', 'in', { search: 1 }],
    ['fab', 'Call and WhatsApp buttons', 'Floating buttons that show the sales number with a copy button.', 'Whole page', 'in', { fab: 1 }],
    ['rail', 'Section rail', 'Dots down the side that show where you are and jump between sections.', 'Whole page', 'in', { rail: 1 }],
    ['layers', 'Visitor content layers', 'A "Layers" button lets visitors switch on specs, industries or how-it-works notes across the page.', 'Doors, sections', 'in', { clPill: 1, clSpecs: 1 }],
    ['wizard', 'Three-step "help me choose"', 'Industry → process → answer, ending in a named product and a pre-filled enquiry.', 'Help section', 'in', { help: 'a' }],
    ['faqsearch', 'FAQ with instant search', 'The site’s FAQ answers, grouped by product and filtered as you type.', 'Help section', 'in', { help: 'b' }],
    ['keys', 'Keyboard shortcuts + reduce motion', '? shows shortcuts; a footer switch turns animation down for visitors who prefer it.', 'Whole page', 'in', { keys: 1 }],
    ['prefill', 'Enquiry that writes itself', 'Choices from the finder, wizard and drawer arrive in the contact form as a ready message.', 'Contact', 'in', { con: 'a' }],
    ['recent', 'Welcome back', 'Returning visitors see the product family they looked at last, first.', 'Hero', 'concept', null],
    ['region', 'India or export contact', 'The contact block leads with the right number and hours for India or for export enquiries.', 'Contact', 'concept', null],
    ['service', 'Service and spares desk', 'A small form for existing customers: machine serial, problem, photo upload.', 'Contact', 'concept', null],
    ['hindi', 'English / हिंदी switch', 'Key pages in Hindi for plant teams.', 'Header', 'need', null]
  ],
  assets: [
    ['corona', 'Live corona discharge', 'Violet streamers flicker between electrode and roller, drawn over the real discharge photo or on their own.', 'Fluxomatic door', 'in', { photos: 1 }],
    ['field', 'Induction field pulse', 'Amber rings pulse from the sealing head as jars pass and their foil glows.', 'Fluxosealer door', 'in', {}],
    ['ions', 'Ion drift', 'Charged dust drifts until the ion bar pairs the charges up.', 'Simco-Ion door', 'in', {}],
    ['plasma', 'Plasma glow', 'A code-drawn plasma field stands in until Plasmaright photos arrive.', 'Plasmaright door', 'in', {}],
    ['bars', 'Logo-bar motif', 'The logo’s three stacked bars and slant become hero art, dividers and eyebrow marks.', 'Whole page', 'in', { motif: 1, dividers: 1 }],
    ['sheets', 'Layered sections', 'Sections rise over each other like stacked sheets as you scroll.', 'Whole page', 'in', { sheets: 'stack' }],
    ['timeline', 'Self-drawing timeline', 'The 1971 → today line draws itself as it comes into view.', 'Brand story', 'in', { story: 'a' }],
    ['globe', 'Dot globe', 'A slowly turning dot globe marks Mumbai; country markers wait for Arshad’s list.', 'Proof', 'in', { proof: 'b' }],
    ['count', 'Counting numbers', '10,000+, 35+ and 10,000 sq ft count up once when seen.', 'Proof', 'in', { proof: 'a' }],
    ['parallax', 'Depth parallax', 'Cut-outs, bars and photos move at different speeds for depth.', 'Hero, story', 'in', { parallax: 1 }],
    ['duotone', 'Green duotone photos', 'Every photo mapped to the logo greens so mixed shots look like one set.', 'Whole page', 'in', { look: 'duotone' }],
    ['texture', 'Grain, grid and glow', 'Fine film grain, a blueprint grid and a soft green glow, each switchable.', 'Whole page', 'in', { grain: 1, grid: 1, glow: 1 }],
    ['endless', 'Endless backgrounds', 'Seven continuous backgrounds with the sections floating above them.', 'Whole page', 'in', { bg: 'line' }],
    ['m3d', '3D machines (optional)', 'The code-built 3D models turn inside the Fluxomatic and Fluxosealer doors.', 'Hero', 'in', { m3d: 1 }],
    ['jar50', '"Celebrating 50 years" jar', 'Pulled from the camera raw file’s preview; a full-resolution conversion would be sharper.', 'Brand story', 'in', { story: 'b' }],
    ['video', 'Scroll-scrubbed line footage', 'A short clip of a real line (jars through the sealer, corona glow in a dim room) scrubbed by scroll.', 'Hero or story', 'need', null],
    ['icons', 'Machine silhouette icons', 'Simple line icons traced from each cut-out for menus and the drawer.', 'Menus, drawer', 'concept', null],
    ['plasmaph', 'Plasmaright photography', 'Real photos to replace the drawn plasma visual.', 'Plasmaright door', 'need', null]
  ]
};

const KIT = {
  swatches: [
    ['Brand green', '#576630', 'The logo. Buttons, links, key headings, marks.'],
    ['Deep green', '#3A4520', 'Hover and pressed states, dark bands.'],
    ['Ink', '#1B1F14', 'Body text. A green-tinted black instead of pure black.'],
    ['Olive tint', '#8C9671', 'From the circle logo edge. Lines, icons, glows.'],
    ['Sage', '#C0C6B2', 'Borders on dark, soft fills.'],
    ['Mist', '#E4E6DE', 'Section bands, the sage-tint look.'],
    ['Paper', '#F5F5EF', 'Default page background.'],
    ['Corona violet', '#7157B8', 'Accent for Fluxomatic only. Thin labels and underlines.'],
    ['Induction amber', '#A86E16', 'Accent for Fluxosealer only. Thin labels and underlines.'],
    ['Steel', '#5F6B72', 'Proposed accent for Simco-Ion (open question).']
  ],
  facts: [
    ['Company', 'Arshad Electronics Pvt. Ltd.'], ['Since', '1971, Mumbai'], ['Legacy', 'Built on the fundamentals of the late Mr A G Moolji; celebrating 50 years of excellence'],
    ['Address', '305, Hammersmith Industrial Estate, Mahim, Mumbai, India'], ['Phones', '+91 22 2445 1709 · +91 22 2446 2628 · +91 90046 17373'], ['Email', 'sales@arshadelectronics.com'],
    ['Motto', 'Quality only happens when you care enough to do your best.'], ['Numbers', '10,000+ installations · 35+ countries · 10,000 sq ft plant'],
    ['Brands', 'Fluxomatic (corona treaters) · Fluxosealer (induction cap sealers) · Simco-Ion (authorised distributor) · Plasmaright (plasma)'],
    ['Taglines', '“Achieve better bonding for long-lasting printability and lamination” · “Keep your product fresh, safe and secure!”'],
    ['Current font', 'Raleway on almost every text element']
  ],
  current: ['Header: email, phone, menu (Home, About us, Products, FAQ’s, Contact)', '"What we do?": 50 years, the late Mr A G Moolji', 'Three services: corona, induction, static', '"Solutions for printing & packaging", 35+ countries', 'Statistics: 10,000+ installations, 35+ countries', 'Motto', 'Quality: in-house, QC, after-sales, 10,000 installations, 10,000 sq ft, user friendly', 'Esteemed clients: 25 logos', 'Affiliations: Anvertech, Cezor, Simco-Ion', '"Feel free to get in touch with us!"'],
  issues: ['No product picture near the top; the page opens on text.', '"10,000" appears twice with two meanings (installations and square feet).', 'Installations and countries are stated in three places.', 'Headings are questions in mixed caps ("WHAT WE DO?").', 'Plasmaright is in the menu but missing from the three services.', 'No way to tell which product fits before contacting.']
};

return { P, T, BRANDS, FINDER, INDUSTRIES, CLIENTS, LOGO, PARTNERS, STORY, LOOKS, FONTS, SECTIONS, BGS, BASE, PRESETS, IDEAS, KIT };
})();
