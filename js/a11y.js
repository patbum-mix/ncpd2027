/* =========================================================
   NCPD 2027 — เครื่องมือการเข้าถึง (Accessibility)
   - ปรับขนาดตัวอักษร (ก- ก ก+)
   - โหมดสีตัดกันสูง
   - หน้าต่าง "ข้อมูลการเข้าถึง" + แถบแจ้งครั้งแรกที่เข้าเว็บ
   วางไฟล์นี้ใน <head> (ไม่ใส่ defer) เพื่อให้การตั้งค่าทำงานทันทีที่เปิดหน้า
   ========================================================= */
(function () {
  const KEY = "ncpd2027-a11y";
  const SIZES = [90, 100, 115, 130, 150]; // ขนาดตัวอักษร (%)
  const DEFAULT_SIZE = 1;                  // index ของ 100%

  const root = document.documentElement;
  let state = { size: DEFAULT_SIZE, contrast: false, noticeClosed: false };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

  function applySettings() {
    state.size = Math.min(Math.max(state.size, 0), SIZES.length - 1);
    root.style.fontSize = SIZES[state.size] + "%";
    root.classList.toggle("hc", !!state.contrast);
  }
  applySettings(); // ทำทันที กันหน้าเว็บกระพริบ

  document.addEventListener("DOMContentLoaded", () => {
    /* ---------- แถบเครื่องมือด้านบน ---------- */
    const bar = document.createElement("div");
    bar.className = "a11y-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "เครื่องมือการเข้าถึง");
    bar.innerHTML = `
      <div class="container a11y-inner">
        <div class="a11y-group" role="group" aria-label="ขนาดตัวอักษร">
          <span class="a11y-label" aria-hidden="true">ขนาดตัวอักษร</span>
          <button type="button" class="a11y-btn" data-a11y="smaller" aria-label="ลดขนาดตัวอักษร">ก-</button>
          <button type="button" class="a11y-btn" data-a11y="reset" aria-label="ขนาดตัวอักษรปกติ">ก</button>
          <button type="button" class="a11y-btn" data-a11y="bigger" aria-label="เพิ่มขนาดตัวอักษร">ก+</button>
        </div>
        <button type="button" class="a11y-btn a11y-wide" data-a11y="contrast" aria-pressed="false">
          <svg class="a11y-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2v16a8 8 0 0 1 0-16z"/></svg><span class="a11y-text">สีตัดกันสูง</span>
        </button>
        <button type="button" class="a11y-btn a11y-wide" data-a11y="info" aria-haspopup="dialog">
          <svg class="a11y-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg><span class="a11y-text">ข้อมูลการเข้าถึง</span>
        </button>
        <span class="sr-only" aria-live="polite" id="a11y-status"></span>
      </div>`;
    const skip = document.querySelector(".skip-link");
    (skip ? skip.after(bar) : document.body.prepend(bar));

    const status = bar.querySelector("#a11y-status");
    const contrastBtn = bar.querySelector('[data-a11y="contrast"]');
    const syncButtons = () => {
      contrastBtn.setAttribute("aria-pressed", String(!!state.contrast));
      bar.querySelector('[data-a11y="smaller"]').disabled = state.size === 0;
      bar.querySelector('[data-a11y="bigger"]').disabled = state.size === SIZES.length - 1;
    };
    syncButtons();

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-a11y]");
      if (!btn) return;
      const act = btn.dataset.a11y;
      if (act === "smaller") state.size--;
      if (act === "bigger") state.size++;
      if (act === "reset") state.size = DEFAULT_SIZE;
      if (act === "contrast") state.contrast = !state.contrast;
      if (act === "info") return openInfo(btn);
      applySettings(); save(); syncButtons();
      status.textContent = act === "contrast"
        ? (state.contrast ? "เปิดโหมดสีตัดกันสูงแล้ว" : "ปิดโหมดสีตัดกันสูงแล้ว")
        : `ขนาดตัวอักษร ${SIZES[state.size]} เปอร์เซ็นต์`;
    });

    /* ---------- หน้าต่างข้อมูลการเข้าถึง ---------- */
    const dlg = document.createElement("dialog");
    dlg.className = "a11y-dialog";
    dlg.setAttribute("aria-labelledby", "a11y-title");
    dlg.innerHTML = `
      <div class="a11y-dialog-head">
        <h2 id="a11y-title"><svg class="a11y-ico a11y-ico-lg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg> การเข้าถึงเว็บไซต์</h2>
        <button type="button" class="a11y-close" aria-label="ปิดหน้าต่าง">✕</button>
      </div>
      <div class="a11y-dialog-body">
        <p class="a11y-intro">
          เว็บไซต์ NCPD 2027 ออกแบบโดยคำนึงถึงแนวทางการพัฒนาเว็บไซต์ที่ทุกคนเข้าถึงได้
          (Web Content Accessibility Guidelines: WCAG 2.1) เพื่อให้ทุกคน รวมถึงคนพิการ
          สามารถรับรู้ข้อมูลและใช้งานเว็บไซต์ได้อย่างเท่าเทียม
        </p>

        <h3>สิ่งที่เว็บไซต์นี้รองรับ</h3>
        <ul class="a11y-list">
          <li><strong>ปรับขนาดตัวอักษร</strong> — ใช้ปุ่ม ก- ก ก+ ที่แถบด้านบน ปรับได้ 5 ระดับ และเว็บจะจำค่าไว้ทุกหน้า</li>
          <li><strong>โหมดสีตัดกันสูง</strong> — พื้นหลังสีดำ ตัวอักษรสีขาวและเหลือง สำหรับผู้มีสายตาเลือนราง</li>
          <li><strong>ใช้งานด้วยคีย์บอร์ดได้ทั้งหมด</strong> — มีกรอบแสดงตำแหน่งที่ชัดเจนทุกปุ่มและลิงก์</li>
          <li><strong>รองรับโปรแกรมอ่านหน้าจอ</strong> — เช่น NVDA, JAWS, Narrator, VoiceOver และ TalkBack</li>
          <li><strong>คำอธิบายรูปภาพ</strong> — รูปที่มีความหมายมีข้อความอธิบาย ส่วนรูปตกแต่งจะถูกข้ามเพื่อไม่ให้รบกวน</li>
          <li><strong>โครงสร้างหัวข้อชัดเจน</strong> — ผู้ใช้โปรแกรมอ่านหน้าจอกระโดดไปยังหัวข้อต่าง ๆ ได้สะดวก</li>
          <li><strong>ลดการเคลื่อนไหว</strong> — หากตั้งค่า "ลดการเคลื่อนไหว" ในอุปกรณ์ เว็บจะปิดภาพเคลื่อนไหวให้อัตโนมัติ</li>
          <li><strong>รองรับการซูมและทุกขนาดหน้าจอ</strong> — ใช้งานได้ทั้งคอมพิวเตอร์ แท็บเล็ต และโทรศัพท์มือถือ</li>
        </ul>

        <h3>ปุ่มลัดบนคีย์บอร์ด</h3>
        <dl class="a11y-keys">
          <div><dt><kbd>Tab</kbd></dt><dd>ไปยังปุ่มหรือลิงก์ถัดไป (กดครั้งแรกเพื่อ "ข้ามไปยังเนื้อหาหลัก")</dd></div>
          <div><dt><kbd>Shift</kbd> + <kbd>Tab</kbd></dt><dd>ย้อนกลับไปปุ่มหรือลิงก์ก่อนหน้า</dd></div>
          <div><dt><kbd>Enter</kbd></dt><dd>กดปุ่มหรือเปิดลิงก์</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>ปิดเมนู หน้าต่าง หรือภาพที่ขยายอยู่</dd></div>
          <div><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>เลื่อนดูภาพก่อนหน้า/ถัดไป ในหน้าขยายภาพข่าว</dd></div>
          <div><dt><kbd>Ctrl</kbd> + <kbd>+</kbd> / <kbd>−</kbd></dt><dd>ซูมเข้า/ออกทั้งหน้าเว็บ</dd></div>
        </dl>
      </div>`;
    document.body.appendChild(dlg);

    let opener = null;
    function openInfo(from) {
      opener = from || null;
      dlg.showModal();
    }
    dlg.querySelector(".a11y-close").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => { if (opener) opener.focus(); });

    /* ---------- แถบแจ้งครั้งแรก (ไม่บังจอ ไม่แย่งโฟกัส) ---------- */
    if (!state.noticeClosed) {
      const note = document.createElement("div");
      note.className = "a11y-notice";
      note.setAttribute("role", "region");
      note.setAttribute("aria-label", "แจ้งเรื่องการเข้าถึงเว็บไซต์");
      note.innerHTML = `
        <span class="a11y-notice-icon" aria-hidden="true"><svg class="a11y-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg></span>
        <p>เว็บไซต์นี้รองรับการเข้าถึงสำหรับทุกคน — ปรับขนาดตัวอักษร โหมดสีตัดกันสูง และโปรแกรมอ่านหน้าจอ</p>
        <div class="a11y-notice-actions">
          <button type="button" class="a11y-notice-more">ดูรายละเอียด</button>
          <button type="button" class="a11y-notice-close" aria-label="ปิดแถบแจ้งนี้">ปิด</button>
        </div>`;
      document.body.appendChild(note);
      const closeNote = () => {
        state.noticeClosed = true; save();
        note.remove();
      };
      note.querySelector(".a11y-notice-close").addEventListener("click", closeNote);
      note.querySelector(".a11y-notice-more").addEventListener("click", () => {
        closeNote();
        openInfo(bar.querySelector('[data-a11y="info"]'));
      });
    }
  });
})();
