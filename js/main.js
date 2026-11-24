/* =========================================================
   NCPD 2027 — ตั้งค่าที่แก้บ่อย อยู่ตรงนี้ทั้งหมด
   ========================================================= */
const CONFIG = {
  // วันเวลาเริ่มงาน (ใช้กับตัวนับถอยหลัง)  รูปแบบ: ปี ค.ศ.-เดือน-วันTชั่วโมง:นาที:วินาที+07:00
  EVENT_START: "2027-08-19T08:30:00+07:00",

  // ลิงก์ปุ่ม "ลงทะเบียน" (ใส่ลิงก์ Google Form หรือเว็บหลังบ้านตรงนี้)
  REGISTER_URL: "#",
};

/* ---------- ใส่ลิงก์ลงทะเบียนให้ทุกปุ่มที่มี data-link="register" ---------- */
document.querySelectorAll('[data-link="register"]').forEach((el) => {
  el.href = CONFIG.REGISTER_URL;
  if (CONFIG.REGISTER_URL.startsWith("http")) {
    el.target = "_blank";
    el.rel = "noopener";
    el.setAttribute("aria-label", el.textContent.trim() + " (เปิดในแท็บใหม่)");
  }
});

/* ---------- เมนูมือถือ (ปุ่มสามขีด) ---------- */
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.querySelector(".sr-only").textContent = isOpen ? "ปิดเมนู" : "เปิดเมนู";
  });
  // กด Esc เพื่อปิดเมนู
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

/* ---------- ตัวนับถอยหลัง ---------- */
const cd = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  minutes: document.getElementById("cd-minutes"),
  seconds: document.getElementById("cd-seconds"),
};

function updateCountdown() {
  if (!cd.days) return;
  const diff = new Date(CONFIG.EVENT_START).getTime() - Date.now();

  if (diff <= 0) {
    cd.days.textContent = cd.hours.textContent = cd.minutes.textContent = cd.seconds.textContent = "0";
    return;
  }
  const s = Math.floor(diff / 1000);
  cd.days.textContent = Math.floor(s / 86400);
  cd.hours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  cd.minutes.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  cd.seconds.textContent = String(s % 60).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- ไทม์ไลน์กำหนดการ: คำนวณ "อีกกี่วัน / สิ้นสุดแล้ว" อัตโนมัติ ---------- */
document.querySelectorAll(".timeline").forEach((list) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let nextMarked = false;

  list.querySelectorAll(".tl-item").forEach((item) => {
    const status = item.querySelector(".tl-status");
    const date = new Date(item.dataset.date + "T00:00:00+07:00");
    const days = Math.round((date - today) / 86400000);

    if (days < 0) {
      item.classList.add("is-past");
      if (status) status.textContent = "สิ้นสุดแล้ว";
    } else {
      if (!nextMarked) {
        item.classList.add("is-next");
        nextMarked = true;
      }
      if (status) status.textContent = days === 0 ? "วันนี้" : `อีก ${days} วัน`;
    }
  });
});
