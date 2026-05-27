import json
import os


def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


# Project root
ROOT = "escape-room"

# ---------- config.json ----------
config = {
    "puzzles": [
        {
            "id": 1,
            "title": "Check it, Return it, Laptop Locker it!",
            "expectedDigit": "2",
            "clues": {
                "wrongDigits": {
                    "1": "That number has no closed loops. Look at 8 and 0 instead.",
                    "3": "3 has no closed loops. Think about the shapes of the numbers.",
                    "5": "5 has no closed loops. The correct digit has two loops.",
                    "8": "8 has two loops, but that's not the odd one out. Compare the numbers.",
                },
                "fallback": "The odd one out is the only number with two closed loops.",
            },
            "hintTimer": 120,
            "hintText": "Count the closed loops in each digit. Which one is different?",
        },
        {
            "id": 2,
            "title": "Library Layers",
            "expectedDigit": "4",
            "clues": {
                "wrongDigits": {
                    "1": "The silent floors are 1 and 4. How many are there?",
                    "2": "Collaborative floors are 2 and 3. The puzzle asks for something else.",
                    "3": "Think about the number of floors that are silent.",
                },
                "fallback": "Read the poem again – which floors are described as 'calm and still'? How many are there?",
            },
            "hintTimer": 120,
            "hintText": "The first and fourth floors are silent. That's two floors, but the digit might be something else...",
        },
        {
            "id": 3,
            "title": "Email Chain",
            "expectedDigit": "0",
            "clues": {
                "wrongDigits": {
                    "1": "The year is in the 2020s.",
                    "2": "The 6th edition was published recently.",
                    "3": "Check the email – the professor wants the most recent edition.",
                },
                "fallback": "Search for 'The Study Skills Handbook' in the library. The 6th edition's publication year gives the digit.",
            },
            "hintTimer": 120,
            "hintText": "Year of publication.",
        },
        {
            "id": 4,
            "title": "Open All Hours",
            "expectedDigit": "5",
            "clues": {
                "wrongDigits": {
                    "1": "The hidden number is one of the digits in the professor's name.",
                    "2": "Use the torch to reveal the number.",
                    "3": "It's not 3. Keep looking with your light.",
                },
                "fallback": "Move your mouse (or finger) over the Open All Hours – it acts like a UV torch.",
            },
            "hintTimer": 120,
            "hintText": "The page isn't really blank. Try 'shining a light' on it by moving your cursor.",
        },
    ],
    "lockboxCode": ["2", "0", "2", "5"],
    "googleScriptUrl": "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
}

# ---------- index.html ----------
index_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>The Case of the Absent Professor</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="game-container">
        <header>
            <h1>The Case of the Absent Professor</h1>
            <div class="team-input">
                <label>Team name:</label>
                <input type="text" id="teamName" placeholder="Enter your team name" autocomplete="off">
            </div>
        </header>

        <div class="puzzles-grid" id="puzzlesGrid">
            <!-- Puzzle cards will be injected here -->
        </div>

        <div class="lockbox-section" id="lockboxSection" style="display: none;">
            <h2>Professor's Lockbox</h2>
            <div class="lockbox-container" id="lockboxContainer"></div>
        </div>
    </div>

    <div id="modalOverlay" class="modal-overlay" style="display: none;">
        <div class="modal-content" id="modalContent"></div>
    </div>

    <script src="js/config.js"></script>
    <script src="js/storage.js"></script>
    <script src="js/reporting.js"></script>
    <script src="js/puzzles.js"></script>
    <script src="js/lockbox.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
"""

# ---------- CSS ----------
css_content = """* {
    box-sizing: border-box;
    user-select: none;
}

body {
    font-family: 'Segoe UI', 'Courier New', monospace;
    background: linear-gradient(135deg, #2e3b3e 0%, #1a1f1f 100%);
    color: #f7e9c3;
    margin: 0;
    padding: 20px;
    min-height: 100vh;
}

.game-container {
    max-width: 1200px;
    margin: 0 auto;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

h1 {
    font-size: 2rem;
    text-shadow: 2px 2px 0 #3a2a1c;
}

.team-input {
    background: #4a3b2c;
    padding: 10px 20px;
    border-radius: 50px;
    display: inline-flex;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
}

.team-input label {
    font-weight: bold;
}

.team-input input {
    padding: 8px 12px;
    border-radius: 30px;
    border: none;
    font-size: 1rem;
    width: 200px;
}

.puzzles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.puzzle-card {
    background: #2c241a;
    border-radius: 20px;
    padding: 20px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 5px 10px rgba(0,0,0,0.3);
    text-align: center;
}

.puzzle-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
}

.puzzle-card h3 {
    margin-top: 0;
    color: #ffecb3;
}

.puzzle-card .digit {
    font-size: 2rem;
    font-weight: bold;
    margin: 10px 0;
    color: #6ef0b0;
}

.puzzle-card .status {
    font-size: 0.8rem;
    color: #c9b27c;
}

.lockbox-section {
    background: #4a3b2c;
    border-radius: 40px;
    padding: 20px;
    text-align: center;
}

.lockbox-container {
    background: #2c241a;
    border-radius: 30px;
    padding: 20px;
    max-width: 400px;
    margin: 0 auto;
}

.code-display {
    background: #0f0e0b;
    font-size: 2.5rem;
    font-family: monospace;
    letter-spacing: 8px;
    padding: 10px;
    border-radius: 20px;
    margin-bottom: 20px;
    color: #6ef0b0;
}

.keypad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}

