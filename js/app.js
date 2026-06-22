document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();

    // --- TYPEWRITER ENGINE START ---
    function typeHTML(element, htmlString, speed = 18) {
        // Splits HTML into tags and plain text tokens
        const tokens = htmlString.match(/(<[^>]+>)|([^<]+)/g);
        let currentTokenIndex = 0;
        let charIndex = 0;
        let typedText = '';
        let intervalId = null;

        function processNext() {
            if (currentTokenIndex >= tokens.length) {
                clearInterval(intervalId);
                element.dataset.typewriterInterval = null;
                element.dataset.isTypingComplete = 'true';
                return;
            }

            let token = tokens[currentTokenIndex];
            if (token.startsWith('<')) {
                // Tags are appended instantly
                typedText += token;
                element.innerHTML = typedText;
                currentTokenIndex++;
                processNext(); // Instantly process next token
                return;
            }

            // Type plain text char by char
            if (charIndex < token.length) {
                typedText += token[charIndex];
                element.innerHTML = typedText;
                charIndex++;
            } else {
                charIndex = 0;
                currentTokenIndex++;
                processNext();
            }
        }

        intervalId = setInterval(processNext, speed);
        element.dataset.typewriterInterval = intervalId;
        element.dataset.isTypingComplete = 'false';
    }
    // --- TYPEWRITER ENGINE END ---


    // Team entry screen elements
    const teamEntryScreen = document.getElementById('teamEntryScreen');
    const mainGameUI = document.getElementById('mainGameUI');
    const initialTeamInput = document.getElementById('initialTeamName');
    const startBtn = document.getElementById('startGameBtn');
    const displayTeamSpan = document.getElementById('displayTeamName');
    const resetBtn = document.getElementById('resetGameBtn');

    // Check if a team name already exists (from previous session)
    const existingTeam = getTeamName();
    if (existingTeam) {
        teamEntryScreen.style.display = 'none';
        mainGameUI.style.display = 'block';
        displayTeamSpan.textContent = existingTeam;
        initialTeamInput.value = existingTeam;
        initGame();
    }

// Start Quest Button
startBtn.addEventListener('click', () => {
    const teamName = initialTeamInput.value.trim();
    if (teamName === "") {
        alert("Please enter a team name.");
        return;
    }
    setTeamName(teamName);
    displayTeamSpan.textContent = teamName;
    teamEntryScreen.style.display = 'none';
    
    const storyModal = document.getElementById('storyModal');
    const slidesContainer = document.getElementById('storySlidesContainer');
    const slides = slidesContainer.querySelectorAll('.story-slide');
    const continueBtn = document.getElementById('storyContinueBtn');
    const beginBtn = document.getElementById('beginGameBtn');

    if (!slides || slides.length === 0) return;

    // Store original HTML and reset typing state for all slides
    slides.forEach((slide) => {
        slide.dataset.originalHtml = slide.innerHTML;
        slide.innerHTML = '';
        slide.classList.remove('active-slide');
        slide.dataset.typewriterInterval = null;
        slide.dataset.isTypingComplete = 'false';
    });
    
    // Activate Slide 1 and start typing
    slides[0].classList.add('active-slide');
    typeHTML(slides[0], slides[0].dataset.originalHtml, 18); // Speed 18ms per char
    
    continueBtn.style.display = 'inline-block';
    beginBtn.style.display = 'none';
    storyModal.style.display = 'flex';
});

// Add listener for the begin button
const beginBtn = document.getElementById('beginGameBtn');
beginBtn.addEventListener('click', () => {
    const storyModal = document.getElementById('storyModal');
    storyModal.style.display = 'none';
    mainGameUI.style.display = 'block';
    initGame();
    setStartTime(); // start timer now
});

