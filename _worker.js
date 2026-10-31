/**
 * ACADEMY ROSTER - CLOUDFLARE WORKER & PAGES PROXY
 * ================================================
 * พัฒนาตามโครงสร้าง BoOnSong663.github.io:
 * 1. ดึงหน้า HTML จาก GitHub Repo (หรือเสิร์ฟตรง) แบบมี Cloudflare Edge Cache
 * 2. Proxy คำขอ API ผ่าน /api/gas ไปยัง Google Apps Script
 * 3. หมดปัญหา iframe / จอขาว / iOS Safari Sandbox 100%
 */

// ==================== การตั้งค่า ====================
const GAS_API_URL = "https://script.google.com/macros/s/AKfycby5HwnLLoGlMFz9fGK2VHwVTdrXAAVETNaiQwXV-ut1ZgFz4lHF-1Jl7jJYhH1tcBVC/exec";

// GitHub Repo ของคุณ (เปลี่ยนได้ตามต้องการ)
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/nutthaphongog/Nk_eval/main";

// ==================== Worker หลัก ====================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 0. รองรับ CORS Preflight (OPTIONS request)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // 1. จัดการคำขอ API -> Google Apps Script (รองรับ /api/gas, /api/gas/, /gas)
    const isApiPath = url.pathname === '/api/gas' || url.pathname === '/api/gas/' || url.pathname === '/gas' || url.pathname.startsWith('/api/');
    if (isApiPath) {
      if (request.method === 'GET') {
        return new Response(JSON.stringify({ status: 'ok', message: 'GAS Proxy is ready' }), {
          headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
        });
      }
      return handleGasProxy(request, env, ctx);
    }

    // 2. ถ้าเป็น Cloudflare Pages ให้เสิร์ฟไฟล์ใน Repo โดยตรง (รองรับทั้ง Private และ Public Repo)
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // 3. จัดการเส้นทางหน้าเว็บ (Routing สำหรับ GitHub Raw Fallback)
    let path = url.pathname;
    if (path === '/' || path === '/index' || path === '/index.html' || path === '/roster') {
      path = '/index.html';
    }

    // 4. ดึงไฟล์ HTML จาก GitHub พร้อม Cloudflare Edge Caching (สำหรับ Public Repo)
    const githubUrl = `${GITHUB_RAW_BASE}${path}`;
    let res = await fetch(githubUrl, {
      cf: {
        cacheTtl: 60,
        cacheEverything: true
      }
    });

    if (!res.ok) {
      return new Response(`ไม่พบหน้านี้ (404 Not Found): ${path} — หาก Repo เป็น Private โปรดเปลี่ยนเป็น Public ใน Settings ของ GitHub หรือให้ Cloudflare Pages อ่านผ่าน env.ASSETS`, {
        status: 404,
        headers: { "content-type": "text/html;charset=UTF-8" }
      });
    }

    const html = await res.text();
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "cache-control": "public, max-age=30, s-maxage=60",
      },
    });
  }
};

// ==================== Proxy ส่งคำขอไปยัง Google Apps Script ====================
async function handleGasProxy(request, env, ctx) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'invalid json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }

  const gasUrl = (env && env.GOOGLE_SCRIPT_URL) || GAS_API_URL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  let gasRes;

  try {
    gasRes = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
      signal: controller.signal
    });
  } catch (err) {
    clearTimeout(timer);
    const isTimeout = err.name === 'AbortError';
    return new Response(JSON.stringify({
      success: false,
      error: isTimeout
        ? 'เชื่อมต่อฐานข้อมูล Google Apps Script ไม่สำเร็จ (Timeout)'
        : 'ไม่สามารถติดต่อ Google Apps Script ได้: ' + err.message
    }), {
      status: 502,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'cache-control': 'no-store, no-cache, must-revalidate'
      }
    });
  }
  clearTimeout(timer);

  const text = await gasRes.text();
  return new Response(text, {
    status: gasRes.status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store, no-cache, must-revalidate',
      'access-control-allow-origin': '*'
    }
  });
}
