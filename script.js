let cardsOpened = 0;
const maxFreeCards = 10;
let backgroundMusic;
let isMusicPlaying = false;
let currentIntensity = 0;
const maxIntensity = 15;
let hasUserInteracted = false;

const cardPool = [
// Simple Romantic Activities
{ 
    emoji: '🌹',
    text: 'Gently massage your partner’s shoulders and back for 5 minutes. 💆‍♀️💆‍♂️',
    intensity: 3 
},
{ 
    emoji: '💑',
    text: 'Hold your partner close, look into their eyes, and share what you love about them. ❤️👀',
    intensity: 2 
},
{ 
    emoji: '🎶',
    text: 'Slow dance together to a romantic song of your choice. 💃🕺',
    intensity: 3 
},

// Build-up, Intense, Moderate
{ 
    emoji: '🌡️',
    text: 'Tease your partner with light kisses on their neck and ears for 2 minutes. 💋👂',
    intensity: 6 
},
{ 
    emoji: '🫦',
    text: 'Trace your partner’s lips with your fingers, then kiss them deeply for 1 minute. 👄🤲',
    intensity: 7 
},
{ 
    emoji: '👕',
    text: 'Slowly undress your partner while describing what you find most attractive about them. 👗🔥',
    intensity: 7 
},

// Highly Intense and Focuses on Finishing
{ 
    emoji: '⏳',
    text: 'Set a timer for 5 minutes: Explore each other’s favorite spots without finishing until the timer ends. ⏱️💓',
    intensity: 9 
},
{ 
    emoji: '🌀',
    text: 'Take turns driving each other wild using only your hands for 2 minutes each. 🤲🔥',
    intensity: 9 
},
{ 
    emoji: '🛏️',
    text: 'Switch to a position of your partner’s choice and keep going until both are satisfied. 🛌✨',
    intensity: 10 
},
{ 
    emoji: '🎭',
    text: 'Roleplay your partner’s ultimate fantasy to end the session on an unforgettable note. 🎭💞',
    intensity: 10 
}

];

function revealCard(e) {
    const card = e.currentTarget;
    if (card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    cardsOpened++;
    
    // Update intensity and remaining cards
    const cardIntensity = Math.min(cardsOpened, maxIntensity);
    updateIntensity(cardIntensity);
    updateRemainingCards();
    
    // Check if all cards are flipped
    if (cardsOpened === maxFreeCards) {
        console.log('All cards flipped, showing session end modal'); // Debug log
        setTimeout(() => {
            showSessionEndedModal();
        }, 1000);
    }
}

function updateRemainingCards() {
    const noticeElement = document.querySelector('.free-cards-notice p');
    if (noticeElement) {
        const remaining = maxFreeCards - cardsOpened;
        noticeElement.textContent = `${remaining} cards remaining`;
        
        if (remaining === 0) {
            setTimeout(() => {
                showSessionEndedModal();
            }, 1000);
        }
    }
}

function showSessionEndedModal() {
    const modalHTML = `
        <div class="modal session-end">
            <div class="modal-content">
                <h2>Session Complete! 🎉</h2>
                <p>You've completed all cards in this session.</p>
                <button onclick="redirectToPayment()" class="submit-button">Purchase More Cards for ₹20</button>
                <button onclick="closeModal(this)" class="submit-button secondary">Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function redirectToPayment() {
    window.location.href = 'https://ucove.in/shop';
}

function closeModal(button) {
    const modal = button.closest('.modal');
    if (modal) modal.remove();
}

function showInteractionMessage() {
    // Remove any existing messages
    const existingMsg = document.querySelector('.interaction-message');
    if (existingMsg) existingMsg.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = 'interaction-message';
    messageDiv.textContent = 'Click anywhere on the page first to enable music';
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Enable audio on first interaction
document.addEventListener('click', function() {
    console.log('Page clicked - enabling audio'); // Debug log
    hasUserInteracted = true;
    const message = document.querySelector('.interaction-message');
    if (message) message.remove();
    
    if (backgroundMusic) {
        backgroundMusic.load();
    }
}, { once: true });

// Initialize audio when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document ready - setting up audio'); // Debug log
    setupAudio();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isMusicPlaying) {
        backgroundMusic.pause();
    } else if (!document.hidden && isMusicPlaying) {
        backgroundMusic.play().catch(err => console.error('Resume playback failed:', err));
    }
});

// Navigation functions
function showPersonalizationForm() {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('personalization-form').classList.add('active');
    updateCreditsVisibility();
}

function goBack() {
    const currentScreen = document.querySelector('.screen.active');
    const previousScreen = currentScreen.previousElementSibling;
    
    if (previousScreen && previousScreen.classList.contains('screen')) {
        currentScreen.classList.remove('active');
        previousScreen.classList.add('active');
    }
}

function exitGame() {
    if (confirm('Are you sure you want to exit the game?')) {
        window.location.href = 'index.html';
    }
}

// Card generation and game logic
function generateCards(personalizedDeck) {
    const container = document.querySelector('.cards-container');
    container.innerHTML = '';

    personalizedDeck.forEach((card, i) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = i;
        cardElement.dataset.intensity = card.intensity;
        
        const front = document.createElement('div');
        front.className = 'front';
        front.innerHTML = `
            <div class="card-content">
                <div class="emoji">${card.emoji}</div>
                <div class="intensity-indicator">Level ${card.intensity}</div>
                <div class="card-number">Card ${i + 1}</div>
            </div>
        `;
        
        const back = document.createElement('div');
        back.className = 'back';
        back.innerHTML = `
            <div class="content-wrapper">
                <div class="emoji-small">${card.emoji}</div>
                <p>${card.text}</p>
                <div class="intensity-level-indicator">Intensity: ${card.intensity}</div>
                <div class="emoji-small">${card.emoji}</div>
            </div>
        `;
        
        cardElement.appendChild(front);
        cardElement.appendChild(back);
        
        cardElement.addEventListener('click', revealCard);
        container.appendChild(cardElement);
    });
}

// Create animated background
function createAmbientBackground() {
    const background = document.createElement('div');
    background.className = 'ambient-background';
    
    // Create multiple bubbles
    for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'floating-bubble';
        
        // Randomize bubble properties
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
        bubble.style.width = `${Math.random() * 100 + 50}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        bubble.style.animationDuration = `${15 + Math.random() * 15}s`;
        
        background.appendChild(bubble);
    }
    
    document.body.appendChild(background);
}

