// lockbox.js – Safe dial mechanism with progressive joke warnings

let lockboxUnlockedFlag = false;
let wrongAttemptCount = 0; // for progressive warnings

// Joke warning messages (cycle through these, then loop)
const WRONG_MESSAGES = [
    "Incorrect combination, try again.",
    "STILL incorrect combination.",
    "Nope, not this one either.",
    "Are you trying to push my buttons?!",
    "You've done it! I've run out of ways to tell you you're wrong. I hope you feel proud of yourself!"
];

function initLockbox() {
    const container = document.getElementById('lockboxContainer');
    if (!container) return;

    // If already unlocked globally, show unlocked state
    if (isLockboxUnlocked() || lockboxUnlockedFlag) {
        renderUnlockedState(container);
        return;
    }

    // Get current puzzle answers and build grid
    const answers = loadState().puzzleAnswers;
    const gridData = buildGridFromAnswers(answers);
    const targetCode = appConfig.targetCode; // "8227"

    // Render grid + safe dials
    renderLockboxUI(container, gridData, targetCode);
}

function buildGridFromAnswers(answers) {
    const maxCols = 4;
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

function renderLockboxUI(container, gridData, targetCode) {
    // Target digits as array of characters
    const targetDigits = targetCode.split(''); // ['8','2','2','7']
    // Current dial values (initially 0,0,0,0)
    let currentDigits = ['0', '0', '0', '0'];

    // Build HTML
    container.innerHTML = `
        <div class="lockbox-grid-section">
            <h4 style="margin-bottom: 10px;">Your answers (grid)</h4>
            <table class="puzzle-grid" style="width:100%; margin-bottom: 20px;">
                <thead><tr><th>Puzzle</th><th>Col 1</th><th>Col 2</th><th>Col 3</th><th>Col 4</th></tr></thead>
                <tbody>
                    ${gridData.map((row, rowIdx) => `
                        <tr>
                            <td style="border:1px solid #b5926a; padding:8px;">${['Number Grid', 'Library Layers', 'Email Chain', 'Blank Page'][rowIdx]}</td>
                            ${row.map((cell, colIdx) => {
                                // Show X for row 1 (index 0) col 4 (index 3) OR row 4 (index 3) col 4 (index 3)
                                if ((rowIdx === 0 || rowIdx === 3) && colIdx === 3) {
                                    return `<td style="border:1px solid #b5926a; padding:8px; text-align:center;">X</td>`;
                                }
                                return `<td style="border:1px solid #b5926a; padding:8px; text-align:center;">${cell || '▯'}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p><strong>Column 1, Column 2 or Column 3, in which of these will the safe-code be?: </strong></p>
        </div>
        <div class="safe-dials">
            <h4>🔐 Enter the combination</h4>
            <div class="dials-container" style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 15px 0;">
                ${targetDigits.map((_, idx) => `
                    <div class="dial" data-idx="${idx}" style="text-align: center;">
                        <button class="dial-up" data-idx="${idx}" style="background:#3a3228; color:#ffecb3; border:none; border-radius: 30px; padding: 5px 12px; cursor:pointer;">▲</button>
                        <div class="dial-value" style="font-size: 2rem; font-weight: bold; margin: 5px 0; background:#0f0e0b; padding: 0 15px; border-radius: 20px;">0</div>
                        <button class="dial-down" data-idx="${idx}" style="background:#3a3228; color:#ffecb3; border:none; border-radius: 30px; padding: 5px 12px; cursor:pointer;">▼</button>
                    </div>
                `).join('')}
            </div>
            <button id="checkCombinationBtn" style="background: #3c6e47; color: white; border: none; padding: 10px 25px; border-radius: 30px; font-size: 1.2rem; cursor: pointer;">🔓 Check Combination</button>
            <div id="lockboxMessage" class="message" style="margin-top: 15px;">Set the dials to and click to check.</div>
        </div>
    `;

    // Update display of dial values
    function updateDialUI() {
        for (let i = 0; i < targetDigits.length; i++) {
            const valueDiv = container.querySelector(`.dial[data-idx="${i}"] .dial-value`);
            if (valueDiv) valueDiv.textContent = currentDigits[i];
        }
    }

    // Increment/decrement handlers
    for (let i = 0; i < targetDigits.length; i++) {
        const upBtn = container.querySelector(`.dial-up[data-idx="${i}"]`);
        const downBtn = container.querySelector(`.dial-down[data-idx="${i}"]`);
        if (upBtn) {
            upBtn.addEventListener('click', () => {
                let val = parseInt(currentDigits[i], 10);
                val = (val + 1) % 10;
                currentDigits[i] = val.toString();
                updateDialUI();
            });
        }
        if (downBtn) {
            downBtn.addEventListener('click', () => {
                let val = parseInt(currentDigits[i], 10);
                val = (val - 1 + 10) % 10;
                currentDigits[i] = val.toString();
                updateDialUI();
            });
        }
    }

    // Check combination button
    const checkBtn = container.querySelector('#checkCombinationBtn');
    const msgDiv = container.querySelector('#lockboxMessage');

    checkBtn.addEventListener('click', () => {
        if (lockboxUnlockedFlag) return;

        const enteredCode = currentDigits.join('');
        if (enteredCode === targetCode) {
            // Success!
            lockboxUnlockedFlag = true;
            setLockboxUnlocked(true);
            const team = getTeamName();
            const answers = loadState().puzzleAnswers;
            const code = answers.join(''); // concatenated answers
            reportSuccess(team, code);
            renderUnlockedState(container);
        } else {
            // Wrong combination – progressive joke warnings
            const message = WRONG_MESSAGES[wrongAttemptCount % WRONG_MESSAGES.length];
            msgDiv.innerHTML = `❌ ${message}`;
            msgDiv.style.background = '#8b3a3a';
            setTimeout(() => {
                if (!lockboxUnlockedFlag) {
                    msgDiv.style.background = '#000000aa';
                    msgDiv.innerHTML = `Set the dials to ${targetCode} and click Check.`;
                }
            }, 2000);
            wrongAttemptCount++;
        }
    });
}

function renderUnlockedState(container) {
    const elapsed = getElapsedTime();
    const timeString = elapsed ? `${elapsed.minutes}m ${elapsed.seconds}s` : "a fantastic effort";
    reportSuccess(team, code, timeString);

    // Trigger confetti
    if (typeof canvasConfetti === 'function') {
        canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        canvasConfetti({ particleCount: 100, spread: 100, origin: { y: 0.6, x: 0.2 }, startVelocity: 15 });
        canvasConfetti({ particleCount: 100, spread: 100, origin: { y: 0.6, x: 0.8 }, startVelocity: 15 });
    }

    container.innerHTML = `
        <div class="unlocked-celebration" style="text-align: center; animation: fadeInScale 0.5s ease;">
            <div style="font-size: 4rem; margin-bottom: 10px;">🎓📜🎉</div>
            <div class="message success" style="font-size: 1.4rem; padding: 20px;">
                🔓 SAFE UNLOCKED! 🔓
            </div>
            <div style="background: #2c241a; border-radius: 30px; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0;">📊 Your Team's Stats</h3>
                <p><strong>⏱️ Time taken:</strong> ${timeString}</p>
                <p><strong>🔢 Code entered:</strong> ${appConfig.targetCode}</p>
                <p><strong>📚 Puzzles solved:</strong> All 4 correctly!</p>
            </div>
            <div style="background: #4a3b2c; border-radius: 30px; padding: 15px;">
                <p>✨ Professor Al Beback's grades have been revealed! ✨</p>
                <p>🎁 Your prize (edible) is waiting with the facilitator.</p>
                <p style="font-size: 0.8rem; margin-top: 10px;">Great teamwork, detectives!</p>
            </div>
        </div>
    `;
    container.classList.add('unlocked');
    // Add a small animation keyframes if not already in CSS
    if (!document.querySelector('#unlockedAnimationStyle')) {
        const style = document.createElement('style');
        style.id = 'unlockedAnimationStyle';
        style.textContent = `
            @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}