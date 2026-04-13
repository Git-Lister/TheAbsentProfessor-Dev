let lockboxLocked = false;

function initLockbox() {
    const container = document.getElementById('lockboxContainer');
    if (!container) return;

    // Check if already unlocked
    if (isLockboxUnlocked()) {
        lockboxLocked = true;
        container.innerHTML = `<div class="message success">🔓 Lockbox already unlocked! Grades revealed. 🔓</div>`;
        container.classList.add('unlocked');
        return;
    }

    const answers = loadState().puzzleAnswers;
    const solvedCount = answers.filter(a => a && a !== '').length;
    const totalPuzzles = 4;

    // Build lootbox UI with solved count indicator
    container.innerHTML = `
        <div class="lootbox-icon" style="font-size: 4rem; text-align: center;">📦</div>
        <div class="lootbox-progress">Puzzles solved: ${solvedCount} / ${totalPuzzles}</div>
        <div class="message" id="lockboxMessage">
            ${solvedCount === totalPuzzles ? 'All puzzles solved! Click to unlock.' : 'Solve all puzzles to unlock the lockbox.'}
        </div>
        ${solvedCount === totalPuzzles ? '<button id="unlockButton" style="margin-top: 15px; padding: 10px 20px; font-size: 1.2rem; background: #3c6e47; color: white; border: none; border-radius: 30px;">🔓 Unlock Lockbox</button>' : ''}
    `;

    if (solvedCount === totalPuzzles) {
        const unlockBtn = container.querySelector('#unlockButton');
        const msgDiv = container.querySelector('#lockboxMessage');
        unlockBtn.addEventListener('click', () => {
            if (lockboxLocked) return;
            const team = getTeamName();
            if (!team) {
                msgDiv.innerHTML = '⚠️ Team name missing. Please refresh and re-enter.';
                return;
            }
            // Unlock!
            lockboxLocked = true;
            setLockboxUnlocked(true);
            const answers = loadState().puzzleAnswers;
            const code = answers.join('');
            reportSuccess(team, code);
            msgDiv.innerHTML = '🎉✅ LOCKBOX UNLOCKED! Grades revealed! ✅🎉';
            msgDiv.classList.add('success');
            container.classList.add('unlocked');
            unlockBtn.disabled = true;
            document.getElementById('teamName')?.setAttribute('disabled', 'disabled'); // if team name input exists
            // Also disable reset? Not necessary.
        });
    }
}