.key {
    background: #3a3228;
    border: none;
    border-radius: 50px;
    padding: 15px;
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffecb3;
    cursor: pointer;
    transition: 0.05s linear;
}

.key:active {
    transform: translateY(2px);
}

.key.clear {
    background: #5f3f2c;
}

.key.enter {
    background: #3c6e47;
}

.message {
    background: #000000aa;
    border-radius: 30px;
    padding: 10px;
    font-size: 0.9rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #2c241a;
    border-radius: 30px;
    padding: 20px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    position: relative;
}

.close-modal {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 1.5rem;
    cursor: pointer;
}

@media (max-width: 600px) {
    .puzzles-grid {
        grid-template-columns: 1fr;
    }
    .key {
        padding: 12px;
        font-size: 1.2rem;
    }
}
"""

# ---------- JS files ----------
# config.js (loads config.json)
config_js = """// This file will be replaced by the actual config loaded via fetch
let appConfig = null;

function loadConfig() {
    return fetch('data/config.json')
        .then(response => response.json())
        .then(data => {
            appConfig = data;
            return data;
        });
}
"""

# storage.js
storage_js = """const STORAGE_KEY = 'absent_professor';

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        teamName: '',
        puzzleDigits: [null, null, null, null],  // index 0 = puzzle 1
        lockboxUnlocked: false
    };
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updatePuzzleDigit(puzzleId, digit) {
    const state = loadState();
    state.puzzleDigits[puzzleId-1] = digit;
    saveState(state);
    return state;
}

function getPuzzleDigit(puzzleId) {
    const state = loadState();
    return state.puzzleDigits[puzzleId-1];
}

function allDigitsCollected() {
    const state = loadState();
    return state.puzzleDigits.every(d => d !== null && d !== undefined);
}

function setTeamName(name) {
    const state = loadState();
    state.teamName = name;
    saveState(state);
}

function getTeamName() {
    return loadState().teamName;
}
"""

# reporting.js
reporting_js = """function reportSuccess(team, code) {
    if (!appConfig || !appConfig.googleScriptUrl) {
        console.warn('No Google Script URL configured');
        return;
    }
    fetch(appConfig.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',  // to avoid CORS errors; the script will still receive the request
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            team: team,
            code: code,
            timestamp: new Date().toISOString()
        })
    }).catch(err => console.error('Reporting error:', err));
}
"""

# puzzles.js (placeholder, actual implementations will be added)
puzzles_js = """// This will contain the puzzle implementations.
// For brevity in the generator, we'll leave stubs and embed in index.html later.
// In a real project, each puzzle would have its own code.
console.log('Puzzles module loaded');
"""

# lockbox.js
lockbox_js = """let lockboxCurrentPosition = 0;
let lockboxEnteredDigits = ['', '', '', ''];
let lockboxLocked = false;

function initLockbox() {
    const container = document.getElementById('lockboxContainer');
    if (!container) return;

    // Build lockbox UI
    container.innerHTML = `
        <div class="code-display" id="codeDisplay">_ _ _ _</div>
        <div class="keypad" id="keypad"></div>
        <div class="message" id="lockboxMessage">🔐 Enter the code digit by digit.</div>
    `;

    buildKeypad();
    updateDisplay();
}

function buildKeypad() {
    const keypad = document.getElementById('keypad');
    if (!keypad) return;
    const layout = ['1','2','3','4','5','6','7','8','9','C','0','E'];
    keypad.innerHTML = '';
    layout.forEach(key => {
        const btn = document.createElement('button');
        btn.classList.add('key');
        if (key === 'C') {
            btn.textContent = '⌫ CLEAR';
            btn.classList.add('clear');
            btn.onclick = () => clearLockboxEntry();
        } else if (key === 'E') {
            btn.textContent = '⏎ ENTER';
            btn.classList.add('enter');
            btn.onclick = () => attemptLockboxUnlock();
        } else {
            btn.textContent = key;
            btn.onclick = () => appendLockboxDigit(key);
        }
        keypad.appendChild(btn);
    });
}

