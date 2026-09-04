document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();

    // --- TYPEWRITER ENGINE (Restores the intro) ---
    function typeHTML(element, htmlString, speed = 18) {
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
                typedText += token;
                element.innerHTML = typedText;
                currentTokenIndex++;
                processNext();
                return;
            }

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
    // --- END TYPEWRITER ENGINE ---

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

    // Start Quest Button - Shows Story Modal in Cutscene Mode
    startBtn.addEventListener('click', () => {
        const teamName = initialTeamInput.value.trim();
        const sessionCodeInput = document.getElementById('sessionCodeInput');
        const sessionCode = sessionCodeInput ? sessionCodeInput.value.trim() : '';

        if (teamName === "") {
            alert("Please enter a team name.");
            return;
        }
        setTeamName(teamName);
        setSessionId(sessionCode); // Save session code

        displayTeamSpan.textContent = teamName;
        teamEntryScreen.style.display = 'none';

        // Story modal setup
        const storyModal = document.getElementById('storyModal');
        const slidesContainer = document.getElementById('storySlidesContainer');
        const slides = slidesContainer.querySelectorAll('.story-slide');
        const continueBtn = document.getElementById('storyContinueBtn');
        const beginBtn = document.getElementById('beginGameBtn');

        // Reset to Slide 1
        slides.forEach((slide) => {
            slide.dataset.originalHtml = slide.innerHTML;
            slide.innerHTML = '';
            slide.classList.remove('active-slide');
            slide.dataset.typewriterInterval = null;
            slide.dataset.isTypingComplete = 'false';
        });

        slides[0].classList.add('active-slide');
        typeHTML(slides[0], slides[0].dataset.originalHtml, 18);

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
        setStartTime();
    });

    // "Continue" Button Logic
    document.getElementById('storyContinueBtn').addEventListener('click', function() {
        const slidesContainer = document.getElementById('storySlidesContainer');
        const slides = slidesContainer.querySelectorAll('.story-slide');
        const currentActive = slidesContainer.querySelector('.story-slide.active-slide');

        if (!slides || slides.length === 0 || !currentActive) return;

        const currentIndex = Array.from(slides).indexOf(currentActive);
        const isTypingComplete = currentActive.dataset.isTypingComplete === 'true';

        // If typing, skip to full text
        if (!isTypingComplete) {
            if (currentActive.dataset.typewriterInterval) {
                clearInterval(currentActive.dataset.typewriterInterval);
                currentActive.dataset.typewriterInterval = null;
            }
            currentActive.innerHTML = currentActive.dataset.originalHtml;
            currentActive.dataset.isTypingComplete = 'true';
            return;
        }

        // Advance to next slide
        if (currentIndex < slides.length - 1) {
            currentActive.classList.remove('active-slide');
            const nextSlide = slides[currentIndex + 1];
            nextSlide.classList.add('active-slide');
            typeHTML(nextSlide, nextSlide.dataset.originalHtml, 18);
        }

        // Show begin button on last slide
        if (currentIndex + 1 === slides.length - 1) {
            this.style.display = 'none';
            document.getElementById('beginGameBtn').style.display = 'inline-block';
        }
    });

    // Reset button logic
    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all progress? This team's unlocks will be lost.")) {
            resetGame();
            location.reload();
        }
    });

    function initGame() {
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
        initLockbox();
    }

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
            const card = document.querySelector(`.puzzle-card[data-id='${puzzleId}']`);
            if (card) {
                card.classList.add('solved');
                const displayAnswer = answerString.length > 6 ? answerString.substring(0,6)+'…' : answerString;
                card.querySelector('.digit').textContent = displayAnswer;
                card.querySelector('.status').textContent = 'Solved';
                // Narrative text
                const narrativeTexts = {
                    4: "✅ The Library is open 24/7! Now you've accessed the building, let's access the information...",
                    1: "✅ The matching images are found! You've uncovered the lockers. Next stop: the floors...",
                    2: "✅ The study zones are mapped! Quiet and social spaces found. What's next?",
                    3: "✅ The year is uncovered! Professor's email leads to her reading list...",
                    5: "✅ The reading list is unlocked! Time to crack the safe."
                };
                const spriteMap = { 4: '🌙', 1: '🔐', 2: '📖', 3: '✉️', 5: '📚' };
                let narrativeDiv = card.querySelector('.completion-narrative');
                if (!narrativeDiv) {
                    narrativeDiv = document.createElement('div');
                    narrativeDiv.className = 'completion-narrative';
                    card.appendChild(narrativeDiv);
                }
                narrativeDiv.innerHTML = `<span class="sprite-icon">${spriteMap[puzzleId] || '✨'}</span> ${narrativeTexts[puzzleId] || "Puzzle complete. Move on to the next!"}`;
            }
            modalOverlay.style.display = 'none';
            initLockbox();
        };

        switch (puzzleId) {
            case 4: renderPuzzle1(dynamicDiv, onSolve); break;
            case 1: renderPuzzle2(dynamicDiv, onSolve); break;
            case 2: renderPuzzle3(dynamicDiv, onSolve); break;
            case 3: renderPuzzle4(dynamicDiv, onSolve); break;
            case 5: renderPuzzle5(dynamicDiv, onSolve); break;
            default: dynamicDiv.innerHTML = '<p>Puzzle not found.</p>';
        }
        modalOverlay.style.display = 'flex';
    }

    // High contrast mode
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
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
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) helpModal.style.display = 'none';
        });
    }
});