// lockbox.js – Safe dial mechanism with progressive joke warnings

let lockboxUnlockedFlag = false;
let wrongAttemptCount = 0;

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

    if (isLockboxUnlocked() || lockboxUnlockedFlag) {
        renderUnlockedState(container);
        return;
    }

    const answers = loadState().puzzleAnswers;
    const gridData = buildGridFromAnswers(answers);
    const targetCode = appConfig.targetCode; // "8227"
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
    const targetDigits = targetCode.split('');
    let currentDigits = ['0', '0', '0', '0'];

    // Riddle instead of direct instruction
    const riddleHTML = `<p style="font-style: italic; margin: 5px 0 15px;">The Box is Locked, but here's the key – the puzzles are where your answers will be.</p>`;

    // Build HTML with padlock icons as column headers
    container.innerHTML = `
        <div class="lockbox-grid-section">
            <h4 style="margin-bottom: 10px;">Prof's Lockbox</h4>
            ${riddleHTML}
            <table class="puzzle-grid" style="width:100%; margin-bottom: 20px;">
                <thead>
                    <tr>
                        <th>Puzzle</th>
                        <th>🔒</th>
                        <th>🔒</th>
                        <th>🔒</th>
                        <th>🔒</th>
                    </tr>
                </thead>
                <tbody>
                    ${gridData.map((row, rowIdx) => `
                        <tr>
                            <td style="border:1px solid #b5926a; padding:8px;">${['Number Grid', 'Library Layers', 'Email Chain', 'Blank Page'][rowIdx]}</td>
                            ${row.map((cell, colIdx) => {
                                // Show X for row 1 col 4 and row 4 col 4 (answers with only 3 digits)
                                if ((rowIdx === 0 || rowIdx === 3) && colIdx === 3) {
                                    return `<td style="border:1px solid #b5926a; padding:8px; text-align:center;">X</td>`;
                                }
                                return `<td class="grid-cell" data-row="${rowIdx}" data-col="${colIdx}" style="border:1px solid #b5926a; padding:8px; text-align:center;">${cell || '▯'}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p class="column-hint" style="font-size:0.9rem; text-align:center;">Which column holds the key? Look for the pattern…</p>
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
            <div id="lockboxMessage" class="message" style="margin-top: 15px;">Set the dials to the safe code and click Check.</div>
        </div>
    `;

    // After rendering, highlight column 3 if all puzzles solved
    if (allAnswersCollected()) {
        const cells = container.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            const col = parseInt(cell.getAttribute('data-col'));
            if (col === 2) { // column index 2 = third column
                cell.classList.add('col3-highlight');
            }
        });
        // Also highlight the column hint
        const hintPara = container.querySelector('.column-hint');
        if (hintPara) hintPara.innerHTML = '✨ The third column glows – that is your key! ✨';
    }

    // Update dial UI
    function updateDialUI() {
        for (let i = 0; i < targetDigits.length; i++) {
            const valueDiv = container.querySelector(`.dial[data-idx="${i}"] .dial-value`);
            if (valueDiv) valueDiv.textContent = currentDigits[i];
        }
    }

    // Attach dial increment/decrement
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

    const checkBtn = container.querySelector('#checkCombinationBtn');
    const msgDiv = container.querySelector('#lockboxMessage');

    checkBtn.addEventListener('click', () => {
        if (lockboxUnlockedFlag) return;

        const enteredCode = currentDigits.join('');
        if (enteredCode === targetCode) {
            lockboxUnlockedFlag = true;
            setLockboxUnlocked(true);
            const team = getTeamName();
            const answers = loadState().puzzleAnswers;
            const code = answers.join('');
            const elapsed = getElapsedTime();
            const timeString = elapsed ? `${elapsed.minutes}m ${elapsed.seconds}s` : "a fantastic effort";
            reportSuccess(team, code, timeString);
            renderUnlockedState(container);
        } else {
            const message = WRONG_MESSAGES[wrongAttemptCount % WRONG_MESSAGES.length];
            msgDiv.innerHTML = `❌ ${message}`;
            msgDiv.style.background = '#8b3a3a';
            setTimeout(() => {
                if (!lockboxUnlockedFlag) {
                    msgDiv.style.background = '#000000aa';
                    msgDiv.innerHTML = `Set the dials to the safe code and click Check.`;
                }
            }, 2000);
            wrongAttemptCount++;
        }
    });
}

function renderUnlockedState(container) {
    // Reporting already done inside check button; just show celebration
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
                <h3 style="margin: 0 0 10px 0;">✨ Case Solved! ✨</h3>
                <p>Your completion has been recorded.</p>
                <p style="font-weight: bold; margin: 15px 0;">The facilitator will announce the winning team!</p>
            </div>
            <div style="background: #4a3b2c; border-radius: 30px; padding: 15px;">
                <p>🎁 Your prize (edible) is waiting with the facilitator.</p>
                <p style="font-size: 0.8rem; margin-top: 10px;">Great teamwork, detectives!</p>
            </div>
        </div>
    `;
    container.classList.add('unlocked');
}