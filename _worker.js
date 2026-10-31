/**
 * NK ELITE ACADEMY - Cloudflare Worker
 * 1) เสิร์ฟหน้าเว็บจาก GitHub  2) Proxy ฐานข้อมูล -> Google Apps Script
 * 3) เรียก Gemini (Google AI Studio) จาก Worker โดยตรง มี timeout + สลับรุ่นสำรอง
 * ต้องตั้ง Secret ใน Cloudflare: GEMINI_API_KEY
 */
const GAS_API_URL = "https://script.google.com/macros/s/AKfycby5HwnLLoGlMFz9fGK2VHwVTdrXAAVETNaiQwXV-ut1ZgFz4lHF-1Jl7jJYhH1tcBVC/exec";
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/nutthaphongog/Nk_eval/main";
// รุ่นเริ่มต้น (ลำดับ = ลองตัวแรกก่อน) เปลี่ยนได้โดยไม่ต้องแก้โค้ด: ตั้งตัวแปร AI_MODELS ใน Cloudflare เช่น "gemini-3.8-flash,gemini-3.5-flash-lite"
const DEFAULT_AI_MODELS = 'gemini-3.8-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite';
const AI_TIMEOUT_MS = 25000; // ต่อรุ่น

const CORS = { 'access-control-allow-origin': '*' };
const json = (o, status = 200) => new Response(JSON.stringify(o), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...CORS }
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: {
        ...CORS, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '86400' } });
    }

    if (url.pathname.startsWith('/api/') || url.pathname === '/gas') {
      if (request.method === 'GET') return json({ status: 'ok', message: 'GAS Proxy is ready' });
      return handleApi(request, env);
    }

    if (env && env.ASSETS) return env.ASSETS.fetch(request);

    let path = url.pathname;
    // หน้าแรก (/) = หน้าดูข้อมูลสาธารณะ | /admin = หน้าโค้ช (ต้อง login)
    if (path === '/' || path === '/view' || path === '/view/' || path === '/view.html') path = '/view.html';
    else if (path === '/admin' || path === '/admin/' || path === '/coach' || path === '/index' || path === '/index.html') path = '/index.html';
    const res = await fetch(`${GITHUB_RAW_BASE}${path}`, { cf: { cacheTtl: 30, cacheEverything: true } });
    if (!res.ok) return new Response(`ไม่พบหน้านี้ (404): ${path}`, { status: 404, headers: { 'content-type': 'text/html;charset=UTF-8' } });
    return new Response(await res.text(), { headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'public, max-age=10, s-maxage=30' } });
  }
};

async function callGas(env, body, ms) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch((env && env.GOOGLE_SCRIPT_URL) || GAS_API_URL, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body), redirect: 'follow', signal: ctl.signal });
    return { status: r.status, text: await r.text() };
  } finally { clearTimeout(t); }
}

async function handleApi(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'invalid json' }, 400); }

  if (body.action === 'ai') return handleAI(body, env);

  try {
    const r = await callGas(env, body, 60000);
    return new Response(r.text, { status: r.status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...CORS } });
  } catch (err) {
    return json({ error: err.name === 'AbortError' ? 'ฐานข้อมูล (Google Apps Script) ตอบช้าเกินไป ลองใหม่อีกครั้ง' : 'ติดต่อ Google Apps Script ไม่ได้: ' + err.message }, 502);
  }
}

// ---------- AI: Gemini ----------
async function handleAI(body, env) {
  // ตรวจรหัสผ่านผ่าน Apps Script (action: ping)
  try {
    const c = await callGas(env, { pw: body.pw, action: 'ping' }, 30000);
    const j = JSON.parse(c.text);
    // 'bad sheet' = Apps Script เวอร์ชันเก่ายังไม่รู้จัก ping แต่ผ่านการตรวจรหัสผ่านแล้ว
    if (j.error && j.error !== 'bad sheet') return json({ error: j.error });
  } catch (e) { return json({ error: 'ตรวจรหัสผ่านไม่สำเร็จ ลองใหม่อีกครั้ง' }); }

  const key = env && env.GEMINI_API_KEY;
  if (!key) return json({ error: 'ยังไม่ได้ตั้ง GEMINI_API_KEY ใน Cloudflare (Settings → Variables and Secrets)' });

  const p = body.payload || {};
  const system =
    'คุณคือผู้ช่วยโค้ชฟุตบอลเยาวชนของ NK ELITE ACADEMY ช่วยร่างข้อความในแบบประเมินพัฒนาการนักกีฬา ' +
    'เกณฑ์คะแนน 1-5 (5=ยอดเยี่ยม, 4=ดี, 3=กำลังพัฒนา, 2=ต้องปรับปรุง, 1=ต้องพัฒนาพื้นฐาน) ' +
    'เขียนเป็นภาษาไทย กระชับ เป็นรูปธรรม อ้างอิงเฉพาะข้อมูลที่ให้ ห้ามแต่งเหตุการณ์ในเกมที่ไม่มีในข้อมูล ' +
    'ถ้าข้อมูลไม่พอสำหรับบางข้อ ให้เว้นเป็นสตริงว่าง ห้ามเดา และตรวจตัวสะกดภาษาไทยก่อนตอบ ' +
    'น้ำเสียงให้กำลังใจ เหมาะกับเด็กและผู้ปกครอง เป้าหมาย 4-8 สัปดาห์ต้องวัดผลได้ ' +
    'ตอบเป็น JSON ล้วนเท่านั้น ไม่มี markdown รูปแบบ: ' +
    '{"observation":{"strength":"","need":"","advice":"","next":""},' +
    '"strengths":["","",""],"improve":["","",""],"goals":["","",""],"actions":["","",""]}';
  const user =
    'ข้อมูลนักกีฬา (อายุ ส่วนสูง น้ำหนัก): ' + JSON.stringify(p.info || {}) + '\n' +
    'คะแนนรายหัวข้อ (ที่โค้ชให้แล้ว): ' + JSON.stringify(p.scores || {}) + '\n' +
    'หมายเหตุของโค้ช: ' + (p.note || '-');

  const models = String((env && env.AI_MODELS) || DEFAULT_AI_MODELS).split(',').map(x => x.trim()).filter(Boolean);
  let lastErr = '';
  for (const model of models) {
    const gen = { responseMimeType: 'application/json', temperature: 0.6, maxOutputTokens: 8192 };
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), AI_TIMEOUT_MS);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: gen })
      });
      const j = await r.json();
      if (!r.ok || j.error) { lastErr = (j.error && j.error.message) || ('HTTP ' + r.status); continue; }
      const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
      const txt = parts.map(x => x.text || '').join('').replace(/```json|```/g, '').trim();
      if (!txt) { lastErr = 'AI ไม่ตอบกลับ'; continue; }
      return json({ result: JSON.parse(txt), model });
    } catch (e) {
      lastErr = e.name === 'AbortError' ? `${model} ตอบช้าเกิน ${AI_TIMEOUT_MS / 1000} วินาที` : String(e.message || e);
    } finally { clearTimeout(t); }
  }
  return json({ error: 'AI ใช้งานไม่ได้ชั่วคราว: ' + lastErr + ' (ลองใหม่อีกครั้งในอีกสักครู่)' });
}
