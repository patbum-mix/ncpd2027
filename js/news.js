/* =========================================================
   NCPD 2027 — ระบบข่าว (ดึงข้อมูลจาก Google Sheet)

   วิธีตั้งค่า:
   1) สร้าง Google Sheet แถวแรกเป็นหัวคอลัมน์ตามนี้ (สะกดตรงตัว):
        id | date | category | title | summary | content | image | gallery | published
      - image   = รูปปก 1 รูป
      - gallery = รูปบรรยากาศหลายรูป ใส่ในช่องเดียว 1 บรรทัดต่อ 1 ลิงก์ (กด Ctrl+Enter เพื่อขึ้นบรรทัดใหม่ในช่อง)
   2) ไฟล์ → แชร์ → เผยแพร่ไปยังเว็บ → เลือกชีตข่าว → รูปแบบ "ค่าที่คั่นด้วยจุลภาค (.csv)" → เผยแพร่
   3) ก๊อปลิงก์ที่ได้ มาวางที่ NEWS_CSV_URL ด้านล่าง

   ถ้า NEWS_CSV_URL ยังว่าง เว็บจะแสดง "ข่าวตัวอย่าง" (SAMPLE_NEWS) แทน
   ========================================================= */
const NEWS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQJubRjAIeYC4E5Zq5NBOQnZjhOTdJ0NedDIDBpCCOGTzZvKxgOj7PG6yOKsEXYKu1lzEq6-U9sTFA/pub?gid=0&single=true&output=csv";

/* ---------- ข่าวตัวอย่าง (ใช้ระหว่างยังไม่มี Google Sheet) ---------- */
const SAMPLE_NEWS = [
  {
    id: "1", date: "2026-11-20", category: "ประกาศ",
    title: "[ตัวอย่าง] เปิดรับบทความวิชาการ NCPD 2027 แล้ววันนี้",
    summary: "ขอเชิญนักวิชาการ นักวิจัย และผู้ปฏิบัติงานด้านคนพิการ ส่งบทความเข้าร่วมนำเสนอในงานสัมมนาวิชาการระดับชาติด้านคนพิการ ครั้งที่ 19",
    content: "โครงการสัมมนาวิชาการระดับชาติด้านคนพิการ ครั้งที่ 19 ประจำปี 2570 (NCPD 2027) ขอเชิญนักวิชาการ นักวิจัย และผู้ปฏิบัติงานด้านคนพิการ ส่งบทคัดย่อ (กึ่งวิชาการ) และบทความฉบับเต็ม (วิชาการ) เข้าร่วมนำเสนอ\n\nผู้สนใจสามารถดาวน์โหลดแม่แบบบทความได้ที่หน้ากำหนดการ หัวข้อแบบฟอร์ม และติดตามวันสำคัญได้ที่หน้ากำหนดการ\n\nนี่คือข่าวตัวอย่างสำหรับทดสอบหน้าตาเว็บไซต์ เมื่อเชื่อมต่อ Google Sheet แล้ว ข่าวนี้จะถูกแทนที่ด้วยข่าวจริง",
    image: "images/sch-paper.jpg",
    gallery: "images/about.jpg\nimages/register.jpg",
    published: "TRUE",
  },
  {
    id: "2", date: "2026-11-15", category: "การประกวด",
    title: "[ตัวอย่าง] ชวนนักพัฒนาร่วมประกวดนวัตกรรม Inclusive Design Challenge",
    summary: "เวทีประกวดนวัตกรรมเพื่อคนพิการ เปิดรับข้อเสนอโครงการรอบแรก ชิงรางวัลและโอกาสต่อยอดสู่การใช้งานจริง",
    content: "การประกวดนวัตกรรม Inclusive Design Challenge เปิดรับข้อเสนอโครงการจากนักศึกษา นักวิจัย และผู้ประกอบการ ที่มีแนวคิดพัฒนานวัตกรรมเพื่อส่งเสริมการเรียนรู้และการสร้างรายได้ของคนพิการ\n\nทีมที่ผ่านการคัดเลือกรอบแรกจะได้พัฒนาผลงานต้นแบบ และนำเสนอในวันงาน ณ มหาวิทยาลัยขอนแก่น",
    image: "images/sch-innovation.jpg",
    gallery: "images/sch-hackathon.jpg\nimages/register.jpg\nimages/about.jpg\nimages/schedule-hero.jpg\nimages/hero-bg.jpg\nimages/sch-paper.jpg\nimages/sch-innovation.jpg\nimages/about.jpg\nimages/register.jpg\nimages/sch-hackathon.jpg\nimages/hero-bg.jpg\nimages/schedule-hero.jpg",
    published: "TRUE",
  },
  {
    id: "3", date: "2026-11-10", category: "กิจกรรม",
    title: "[ตัวอย่าง] รับสมัครทีมเข้าร่วม Hackathon เพื่อการเข้าถึงอย่างเท่าเทียม",
    summary: "รวมพลังนักพัฒนา นักออกแบบ และผู้ใช้งานจริง ระดมไอเดียสร้างต้นแบบเพื่อคนพิการภายในเวลาจำกัด",
    content: "กิจกรรม Hackathon เปิดรับสมัครทีมละ 3–5 คน โดยสนับสนุนให้มีสมาชิกที่เป็นคนพิการหรือผู้ดูแลร่วมทีม เพื่อให้ได้มุมมองจากผู้ใช้งานจริง\n\nทีมที่ได้รับคัดเลือกจะได้เข้าร่วมเวิร์กช็อปออนไลน์ก่อนวันแข่งขัน",
    image: "images/sch-hackathon.jpg",
    gallery: "images/register.jpg\nimages/sch-innovation.jpg\nimages/schedule-hero.jpg",
    published: "TRUE",
  },
  {
    id: "4", date: "2026-11-01", category: "ประชาสัมพันธ์",
    title: "[ตัวอย่าง] มหาวิทยาลัยขอนแก่นรับมอบธงเจ้าภาพการจัดงาน NCPD",
    summary: "พิธีส่งมอบธงเจ้าภาพการจัดงานสัมมนาวิชาการระดับชาติด้านคนพิการ สู่มหาวิทยาลัยขอนแก่น เจ้าภาพร่วมประจำปี 2570",
    content: "มหาวิทยาลัยขอนแก่นได้รับมอบธงเจ้าภาพการจัดงานสัมมนาวิชาการระดับชาติด้านคนพิการ ต่อจากเจ้าภาพปี 2569 เพื่อเตรียมความพร้อมจัดงานครั้งที่ 19\n\nนี่คือข่าวตัวอย่าง",
    image: "images/about.jpg",
    gallery: "images/hero-bg.jpg",
    published: "TRUE",
  },
];

