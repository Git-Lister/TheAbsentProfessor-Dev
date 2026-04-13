document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    // Initialize team name input
    const teamInput = document.getElementById('teamName');
    const storedTeam = getTeamName();
    if (storedTeam) teamInput.value = storedTeam;
    teamInput.addEventListener('change', () => {
        setTeamName(teamInput.value);
    });

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

    // Check if all answers collected to show lockbox
    updateLockboxVisibility();

    // Initialize lockbox UI
    initLockbox();
});

function openPuzzle(puzzleId) {
    const puzzle = appConfig.puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return;

    // Already solved? Optionally allow re-solving? We'll prevent if already solved.
    if (getPuzzleAnswer(puzzleId)) {
        alert('You have already solved this puzzle!');
        return;
    }

    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    if (!modalOverlay || !modalContent) return;

    // Clear previous content
    modalContent.innerHTML = '<span class="close-modal">&times;</span><div id="puzzleDynamicContent"></div>';
    const dynamicDiv = modalContent.querySelector('#puzzleDynamicContent');
    const closeSpan = modalContent.querySelector('.close-modal');
    closeSpan.onclick = () => { modalOverlay.style.display = 'none'; };

    // Define what happens when puzzle is solved
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
        // Re-init lockbox in case it becomes visible now
        initLockbox();
    };

    // Call appropriate render function based on puzzleId
    switch (puzzleId) {
        case 1:
            renderPuzzle1(dynamicDiv, onSolve);
            break;
        case 2:
            renderPuzzle2(dynamicDiv, onSolve);
            break;
        case 3:
            renderPuzzle3(dynamicDiv, onSolve);
            break;
        case 4:
            renderPuzzle4(dynamicDiv, onSolve);
            break;
        default:
            dynamicDiv.innerHTML = '<p>Puzzle not found.</p>';
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