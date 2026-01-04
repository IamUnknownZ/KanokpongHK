document.addEventListener("DOMContentLoaded", () => {
  // ✅ หน้า Welcome (index.html) รันแค่นี้พอ
  if (document.body.classList.contains("index-body")) {
    initWelcomeGate();
    return;
  }

  // ✅ หน้า home.html
  initScrollReveal();
  initNavbarScroll();
  initLogoScrollTop();
  initCopyTitle();
  initScrollProgress();
  initBackToTop();
  initHobbyModal();
  initSeason3Carousel();
  initHomeLoader();
  initYouTubeMusic();
});

/* =========================
   WELCOME (index.html)
   - รอ animationend + fallback
   - fade overlay ออกก่อน แล้วค่อยซ่อน
   - click profile -> fade แล้วไป home.html
========================= */
function initWelcomeGate(){
  const intro = document.getElementById("intro-animation");
  const logo = intro?.querySelector(".netflix-logo-anim");
  const gate = document.getElementById("profile-gate");
  const profileDev = document.getElementById("profileDev");

  if(!intro || !gate) return;

  gate.classList.add("hidden");
  document.body.style.overflow = "hidden";

  let done = false;

  const showGate = () => {
    if(done) return;
    done = true;

    intro.classList.add("is-hide");

    setTimeout(() => {
      intro.classList.add("hidden");
      gate.classList.remove("hidden");
      gate.classList.add("fade-in");
      document.body.style.overflow = "";
    }, 580);
  };

  if(logo){
    logo.addEventListener("animationend", showGate, { once:true });
  }
  setTimeout(showGate, 3400);

  if(profileDev){
    profileDev.addEventListener("click", () => {
      gate.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = "home.html";
      }, 450);
    });
  }
}

/* =========================
   Scroll Reveal
========================= */
function initScrollReveal() {
  const hiddenElements = document.querySelectorAll(".reveal");
  if (!hiddenElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  }, { threshold: 0.12 });

  hiddenElements.forEach((el) => observer.observe(el));
}

/* =========================
   Navbar Scroll
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

/* =========================
   Logo Scroll Top
========================= */
function initLogoScrollTop() {
  const logo = document.getElementById("logoTop");
  if (!logo) return;

  logo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================
   Copy Title
========================= */
function initCopyTitle() {
  const btn = document.getElementById("copyTitleBtn");
  if(!btn) return;

  btn.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText("NAN CHUN - SE SO NEON");
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => btn.innerHTML = original, 2000);
    }catch(e){
      // ignore
    }
  });
}

/* =========================
   Scroll Progress Bar
========================= */
function initScrollProgress(){
  const bar = document.getElementById("scroll-progress");
  if(!bar) return;

  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = pct.toFixed(2) + "%";
    ticking = false;
  };

  const onScroll = () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

/* =========================
   Back To Top
========================= */
function initBackToTop(){
  const btn = document.getElementById("backToTop");
  if(!btn) return;

  const toggle = () => {
    if(window.scrollY > 600) btn.classList.add("is-show");
    else btn.classList.remove("is-show");
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
}

/* =========================
   Season 2 — Modal
========================= */
function initHobbyModal(){
  const modal = document.getElementById("hobbyModal");
  if(!modal) return;

  const titleEl = document.getElementById("hobbyModalTitle");
  const reasonEl = document.getElementById("hobbyModalReason");
  const iconEl = document.getElementById("hobbyModalIcon");

  function open({ title, reason, icon }){
    if(titleEl) titleEl.textContent = title || "Hobby";
    if(reasonEl) reasonEl.textContent = reason || "";
    if(iconEl) iconEl.innerHTML = `<i class="${icon || "fa-solid fa-star"}"></i>`;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function close(){
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".hobby-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      open({
        title: btn.dataset.title,
        reason: btn.dataset.reason,
        icon: btn.dataset.icon
      });
    });
  });

  modal.addEventListener("click", (e) => {
    if(e.target && e.target.hasAttribute("data-modal-close")) close();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && !modal.classList.contains("hidden")) close();
  });
}

