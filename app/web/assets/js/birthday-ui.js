// birthday-ui.js

// Function to check if today is June 14th OR if the test override is active
function isBirthdayToday() {
    const today = new Date();
    const month = today.getMonth(); // getMonth() is 0-indexed (0 for January, 5 for June)
    const day = today.getDate(); // getDate() is 1-indexed

    // Check for a query parameter override for testing, e.g., ?birthday=true
    const urlParams = new URLSearchParams(window.location.search);
    const testOverride = urlParams.get('birthday');

    // Return true if it's June 14th OR if the 'birthday' query parameter is set to 'true'
    return (month === 5 && day === 14) || (testOverride === 'true');
}

// Function to add a simple confetti effect
function addConfettiEffect() {
    // This is a very basic confetti effect using CSS and div elements
    // For a more robust effect, you might use a library like confetti.js

    // Ensure document.body exists before trying to append
    if (!document.body) {
        console.error("Cannot add confetti: document.body is not available.");
        return; // Exit the function if body is null
    }

    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none'; // Allow clicks to pass through
    confettiContainer.style.zIndex = '9999'; // Ensure it's on top
    confettiContainer.classList.add('confetti-container'); // Add class for easier targeting if needed

    document.body.appendChild(confettiContainer);

    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f']; // Confetti colors

    for (let i = 0; i < 100; i++) { // Create 100 confetti pieces
        const confetti = document.createElement('div');
        confetti.classList.add('confetti'); // Add class for easier targeting if needed
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        confetti.style.top = `${Math.random() * 100}vh`; // Random vertical position
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`; // Random rotation
        confetti.style.opacity = Math.random(); // Random opacity
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`; // Fall animation

        confettiContainer.appendChild(confetti);
    }

    // Add a basic CSS animation for falling confetti
    // Check if the style element already exists to avoid adding it multiple times
    if (!document.getElementById('confetti-fall-animation')) {
         // Ensure document.head exists before trying to append
         if (!document.head) {
             console.error("Cannot add confetti styles: document.head is not available.");
             return; // Exit if head is null
         }
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.id = 'confetti-fall-animation'; // Add an ID for easy checking
        styleSheet.innerText = `
            @keyframes fall {
                0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// --- Main execution wrapped in DOMContentLoaded listener ---
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed'); // Log when DOM is ready

    // Check if it's the birthday or the test override is active
    if (isBirthdayToday()) {
        console.log("Birthday mode active! Adding birthday UI effects.");
        // Add your desired UI changes here
        addConfettiEffect(); // Example: add confetti

        // You could add more specific changes here, e.g.:
        // document.body.style.backgroundColor = '#ffe4e1'; // Change background color
        // const pageTitle = document.querySelector('h1');
        // if (pageTitle) {
        //     pageTitle.textContent = 'Happy Birthday!'; // Change title text
        // }
        // Create and add a birthday message element
        // const birthdayMessage = document.createElement('div');
        // birthdayMessage.textContent = "Wishing you a fantastic birthday!";
        // birthdayMessage.style.textAlign = 'center';
        // birthdayMessage.style.marginTop = '20px';
        // document.body.prepend(birthdayMessage); // Add message at the top

    } else {
        console.log("Birthday mode not active. No special UI effects.");
    }
});

