document.addEventListener("DOMContentLoaded", () => {
  initIntroGate();
  initProfileGateLinks();
  initScrollReveal();
  initNavbarScroll();
  initLogoScrollTop();
  initCopyTitle();
});

/* =========================
   INDEX & NAV LOGIC
========================= */
function initIntroGate() {
  const intro = document.getElementById("intro-animation");
  const gate = document.getElementById("profile-gate");
  if (!intro || !gate) return;

  gate.classList.add("hidden");
  setTimeout(() => {
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.classList.add("hidden");
      gate.classList.remove("hidden");
      gate.classList.add("fade-in");
    }, 800);
  }, 2800);
}

function initProfileGateLinks() {
  const dev = document.getElementById("profileDev");
  const goHome = () => {
    const gate = document.getElementById("profile-gate");
    if(gate) gate.classList.add("fade-out");
    setTimeout(() => window.location.href = "home.html", 450);
  };
  if(dev) dev.addEventListener("click", goHome);
}

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
  const logo = document.getElementById("logoTop");
  if (!logo) return;
  logo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initCopyTitle() {
  const btn = document.getElementById("copyTitleBtn");
  if(!btn) return;
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText("NAN CHUN - SE SO NEON");
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => btn.innerHTML = originalContent, 2000);
  });
}

/* =========================
   YOUTUBE PLAYERS (Music + Movie Slider)
========================= */
var player;
var isPlaying = false;
var updateInterval;
var moviePlayers = [];
var currentMovie = 0;

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Global YouTube Ready Function
window.onYouTubeIframeAPIReady = function() {
  
  // 1. Setup Music Player (Season 4)
  if (document.getElementById('yt-nan-player')) {
    player = new YT.Player('yt-nan-player', {
      height: '0', 
      width: '0',
      videoId: 'A5ZWtVZafIs', 
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  /* =========================
   SEASON 3: SIMPLE SLIDER (NO TRAILER)
========================= */
var currentMovie = 0;

$(function () {
  // Navigation Dots only
  $('[data-navigation] li').on('click', function () {
    var newIndex = $(this).index();
    if (newIndex === currentMovie) return;

    currentMovie = newIndex;

    $('[data-navigation] li')
      .removeClass('is-active')
      .eq(newIndex)
      .addClass('is-active');

    $('.card-movie')
      .removeClass('card-movie--active')
      .eq(newIndex)
      .addClass('card-movie--active');
  });
});

}

// --- Music Player Logic ---
function onPlayerReady(event) {
  const btnPlay = document.getElementById("npPlay");
  const btnStop = document.getElementById("npStop");
  const seek = document.getElementById("npSeek");

  btnPlay.addEventListener("click", () => {
    if(!player) return;
    if(isPlaying) player.pauseVideo();
    else player.playVideo();
  });

  btnStop.addEventListener("click", () => {
    if(player) {
      player.pauseVideo();
      player.seekTo(0);
    }
    isPlaying = false;
    updateUI(false);
    stopLoop();
    seek.value = 0;
    document.getElementById("npCurrent").innerText = "0:00";
  });

  seek.addEventListener("input", function() {
    const duration = player.getDuration();
    if (duration) {
      const seekTo = duration * (this.value / 100);
      player.seekTo(seekTo, true);
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    isPlaying = true;
    updateUI(true);
    startLoop();
  } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
    isPlaying = false;
    updateUI(false);
    stopLoop();
    if(event.data == YT.PlayerState.ENDED) document.getElementById("npSeek").value = 0;
  }
}

function updateUI(playing) {
  const icon = document.getElementById("npPlayIcon");
  const text = document.getElementById("npPlayText");
  const disc = document.getElementById("npDisc");
  const status = document.getElementById("npStatus");

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
      document.getElementById("npSeek").value = (ct / dur) * 100;
      document.getElementById("npCurrent").innerText = fmtTime(ct);
      document.getElementById("npDuration").innerText = fmtTime(dur);
    }
  }, 1000);
}

function stopLoop() {
  clearInterval(updateInterval);
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sc = Math.floor(s % 60);
  return m + ":" + (sc < 10 ? "0"+sc : sc);
}

// --- Movie Slider Logic (jQuery) ---
$(function() {
    // Play Trailer Button
    $('[data-play]').on('click', function() {
        var $card = $('.card-movie--active');
        var idx = $card.index();
        var currentPlayer = moviePlayers[idx];

        if ($card.hasClass('card-movie--playing')) {
            $(this).removeClass('is-playing');
            $card.removeClass('card-movie--playing');
            if(currentPlayer && typeof currentPlayer.pauseVideo === 'function') currentPlayer.pauseVideo();
        } else {
            $(this).addClass('is-playing');
            $card.addClass('card-movie--playing');
            if(currentPlayer && typeof currentPlayer.playVideo === 'function') currentPlayer.playVideo();
        }
    });

    // Navigation Dots
    $('[data-navigation] li').on('click', function() {
        var newIndex = $(this).index();
        if(newIndex === currentMovie) return;

        resetMoviePlayer(); // Stop current video

        currentMovie = newIndex;
        $('[data-navigation] li').removeClass('is-active').eq(newIndex).addClass('is-active');
        $('.card-movie').removeClass('card-movie--active').eq(newIndex).addClass('card-movie--active');
    });

    // Helper to stop video inside slider
    window.resetMoviePlayer = function() {
        var $card = $('.card-movie--active');
        var idx = $card.index();
        var currentPlayer = moviePlayers[idx];

        $card.removeClass('card-movie--playing');
        $('[data-play]').removeClass('is-playing');
        
        if(currentPlayer && typeof currentPlayer.stopVideo === 'function') {
            currentPlayer.stopVideo(); // Stop trailer
        }
    }
}); 