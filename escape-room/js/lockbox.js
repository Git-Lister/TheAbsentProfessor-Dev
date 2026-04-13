let lockboxUnlockedFlag = false;

function initLockbox() {
    const container = document.getElementById('lockboxContainer');
    if (!container) return;

    // Check if already unlocked (persisted)
    if (isLockboxUnlocked()) {
        lockboxUnlockedFlag = true;
        renderUnlockedState(container);
        return;
    }

    // Get current puzzle answers
    const answers = loadState().puzzleAnswers; // array of strings, e.g. ["158", "1423", "2024", "247"]
    const gridData = buildGridFromAnswers(answers);
    const column3String = getColumn3String(gridData);

    // Render the grid
    renderGrid(container, gridData);

    // Check if column3 equals "8227"
    if (column3String === "8227" && !lockboxUnlockedFlag) {
        unlockLockbox(container);
    } else {
        // Add a message showing progress
        const msgDiv = container.querySelector('#lockboxMessage') || document.createElement('div');
        if (!msgDiv.id) {
            msgDiv.id = 'lockboxMessage';
            msgDiv.className = 'message';
            container.appendChild(msgDiv);
        }
        msgDiv.innerHTML = `Column 3: ${column3String} ${column3String === "8227" ? '✅' : '❌'} (need 8227 to unlock)`;
    }
}

function buildGridFromAnswers(answers) {
    // Each answer is a string of digits. Pad with empty strings for missing digits.
    const maxCols = 4; // we need up to 4 columns (since 2024 has 4, 247 has 3)
    const grid = [];
    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i] || '';
        const digits = answer.split('');
        const row = [];
        for (let j = 0; j < maxCols; j++) {
            row.push(j < digits.length ? digits[j] : '');
        }
        grid.push(row);
    }
    return grid;
}

function getColumn3String(grid) {
    // column index 2 (third column)
    let col3 = '';
    for (let i = 0; i < grid.length; i++) {
        col3 += grid[i][2] || '';
    }
    return col3;
}

function renderGrid(container, gridData) {
    // Create table HTML
    let html = `<table class="puzzle-grid" style="width:100%; border-collapse: collapse; margin-bottom: 20px;">`;
    html += `<thead><tr><th>Puzzle</th><th>Col 1</th><th>Col 2</th><th>Col 3</th><th>Col 4</th></tr></thead><tbody>`;
    const puzzleNames = ['Number Grid', 'Library Layers', 'Email Chain', 'Blank Page'];
    for (let i = 0; i < gridData.length; i++) {
        html += `<tr>
            <td style="border:1px solid #b5926a; padding: 8px;">${puzzleNames[i]}</td>
            ${gridData[i].map(cell => `<td style="border:1px solid #b5926a; padding: 8px; text-align: center; font-size: 1.2rem;">${cell || '▯'}</td>`).join('')}
        </tr>`;
    }
    html += `</tbody></table>`;
    html += `<div id="lockboxMessage" class="message"></div>`;
    container.innerHTML = html;
}

function renderUnlockedState(container) {
    container.innerHTML = `
        <div class="message success" style="text-align: center; padding: 20px;">
            🎉🔓 LOCKBOX UNLOCKED! Grades revealed! 🔓🎉
        </div>
        <div style="text-align: center; margin-top: 15px;">
            <span style="font-size: 2rem;">📦✨</span>
        </div>
    `;
    container.classList.add('unlocked');
}

function unlockLockbox(container) {
    if (lockboxUnlockedFlag) return;
    lockboxUnlockedFlag = true;
    setLockboxUnlocked(true);
    const team = getTeamName();
    const answers = loadState().puzzleAnswers;
    const code = answers.join('');
    reportSuccess(team, code);
    renderUnlockedState(container);
}