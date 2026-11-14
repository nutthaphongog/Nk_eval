/* NK ELITE ACADEMY - ส่วนเสริม: แดชบอร์ด (แอดมิน) + ตารางการแข่งขัน (แอดมินแก้ได้ / หน้าสาธารณะดูอย่างเดียว)
   ใช้ร่วมกับ index.html และ view.html ไม่แก้ฟังก์ชันเดิม */
(function () {
'use strict';
const ADMIN = typeof savePlayer === 'function';   // มีเฉพาะ index.html
const MS = 'Matches';                              // ชื่อชีตเก็บข้อมูลการแข่งขัน
let tok = 0;

/* ---------- ไอคอน (เส้นบาง ทันสมัย) ---------- */
const P = {
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
 check:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
 trend:'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
 star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
 trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 shield:'<path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/><path d="m12 8 1.4 2.8 3.1.4-2.2 2.2.5 3.1L12 15l-2.8 1.5.5-3.1-2.2-2.2 3.1-.4z"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
 trash:'<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
 bars:'<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V7M17 16v-8"/>',
 layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
 alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
 award:'<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
 ball:'<circle cx="12" cy="12" r="10"/><path d="m12 7 4 3-1.5 4.5h-5L8 10z"/>'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;

/* ---------- สไตล์ (ธีมเดิม: กระจกโปร่งบนพื้นหลังกรมท่า, แดงเป็นสีเน้น) ---------- */
const st = document.createElement('style');
st.textContent = `
.ic{width:1.15em;height:1.15em;vertical-align:-.18em;flex:none}
.dv-h{margin:6px 0 16px}.dv-h h1{margin:0}
.kp{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:12px;margin-bottom:14px}
.kc,.dc,.mc,.mempty{background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.13);border-radius:16px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.kc{padding:14px;display:flex;gap:12px;align-items:center}
.ki{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:20px;flex:none;background:linear-gradient(135deg,rgba(106,166,255,.38),rgba(47,91,224,.22));color:#cfe0ff}
.ki.r{background:linear-gradient(135deg,rgba(224,34,47,.45),rgba(224,34,47,.15));color:#ffc9cd}
.ki.g{background:linear-gradient(135deg,rgba(22,163,74,.45),rgba(22,163,74,.15));color:#b8f0cb}
.ki.y{background:linear-gradient(135deg,rgba(245,215,110,.4),rgba(245,215,110,.12));color:#ffefb0}
.kv b{display:block;font-size:24px;line-height:1.1}.kv span{font-size:12px;color:#a9b8e2}
.dg{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:14px;margin-bottom:14px}
.dc{padding:16px;min-width:0}
.dc h3{display:flex;gap:8px;align-items:center;font-size:15px;margin:0 0 12px;color:#fff}
.dc h3 .ic{color:#6aa6ff}.dc h3 small{margin-left:auto;color:#8ea0cf;font-size:11px;font-weight:400}
.dc svg.ch{width:100%;height:auto;display:block}
.dom{display:grid;grid-template-columns:62px 1fr 30px;gap:10px;align-items:center;padding:5px 0;font-size:13px}
.dom .tr{height:8px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden}
.dom .tr i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#2f5be0,#6aa6ff)}
.dom b{text-align:right}
.stk{display:flex;height:12px;border-radius:6px;overflow:hidden;background:rgba(255,255,255,.1);margin:4px 0 12px}
.lgd{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px 12px;font-size:12.5px;color:#cdd7f2}
.lgd span{display:flex;align-items:center;gap:7px}.lgd i{width:9px;height:9px;border-radius:3px;flex:none}.lgd b{margin-left:auto;color:#fff}
.rk{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid rgba(255,255,255,.08);cursor:pointer;font-size:14px}
.rk:first-of-type{border-top:0}
.rk .n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rk em{font-style:normal;font-size:12px;color:#a9b8e2}
.rk b{font-size:15px}.up{color:#7ee2a0}
.dv-av{width:30px;height:30px;border-radius:9px;overflow:hidden;background:rgba(255,255,255,.14);display:grid;place-items:center;font-size:13px;font-weight:600;flex:none}
.dv-av img{width:100%;height:100%;object-fit:cover}
.rkn{width:18px;text-align:center;color:#8ea0cf;font-size:12px}
.mm{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:8px;margin-bottom:12px}
.mm div{background:rgba(255,255,255,.07);border-radius:10px;padding:8px 6px;text-align:center}
.mm b{display:block;font-size:19px;line-height:1.15}.mm span{font-size:11px;color:#a9b8e2}
.form{display:flex;gap:6px;align-items:center;margin:0 0 12px;font-size:12px;color:#a9b8e2}
.rc{display:inline-grid;place-items:center;min-width:26px;height:26px;padding:0 8px;border-radius:8px;font-size:12px;font-weight:600;color:#fff}
.rc.W{background:#16a34a}.rc.D{background:#c9961a}.rc.L{background:var(--red)}
.lgn{display:flex;gap:14px;font-size:11.5px;color:#a9b8e2;margin-top:4px}.lgn i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:5px}
.mempty{padding:18px;text-align:center;color:#a9b8e2;font-size:13px}
.warn{background:rgba(224,34,47,.14);border:1px solid rgba(224,34,47,.4);color:#ffd2d5;border-radius:12px;padding:12px 14px;font-size:13px;margin:0 0 14px}
/* ----- ตารางการแข่งขัน ----- */
.mh{display:flex;align-items:center;gap:8px;margin:22px 0 10px;font-size:17px}.mh .ic{color:#6aa6ff}.mh small{color:#8ea0cf;font-weight:400;font-size:12px}
.mlist{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,310px),1fr));gap:12px}
.mc{padding:14px}
.mtop{display:flex;justify-content:space-between;gap:8px;align-items:center;font-size:12.5px;color:#a9b8e2;margin-bottom:12px}
.mtop span{display:flex;gap:6px;align-items:center}
.mtop .cp{background:rgba(255,255,255,.1);border-radius:999px;padding:2px 10px;color:#dbe5ff;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.today{background:var(--red);color:#fff;border-radius:999px;padding:1px 9px;font-size:11px}
.mbody{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center}
.mt{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;min-width:0}
.mt b{font-size:14px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mt em{font-style:normal;font-size:10.5px;color:#ff9aa2;margin-top:-4px}
.lg{width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);display:grid;place-items:center;overflow:hidden;color:#9fb0dc;font-size:26px}
.lg img{width:100%;height:100%;object-fit:contain;padding:4px}
.lg.big{width:64px;height:64px}
.msc{display:flex;align-items:center;gap:8px;font-size:30px;font-weight:700;line-height:1}
.msc i{font-style:normal;color:#8ea0cf;font-weight:400}
.msc .vs{font-size:15px;letter-spacing:.12em;color:#a9b8e2;font-weight:600}
.mf{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:12px;font-size:12.5px;min-height:30px}
.mf>.mut{display:flex;gap:5px;align-items:center;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mfr{display:flex;gap:6px;align-items:center;margin-left:auto}
.mc button.s{background:rgba(255,255,255,.08);color:#e7ecfb;border-color:rgba(255,255,255,.18);display:inline-grid;place-items:center;padding:5px 9px}
.mc button.s:hover{background:rgba(255,255,255,.16)}
.mc button.s.x{color:#ff9aa2;border-color:rgba(255,120,130,.4)}
#mdlg{width:min(460px,94vw)}
.m2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.lgp{display:flex;gap:8px;align-items:center;margin-bottom:6px;flex-wrap:wrap}
.lgp .phb{display:flex;flex-direction:column;gap:6px}
#mdlg .lg{background:#101a35;border-color:var(--line)}
@media(max-width:620px){.tabs{overflow-x:auto;scrollbar-width:none}.tabs::-webkit-scrollbar{display:none}.tab{padding:0 7px!important;font-size:12.5px!important}}
`;
document.head.appendChild(st);

/* ---------- ตัวช่วย ---------- */
const pad = n => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
const pd = s => { const d = new Date(String(s || '') + 'T00:00:00'); return isNaN(d) ? null : d; };
const fd = s => { const d = pd(s); return d ? d.toLocaleDateString('th-TH', {day:'numeric', month:'short', year:'numeric'}) : (s || '-'); };
const fs = s => { const d = pd(s); return d ? d.toLocaleDateString('th-TH', {day:'numeric', month:'short'}) : (s || ''); };
const fm = k => { const d = pd(k + '-01'); return d ? d.toLocaleDateString('th-TH', {month:'short', year:'2-digit'}) : k; };
const num = v => v !== '' && v != null && !isNaN(+v);
const done = m => num(m.hScore) && num(m.aScore);
const res = m => {
  if (!done(m) || !m.ours) return null;
  const f = +(m.ours === 'h' ? m.hScore : m.aScore), a = +(m.ours === 'h' ? m.aScore : m.hScore);
  return {gf: f, ga: a, r: f > a ? 'W' : f < a ? 'L' : 'D'};
};
const cmpA = (a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || '');
const cmpD = (a, b) => cmpA(b, a);
const RL = {W:'ช', D:'ส', L:'พ'}, RT = {W:'ชนะ', D:'เสมอ', L:'แพ้'};

async function loadM() {
  try {
    const r = await call(ADMIN ? 'list' : 'public', {sheet: MS});
    S.matches = (r.rows || []).filter(m => m && m.id && m.date);
    S.mErr = '';
  } catch (e) { S.matches = S.matches || []; S.mErr = e.message || 'error'; }
}
function setTab(n) { document.querySelectorAll('.tabs .tab[data-t]').forEach(a => a.classList.toggle('on', a.dataset.t === n)); }

/* ---------- กราฟ SVG แบบ minimal ---------- */
function line(pts) {
  if (!pts.length) return '<div class="mempty">ยังไม่มีข้อมูล</div>';
  const W = 420, H = 170, L = 26, R = 14, T = 18, B = 26, lo = 1, hi = 5;
  const x = i => pts.length === 1 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (pts.length - 1);
  const y = v => T + (hi - v) / (hi - lo) * (H - T - B);
  const grid = [1, 2, 3, 4, 5].map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.1)"/><text x="${L - 8}" y="${y(v) + 3.5}" text-anchor="end" fill="#8ea0cf" font-size="10">${v}</text>`).join('');
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ');
  const area = pts.length > 1 ? `<path d="${d} L${x(pts.length - 1).toFixed(1)} ${H - B} L${x(0).toFixed(1)} ${H - B}Z" fill="url(#lg1)"/>` : '';
  const k = Math.ceil(pts.length / 8);
  const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="4" fill="#0a1f3d" stroke="#6aa6ff" stroke-width="2"/><text x="${x(i).toFixed(1)}" y="${(y(p.v) - 9).toFixed(1)}" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="600">${p.v.toFixed(1)}</text>${i % k === 0 ? `<text x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle" fill="#8ea0cf" font-size="10">${esc(p.l)}</text>` : ''}`).join('');
  return `<svg class="ch" viewBox="0 0 ${W} ${H}" role="img"><defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa6ff" stop-opacity=".35"/><stop offset="1" stop-color="#6aa6ff" stop-opacity="0"/></linearGradient></defs>${grid}${area}<path d="${d}" fill="none" stroke="#6aa6ff" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>`;
}
function cols(gs, colors) {
  if (!gs.length) return '<div class="mempty">ยังไม่มีข้อมูล</div>';
  const W = 420, H = 150, L = 8, R = 8, T = 16, B = 24, k = gs[0].v.length;
  const mx = Math.max(1, ...gs.flatMap(g => g.v)), bw = (W - L - R) / gs.length, w = Math.min(18, bw * .7 / k);
  const out = gs.map((g, i) => {
    const cx = L + bw * (i + .5), x0 = cx - (k * w + (k - 1) * 3) / 2;
    return g.v.map((v, j) => {
      const h = v / mx * (H - T - B), bx = x0 + j * (w + 3);
      return `<rect x="${bx.toFixed(1)}" y="${(H - B - h).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(h, v > 0 ? 2 : 0).toFixed(1)}" rx="3" fill="${colors[j]}"/>${v > 0 ? `<text x="${(bx + w / 2).toFixed(1)}" y="${(H - B - h - 4).toFixed(1)}" text-anchor="middle" fill="#fff" font-size="10">${v}</text>` : ''}`;
    }).join('') + `<text x="${cx.toFixed(1)}" y="${H - 8}" text-anchor="middle" fill="#8ea0cf" font-size="10">${esc(g.l)}</text>`;
  }).join('');
  return `<svg class="ch" viewBox="0 0 ${W} ${H}" role="img"><line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" stroke="rgba(255,255,255,.15)"/>${out}</svg>`;
}

/* ---------- ตารางการแข่งขัน ---------- */
const logo = s => `<span class="lg">${s ? `<img src="${esc(s)}" alt="">` : ic('shield')}</span>`;
function card(m, plain) {
  const d = done(m), r = res(m), us = m.ours;
  const team = side => {
    const h = side === 'h';
    return `<div class="mt">${logo(h ? m.homeLogo : m.awayLogo)}<b>${esc((h ? m.homeName : m.awayName) || '-')}</b>${us === side ? '<em>ทีมเรา</em>' : ''}</div>`;
  };
  const adm = ADMIN && !plain ? `<button class="s" onclick="nkEdit('${m.id}')" aria-label="แก้ไข">${ic('edit')}</button><button class="s x" onclick="nkDel('${m.id}')" aria-label="ลบ">${ic('trash')}</button>` : '';
  return `<div class="mc"><div class="mtop"><span>${ic('cal')} ${fd(m.date)}${m.time ? ' · ' + esc(m.time) : ''}${!d && m.date === today() ? ' <b class="today">วันนี้</b>' : ''}</span>${m.comp ? `<span class="cp">${esc(m.comp)}</span>` : ''}</div>
   <div class="mbody">${team('h')}<div class="msc">${d ? `<span>${+m.hScore}</span><i>-</i><span>${+m.aScore}</span>` : '<span class="vs">VS</span>'}</div>${team('a')}</div>
   <div class="mf"><span class="mut">${m.venue ? ic('pin') + ' ' + esc(m.venue) : ''}</span><span class="mfr">${r ? `<span class="rc ${r.r}">${RT[r.r]}</span>` : ''}${adm}</span></div></div>`;
}
const errBox = () => S.mErr ? `<div class="warn">${ic('alert')} โหลดข้อมูลการแข่งขันไม่ได้: ${esc(S.mErr)}<br><span style="opacity:.85">ถ้าเพิ่งติดตั้งครั้งแรก ต้องให้ Apps Script รู้จักชีตชื่อ “${MS}” (ดูคำแนะนำ)</span></div>` : '';
function record(ms) {
  const rs = ms.map(res).filter(Boolean);
  return {n: rs.length, w: rs.filter(x => x.r === 'W').length, d: rs.filter(x => x.r === 'D').length, l: rs.filter(x => x.r === 'L').length, gf: rs.reduce((a, x) => a + x.gf, 0), ga: rs.reduce((a, x) => a + x.ga, 0)};
}
function drawMatches() {
  const ms = S.matches || [], up = ms.filter(m => !done(m)).sort(cmpA), dn = ms.filter(done).sort(cmpD), rc = record(ms);
  $('app').innerHTML = `<div class="bar1"><div><h1>ตารางการแข่งขัน</h1><span class="mut">${ms.length} นัด${rc.n ? ` · ชนะ ${rc.w} เสมอ ${rc.d} แพ้ ${rc.l}` : ''}</span></div>
   ${ADMIN ? `<button class="p" style="margin-left:auto" onclick="nkAdd()">+ เพิ่มการแข่งขัน</button>` : ''}</div>${errBox()}
   <h3 class="mh">${ic('clock')} กำลังจะมาถึง <small>${up.length} นัด</small></h3>
   ${up.length ? `<div class="mlist">${up.map(m => card(m)).join('')}</div>` : '<div class="mempty">ยังไม่มีตารางการแข่งขันที่กำลังจะมาถึง</div>'}
   <h3 class="mh">${ic('trophy')} ผลการแข่งขัน <small>${dn.length} นัด</small></h3>
   ${dn.length ? `<div class="mlist">${dn.map(m => card(m)).join('')}</div>` : '<div class="mempty">ยังไม่มีผลการแข่งขัน</div>'}`;
}
async function matchesPage() {
  if (ADMIN && !PW) return;
  const t = ++tok; setTab('matches'); S.view = 'matches'; closeSide();
  $('app').innerHTML = '<p class="mut">กำลังโหลด...</p>';
  await loadM();
  if (t !== tok) return;
  if (ADMIN && /รหัสผ่าน/.test(S.mErr || '')) return logout();
  drawMatches(); scrollTo(0, 0);
}

/* ---------- ฟอร์มเพิ่ม/แก้ไขการแข่งขัน (แอดมิน) ---------- */
let ed = {id: '', h: '', a: ''};
function ensureDlg() {
  if ($('mdlg')) return;
  const tb = (s, label) => `<div><label>${label}</label><div class="lgp"><span class="lg big" id="m${s}_prev"></span><div class="phb"><button class="s" type="button" onclick="document.getElementById('m${s}_f').click()">เลือกรูป</button><input id="m${s}_f" type="file" accept="image/*" hidden onchange="nkLogo('${s}',this)"><button class="s x" type="button" onclick="nkClr('${s}')">ลบรูป</button></div></div>
    <input id="m${s}_n" placeholder="ชื่อทีม" maxlength="30" autocomplete="off"><label>ประตู</label><input id="m${s}_s" type="number" min="0" max="99" inputmode="numeric"></div>`;
  const dl = document.createElement('dialog'); dl.id = 'mdlg';
  dl.innerHTML = `<h2 id="mt">เพิ่มการแข่งขัน</h2>
   <div class="m2">${tb('h', 'ทีมเจ้าบ้าน')}${tb('a', 'ทีมเยือน')}</div>
   <p class="mut" style="margin:8px 0 0;font-size:12px;color:#667089">ไม่ใส่รูป = ใช้ไอคอนตราสโมสรมาตรฐาน · เว้นประตูว่างทั้งคู่ = ยังไม่แข่ง</p>
   <div class="m2"><div><label>วันที่แข่ง</label><input id="m_date" type="date"></div><div><label>เวลา (ไม่บังคับ)</label><input id="m_time" type="time"></div></div>
   <label>NK ELITE เป็นทีมไหน (ใช้คำนวณ ชนะ/เสมอ/แพ้)</label><select id="m_ours"><option value="h">ทีมเจ้าบ้าน (ซ้าย)</option><option value="a">ทีมเยือน (ขวา)</option><option value="">ไม่ระบุ / ไม่ใช่ทีมเรา</option></select>
   <label>รายการแข่งขัน (ไม่บังคับ)</label><input id="m_comp" maxlength="40" placeholder="เช่น ลีกเยาวชน / กระชับมิตร">
   <label>สนาม (ไม่บังคับ)</label><input id="m_venue" maxlength="40">
   <div class="acts"><button onclick="document.getElementById('mdlg').close()">ยกเลิก</button><button class="p" id="m_save" onclick="nkSave()">บันทึก</button></div>`;
  document.body.appendChild(dl);
}
const lp = s => { const v = s === 'h' ? ed.h : ed.a; $('m' + s + '_prev').innerHTML = v ? `<img src="${esc(v)}" alt="">` : ic('shield'); };
function fill(m) {
  ensureDlg();
  $('mt').textContent = m.id ? 'แก้ไขการแข่งขัน' : 'เพิ่มการแข่งขัน';
  $('mh_n').value = m.homeName || ''; $('ma_n').value = m.awayName || '';
  $('mh_s').value = num(m.hScore) ? m.hScore : ''; $('ma_s').value = num(m.aScore) ? m.aScore : '';
  $('m_date').value = m.date || today(); $('m_time').value = m.time || '';
  $('m_ours').value = m.ours === undefined ? 'h' : (m.ours || '');
  $('m_comp').value = m.comp || ''; $('m_venue').value = m.venue || '';
  lp('h'); lp('a'); $('m_save').disabled = false; $('mdlg').showModal();
}
window.nkAdd = () => { ed = {id: '', h: '', a: ''}; fill({}); };
window.nkEdit = id => {
  const m = (S.matches || []).find(x => x.id === id); if (!m) return;
  ed = {id, h: m.homeLogo || '', a: m.awayLogo || ''}; fill(m);
};
window.nkClr = s => { if (s === 'h') ed.h = ''; else ed.a = ''; lp(s); };
window.nkLogo = (s, inp) => {
  const f = inp.files[0]; if (!f) return;
  const img = new Image(), u = URL.createObjectURL(f);
  img.onload = () => {
    const c = document.createElement('canvas'), x = c.getContext('2d');
    let n = 128, q = .85, d;
    const draw = () => { const k = Math.min(n / img.width, n / img.height), w = Math.max(1, Math.round(img.width * k)), h = Math.max(1, Math.round(img.height * k)); c.width = w; c.height = h; x.clearRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h); d = c.toDataURL('image/webp', q); };
    draw();
    while (d.length > 18000 && n > 32) { if (q > .4 && d.startsWith('data:image/webp')) q -= .1; else n = Math.round(n * .8); draw(); }
    if (s === 'h') ed.h = d; else ed.a = d;
    lp(s); URL.revokeObjectURL(u);
  };
  img.onerror = () => alert('เปิดไฟล์รูปนี้ไม่ได้ ลองรูปอื่น (JPG/PNG)');
  img.src = u; inp.value = '';
};
window.nkSave = async () => {
  const hn = $('mh_n').value.trim(), an = $('ma_n').value.trim(), date = $('m_date').value;
  if (!hn || !an) return alert('กรุณากรอกชื่อทีมให้ครบทั้งสองทีม');
  if (!date) return alert('กรุณาเลือกวันที่แข่ง');
  const hs = $('mh_s').value.trim(), as2 = $('ma_s').value.trim();
  if ((hs === '') !== (as2 === '')) return alert('กรอกประตูให้ครบทั้งสองทีม (หรือเว้นว่างทั้งคู่ถ้ายังไม่แข่ง)');
  if (hs !== '' && (+hs < 0 || +as2 < 0 || isNaN(+hs) || isNaN(+as2))) return alert('ประตูต้องเป็นตัวเลข 0 ขึ้นไป');
  const data = {homeName: hn, homeLogo: ed.h, awayName: an, awayLogo: ed.a, date, time: $('m_time').value, hScore: hs === '' ? '' : +hs, aScore: as2 === '' ? '' : +as2, ours: $('m_ours').value, comp: $('m_comp').value.trim(), venue: $('m_venue').value.trim()};
  if (ed.id) data.id = ed.id;
  $('m_save').disabled = true;
  try { await call('save', {sheet: MS, data}); $('mdlg').close(); await loadM(); drawMatches(); }
  catch (e) { alert('บันทึกไม่สำเร็จ: ' + e.message); }
  $('m_save').disabled = false;
};
window.nkDel = async id => {
  const m = (S.matches || []).find(x => x.id === id); if (!m) return;
  if (!confirm(`ลบการแข่งขัน “${m.homeName} vs ${m.awayName}” (${fd(m.date)})?\nการลบกู้คืนไม่ได้`)) return;
  try { await call('delete', {sheet: MS, id}); await loadM(); drawMatches(); }
  catch (e) { alert('ลบไม่สำเร็จ: ' + e.message); }
};

/* ---------- แดชบอร์ด (แอดมิน) ---------- */
const TIERS = [['elite', 'Elite ≥4.5', '#3a5ce0'], ['rare', 'Rare 4.0–4.4', '#ffd75e'], ['gold', 'Gold 3.5–3.9', '#e6c45a'], ['silver', 'Silver 2.5–3.4', '#cdd5e2'], ['bronze', 'Bronze <2.5', '#cf9560'], ['none', 'ยังไม่ประเมิน', '#4a5468']];
const tierOf = t => t == null ? 'none' : t >= 4.5 ? 'elite' : t >= 4 ? 'rare' : t >= 3.5 ? 'gold' : t >= 2.5 ? 'silver' : 'bronze';
const kpi = (i, cls, v, l) => `<div class="kc"><div class="ki ${cls}">${ic(i)}</div><div class="kv"><b>${v}</b><span>${l}</span></div></div>`;
const mini = p => `<span class="dv-av">${p.photo ? `<img src="${esc(p.photo)}" alt="">` : esc(String(p.name || '?').trim().charAt(0))}</span>`;

function dashHtml() {
  const ps = S.players, asms = S.asms, ms = S.matches || [];
  const rows = ps.map(p => { const l = asmOf(p.id); return {p, l: l[0], pv: l[1]}; });
  const lat = rows.filter(r => r.l).map(r => ({...r, t: tAvg(r.l)})).filter(r => r.t != null);
  const teamAvg = mean(lat.map(r => r.t));
  const rc = record(ms);

  // แนวโน้มรายเดือน
  const mo = {};
  asms.forEach(a => { const k = String((a.info && a.info.date) || '').slice(0, 7); if (/^\d{4}-\d{2}$/.test(k)) (mo[k] = mo[k] || []).push(tAvg(a)); });
  const mk = Object.keys(mo).sort().slice(-8);
  const trendPts = mk.map(k => ({l: fm(k), v: mean(mo[k].filter(x => x != null))})).filter(p => p.v != null);
  const cntPts = mk.map(k => ({l: fm(k), v: [mo[k].length]}));

  // รายด้าน
  const dom = D.map((d, i) => ({s: d.s, m: mean(lat.map(r => dAvg(r.l, i)).filter(x => x != null))}));
  const domH = lat.length ? dom.map(x => `<div class="dom"><span>${esc(x.s)}</span><div class="tr"><i style="width:${x.m ? x.m / 5 * 100 : 0}%"></i></div><b>${f1(x.m)}</b></div>`).join('') : '<div class="mempty">ยังไม่มีข้อมูลการประเมิน</div>';

  // ระดับการ์ด
  const cnt = {}; TIERS.forEach(t => cnt[t[0]] = 0);
  rows.forEach(r => cnt[tierOf(r.l ? tAvg(r.l) : null)]++);
  const tot = Math.max(1, ps.length);
  const tierH = `<div class="stk">${TIERS.map(t => cnt[t[0]] ? `<i style="width:${cnt[t[0]] / tot * 100}%;background:${t[2]}"></i>` : '').join('')}</div><div class="lgd">${TIERS.map(t => `<span><i style="background:${t[2]}"></i>${t[1]}<b>${cnt[t[0]]}</b></span>`).join('')}</div>`;

  // อันดับ / พัฒนาการ / ควรประเมิน
  const top = [...lat].sort((a, b) => b.t - a.t).slice(0, 5);
  const topH = top.length ? top.map((r, i) => `<div class="rk" onclick="nkP('${r.p.id}')"><span class="rkn">${i + 1}</span>${mini(r.p)}<span class="n">${esc(r.p.nick || r.p.name)}</span><b>${f1(r.t)}</b></div>`).join('') : '<div class="mempty">ยังไม่มีข้อมูล</div>';
  const imp = lat.filter(r => r.pv && tAvg(r.pv) != null).map(r => ({...r, df: r.t - tAvg(r.pv)})).filter(r => r.df > 0).sort((a, b) => b.df - a.df).slice(0, 5);
  const impH = imp.length ? imp.map((r, i) => `<div class="rk" onclick="nkP('${r.p.id}')"><span class="rkn">${i + 1}</span>${mini(r.p)}<span class="n">${esc(r.p.nick || r.p.name)}</span><b class="up">▲ +${r.df.toFixed(1)}</b></div>`).join('') : '<div class="mempty">ยังไม่มีนักกีฬาที่คะแนนเพิ่มขึ้นเมื่อเทียบครั้งก่อน</div>';
  const now = Date.now();
  const need = rows.map(r => {
    if (!r.l) return {r, why: 'ยังไม่เคยประเมิน', k: 1e9};
    const d = pd(r.l.info && r.l.info.date); const days = d ? Math.floor((now - d) / 864e5) : null;
    return days != null && days > 60 ? {r, why: `ประเมินล่าสุด ${days} วันก่อน`, k: days} : null;
  }).filter(Boolean).sort((a, b) => b.k - a.k);
  const needH = need.length ? need.slice(0, 5).map(x => `<div class="rk" onclick="nkP('${x.r.p.id}')">${mini(x.r.p)}<span class="n">${esc(x.r.p.nick || x.r.p.name)}</span><em>${x.why}</em></div>`).join('') + (need.length > 5 ? `<div class="mut" style="margin-top:6px">และอีก ${need.length - 5} คน</div>` : '') : '<div class="mempty">ทุกคนประเมินล่าสุดภายใน 60 วัน</div>';

  // การแข่งขัน
  const results = ms.filter(m => res(m)).sort(cmpA);
  const form = results.slice(-5).map(m => `<span class="rc ${res(m).r}">${RL[res(m).r]}</span>`).join('');
  const goalG = results.slice(-8).map(m => ({l: fs(m.date), v: [res(m).gf, res(m).ga]}));
  const nxt = ms.filter(m => !done(m)).sort(cmpA).find(m => m.date >= today()) || ms.filter(m => !done(m)).sort(cmpA)[0];
  const winR = rc.n ? Math.round(rc.w / rc.n * 100) : 0;
  const matchH = `${errBox()}${rc.n ? `<div class="mm"><div><b>${rc.n}</b><span>แข่ง</span></div><div><b>${rc.w}</b><span>ชนะ</span></div><div><b>${rc.d}</b><span>เสมอ</span></div><div><b>${rc.l}</b><span>แพ้</span></div><div><b>${rc.gf}</b><span>ได้</span></div><div><b>${rc.ga}</b><span>เสีย</span></div></div>
    <div class="form">ฟอร์มล่าสุด ${form}<span style="margin-left:auto">ชนะ ${winR}%</span></div>` : '<div class="mempty" style="margin-bottom:12px">ยังไม่มีผลการแข่งขันของทีมเรา (เลือก “NK ELITE เป็นทีมไหน” ตอนบันทึกผล)</div>'}`;

  return `<div class="bar1 dv-h"><div><h1>แดชบอร์ด</h1><span class="mut">ภาพรวมนักกีฬา การประเมิน และการแข่งขัน</span></div></div>
  <div class="kp">${kpi('users', '', ps.length, 'นักกีฬาทั้งหมด')}${kpi('check', 'g', `${lat.length}<small style="font-size:14px;color:#a9b8e2">/${ps.length}</small>`, 'ประเมินแล้ว')}${kpi('layers', '', asms.length, 'การประเมินทั้งหมด')}${kpi('star', 'y', f1(teamAvg), 'คะแนนเฉลี่ยทีม (จาก 5)')}${kpi('trophy', 'r', ms.length ? `${rc.w}-${rc.d}-${rc.l}` : '-', `แข่งทั้งหมด ${ms.length} นัด (ช-ส-พ)`)}</div>
  <div class="dg">
   <div class="dc"><h3>${ic('trend')} แนวโน้มคะแนนเฉลี่ย<small>รายเดือน</small></h3>${line(trendPts)}</div>
   <div class="dc"><h3>${ic('bars')} จำนวนการประเมิน<small>รายเดือน</small></h3>${cols(cntPts, ['#6aa6ff'])}</div>
  </div>
  <div class="dg">
   <div class="dc"><h3>${ic('target' in P ? 'target' : 'star')} คะแนนเฉลี่ยรายด้าน<small>ล่าสุดของทั้งทีม</small></h3>${domH}</div>
   <div class="dc"><h3>${ic('layers')} ระดับการ์ดนักกีฬา</h3>${tierH}</div>
  </div>
  <div class="dg">
   <div class="dc"><h3>${ic('award')} คะแนนสูงสุด 5 อันดับ</h3>${topH}</div>
   <div class="dc"><h3>${ic('trend')} พัฒนาการดีที่สุด<small>เทียบครั้งก่อน</small></h3>${impH}</div>
   <div class="dc"><h3>${ic('alert')} ควรประเมิน<small>เกิน 60 วัน / ยังไม่เคย</small></h3>${needH}</div>
  </div>
  <div class="dg">
   <div class="dc"><h3>${ic('trophy')} ภาพรวมการแข่งขัน</h3>${matchH}${cols(goalG, ['#6aa6ff', '#ff7a85'])}${goalG.length ? '<div class="lgn"><span><i style="background:#6aa6ff"></i>ประตูได้</span><span><i style="background:#ff7a85"></i>ประตูเสีย</span></div>' : ''}</div>
   <div class="dc"><h3>${ic('cal')} นัดถัดไป</h3>${nxt ? `<div class="mlist" style="grid-template-columns:1fr">${card(nxt, true)}</div>` : '<div class="mempty">ยังไม่มีตารางการแข่งขันที่กำลังจะมาถึง</div>'}<p style="margin:12px 0 0"><button class="s" onclick="goMatches()">ดูตารางการแข่งขันทั้งหมด →</button></p></div>
  </div>`;
}
async function dashPage() {
  if (!ADMIN || !PW) return;
  const t = ++tok; setTab('dash'); S.view = 'dash'; closeSide();
  $('app').innerHTML = '<p class="mut">กำลังโหลด...</p>';
  try { await load(); await loadM(); }
  catch (e) {
    if (/รหัสผ่าน/.test(e.message)) return logout();
    if (t === tok) $('app').innerHTML = `<section><h3>โหลดข้อมูลไม่สำเร็จ</h3><p class="mut">${esc(e.message)}</p><button class="p" onclick="goDash()">ลองใหม่</button></section>`;
    return;
  }
  if (t !== tok) return;
  $('app').innerHTML = dashHtml(); scrollTo(0, 0);
}

/* ---------- เชื่อมกับของเดิม (ห่อ home เฉพาะเพื่อไฮไลต์แท็บ ไม่แก้ตรรกะเดิม) ---------- */
const _home = window.home;
window.home = function () { tok++; setTab('players'); return _home.apply(this, arguments); };
window.goDash = () => { dashPage(); return false; };
window.goMatches = () => { matchesPage(); return false; };
window.nkP = id => { tok++; setTab('players'); openPlayer(id); };
})();