function updateDisplay() {
    const display = document.getElementById('codeDisplay');
    if (!display) return;
    let text = '';
    for (let i = 0; i < 4; i++) {
        text += (lockboxEnteredDigits[i] ? lockboxEnteredDigits[i] : '_') + ' ';
    }
    display.textContent = text.trim();
}

function appendLockboxDigit(digit) {
    if (lockboxLocked) return;
    if (lockboxCurrentPosition >= 4) return;

    const expected = appConfig.lockboxCode[lockboxCurrentPosition];
    if (digit === expected) {
        // Correct
        lockboxEnteredDigits[lockboxCurrentPosition] = digit;
        updateDisplay();
        // Optional click sound here
        lockboxCurrentPosition++;
        if (lockboxCurrentPosition === 4) {
            // All digits correct, unlock automatically
            attemptLockboxUnlock();
        }
    } else {
        // Wrong digit: show clue
        const clue = getClueForPosition(lockboxCurrentPosition, digit);
        showLockboxMessage(clue, true);
        // Do not advance, do not store digit
    }
}

function getClueForPosition(pos, wrongDigit) {
    const puzzleId = pos + 1;  // positions 1-4 correspond to puzzle IDs
    const puzzleConfig = appConfig.puzzles.find(p => p.id === puzzleId);
    if (!puzzleConfig) return "That's not right. Try again!";
    const clues = puzzleConfig.clues;
    if (clues.wrongDigits && clues.wrongDigits[wrongDigit]) {
        return clues.wrongDigits[wrongDigit];
    }
    return clues.fallback || "Hmm, that doesn't match. Check your puzzle again.";
}

function showLockboxMessage(msg, isError = false) {
    const msgDiv = document.getElementById('lockboxMessage');
    if (!msgDiv) return;
    msgDiv.textContent = msg;
    if (isError) {
        msgDiv.style.background = '#8b3a3a';
        setTimeout(() => {
            msgDiv.style.background = '#000000aa';
            if (!lockboxLocked) msgDiv.textContent = '🔐 Enter the code digit by digit.';
        }, 2000);
    } else {
        msgDiv.style.background = '#2b6e3c';
        setTimeout(() => {
            msgDiv.style.background = '#000000aa';
        }, 2000);
    }
}

function clearLockboxEntry() {
    if (lockboxLocked) return;
    // Reset everything
    lockboxCurrentPosition = 0;
    lockboxEnteredDigits = ['', '', '', ''];
    updateDisplay();
    showLockboxMessage('Code cleared. Start over.', false);
}

function attemptLockboxUnlock() {
    if (lockboxLocked) return;
    if (lockboxCurrentPosition !== 4) {
        showLockboxMessage(`You need all 4 digits. Currently entered: ${lockboxEnteredDigits.join('')}`, true);
        return;
    }

    const enteredCode = lockboxEnteredDigits.join('');
    const expectedCode = appConfig.lockboxCode.join('');

    if (enteredCode === expectedCode) {
        // Success
        lockboxLocked = true;
        showLockboxMessage('🎉✅ LOCK OPEN! Grades unlocked! ✅🎉', false);
        // Disable keypad and team name input
        document.querySelectorAll('.key').forEach(btn => btn.classList.add('disabled'));
        document.getElementById('teamName').disabled = true;

        // Report to Google Sheets
        const team = getTeamName();
        if (team) {
            reportSuccess(team, enteredCode);
        }
    } else {
        // This shouldn't happen because we validate per digit, but just in case
        showLockboxMessage('Code doesn\'t match. Please try again.', true);
        clearLockboxEntry();
    }
}
"""

# app.js
app_js = """document.addEventListener('DOMContentLoaded', async () => {
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
            const digit = getPuzzleDigit(puzzle.id);
            card.innerHTML = `
                <h3>${puzzle.title}</h3>
                <div class="digit">${digit !== null ? digit : '?'}</div>
                <div class="status">${digit !== null ? 'Solved' : 'Click to solve'}</div>
            `;
            card.addEventListener('click', () => openPuzzle(puzzle.id));
            grid.appendChild(card);
        });
    }

    // Check if all digits collected to show lockbox
    updateLockboxVisibility();

    // Initialize lockbox UI if needed
    initLockbox();
});

