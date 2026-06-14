// =====================================================
// FLOATING BACKGROUND PETALS
// =====================================================
const bgDecor = document.querySelector(".bg-decor");
const petalChars = ["🌸", "💖", "✨", "💌", "🩷"];

function spawnPetal() {
  const el = document.createElement("span");
  el.className = "petal";
  el.textContent = petalChars[Math.floor(Math.random() * petalChars.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = 14 + Math.random() * 14 + "px";
  el.style.opacity = (0.2 + Math.random() * 0.35).toFixed(2);
  const duration = 9 + Math.random() * 10;
  el.style.animationDuration = duration + "s";
  bgDecor.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000 + 200);
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  for (let i = 0; i < 6; i++) spawnPetal();
  setInterval(spawnPetal, 900);
}

// =====================================================
// PAGE NAVIGATION
// =====================================================
const pages = document.querySelectorAll(".page");
const stamps = document.querySelectorAll(".stamp");

function goToPage(targetPage) {
  pages.forEach((page) => {
    const isActive = Number(page.dataset.page) === targetPage;
    page.classList.toggle("is-active", isActive);
    page.toggleAttribute("inert", !isActive);
  });

  stamps.forEach((stamp) => {
    stamp.classList.toggle("is-done", Number(stamp.dataset.stamp) <= targetPage);
  });
}

// =====================================================
// HALAMAN 1 — BUKA SURAT
// =====================================================
const envelope = document.getElementById("envelope");
const openSeal = document.getElementById("openSeal");

openSeal.addEventListener("click", () => {
  envelope.classList.add("is-open");
  setTimeout(() => goToPage(2), 650);
});

// =====================================================
// HALAMAN 2 — YES / NO (tombol "enggak" suka lari)
// =====================================================
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");

const noTexts = [
  "enggak dulu",
  "yakin nih?",
  "coba klik lagi deh",
  "eh, jangan disitu",
  "kok gamau sih 🥺",
  "yes aja yaa",
];
let noClickCount = 0;

function moveNoButtonAway() {
  const rect = btnNo.getBoundingClientRect();
  const padding = 16;
  const maxX = window.innerWidth - rect.width - padding;
  const maxY = window.innerHeight - rect.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  btnNo.classList.add("is-runaway");
  btnNo.style.left = x + "px";
  btnNo.style.top = y + "px";

  noClickCount = Math.min(noClickCount + 1, noTexts.length - 1);
  btnNo.textContent = noTexts[noClickCount];
}

btnNo.addEventListener("mouseenter", moveNoButtonAway);
btnNo.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButtonAway();
});
btnNo.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoButtonAway();
  },
  { passive: false }
);

btnYes.addEventListener("click", () => {
  burstConfetti();
  // reset tombol "enggak" buat halaman berikutnya
  btnNo.classList.remove("is-runaway");
  btnNo.style.left = "";
  btnNo.style.top = "";
  btnNo.textContent = noTexts[0];
  noClickCount = 0;

  setTimeout(() => goToPage(3), 450);
});

// =====================================================
// HALAMAN 3 — PILIH TANGGAL (bebas hari apa)
// =====================================================
const dateInput = document.getElementById("dateInput");
const dayName = document.getElementById("dayName");
const btnConfirmDate = document.getElementById("btnConfirmDate");
const finalDate = document.getElementById("finalDate");

// minimal tanggal = hari ini
const today = new Date();
dateInput.min = today.toISOString().split("T")[0];

function formatDateID(value) {
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

dateInput.addEventListener("change", () => {
  if (!dateInput.value) {
    btnConfirmDate.disabled = true;
    return;
  }
  dayName.textContent = "oke, jadinya hari " + formatDateID(dateInput.value) + " ya 🥰";
  btnConfirmDate.disabled = false;
});

btnConfirmDate.addEventListener("click", () => {
  if (!dateInput.value) return;

  const tanggal = formatDateID(dateInput.value);

  finalDate.textContent = tanggal;

  emailjs.send(
    "service_7zu82wt",
    "template_ac1f2el",
    {
      nama: "Ajeng",
      tanggal: tanggal,
      title: "Hasil Tiket Date",
      email: "ivandwiseptyawan@gmail.com"
    }
  )
  .then(() => {
    console.log("Email berhasil dikirim");
  })
  .catch((error) => {
    console.error("Email gagal dikirim:", error);
  });

  burstConfetti();
  goToPage(4);
});
// =====================================================
// HALAMAN 4 — UBAH TANGGAL (balik ke halaman 3)
// =====================================================
document.getElementById("btnEditDate").addEventListener("click", () => {
  goToPage(3);
});

// =====================================================
// CONFETTI
// =====================================================
const confettiLayer = document.getElementById("confetti-layer");
const confettiChars = ["💖", "🎉", "🌸", "✨", "💌", "🩷"];

function burstConfetti() {
  if (prefersReducedMotion) return;

  const amount = 26;
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent =
      confettiChars[Math.floor(Math.random() * confettiChars.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.fontSize = 14 + Math.random() * 16 + "px";
    piece.style.animationDuration = 1.4 + Math.random() * 1.6 + "s";
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}

// =====================================================
// INIT
// =====================================================
goToPage(1);
