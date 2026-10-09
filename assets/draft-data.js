/* Arshad site draft 1 (dark): content rules applied to the shared data before the pages are built (decision Q5).
   Only what arshadelectronics.com publishes is shown: rows with no published value are dropped (not "On request"),
   the lab's "Arshad to confirm" flags are removed, and placeholder milestones are left out. */
(() => {
  const D = window.PD, H = window.HD;
  Object.values(D.P).forEach(p => {
    if (Array.isArray(p.spec)) p.spec = p.spec.filter(r => r[1] != null && r[1] !== '').map(r => [r[0], r[1]]);
  });
  // homepage story: no "Date and detail needed" milestones; 2021 is not a year the site gives (it says "celebrating 50 years")
  H.STORY = H.STORY.filter(m => !m.todo).map(m => m.yr === '2021' ? Object.assign({}, m, { yr: '50 years' }) : m);

  /* round 2: product descriptions, features and safety lists in the live product pages' own words
     (arshadelectronics.com, read 9 Oct 2026; spelling and grammar tidied, nothing added) */
  const KIT = 'It consists of the generator, an oil-cooled high voltage transformer, a pneumatic operated electrode assembly and an ozone extraction system.';
  const SLEEVE = 'Aluminium rollers are covered with a pure dielectric, ozone-resistant sleeve for long life';
  const BAL = 'Aluminium rollers are dynamically balanced, covered with a pure dielectric, ozone-resistant sleeve for long life';
  const GUIDE = 'Guide rollers for entry and exit of film';
  const FIN = 'Easy to maintain fin type electrodes for fixed treatment and micro gap adjustments';
  const SAFE6 = ['Zero speed cut off', 'Active spark protection', 'Over temperature cut off', 'Single phase preventer', 'Speed to power', 'Assembly door open cut off with audio / visual alarm'];
  const SEAL3 = ['No foil detection system', 'Easy line relocation', 'Plug and play system'];
  const T = {
    mnl: { desc: 'The FTS-MNL series corona treatment system is designed for monolayer blown films. It consists of a generator, an oil-cooled high voltage transformer and a pneumatic operated electrode assembly.',
      feats: ['Key type electrodes for skip treatment and fin type electrodes for fixed treatment', SLEEVE, GUIDE],
      safety: ['Zero speed cut off', 'Active spark protection', 'Assembly door open cut off'] },
    mnlaba: { desc: 'The FTS-MNL-ABA series is specially designed for A-B-A blown film extruders. ' + KIT,
      feats: ['Key type electrodes for skip treatment and fin type electrodes for fixed treatment', SLEEVE, GUIDE],
      safety: ['Zero speed cut off', 'Active spark protection', 'Assembly door open cut off with audio / visual alarm'] },
    mml: { desc: 'The FTS-MML series is designed for multilayer blown film extruders. ' + KIT, feats: [FIN, BAL, GUIDE], safety: SAFE6 },
    mmlibc: { desc: 'The FTS-MML-IBC series is designed for IBC blown film extruders. ' + KIT, feats: [FIN, BAL, GUIDE], safety: SAFE6 },
    cmbr: { desc: 'The FTS-CM-BR series is designed for conductive and non-conductive films on lamination and printing machines. ' + KIT,
      variants: [['CM model', 'ceramic electrode system with micro gap adjustment'], ['BR model', 'silicone roller electrodes, driven externally']],
      feats: ['Aluminium rollers are dynamically balanced, with an external drive arrangement for synchronising with machine speed', GUIDE], safety: SAFE6 },
    ncf: { desc: 'The FTS-NCF series is designed for non-conductive films on lamination, coating and printing machines. ' + KIT, feats: [FIN, BAL, GUIDE], safety: SAFE6 },
    ws: { desc: 'The Fluxomatic FTS-WS corona discharge treater is designed for woven fabric on lamination, coating and printing machines. ' + KIT,
      feats: ['Easy to maintain fin type electrodes for fixed treatment and micro gap adjustment', BAL, 'Guide rollers for entry and exit of the fabric', 'A pre-lump sensor arrangement is incorporated to avoid breakage of electrodes'], safety: SAFE6 },
    '3d': { desc: 'The FTS-3D system is used for treatment on flat plastic moulded articles and pipes prior to printing. It consists of the generator, an oil-cooled high voltage transformer, an electrode assembly and an ozone extraction system.',
      feats: ['An insulated, customised conveyor system is provided for flat or round objects'] },
    cbl: { desc: 'The FTS-CBL system is used for treatment on cables prior to ink-jet printing. It consists of the generator, an oil-cooled high voltage transformer, an electrode assembly and an ozone extraction system.' },
    brezop: { desc: 'The Brezo P series is a manual, hand-held induction cap sealer that is suitable for low production volumes and laboratory use. The sturdy design makes it a versatile induction cap sealer that can be upgraded if required. It is also available with an optional stand that holds the sealing head at a set height, with an arrangement to place the container in the centre of the sealing head.',
      feats: ['Digital height position indicator with position lock', 'Adjustable height of sealing coil head: 0 – 350 mm', 'Castor PU wheels for easy movement of the machine', 'Levelling feet pads keep the machine level and secured to the floor', 'Keypad control interface', 'Ambient operating temperature'] },
    brezoa: { desc: 'The air-cooled Fluxosealer® Brezo A is an online induction cap sealer that is compact and reliable. It is the most practical choice as it can operate under ambient temperatures of up to 45 °C. The elegant design, microprocessor technology and flexibility of use make this cap sealer a perfect choice.',
      feats: SEAL3 },
    brezo2: { desc: 'The air-cooled Fluxosealer® Brezo 2 is an online, high-speed induction cap sealer that is compact and reliable. It is designed for high production output and equipped with advanced micro-controlled technology for better productivity and compliance. The elegant design, microprocessor technology and flexibility of use make this cap sealer a perfect choice.',
      feats: SEAL3 },
    brezo3: { desc: 'The Arshad Fluxosealer™ Brezo 3C SS is a high-speed, air-cooled online induction cap sealing machine used on a continuous production filling and capping line. Its induction sealing head unit sits over the line conveyor and seals each bottle as it passes underneath, by a non-contact electromagnetic heating process. Heating is controlled from the control panel and preset to the line speed and bottle diameter; the sealing head height adjusts to let the bottle pass.',
      feats: SEAL3.concat('Modular tower light for fault indication'),
      safety: ['No wad detector with bottle rejection system', 'Auto on / off system', 'Low / high voltage protection', 'Low / high current indication', 'Stalled bottle interlock', 'Production / reject bottle counter'] },
    aurae3: { desc: 'The Fluxosealer® Aurae 3 is a heavy-duty, water-cooled induction cap sealer for high speed and special sealing applications, for wide-mouth containers and special caps. It is designed for high production output on larger cap diameters, and extreme high speeds on smaller ones.',
      feats: SEAL3 }
  };
  Object.keys(T).forEach(k => Object.assign(D.P[k], T[k]));

  // Simco-Ion: the live page's own wording and full process lists
  D.simco.line = 'Authorised distributor for Simco-Ion products in India.';
  D.simco.plastics = ['Laminating', 'Blow moulding', 'Film extrusion', 'Thermoforming', 'In-mould labelling', 'Injection moulding', 'Chill roller pinning', 'Trim collection', 'Coating'];
  D.simco.packaging = ['Bottling', 'Labelling', 'Trim collection', 'Over-wrapping', 'Thermoforming', 'Package printing', 'Form, fill and seal'];
  D.simco.products = [['IQ Power', 'Static neutralising system', 'A static neutralising system, suitable for plastic and packaging solutions.'], ['IQ Easy', 'Static neutralising bar', 'A static neutralising bar, suitable for plastic and packaging solutions.']];
  D.simco.plasticsP = 'In the plastics industry static charge can cause machines to jam, parts to stick to each other, and contamination which can increase product defects that waste time and money. Materials are becoming increasingly thin and sensitive, while processes are becoming faster and leaner. Simco-Ion solves problems for a variety of plastics applications by offering custom static control, contamination control and web cleaning solutions.';
  D.simco.packagingP = 'Static charges can cause issues in many areas of packaging processes. Contamination control, quality problems, operator safety and process control are all areas of concern, and are becoming more relevant as regulations become more stringent. Simco-Ion provides solutions for your static problems with a variety of static control and contamination eliminating products.';
})();