function openPuzzle(puzzleId) {
    // This will be expanded with actual puzzle content.
    // For now, just a placeholder that sets the digit after a mock interaction.
    const puzzle = appConfig.puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return;

    // In a real implementation, we'd open a modal with the puzzle interface.
    // For demo, we'll simulate solving by asking the user to input the digit.
    const digit = prompt(`Solve puzzle ${puzzleId}: ${puzzle.title}\\n\\nEnter the digit you think is correct:`);
    if (digit && digit.length === 1 && /\\d/.test(digit)) {
        if (digit === puzzle.expectedDigit) {
            updatePuzzleDigit(puzzleId, digit);
            // Update card UI
            const card = document.querySelector(`.puzzle-card[data-id='${puzzleId}']`);
            if (card) {
                card.querySelector('.digit').textContent = digit;
                card.querySelector('.status').textContent = 'Solved';
            }
            updateLockboxVisibility();
            alert(`Correct! The digit for this puzzle is ${digit}.`);
        } else {
            // Show a clue from config
            const clue = puzzle.clues.wrongDigits[digit] || puzzle.clues.fallback;
            alert(`Wrong. ${clue}`);
        }
    } else {
        alert('Please enter a single digit (0-9).');
    }
}

function updateLockboxVisibility() {
    const allCollected = allDigitsCollected();
    const lockboxSection = document.getElementById('lockboxSection');
    if (lockboxSection) {
        lockboxSection.style.display = allCollected ? 'block' : 'none';
    }
}
"""

# backend/apps-script.js (Google Apps Script code)
apps_script = """function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.team, data.code, data.timestamp]);
  return ContentService.createTextOutput("OK");
}
"""

# README.md
readme = """# The Case of the Absent Professor – Digital Escape Room

This project is a web-based version of the in-person escape room game created by Mark Burgess (MMU Library). It allows student groups to solve four puzzles, collect a 4-digit code, and “unlock” a digital lockbox, with real-time reporting to a Google Sheet for the facilitator.

## Setup Instructions

1. **Configure the puzzles and answers**  
   Edit `data/config.json` to set the expected digit for each puzzle, the lockbox code, and the clues/hints. The `googleScriptUrl` will be updated after step 3.

2. **Set up Google Sheets reporting**  
   - Create a new Google Sheet.  
   - Go to **Extensions → Apps Script**.  
   - Paste the contents of `backend/apps-script.js` into the editor.  
   - Deploy the script as a **web app** (Execute as: “Me”, Who has access: “Anyone”).  
   - Copy the deployment URL and paste it into `config.json` as `googleScriptUrl`.  
   - (Optional) Add a second sheet for logging wrong attempts; modify the script accordingly.

3. **Deploy to GitHub Pages**  
   - Push all files to a GitHub repository.  
   - Enable Pages in the repository settings, selecting the root folder.  
   - The site will be available at `https://yourusername.github.io/repo-name`.

4. **Test**  
   - Open the site, enter a team name, and solve puzzles.  
   - Verify that the lockbox appears after all four digits are collected.  
   - Check the Google Sheet to see recorded unlocks.

## Customization

- **Puzzle content**: Replace the placeholder puzzle implementations in `js/puzzles.js` with actual interactive HTML/JS for each puzzle. The current version uses a simple `prompt()` for testing.  
- **Styling**: Modify `css/style.css` to match your branding.  
- **Hints**: Adjust the `hintTimer` and `hintText` in `config.json` for each puzzle (future implementation).

## Files and Structure

- `index.html` – Main page  
- `css/style.css` – Styling  
- `js/` – All JavaScript modules  
- `data/config.json` – Game configuration (answers, hints, Google Script URL)  
- `backend/` – Google Apps Script reference  

Enjoy the game!
"""


# ---------- Create files ----------
def create_project():
    # Root
    os.makedirs(ROOT, exist_ok=True)

    # Write config.json
    create_file(os.path.join(ROOT, "data", "config.json"), json.dumps(config, indent=2))

    # Write index.html
    create_file(os.path.join(ROOT, "index.html"), index_html)

    # Write CSS
    create_file(os.path.join(ROOT, "css", "style.css"), css_content)

    # Write JS files
    create_file(os.path.join(ROOT, "js", "config.js"), config_js)
    create_file(os.path.join(ROOT, "js", "storage.js"), storage_js)
    create_file(os.path.join(ROOT, "js", "reporting.js"), reporting_js)
    create_file(os.path.join(ROOT, "js", "puzzles.js"), puzzles_js)
    create_file(os.path.join(ROOT, "js", "lockbox.js"), lockbox_js)
    create_file(os.path.join(ROOT, "js", "app.js"), app_js)

    # Write backend script
    create_file(os.path.join(ROOT, "backend", "apps-script.js"), apps_script)

    # Write README
    create_file(os.path.join(ROOT, "README.md"), readme)

    print(f"Project created in '{ROOT}' directory.")


if __name__ == "__main__":
    create_project()