// Simple audio setup function
function setupAudio() {
    // Create audio element
    backgroundMusic = new Audio();
    backgroundMusic.src = 'videoplayback (2).mp3'; // Test audio URL
    // Once the test audio works, replace with your actual music file:
    // backgroundMusic.src = './assets/music/background.mp3';
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    // Create music control button
    const musicBtn = document.createElement('button');
    musicBtn.className = 'music-control';
    musicBtn.innerHTML = `
        <i class="fas fa-music"></i>
        <span>Play Music</span>
    `;

    // Add click handler
    musicBtn.onclick = function() {
        console.log('Music button clicked'); // Debug log
        
        if (!hasUserInteracted) {
            showInteractionMessage();
            return;
        }

        if (backgroundMusic.paused) {
            // Try to play music
            let playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Music started playing'); // Debug log
                    isMusicPlaying = true;
                    this.innerHTML = `
                        <i class="fas fa-pause"></i>
                        <span>Pause Music</span>
                    `;
                    this.classList.add('playing');
                }).catch(error => {
                    console.error('Playback failed:', error);
                    showInteractionMessage();
                });
            }
        } else {
            // Pause music
            backgroundMusic.pause();
            isMusicPlaying = false;
            this.innerHTML = `
                <i class="fas fa-music"></i>
                <span>Play Music</span>
            `;
            this.classList.remove('playing');
            console.log('Music paused'); // Debug log
        }
    };

    // Add button to page
    document.body.appendChild(musicBtn);
    console.log('Audio setup complete'); // Debug log
}

// Add this function to create intensity meter
function createIntensityMeter() {
    const gameScreen = document.getElementById('game-screen');
    const intensityMeter = document.createElement('div');
    intensityMeter.className = 'intensity-meter';
    intensityMeter.innerHTML = `
        <div class="intensity-label">Intensity Level</div>
        <div class="intensity-bar">
            <div class="intensity-fill"></div>
        </div>
        <div class="intensity-level">Level 0</div>
    `;
    gameScreen.appendChild(intensityMeter);
}

