document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOGIC FOR INDEX.HTML (Intro) ---
    const introSection = document.getElementById('intro-animation');
    const profileSection = document.getElementById('profile-gate');
    
    if (introSection) {
        // รอ 2.8 วิ (Zoom Out)
        setTimeout(() => {
            introSection.classList.add('fade-out');

            // รอ Fade Out จบ -> ลบ -> โชว์ Profile
            setTimeout(() => {
                introSection.classList.add('hidden');
                profileSection.classList.remove('hidden');
                profileSection.style.display = 'flex';
                profileSection.classList.add('fade-in');
            }, 800);

        }, 2800);
    }

    // --- 2. LOGIC FOR HOME.HTML (Scroll Reveal) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));


    // --- 3. NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('nav');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

// --- FUNCTION: ย้ายจาก Profile -> Home ---
function enterSite() {
    const profileSection = document.getElementById('profile-gate');
    profileSection.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 800);
}