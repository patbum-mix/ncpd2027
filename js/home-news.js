/* =========================================================
   NCPD 2027 — "ข่าวสารล่าสุด" ในหน้าหลัก
   ใช้ข้อมูลชุดเดียวกับหน้าข่าวสาร (จาก js/news.js)
   ต้องโหลด js/news.js ก่อนไฟล์นี้เสมอ
   ========================================================= */
const HOME_NEWS_COUNT = 3; // จำนวนข่าวที่แสดงในหน้าหลัก

(async function initHomeNews() {
  const section = document.getElementById("home-news");
  const list = document.getElementById("home-news-list");
  if (!section || !list) return;

  try {
    const { items } = await loadNews();
    if (!items.length) {
      section.hidden = true; // ยังไม่มีข่าว → ซ่อนทั้งส่วน
      return;
    }
    list.innerHTML = items.slice(0, HOME_NEWS_COUNT).map((n) => cardHTML(n)).join("");
  } catch {
    list.innerHTML = `
      <li class="news-empty">
        ไม่สามารถโหลดข่าวได้ในขณะนี้ —
        <a href="news.html">ไปที่หน้าข่าวสาร</a>
      </li>`;
  } finally {
    list.removeAttribute("aria-busy");
  }
})();