/* =========================
   Season 3 — Carousel
========================= */
function initSeason3Carousel(){
  const hero = document.getElementById("movieHero");
  if(!hero) return;

  const cards = Array.from(hero.querySelectorAll(".card-movie"));
  const prevBtn = document.getElementById("moviePrev");
  const nextBtn = document.getElementById("movieNext");
  const pauseBtn = document.getElementById("moviePause");
  const pauseIcon = document.getElementById("moviePauseIcon");
  const pauseText = document.getElementById("moviePauseText");
  const counter = document.getElementById("movieCounter");

  if(!cards.length) return;

  const AUTO_MS = 6000;

  let index = cards.findIndex(c => c.classList.contains("card-movie--active"));
  if(index < 0) index = 0;

  // ✅ กันเคส active หลุด/ผิด
  cards.forEach(c => c.classList.remove("card-movie--active"));
  cards[index].classList.add("card-movie--active");

  let timer = null;
  let paused = false;

  function fmt(n){ return String(n).padStart(2, "0"); }

  function setCounter(){
    if(!counter) return;
    counter.textContent = `${fmt(index+1)} / ${fmt(cards.length)}`;
  }

  function activate(newIndex){
    if(newIndex === index) return;

    cards[index].classList.remove("card-movie--active");
    index = (newIndex + cards.length) % cards.length;
    cards[index].classList.add("card-movie--active");

    setCounter();
  }

  function next(){ activate(index + 1); }
  function prev(){ activate(index - 1); }

  function startAuto(){
    stopAuto();
    if(paused) return;
    timer = setInterval(next, AUTO_MS);
  }

  function stopAuto(){
    if(timer) clearInterval(timer);
    timer = null;
  }

  function togglePause(){
    paused = !paused;

    if(paused){
      stopAuto();
      if(pauseIcon) pauseIcon.className = "fa-solid fa-play";
      if(pauseText) pauseText.textContent = "Play";
      pauseBtn?.setAttribute("aria-label", "Resume autoplay");
    }else{
      startAuto();
      if(pauseIcon) pauseIcon.className = "fa-solid fa-pause";
      if(pauseText) pauseText.textContent = "Pause";
      pauseBtn?.setAttribute("aria-label", "Pause autoplay");
    }
  }

  prevBtn?.addEventListener("click", () => { prev(); startAuto(); });
  nextBtn?.addEventListener("click", () => { next(); startAuto(); });
  pauseBtn?.addEventListener("click", togglePause);

  // swipe
  let startX = 0, startY = 0, dragging = false;

  hero.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    dragging = true;
  }, { passive: true });

  hero.addEventListener("touchmove", (e) => {
    if(!dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30){
      dragging = false;
      if(dx < 0) next();
      else prev();
      startAuto();
    }
  }, { passive: true });

  hero.addEventListener("touchend", () => { dragging = false; }, { passive: true });

  setCounter();
  startAuto();

  document.addEventListener("visibilitychange", () => {
    if(document.hidden) stopAuto();
    else startAuto();
  });
}

