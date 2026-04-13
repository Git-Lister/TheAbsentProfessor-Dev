let lockboxLocked = false;

function initLockbox() {
    const container = document.getElementById('lockboxContainer');
    if (!container) return;

    // Check if already unlocked
    if (isLockboxUnlocked()) {
        lockboxLocked = true;
        container.innerHTML = `<div class="message success">🔓 Lockbox already unlocked! Grades revealed. 🔓</div>`;
        return;
    }

    // Build temporary lockbox UI
    container.innerHTML = `
        <div class="message" id="lockboxMessage">All answers collected? Click the button to unlock.</div>
        <button id="unlockButton" style="margin-top: 15px; padding: 10px 20px; font-size: 1.2rem; background: #3c6e47; color: white; border: none; border-radius: 30px;">🔓 Unlock Lockbox</button>
    `;

    const unlockBtn = container.querySelector('#unlockButton');
    const msgDiv = container.querySelector('#lockboxMessage');

    unlockBtn.addEventListener('click', () => {
        if (lockboxLocked) return;
        const team = getTeamName();
        if (!team) {
            msgDiv.innerHTML = '⚠️ Please enter a team name first.';
            return;
        }
        if (!allAnswersCollected()) {
            msgDiv.innerHTML = '❌ You have not solved all four puzzles yet. Keep going!';
            return;
        }
        // Unlock!
        lockboxLocked = true;
        setLockboxUnlocked(true);
        const answers = loadState().puzzleAnswers;
        const code = answers.join('');  // e.g., "15814232024247"
        reportSuccess(team, code);
        msgDiv.innerHTML = '🎉✅ LOCKBOX UNLOCKED! Grades revealed! ✅🎉';
        msgDiv.classList.add('success');
        unlockBtn.disabled = true;
        // Optionally disable team input
        document.getElementById('teamName').disabled = true;
    });
}