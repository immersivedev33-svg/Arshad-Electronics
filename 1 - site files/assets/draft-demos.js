/* Arshad site draft 1 (dark): demos added in round 2 (9 Oct 2026).
   pen: the dyne pen from the Dynamic asset demos lab (labs-archive/07), restyled for the dark site.
   Draw across the film: ink beads up on the untreated half and lays flat on the corona-treated half. */
window.DRAFTX = (() => {
  'use strict';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function pen(r){
    const cv = r.querySelector('#fmPen'); if (!cv) return;
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const INK = '#79AEFF', SHINE = 'rgba(255,255,255,.5)';
    let segs = [], beads = [], drawing = false, last = null, dist = 0, user = false, W = 0;
    const auto = { t: 0, prev: null, fade: 1 };
    const sec = () => performance.now() / 1000;
    const pt = e => { const b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    function addInk(a, b, isAuto){
      if ((a.x + b.x) / 2 < W / 2){
        dist += Math.hypot(b.x - a.x, b.y - a.y);
        while (dist > 14){ dist -= 14; beads.push({ x: b.x, y: b.y + (Math.random() - 0.5) * 3, r: 4.5 + Math.random() * 4, born: sec(), auto: isAuto }); }
      } else segs.push({ a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y }, auto: isAuto });
    }
    cv.addEventListener('pointerdown', e => { if (!user){ user = true; segs = []; beads = []; } drawing = true; last = pt(e); dist = 0; try { cv.setPointerCapture(e.pointerId); } catch (x){} lp.kick(); });
    cv.addEventListener('pointermove', e => { if (!drawing) return; const q = pt(e); addInk(last, q, false); last = q; lp.kick(); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => cv.addEventListener(ev, () => { drawing = false; }));
    const lp = window.PU.loop(cv, (ctx, w, h, t, dt) => {
      W = w; const now = sec();
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#1A2012'; ctx.fillRect(0, 0, w / 2, h);
      ctx.fillStyle = '#211D33'; ctx.fillRect(w / 2, 0, w / 2, h);
      ctx.fillStyle = '#9D7BFF'; ctx.globalAlpha = 0.75; ctx.fillRect(w / 2, 0, w / 2, 3); ctx.globalAlpha = 1;
      ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(201,213,162,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = '600 13px "IBM Plex Mono", monospace'; ctx.fillStyle = '#C9D0B6'; ctx.textAlign = 'left';
      ctx.fillText('Untreated', 16, 26); ctx.fillText('Corona treated', w / 2 + 16, 26);
      // until the visitor draws, a pen draws a sample line across both halves, then it fades and repeats
      if (!user && !RM && dt > 0){
        auto.t += dt;
        if (auto.t < 3){
          const u = auto.t / 3, cur = { x: w * (0.06 + 0.88 * u), y: h * (0.56 + 0.14 * Math.sin(u * Math.PI * 4)) };
          if (auto.prev) addInk(auto.prev, cur, true); auto.prev = cur; auto.fade = 1;
          ctx.fillStyle = '#E6EAD9'; ctx.beginPath(); ctx.arc(cur.x, cur.y - 12, 5, 0, Math.PI * 2); ctx.fill();
        } else if (auto.t > 4.5 && auto.t < 5.5) auto.fade = 1 - (auto.t - 4.5);
        else if (auto.t >= 5.5){ segs = segs.filter(s => !s.auto); beads = beads.filter(b => !b.auto); auto.t = 0; auto.prev = null; dist = 0; auto.fade = 1; }
      }
      ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.lineCap = 'round';
      for (const s of segs){ ctx.globalAlpha = s.auto ? auto.fade : 1; ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.stroke(); }
      for (const b of beads){
        const k = RM ? 1 : clamp((now - b.born) / 0.5, 0, 1);
        ctx.globalAlpha = b.auto ? auto.fade : 1;
        ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * (1.6 - 0.75 * k), b.r * (0.55 + 0.3 * k), 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = SHINE; ctx.globalAlpha *= k; ctx.beginPath(); ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.22, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
    const clr = r.querySelector('#fmPenClear'); if (clr) clr.addEventListener('click', () => { segs = []; beads = []; user = true; lp.kick(); });
  }
  return { pen };
})();