// Update intensity display
function updateIntensity(cardIntensity) {
    currentIntensity += cardIntensity;
    const percentage = (currentIntensity / maxIntensity) * 100;
    
    const intensityFill = document.querySelector('.intensity-fill');
    const intensityLevel = document.querySelector('.intensity-level');
    
    if (intensityFill && intensityLevel) {
        intensityFill.style.width = `${Math.min(percentage, 100)}%`;
        intensityLevel.textContent = `Level ${currentIntensity}`;

        // Update color based on intensity level
        if (currentIntensity <= 5) {
            intensityFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        } else if (currentIntensity <= 10) {
            intensityFill.style.background = 'linear-gradient(90deg, #FFC107, #FF9800)';
        } else {
            intensityFill.style.background = 'linear-gradient(90deg, #FF4B8B, #FF1744)';
        }
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    createAmbientBackground();
    console.log('Audio setup completed');

    // Form submission handler
    document.getElementById('couple-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const partner1Name = this.querySelector('input[placeholder="Partner 1\'s Name"]').value;
        const partner2Name = this.querySelector('input[placeholder="Partner 2\'s Name"]').value;
        const mood = this.querySelector('select[required]').value;
        
        // Generate personalized deck with names
        const personalizedDeck = cardPool.map(card => ({
            ...card,
            text: card.text
                .replace(/your partner/g, partner2Name)
                .replace(/each other/g, `${partner1Name} and ${partner2Name}`)
                .replace(/partner's/g, `${partner2Name}'s`)
                .replace(/both/g, 'both of you')
        }));
        
        // Switch to game screen
        document.getElementById('personalization-form').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        updateCreditsVisibility();
        createIntensityMeter();
        generateCards(personalizedDeck);
    });

    // Add modal close handlers for existing modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal');
            if (modal) modal.remove();
        }
    });

    // Add this to handle mobile interaction
    document.body.addEventListener('touchstart', () => {
        if (backgroundMusic && !isMusicPlaying) {
            backgroundMusic.play().catch(console.error);
        }
    }, { once: true });

    // Add this to restore session on page load
    const savedAccount = sessionStorage.getItem('userAccount');
    if (savedAccount) {
        // Get fresh account data from localStorage
        const accounts = JSON.parse(localStorage.getItem('premiumAccounts') || '[]');
        const parsedAccount = JSON.parse(savedAccount);
        
        // Find the current account in localStorage
        const currentAccount = accounts.find(acc => acc.email === parsedAccount.email);
        
        if (currentAccount) {
            // Use the most up-to-date credit balance from localStorage
            userAccount = currentAccount;
            userCredits = currentAccount.credits;
            isPremiumUser = true;
            
            // Update session storage with current values
            sessionStorage.setItem('userAccount', JSON.stringify(currentAccount));
            sessionStorage.setItem('userCredits', currentAccount.credits.toString());
            
            // Update UI
            updateCreditsDisplay();
            
            console.log('Session restored. Current credits:', userCredits);
        }
    }
});

// Function to generate a personalized deck
function generateRandomDeck() {
    const shuffled = cardPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, maxFreeCards).map((card, i) => ({
        ...card,
        intensity: i + 1 // Increase intensity with each card
    }));
}

// Update the credits visibility based on screen
function updateCreditsVisibility() {
    const credits = document.querySelector('.credits');
    const gameScreen = document.getElementById('game-screen');
    
    if (gameScreen.classList.contains('active')) {
        credits.style.display = 'none';
    } else {
        credits.style.display = 'block';
    }
}

function generatePersonalizedCards(partner1Name, partner2Name) {
    const cardPool = [
        // Level 1-3 (Simple, Sweet Tasks)
        { 
            emoji: '🤗',
            text: `${partner1Name}, give ${partner2Name} a warm, tight hug for 30 seconds`,
            intensity: 1
        },
        { 
            emoji: '👀',
            text: `${partner1Name} and ${partner2Name}, maintain eye contact for one minute while holding hands`,
            intensity: 1
        },
        { 
            emoji: '💝',
            text: `${partner1Name}, whisper three things you love about ${partner2Name}`,
            intensity: 2
        },
        { 
            emoji: '💃',
            text: `${partner1Name} and ${partner2Name}, slow dance together to your favorite song`,
            intensity: 2
        },
        { 
            emoji: '✨',
            text: `${partner1Name}, give ${partner2Name} a gentle shoulder massage`,
            intensity: 3
        },
        { 
            emoji: '🌹',
            text: `${partner2Name}, blindfold ${partner1Name} and feed them their favorite snack`,
            intensity: 3
        },
        // Level 4-6 (Romantic)
        { 
            emoji: '💋',
            text: `${partner1Name}, give ${partner2Name} soft kisses on their neck`,
            intensity: 4
        },
        { 
            emoji: '🎭',
            text: `Role play: ${partner1Name}, pretend you're meeting ${partner2Name} for the first time`,
            intensity: 5
        },
        { 
            emoji: '🌙',
            text: `${partner1Name} and ${partner2Name}, dim the lights and share your favorite romantic memory`,
            intensity: 6
        },
        { 
            emoji: '💫',
            text: `${partner2Name}, create a trail of kisses from ${partner1Name}'s hand to their neck`,
            intensity: 7
        }
    ];

    // Add more romantic cards as needed
    return cardPool;
} 