/* =========================================================
   ส่วนด้านล่างนี้ไม่จำเป็นต้องแก้
   ========================================================= */

// แปลง CSV เป็นตาราง (รองรับข้อความที่มี , หรือขึ้นบรรทัดใหม่ในเครื่องหมายคำพูด)
function parseCSV(text) {
  const rows = []; let row = []; let field = ""; let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
  return rows
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}

// ลิงก์รูปจาก Google Drive (แบบแชร์) → แปลงให้แสดงบนเว็บได้
function imageUrl(url) {
  if (!url) return "images/news-default.jpg";
  const m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([\w-]+)/);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}=w1200` : url;
}

// แยกลิงก์รูปในช่อง gallery (1 บรรทัดต่อ 1 ลิงก์)
function galleryList(text) {
  return String(text || "")
    .split(/\s*[\r\n]+\s*|\s+(?=https?:\/\/)/)
    .map((u) => u.trim())
    .filter(Boolean)
    .map(imageUrl);
}

// ป้องกันโค้ดแปลกปลอมจากข้อความใน Sheet
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function thaiDate(iso) {
  const d = new Date(iso + "T00:00:00+07:00");
  if (isNaN(d)) return esc(iso);
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
}

/* ---------- โหลดข่าว ----------
   - ยังไม่ใส่ NEWS_CSV_URL → ใช้ข่าวตัวอย่าง (ช่วงพัฒนาเว็บเท่านั้น)
   - ใส่แล้ว → ดึงจาก Google Sheet ถ้าล้มเหลวจะลองใหม่อัตโนมัติ 3 ครั้ง
   - ลองครบแล้วยังไม่ได้ → ใช้ "ข่าวจริงชุดล่าสุดที่เคยโหลดได้" ที่จำไว้ในเบราว์เซอร์
   - ไม่เคยโหลดได้เลย → แสดงข้อความแจ้ง + ปุ่มลองใหม่ (ไม่แสดงข่าวตัวอย่างเด็ดขาด)
*/
const CACHE_KEY = "ncpd2027-news-cache";

function cleanNews(items) {
  return items
    .filter((n) => n.title && String(n.published || "TRUE").toUpperCase() !== "FALSE")
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

async function fetchWithRetry(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000); // รอสูงสุด 10 วินาทีต่อครั้ง
    try {
      const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      if (!text.trim()) throw new Error("ไฟล์ว่าง");
      return text;
    } catch (err) {
      console.warn(`โหลดข่าวครั้งที่ ${i}/${tries} ไม่สำเร็จ`, err);
      if (i === tries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * i)); // รอ 1, 2 วินาทีก่อนลองใหม่
    } finally {
      clearTimeout(timer);
    }
  }
}

async function loadNews() {
  if (!NEWS_CSV_URL) return { items: cleanNews(SAMPLE_NEWS), stale: false, sample: true };

  try {
    const text = await fetchWithRetry(NEWS_CSV_URL);
    const items = cleanNews(parseCSV(text));
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), text })); } catch {}
    return { items, stale: false };
  } catch (err) {
    let cache = null;
    try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch {}
    if (cache && cache.text) {
      return { items: cleanNews(parseCSV(cache.text)), stale: true, savedAt: cache.savedAt };
    }
    throw err;
  }
}

function staleNoticeHTML(savedAt) {
  const when = new Date(savedAt).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
  return `<div class="news-notice" role="status">
      ไม่สามารถเชื่อมต่อเพื่ออัปเดตข่าวได้ในขณะนี้ กำลังแสดงข่าวที่บันทึกไว้ล่าสุดเมื่อ ${esc(when)}
      <button type="button" class="news-retry" data-retry>ลองโหลดใหม่</button>
    </div>`;
}

function errorHTML() {
  return `<div class="news-error" role="alert">
      <p class="news-error-title">โหลดข่าวไม่สำเร็จ</p>
      <p>อาจเกิดจากการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง</p>
      <button type="button" class="btn-read news-retry" data-retry>ลองใหม่</button>
    </div>`;
}

// ปุ่ม "ลองใหม่" ทุกปุ่ม → โหลดหน้าใหม่
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-retry]")) location.reload();
});

const CAMERA_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>';

function cardHTML(n, headingTag = "h3") {
  return `
    <li class="news-card">
      <a href="news-detail.html?id=${encodeURIComponent(n.id)}" class="news-card-link">
        <div class="news-thumb">
          <img src="${esc(imageUrl(n.image))}" alt="" loading="lazy">
          ${galleryList(n.gallery).length ? `<span class="photo-badge"><span aria-hidden="true">${CAMERA_ICON}</span>${galleryList(n.gallery).length}<span class="sr-only"> ภาพ</span></span>` : ""}
        </div>
        <div class="news-body">
          <p class="news-meta">
            ${n.category ? `<span class="news-tag">${esc(n.category)}</span>` : ""}
            <time datetime="${esc(n.date)}">${thaiDate(n.date)}</time>
          </p>
          <${headingTag} class="news-title">${esc(n.title)}</${headingTag}>
          <p class="news-summary">${esc(n.summary)}</p>
          <span class="news-more" aria-hidden="true">อ่านต่อ →</span>
        </div>
      </a>
    </li>`;
}

/* ---------- หน้า "ข่าวสาร" (news.html) ---------- */
async function initNewsList() {
  const list = document.getElementById("news-list");
  if (!list) return;
  const featured = document.getElementById("news-featured");
  const filter = document.getElementById("news-filter");
  const search = document.getElementById("news-search");
  const count = document.getElementById("news-count");

  let all;
  try {
    const data = await loadNews();
    all = data.items;
    if (data.stale) featured.insertAdjacentHTML("beforebegin", staleNoticeHTML(data.savedAt));
  } catch {
    filter.closest(".news-toolbar").hidden = true;
    list.outerHTML = errorHTML();
    return;
  }
  let category = "ทั้งหมด";

  const cats = ["ทั้งหมด", ...new Set(all.map((n) => n.category).filter(Boolean))];
  filter.innerHTML = cats
    .map((c) => `<button type="button" class="chip${c === category ? " is-active" : ""}" aria-pressed="${c === category}">${esc(c)}</button>`)
    .join("");

  function render() {
    const q = search.value.trim().toLowerCase();
    const shown = all.filter((n) =>
      (category === "ทั้งหมด" || n.category === category) &&
      (!q || (n.title + " " + n.summary).toLowerCase().includes(q))
    );
    const isDefault = category === "ทั้งหมด" && !q;
    const top = isDefault ? shown[0] : null;
    const rest = top ? shown.slice(1) : shown;

    featured.innerHTML = top ? `
      <a href="news-detail.html?id=${encodeURIComponent(top.id)}" class="news-featured">
        <div class="news-featured-img"><img src="${esc(imageUrl(top.image))}" alt=""></div>
        <div class="news-featured-body">
          <p class="news-meta">
            <span class="news-tag news-tag--hot">ข่าวล่าสุด</span>
            ${top.category ? `<span class="news-tag">${esc(top.category)}</span>` : ""}
            <time datetime="${esc(top.date)}">${thaiDate(top.date)}</time>
          </p>
          <h2 class="news-featured-title">${esc(top.title)}</h2>
          <p class="news-summary">${esc(top.summary)}</p>
          <span class="btn-read">อ่านข่าวนี้</span>
        </div>
      </a>` : "";

    list.innerHTML = rest.length
      ? rest.map((n) => cardHTML(n)).join("")
      : (top ? "" : `<li class="news-empty">ไม่พบข่าวที่ค้นหา</li>`);
    count.textContent = `พบ ${shown.length} ข่าว`;
  }

  filter.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    category = btn.textContent;
    filter.querySelectorAll(".chip").forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    render();
  });
  search.addEventListener("input", render);
  render();
}

/* ---------- หน้า "อ่านข่าว" (news-detail.html?id=...) ---------- */
async function initNewsDetail() {
  const article = document.getElementById("article");
  if (!article) return;
  const id = new URLSearchParams(location.search).get("id");
  let all, data;
  try {
    data = await loadNews();
    all = data.items;
  } catch {
    article.innerHTML = `<div class="container article-narrow article-missing">${errorHTML()}</div>`;
    article.removeAttribute("aria-busy");
    return;
  }
  const n = all.find((x) => String(x.id) === String(id));

  if (!n) {
    article.innerHTML = `
      <div class="container article-narrow article-missing">
        <h1>ไม่พบข่าวที่ต้องการ</h1>
        <p>ข่าวนี้อาจถูกลบหรือลิงก์ไม่ถูกต้อง</p>
        <a href="news.html" class="btn-read">กลับไปหน้าข่าวสาร</a>
      </div>`;
    article.removeAttribute("aria-busy");
    return;
  }

  document.title = `${n.title} — NCPD 2027`;
  const paragraphs = String(n.content || n.summary)
    .split(/\n\s*\n|\n/)
    .filter((p) => p.trim())
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");
  const pageUrl = location.href;

  article.innerHTML = `
    <header class="article-head">
      <div class="container article-narrow">
        <nav class="breadcrumb" aria-label="เส้นทาง">
          <a href="index.html">หน้าหลัก</a> <span aria-hidden="true">›</span>
          <a href="news.html">ข่าวสาร</a>
        </nav>
        <p class="news-meta">
          ${n.category ? `<span class="news-tag">${esc(n.category)}</span>` : ""}
          <time datetime="${esc(n.date)}">${thaiDate(n.date)}</time>
        </p>
        <h1 class="article-title">${esc(n.title)}</h1>
        ${n.summary ? `<p class="article-lead">${esc(n.summary)}</p>` : ""}
      </div>
    </header>
    <div class="container article-wide">
      <img class="article-cover" src="${esc(imageUrl(n.image))}" alt="">
    </div>
    <div class="container article-narrow">
      ${data.stale ? staleNoticeHTML(data.savedAt) : ""}
      <div class="article-content">${paragraphs}</div>
      ${galleryHTML(galleryList(n.gallery))}
      <div class="article-share">
        <span>แชร์ข่าวนี้</span>
        <a class="share share-fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener">Facebook<span class="sr-only"> (เปิดในแท็บใหม่)</span></a>
        <a class="share share-line" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener">LINE<span class="sr-only"> (เปิดในแท็บใหม่)</span></a>
        <button type="button" class="share share-copy" id="copy-link">คัดลอกลิงก์</button>
      </div>
      <a href="news.html" class="back-link">← กลับไปหน้าข่าวสารทั้งหมด</a>
    </div>`;
  article.removeAttribute("aria-busy");
  initLightbox(galleryList(n.gallery));

  const copyBtn = document.getElementById("copy-link");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      copyBtn.textContent = "คัดลอกแล้ว ✓";
    } catch {
      copyBtn.textContent = "คัดลอกไม่สำเร็จ";
    }
    setTimeout(() => (copyBtn.textContent = "คัดลอกลิงก์"), 2000);
  });

  const others = all.filter((x) => x !== n).slice(0, 3);
  if (others.length) {
    document.getElementById("related-list").innerHTML = others.map((x) => cardHTML(x)).join("");
    document.getElementById("related-wrap").hidden = false;
  }
}

/* ---------- แกลเลอรีรูปในหน้าอ่านข่าว ---------- */
const GALLERY_MAX = 9; // แสดงสูงสุดกี่รูปในตาราง (รูปที่เหลือดูได้ในหน้าขยาย)

function galleryHTML(imgs) {
  if (!imgs.length) return "";
  const shown = imgs.slice(0, GALLERY_MAX);
  const extra = imgs.length - shown.length;
  const layout = imgs.length >= 4 ? "many" : String(imgs.length);
  return `
    <section class="gallery-wrap" aria-labelledby="gallery-title">
      <h2 id="gallery-title" class="gallery-heading">ภาพบรรยากาศ <span>${imgs.length} ภาพ</span></h2>
      <ul class="gallery" data-layout="${layout}">
        ${shown.map((src, i) => {
          const isLast = i === shown.length - 1 && extra > 0;
          return `<li>
            <button type="button" class="gallery-item" data-index="${i}">
              <img src="${esc(src)}" alt="" loading="lazy">
              ${isLast ? `<span class="gallery-more" aria-hidden="true">+${extra + 1}</span>` : ""}
              <span class="sr-only">${isLast ? `ดูภาพที่ ${i + 1} และอีก ${extra} ภาพ` : `ขยายภาพที่ ${i + 1} จาก ${imgs.length}`}</span>
            </button>
          </li>`;
        }).join("")}
      </ul>
    </section>`;
}

/* ---------- หน้าต่างขยายรูป (Lightbox) ---------- */
function initLightbox(imgs) {
  if (!imgs.length) return;
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "ภาพบรรยากาศ");
  dlg.innerHTML = `
    <div class="lb-top">
      <span class="lb-count" aria-live="polite"></span>
      <button type="button" class="lb-btn lb-close" aria-label="ปิด">✕</button>
    </div>
    <div class="lb-stage">
      <button type="button" class="lb-btn lb-prev" aria-label="ภาพก่อนหน้า">‹</button>
      <img class="lb-img" alt="">
      <button type="button" class="lb-btn lb-next" aria-label="ภาพถัดไป">›</button>
    </div>`;
  document.body.appendChild(dlg);

  const img = dlg.querySelector(".lb-img");
  const count = dlg.querySelector(".lb-count");
  let idx = 0;
  let opener = null;

  function show(i) {
    idx = (i + imgs.length) % imgs.length;
    img.src = imgs[idx];
    img.alt = `ภาพที่ ${idx + 1} จาก ${imgs.length}`;
    count.textContent = `${idx + 1} / ${imgs.length}`;
  }
  function open(i, btn) {
    opener = btn;
    show(i);
    dlg.showModal();
    document.body.classList.add("no-scroll");
  }

  dlg.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
  dlg.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    if (opener) opener.focus();
  });
  // คลิกพื้นหลังมืดเพื่อปิด
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.classList.contains("lb-stage")) dlg.close();
  });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  // ปัดซ้าย-ขวาบนมือถือ
  let startX = null;
  dlg.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  dlg.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    startX = null;
  });

  document.querySelectorAll(".gallery-item").forEach((btn) =>
    btn.addEventListener("click", () => open(Number(btn.dataset.index), btn))
  );
}

initNewsList();
initNewsDetail();
