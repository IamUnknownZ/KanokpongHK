document.addEventListener('DOMContentLoaded', () => {
    
    // Select Elements from index.html
    const introSection = document.getElementById('intro-animation');
    const profileSection = document.getElementById('profile-gate');
    const dashboard = document.getElementById('dashboard');

    // --- LOGIC FOR INTRO TRANSITION ---
    // Only run this if we are on the index page (where introSection exists)
    if (introSection) {
        
        // Step 1: Play the Zoom Animation (Wait 3s)
        setTimeout(() => {
            
            // Step 2: Trigger Fade Out on the Logo
            introSection.classList.add('fade-out');

            // Step 3: Wait for fade out to complete (1s buffer)
            setTimeout(() => {
                introSection.classList.add('hidden'); // Remove intro completely
                
                // Show Profiles
                profileSection.classList.remove('hidden'); 
                profileSection.style.display = 'flex'; // Ensure Flex layout is applied
                profileSection.classList.add('fade-in'); // Trigger Fade In
                
            }, 1000); 

        }, 3000); 
    }
});

// --- LOGIC FOR ENTERING THE SITE ---
// Called when user clicks a Profile Picture
function enterSite() {
    const profileSection = document.getElementById('profile-gate');
    const dashboard = document.getElementById('dashboard');

    // 1. Fade out the Profile Selection screen
    profileSection.classList.add('fade-out');

    // 2. Wait for fade (0.8s) then swap to Dashboard
    setTimeout(() => {
        // Hide Profiles
        profileSection.classList.add('hidden');
        profileSection.style.display = 'none';

        // Show Dashboard
        dashboard.classList.remove('hidden');
        dashboard.classList.add('fade-in');
        
    }, 800); 
}
// --- LOGIC FOR CLICKING PLAY (Fade to Black) ---
function playMovie(e) {
    e.preventDefault(); // Stop the link from jumping immediately
    
    const dashboard = document.getElementById('dashboard');

    // 1. Fade out the current dashboard (revealing the black body background)
    dashboard.classList.add('fade-out');

    // 2. Wait for the animation (1s), then go to the next page
    setTimeout(() => {
        window.location.href = 'story.html';
    }, 1000);
}