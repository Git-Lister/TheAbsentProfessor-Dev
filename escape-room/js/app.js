document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();

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
        // Skip entry screen and go directly to game
        teamEntryScreen.style.display = 'none';
        mainGameUI.style.display = 'block';
        displayTeamSpan.textContent = existingTeam;
        initialTeamInput.value = existingTeam;
        initGame();
    }

    // Start button logic
    startBtn.addEventListener('click', () => {
        const teamName = initialTeamInput.value.trim();
        if (teamName === "") {
            alert("Please enter a team name.");
            return;
        }
        setTeamName(teamName);
        displayTeamSpan.textContent = teamName;
        teamEntryScreen.style.display = 'none';
        mainGameUI.style.display = 'block';
        initGame();
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

        // Update lockbox visibility and init lockbox
        updateLockboxVisibility();
        initLockbox(); // defined in lockbox.js
    }

    // Make openPuzzle and updateLockboxVisibility available globally (they are already in this scope)
    window.openPuzzle = openPuzzle;
    window.updateLockboxVisibility = updateLockboxVisibility;

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
                const displayAnswer = answerString.length > 6 ? answerString.substring(0,6)+'…' : answerString;
                card.querySelector('.digit').textContent = displayAnswer;
                card.querySelector('.status').textContent = 'Solved';
            }
            modalOverlay.style.display = 'none';
            updateLockboxVisibility();
            initLockbox(); // re-init lockbox to reflect new solved count
        };

        switch (puzzleId) {
            case 1: renderPuzzle1(dynamicDiv, onSolve); break;
            case 2: renderPuzzle2(dynamicDiv, onSolve); break;
            case 3: renderPuzzle3(dynamicDiv, onSolve); break;
            case 4: renderPuzzle4(dynamicDiv, onSolve); break;
            default: dynamicDiv.innerHTML = '<p>Puzzle not found.</p>';
        }

        modalOverlay.style.display = 'flex';
    }

    function updateLockboxVisibility() {
        const allCollected = allAnswersCollected();
        const lockboxSection = document.getElementById('lockboxSection');
        if (lockboxSection) {
            lockboxSection.style.display = allCollected ? 'block' : 'none';
        }
    }
});