document.addEventListener("DOMContentLoaded", () => {
  initIntroGate();       // index.html intro -> profile gate
  initProfileGateLinks();// index.html click profiles -> home.html
  initScrollReveal();    // home.html reveal animation
  initNavbarScroll();    // home.html navbar background on scroll
  initLogoScrollTop();   // home.html logo click to top
});

/* =========================
   INDEX: INTRO -> PROFILE GATE
========================= */
function initIntroGate() {
  const intro = document.getElementById("intro-animation");
  const gate = document.getElementById("profile-gate");
  if (!intro || !gate) return;

  // ให้แน่ใจว่า gate ซ่อนไว้ก่อน
  gate.classList.add("hidden");

  // ให้ตรงกับความยาว animation ใน CSS (3s) เผื่อ buffer
  setTimeout(() => {
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.classList.add("hidden");
      gate.classList.remove("hidden");
      gate.classList.add("fade-in");
    }, 800);
  }, 2800);
}

/* =========================
   INDEX: CLICK PROFILE -> HOME
========================= */
function initProfileGateLinks() {
  const dev = document.getElementById("profileDev");
  const teacher = document.getElementById("profileTeacher");

  if (!dev && !teacher) return; // not on index

  const goHome = () => {
    const gate = document.getElementById("profile-gate");
    if (gate) gate.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "home.html";
    }, 450);
  };

  dev?.addEventListener("click", goHome);
  teacher?.addEventListener("click", goHome);

  // เผื่อกด Enter/Space (accessibility)
  dev?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") goHome();
  });
  teacher?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") goHome();
  });
}

/* =========================
   HOME: SCROLL REVEAL (เหมือนเดิม)
========================= */
function initScrollReveal() {
  const hiddenElements = document.querySelectorAll(".reveal");
  if (!hiddenElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
        // ถ้าอยากให้เลื่อนกลับแล้วซ่อนอีกครั้ง ให้เปิดบรรทัดล่าง
        // else entry.target.classList.remove("active");
      });
    },
    { threshold: 0.12 }
  );

  hiddenElements.forEach((el) => observer.observe(el));
}

/* =========================
   HOME: NAVBAR EFFECT
========================= */
function initNavbarScroll() {
  const navbar = document.querySelector("nav");
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initLogoScrollTop() {
  const logo = document.getElementById("logoTop") || document.querySelector(".logo");
  if (!logo) return;
  logo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