// "Continue" Button Logic
document.getElementById('storyContinueBtn').addEventListener('click', function() {
    const slidesContainer = document.getElementById('storySlidesContainer');
    const slides = slidesContainer.querySelectorAll('.story-slide');
    const currentActive = slidesContainer.querySelector('.story-slide.active-slide');
    
    if (!slides || slides.length === 0 || !currentActive) return;

    const currentIndex = Array.from(slides).indexOf(currentActive);
    const isTypingComplete = currentActive.dataset.isTypingComplete === 'true';

    // ACTION 1: If text is still typing, INSTANTLY reveal the full text
    if (!isTypingComplete) {
        if (currentActive.dataset.typewriterInterval) {
            clearInterval(currentActive.dataset.typewriterInterval);
            currentActive.dataset.typewriterInterval = null;
        }
        currentActive.innerHTML = currentActive.dataset.originalHtml;
        currentActive.dataset.isTypingComplete = 'true';
        return; // Stop here. They must click "Continue" again to advance.
    }

    // ACTION 2: Text is fully revealed, ADVANCE to the next slide
    if (currentIndex < slides.length - 1) {
        currentActive.classList.remove('active-slide');
        const nextSlide = slides[currentIndex + 1];
        nextSlide.classList.add('active-slide');
        // Start typing on the new slide
        typeHTML(nextSlide, nextSlide.dataset.originalHtml, 18);
    }
    
    // If we just moved to the LAST slide
    if (currentIndex + 1 === slides.length - 1) {
        this.style.display = 'none'; // Hide Continue
        document.getElementById('beginGameBtn').style.display = 'inline-block'; // Show Begin
    }
});

    // Reset button logic
    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all progress? This team's unlocks will be lost.")) {
            resetGame();
            location.reload(); // Reload to show team entry screen again
        }
    });

    function initGame() {
        // Render puzzle cards
        const grid = document.getElementById('puzzlesGrid');
        if (grid && appConfig) {
            grid.innerHTML = '';
            appConfig.puzzles.forEach(puzzle => {
                const card = document.createElement('div');
                card.className = 'puzzle-card';
                card.dataset.id = puzzle.id;
                const answer = getPuzzleAnswer(puzzle.id);
                const displayAnswer = answer ? (answer.length > 6 ? answer.substring(0,6)+'…' : answer) : '?';
                card.innerHTML = `
                    <h3>${puzzle.title}</h3>
                    <div class="digit">${answer ? displayAnswer : '?'}</div>
                    <div class="status">${answer ? 'Solved' : 'Click to solve'}</div>
                `;
                card.addEventListener('click', () => openPuzzle(puzzle.id));
                grid.appendChild(card);
            });
        }

        // Lockbox is always visible – no hiding logic
        // Ensure the lockbox section is shown (it already has no style="display:none")
        initLockbox(); // defined in lockbox.js
    }

    // Make openPuzzle available globally (if needed)
    window.openPuzzle = openPuzzle;

    function openPuzzle(puzzleId) {
        const puzzle = appConfig.puzzles.find(p => p.id === puzzleId);
        if (!puzzle) return;

        if (getPuzzleAnswer(puzzleId)) {
            alert('You have already solved this puzzle!');
            return;
        }

        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        if (!modalOverlay || !modalContent) return;

        modalContent.innerHTML = '<span class="close-modal">&times;</span><div id="puzzleDynamicContent"></div>';
        const dynamicDiv = modalContent.querySelector('#puzzleDynamicContent');
        const closeSpan = modalContent.querySelector('.close-modal');
        closeSpan.onclick = () => { modalOverlay.style.display = 'none'; };

        const onSolve = (answerString) => {
            updatePuzzleAnswer(puzzleId, answerString);
            
            // Update card UI
            const card = document.querySelector(`.puzzle-card[data-id='${puzzleId}']`);
            if (card) {
                card.classList.add('solved');
                
                const displayAnswer = answerString.length > 6 ? answerString.substring(0,6)+'…' : answerString;
                card.querySelector('.digit').textContent = displayAnswer;
                card.querySelector('.status').textContent = 'Solved';

                // --- UPDATED NARRATIVE & SPRITE MAP ---
                const narrativeTexts = {
                    4: "The Library is open 24/7! Now you've accessed the building, let's access the information...",
                    1: "The matching images are found! You've uncovered the lockers. Next stop: the floors...",
                    2: "The study zones are mapped! Quiet and social spaces found. What's next?",
                    3: "The year is uncovered! Professor's email leads to her reading list...",
                    5: "The reading list is unlocked! Time to crack the safe."
                };

                // Map each puzzle ID to its unique high-contrast sprite
                const spriteMap = {
                    4: '🌙', // Grey crescent moon for night
                    1: '🔐', // Gold locker key
                    2: '📖', // White/blue open book
                    3: '✉️', // White envelope
                    5: '📚'  // Stack of books
                };

                let narrativeDiv = card.querySelector('.completion-narrative');
                if (!narrativeDiv) {
                    narrativeDiv = document.createElement('div');
                    narrativeDiv.className = 'completion-narrative';
                    card.appendChild(narrativeDiv);
                }
                
                // Inject the specific emoji alongside the text
                narrativeDiv.innerHTML = `
                    <span class="sprite-icon">${spriteMap[puzzleId] || '✨'}</span> 
                    ${narrativeTexts[puzzleId] || "Puzzle complete. Move on to the next!"}
                `;
            }

            modalOverlay.style.display = 'none';
            initLockbox();
        };

        switch (puzzleId) {
            case 4: renderPuzzle1(dynamicDiv, onSolve); break; // ID 4 (Torch) -> function 1
            case 1: renderPuzzle2(dynamicDiv, onSolve); break; // ID 1 (Grid) -> function 2
            case 2: renderPuzzle3(dynamicDiv, onSolve); break; // ID 2 (Poem) -> function 3
            case 3: renderPuzzle4(dynamicDiv, onSolve); break; // ID 3 (Emails) -> function 4
            case 5: renderPuzzle5(dynamicDiv, onSolve); break; // ID 5 (New) -> function 5
            default: dynamicDiv.innerHTML = '<p>Puzzle not found.</p>';
        }
        modalOverlay.style.display = 'flex';
    }

    // ---------- HIGH CONTRAST MODE (global, works from entry screen) ----------
    // Load saved preference
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }

    // Global toggle button (always present)
    const globalA11yBtn = document.getElementById('globalAccessibilityToggle');
    if (globalA11yBtn) {
        globalA11yBtn.addEventListener('click', () => {
            const isNowHighContrast = !document.body.classList.contains('high-contrast');
            if (isNowHighContrast) {
                document.body.classList.add('high-contrast');
                localStorage.setItem('highContrast', 'true');
            } else {
                document.body.classList.remove('high-contrast');
                localStorage.setItem('highContrast', 'false');
            }
        });
    }
    // Help button toggle
    const helpBtn = document.getElementById('globalHelpToggle');
    const helpModal = document.getElementById('helpModal');
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    if (helpBtn && helpModal && closeHelpBtn) {
        helpBtn.addEventListener('click', () => {
            helpModal.style.display = 'flex';
        });
        closeHelpBtn.addEventListener('click', () => {
            helpModal.style.display = 'none';
        });
        // Close modal if clicking outside the card (on the overlay)
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) helpModal.style.display = 'none';
        });
    }
});