/* =========================
   HOME LOADER (3s + preload)
========================= */
function initHomeLoader(){
  const loader = document.getElementById("home-loader");
  if(!loader) return;

  const MIN_DELAY = 3000;
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  function preloadUrl(url){
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  function collectEssentialUrls(){
    const urls = new Set();

    // season 3 backgrounds (inline style)
    document.querySelectorAll("#season3 .card-movie").forEach((el) => {
      const bg = el.style.backgroundImage || "";
      const m = bg.match(/url\((['"]?)(.*?)\1\)/i);
      if(m && m[2]) urls.add(m[2]);
    });

    // ✅ dashboard background (computed style กันกรณีใช้ shorthand)
    const dash = document.getElementById("dashboard");
    if(dash){
      const bg = getComputedStyle(dash).backgroundImage || "";
      const m = bg.match(/url\((['"]?)(.*?)\1\)/i);
      if(m && m[2]) urls.add(m[2]);
    }

    return [...urls];
  }

  async function run(){
    const urls = collectEssentialUrls();
    const preloadPromise = Promise.allSettled(urls.map(preloadUrl));
    const delayPromise = wait(MIN_DELAY);

    await Promise.all([preloadPromise, delayPromise]);

    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 600);
  }

  window.addEventListener("load", run, { once:true });
}

/* =========================
   YouTube Music Player (Season 4)
========================= */
function initYouTubeMusic(){
  if(!document.getElementById("yt-nan-player")) return;

  // กันโหลดซ้ำถ้ามีอะไรเรียกซ้ำ
  if(window.__yt_api_loaded__) return;
  window.__yt_api_loaded__ = true;

  let player;
  let isPlaying = false;
  let updateInterval = null;

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player("yt-nan-player", {
      height: "0",
      width: "0",
      videoId: "A5ZWtVZafIs",
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  function onPlayerReady() {
    const btnPlay = document.getElementById("npPlay");
    const btnStop = document.getElementById("npStop");
    const seek = document.getElementById("npSeek");

    const vol = document.getElementById("npVolume");
    const volVal = document.getElementById("npVolVal");
    const muteBtn = document.getElementById("npMute");
    const muteIcon = document.getElementById("npMuteIcon");

    if(player && vol){
      const v = parseInt(vol.value || "70", 10);
      player.setVolume(Math.max(0, Math.min(100, v)));
      if(volVal) volVal.textContent = String(v);
    }

    btnPlay?.addEventListener("click", () => {
      if(!player) return;
      if(isPlaying) player.pauseVideo();
      else player.playVideo();
    });

    btnStop?.addEventListener("click", () => {
      if(!player) return;
      player.pauseVideo();
      player.seekTo(0, true);
      isPlaying = false;
      updateUI(false);
      stopLoop();
      if(seek) seek.value = 0;
      const cur = document.getElementById("npCurrent");
      if(cur) cur.innerText = "0:00";
    });

    seek?.addEventListener("input", function() {
      if(!player) return;
      const duration = player.getDuration();
      if(duration){
        const seekTo = duration * (this.value / 100);
        player.seekTo(seekTo, true);
      }
    });

    vol?.addEventListener("input", function(){
      if(!player) return;
      const v = parseInt(this.value, 10);
      player.setVolume(v);
      if(volVal) volVal.textContent = String(v);

      if(player.isMuted && player.isMuted()){
        player.unMute();
        if(muteIcon) muteIcon.className = "fa-solid fa-volume-high";
      }
    });

    muteBtn?.addEventListener("click", () => {
      if(!player) return;
      if(player.isMuted && player.isMuted()){
        player.unMute();
        if(muteIcon) muteIcon.className = "fa-solid fa-volume-high";
      }else{
        player.mute();
        if(muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
      }
    });
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      isPlaying = true;
      updateUI(true);
      startLoop();
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      isPlaying = false;
      updateUI(false);
      stopLoop();
      if(event.data === YT.PlayerState.ENDED) {
        const seek = document.getElementById("npSeek");
        if(seek) seek.value = 0;
      }
    }
  }

  function updateUI(playing) {
    const icon = document.getElementById("npPlayIcon");
    const text = document.getElementById("npPlayText");
    const disc = document.getElementById("npDisc");
    const status = document.getElementById("npStatus");

    if(!icon || !text || !disc || !status) return;

    if(playing) {
      icon.className = "fa-solid fa-pause";
      text.innerText = "Pause";
      disc.classList.add("spin-slow");
      status.innerText = "Playing...";
    } else {
      icon.className = "fa-solid fa-play";
      text.innerText = "Play";
      disc.classList.remove("spin-slow");
      status.innerText = "";
    }
  }

  function startLoop() {
    stopLoop();
    updateInterval = setInterval(() => {
      if(!player || !player.getDuration) return;
      const ct = player.getCurrentTime();
      const dur = player.getDuration();
      if(dur > 0) {
        const seek = document.getElementById("npSeek");
        const cur = document.getElementById("npCurrent");
        const total = document.getElementById("npDuration");
        if(seek) seek.value = (ct / dur) * 100;
        if(cur) cur.innerText = fmtTime(ct);
        if(total) total.innerText = fmtTime(dur);
      }
    }, 1000);
  }

  function stopLoop() {
    if(updateInterval) clearInterval(updateInterval);
    updateInterval = null;
  }

  function fmtTime(s) {
    const m = Math.floor(s / 60);
    const sc = Math.floor(s % 60);
    return m + ":" + (sc < 10 ? "0"+sc : sc);
  }
}
