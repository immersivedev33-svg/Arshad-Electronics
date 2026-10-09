/* Product content for the page lab. Everything here is taken from arshadelectronics.com
   (product pages, hubs, FAQ, home) as read on 23–26 Sep 2026. null = not published on the site.
   flag = figure published on the site that needs Arshad to confirm (see the catalog). */
window.PD = (function(){
const FILM_SAFE6 = ['Zero speed cut off','Active spark protection','Over temperature cut off','Single phase preventer','Speed to power','Door open cut off with audio / visual alarm'];
const FLUX_KIT = 'Generator, oil-cooled HV transformer, pneumatic electrode assembly, ozone extraction';
return {
company: {
  name: 'Arshad Electronics Pvt. Ltd.', since: 1971,
  addr: '305, Hammersmith Industrial Estate, Mahim, Mumbai, India',
  phones: ['+91 22 2445 1709', '+91 22 2446 2628', '+91 90046 17373'], email: 'sales@arshadelectronics.com',
  claims: [[10000, '+', 'installations worldwide'], [35, '+', 'countries'], [10000, ' sq ft', 'manufacturing facility'], [1971, '', 'founded in Mumbai']],
  story: 'Built on the fundamentals set by the late Mr A G Moolji, and celebrating 50 years of excellence.',
  motto: 'Quality only happens when you care enough to do your best.',
  promise: ['In-house manufacturing', 'Quality control', 'After-sales service']
},
corona: {
  line: 'Better bonding for long-lasting printability and lamination.',
  what: 'A high-voltage, high-frequency discharge between an electrode and an earthed, dielectric-covered roller ionises the air. The nascent oxygen oxidises the film surface and raises its surface energy, so inks, coatings and adhesives wet out and bond.',
  lasting: 'Treatment lasts up to about a month, depending on formulation, before the surface drifts back toward its original dyne level.',
  benefits: ['Better print quality', 'Faster press speeds', 'Less scrap', 'Better bondability, wettability and printability', 'Continuous treatment in a single step', 'Low power use with IGBT generators', 'Easy to run and service'],
  substrates: ['Monolayer film', 'Multilayer film', 'Metallised film', 'Cast film', 'BOPP', 'Woven fabric', 'Polyester'],
  applications: ['Blown film', 'Printing and UV coating', 'Aseptic packaging', 'Lamination and coating', 'Sheet extrusion'],
  system: [['Generator', 'IGBT, sized to your film, width and speed'], ['HV transformer', 'Oil-cooled, steps the output up to electrode voltage'], ['Electrode assembly', 'Pneumatic, key or fin type, micro gap adjustment'], ['Ozone extraction', 'Draws the ozone away from the operator']],
  needs: ['Material', 'Application', 'Maximum width', 'Number of sides treated', 'Maximum line speed', 'Gauge range'],
  formula: 'Power = sides × width × line speed × change in dyne level × A / 1000'
},
sealing: {
  line: 'Keep your product fresh, safe and secure.',
  what: 'After filling and capping, an electromagnetic field heats the aluminium foil liner inside the cap. The polymer coating on the foil melts and bonds to the container rim, leaving an airtight, tamper-evident seal. No contact with the product.',
  benefits: ['Leak-proof sealing', 'Tamper evident', 'Longer shelf life', 'Airtight hermetic seal', 'Protects freshness and integrity', 'Builds customer confidence'],
  industries: ['Food', 'Cosmetics and personal care', 'Pharmaceuticals', 'Adhesives', 'Dairy', 'Agro-chemicals', 'Detergents', 'Lubricants'],
  containers: ['HDPE / LDPE bottles', 'PET bottles', 'PP jars and bottles', 'Glass bottles'],
  factors: [['Foil structure', '20–35 gsm recommended'], ['Neck surface', 'Uniform, flat rim'], ['Neck diameter', 'Within the head’s cap range'], ['Dwell time', 'Time spent under the coil'], ['Closure torque', 'Even pressure on the liner']]
},
clients: { sealing: ['Adani Wilmar', 'Pidilite', 'Castrol India', 'Mother Dairy', 'Marico', 'Intas Pharmaceuticals', 'Indian Oil'],
  corona: ['Larsen & Toubro', 'Zydus Cadila', 'Huhtamaki'], more: ['Bharat Petroleum', 'Alembic', 'Bayer CropScience'] },
faq: {
  corona: [
    ['What is corona treatment?', 'High voltage at high frequency is applied between a conducting electrode and an earthed, dielectric-covered roller. The air ionises into a corona discharge, and its nascent oxygen oxidises the film so it is ready for printing, lamination or coating.'],
    ['What do you need from us to size a treater?', 'Material, application, maximum width, number of sides treated, maximum line speed and gauge range. Generator power follows: power = sides × width × line speed × change in dyne level × A / 1000.'],
    ['What makes up a treater system?', 'A generator, a high-voltage transformer, the electrode assembly and ozone extraction. Systems are built for non-conductive or conductive film; electrode design matters more than raw generator power.'],
    ['How long does treatment last?', 'Up to about a month depending on formulation, after which the surface drifts back toward its original dyne level.']],
  sealing: [
    ['What is induction cap sealing?', 'After filling and capping, an aluminium foil disc in the cap is heated electromagnetically and sealed evenly onto the container rim while the cap stays on.'],
    ['Is an induction seal strong?', 'Yes, with the right equipment. Arshad encourages drop tests and seal-strength checks, especially for products that travel rough roads.'],
    ['Why is induction sealing better?', 'Leak-proof, airtight, pilfer-proof and tamper evident, with longer shelf life and more customer confidence.'],
    ['What decides a good seal?', 'Five things: foil structure (20–35 gsm recommended), a uniform neck surface, neck diameter, dwell time under the coil, and closure torque.'],
    ['What can be induction sealed?', 'Any capped container with a uniform mouth: HDPE/LDPE bottles, PET bottles, polypropylene jars and bottles, and glass bottles.']]
},
simco: {
  line: 'Authorised Simco-Ion distributor in India.',
  plastics: ['Laminating', 'Blow moulding', 'Film extrusion', 'Thermoforming', 'In-mould labelling', 'Injection moulding', 'Chill roll pinning', 'Trim collection'],
  packaging: ['Bottling', 'Labelling', 'Over-wrapping', 'Package printing', 'Form-fill-seal'],
  products: [['IQ Power', 'Static neutralising system', 'For plastics and packaging lines that need controlled, monitored static elimination.'], ['IQ Easy', 'Static neutralising bar', 'An ionising bar for the same plastics and packaging applications.']]
},
P: {
  mnl: { name: 'FTS-MNL', sub: 'Monolayer blown film', desc: 'Corona treater for monolayer blown film, for printing.', img: 'cut-fluxomatic-cdt--mnl.webp', m3: 'cdt-mnl', w: [500, 1100], v: 40, app: ['Printing'],
    spec: [['Width', '500 – 1100 mm'], ['Line speed', '40 m/min (printing)'], ['Components', 'Generator, oil-cooled HV transformer, pneumatic electrode assembly'], ['Input supply', null], ['Generator power', null]],
    variants: [['Key electrode', 'skip treatment'], ['Fin electrode', 'fixed treatment']],
    feats: ['Key-type electrodes for skip treatment, fin-type for fixed treatment', 'Aluminium rollers with a pure dielectric, ozone-resistant sleeve', 'Entry and exit guide rollers'],
    safety: ['Zero speed cut off', 'Active spark protection', 'Door open cut off'] },
  mnlaba: { name: 'FTS-MNL-ABA', sub: 'A-B-A blown film', desc: 'Corona treater for A-B-A blown film extruders, for printing.', img: 'cut-fluxomatic-cdt-mnl-aba.webp', m3: 'cdt-mnl-aba', w: [500, 1100], v: 80, app: ['Printing'],
    spec: [['Width', '500 – 1100 mm'], ['Line speed', '80 m/min (printing)'], ['Components', FLUX_KIT], ['Input supply', null], ['Generator power', null]],
    variants: [['Key electrode', 'skip treatment'], ['Fin electrode', 'fixed treatment']],
    feats: ['Key-type electrodes for skip treatment, fin-type for fixed treatment', 'Aluminium rollers with a dielectric, ozone-resistant sleeve', 'Entry and exit guide rollers'],
    safety: ['Zero speed cut off', 'Active spark protection', 'Door open cut off with audio / visual alarm'] },
  mml: { name: 'FTS-MML', sub: 'Multilayer blown film', desc: 'Corona treater for multilayer blown film extruders, for lamination.', img: 'cut-fluxomatic-cdt--mml.webp', m3: 'cdt-mml', w: [1100, 2600], v: 80, app: ['Lamination'],
    spec: [['Width', '1100 – 2600 mm'], ['Line speed', '80 m/min (lamination)'], ['Components', FLUX_KIT], ['Input supply', null], ['Generator power', null]],
    variants: [], feats: ['Fin-type electrodes for fixed treatment, micro gap adjustment', 'Dynamically balanced aluminium rollers, dielectric ozone-resistant sleeve', 'Entry and exit guide rollers'], safety: FILM_SAFE6 },
  mmlibc: { name: 'FTS-MML-IBC', sub: 'IBC blown film', desc: 'Corona treater for internal-bubble-cooling blown film extruders, for lamination.', img: 'cut-fluxomatic-cdt--mml-ibc-2.webp', m3: 'cdt-mml-ibc', w: [1100, 2600], v: 120, app: ['Lamination'],
    spec: [['Width', '1100 – 2600 mm'], ['Line speed', '120 m/min (lamination)'], ['Components', FLUX_KIT], ['Input supply', null], ['Generator power', null]],
    variants: [], feats: ['Fin-type electrodes, micro gap adjustment', 'Dynamically balanced aluminium rollers, dielectric sleeve', 'Entry and exit guide rollers'], safety: FILM_SAFE6 },
  cmbr: { name: 'FTS-CM-BR', sub: 'Conductive and non-conductive film', desc: 'Corona treater for conductive and non-conductive film on lamination and printing machines, in two electrode models.', img: 'cut-fluxomatic-cdt-cm--br.webp', m3: 'cdt-cm-br-a', w: [500, 1700], v: 300, app: ['Lamination', 'Printing'], conductive: true,
    spec: [['Width', '500 – 1700 mm'], ['Line speed', '300 m/min'], ['Components', FLUX_KIT], ['Input supply', null], ['Generator power', null]],
    variants: [['CM', 'ceramic electrodes, micro gap adjustment'], ['BR', 'externally driven silicone roller electrodes']],
    feats: ['Dynamically balanced aluminium rollers with external drive, synchronised to machine speed', 'Entry and exit guide rollers'], safety: FILM_SAFE6 },
  ncf: { name: 'FTS-NCF', sub: 'Non-conductive film', desc: 'Corona treater for non-conductive film on lamination, coating and printing machines.', img: 'cut-fluxomatic-cdt-ncf.webp', m3: 'cdt-ncf-station', w: [500, 1700], v: 300, app: ['Lamination', 'Coating', 'Printing'],
    spec: [['Width', '500 – 1700 mm'], ['Line speed', '300 m/min (lamination)'], ['Components', FLUX_KIT], ['Input supply', null], ['Generator power', null]],
    variants: [], feats: ['Fin-type electrodes, micro gap adjustment', 'Dynamically balanced aluminium rollers, dielectric sleeve', 'Entry and exit guide rollers'], safety: FILM_SAFE6 },
  ws: { name: 'FTS-WS', sub: 'Woven fabric', desc: 'Corona treater for woven fabric on lamination, coating and printing machines, with a pre-lump sensor that protects the electrodes.', img: 'cut-fluxomatic-cdt-ws.webp', m3: 'cdt-ws', w: [500, 5100], v: 300,
    spec: [['Width', '500 – 5100 mm'], ['Line speed', '300 m/min (lamination)'], ['Interlock', 'PLC based safety interlock system'], ['Components', FLUX_KIT], ['Input supply', null], ['Generator power', null]],
    variants: [], feats: ['Fin-type electrodes, micro gap adjustment', 'Dynamically balanced aluminium rollers, dielectric sleeve', 'Entry and exit guide rollers', 'Pre-lump sensor to avoid electrode breakage'], safety: FILM_SAFE6 },
  '3d': { name: 'FTS-3D', sub: 'Moulded articles and pipes', desc: 'Treats flat plastic moulded articles and pipes before printing, on an insulated conveyor customised for flat or round objects.', img: 'cut-fluxomatic-cds-3d.webp', m3: 'cds-3d',
    spec: [['Object size range', null], ['Line speed', '300 m/min', 'flag'], ['Components', 'Generator, oil-cooled HV transformer, electrode assembly, ozone extraction'], ['Interlock', 'PLC based safety interlock system'], ['Conveyor', 'Insulated, customised for flat or round objects'], ['Input supply / power', null]],
    variants: [['Flat', 'moulded articles'], ['Round', 'pipes']], feats: ['Customised insulated conveyor'], safety: ['Zero speed cut off', 'Active spark protection', 'Door open cut off with audio / visual alarm'] },
  cbl: { name: 'FTS-CBL', sub: 'Cables', desc: 'Treats cables before ink-jet printing.', img: null, m3: null,
    spec: [['Cable diameter range', null], ['Line speed', '300 m/min', 'flag'], ['Components', 'Generator, oil-cooled HV transformer, electrode assembly, ozone extraction'], ['Input supply / power', null]],
    variants: [], feats: [], safety: ['Zero speed cut off', 'Active spark protection', 'Door open cut off with audio / visual alarm'] },
  brezop: { name: 'Brezo P', sub: 'Manual, hand-held', desc: 'Manual hand-held induction cap sealer for low volumes and laboratories. Upgradeable; an optional stand holds the head at a set height.', img: 'cut-fluxosealer--brezo--p.webp', m3: 'brezo-p', cool: 'Air', cap: [28, 83], bpm: [4, 6], ftmin: null,
    spec: [['Type', 'Air cooled'], ['Input', '230 V AC, 5 A, 50 Hz'], ['Output', '4 – 6 bottles/min'], ['Cap diameter', '28 – 83 mm'], ['Head height', '0 – 350 mm, adjustable'], ['MOC', 'Mild steel, powder-coated'], ['Power rating', null], ['Dimensions / weight', null]],
    variants: [['Hand-held', 'standard'], ['With stand', 'V-stop bottle centring guide, optional'], ['Foot pedal', 'manual sealing switch, optional']],
    feats: ['Digital height indicator with position lock', 'PU castor wheels', 'Levelling feet', 'Keypad control', 'Runs at ambient temperature'], safety: [] },
  brezoa: { name: 'Brezo A', sub: 'Online, compact', desc: 'Compact online sealer that runs in ambient temperatures up to 45 °C, with microprocessor control.', img: 'cut-fluxosealer--brezo--a.webp', m3: 'brezo-a', cool: 'Air', cap: [20, 120], ftmin: 30,
    spec: [['Type', 'Air cooled'], ['Input', '230 V AC, 10 A, 50 Hz'], ['Line speed', '30 ft/min', 'flag'], ['Cap diameter', '20 – 120 mm'], ['MOC', 'MS powder-coated or SS 304'], ['Power rating', null], ['Dimensions / weight', null]],
    variants: [['MS', 'powder-coated'], ['SS 304', 'stainless'], ['+ Conveyor', 'slat chain, optional'], ['+ Rejection', 'pneumatic no-foil rejection, optional']],
    feats: ['No-foil detection', 'Easy line relocation', 'Plug and play'], safety: ['Microprocessor based safety interlock (optional)'] },
  brezo2: { name: 'Brezo 2', sub: 'Online, high speed', desc: 'Compact high-speed online sealer with micro-controlled technology.', img: 'cut-fluxosealer--brezo--2.webp', m3: 'brezo-2', cool: 'Air', cap: [20, 120], ftmin: 60,
    spec: [['Type', 'Air cooled'], ['Input', '230 V AC, 10 A, 50 Hz'], ['Line speed', '60 ft/min', 'flag'], ['Cap diameter', '20 – 120 mm'], ['MOC', 'MS powder-coated or SS 304'], ['Power rating', null], ['Dimensions / weight', null]],
    variants: [['MS', 'powder-coated'], ['SS 304', 'stainless'], ['+ Conveyor', 'slat chain, optional'], ['+ Rejection', 'pneumatic no-foil rejection, optional'], ['+ Loose cap', 'loose cap detector, optional']],
    feats: ['No-foil detection', 'Easy line relocation', 'Plug and play'], safety: ['PLC / microprocessor safety interlock (optional)', 'Stalled bottle interlock (optional)'] },
  brezo3: { name: 'Brezo 3C SS', sub: 'Online, high speed, stainless', desc: 'High-speed online sealer for continuous filling and capping lines. Heating is preset to line speed and bottle diameter; head height adjusts to the bottle.', img: 'cut-fluxosealer--brezo--3css.webp', m3: 'brezo-3css', cool: 'Air', cap: [20, 120], ftmin: 80, ftminLo: 60,
    spec: [['Input', '230 V AC, 1-phase, 50 Hz, 15 A'], ['Sealing speed', '60 – 80 ft/min'], ['Neck diameter', '20 – 120 mm'], ['MOC', 'SS 304 enclosure'], ['Max power', '2000 W'], ['Panel footprint', '800 × 800 × 1500 mm'], ['Conveyor', '1500 mm long, 850 ± 50 mm high, 150 mm Delrin slats, 0 – 50 ft/min, ¼ HP with VFD', 'flag'], ['Conveyor footprint', '1500 × 400 × 900 mm']],
    variants: [['3C SS', 'stainless enclosure'], ['SS slat chain', 'instead of Delrin slats, optional']],
    feats: ['No-foil detection', 'Easy line relocation', 'Plug and play', 'Modular tower light for fault indication'],
    safety: ['No wad detector with bottle rejection', 'Auto on / off', 'Low / high voltage protection', 'Low / high current indication', 'Stalled bottle interlock', 'Production / reject counter'] },
  aurae3: { name: 'Aurae 3', sub: 'Heavy duty, water cooled', desc: 'Heavy-duty water-cooled sealer for high speeds, wide-mouth containers and special caps.', img: 'cut-fluxosealer--aurae3.webp', m3: 'aurae-3', cool: 'Water', cap: [20, 120], ftmin: 80,
    spec: [['Type', 'Water cooled'], ['Input', '230 V AC, 10 A, 50 Hz'], ['Line speed', '80 ft/min', 'flag'], ['Cap diameter', '20 – 120 mm', 'flag'], ['MOC', 'MS powder-coated or SS 304'], ['Chiller', null], ['Power rating', null], ['Dimensions / weight', null]],
    variants: [['MS', 'powder-coated'], ['SS 304', 'stainless'], ['+ Conveyor', 'slat chain, optional'], ['+ Rejection', 'pneumatic no-foil rejection, optional']],
    feats: ['No-foil detection', 'Easy line relocation', 'Plug and play'], safety: ['PLC based safety interlock (optional)'] }
}
};
})();
