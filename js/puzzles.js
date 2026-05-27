// Puzzle implementations (each receives a container and an onSolve callback)

// ------------------- Puzzle 1: Check it, Return it, Laptop Locker it! -------------------
function renderPuzzle1(container, onSolve) {
    const puzzleId = 1;
    const puzzleConfig = appConfig.puzzles.find(p => p.id === puzzleId);
    const hintText = puzzleConfig.hintText;
    const hintTimerSeconds = puzzleConfig.hintTimer;
    let hintTimeoutId = null;
    let solved = false;
    let wrongAttempts = 0;

    const TARGETS = [1, 5, 8];
    const ANSWER = "158";
    let selectedTargets = new Set();
    let lockedCells = new Set();

    container.innerHTML = `
        <div style="text-align: center;">
            <h3>📇 Check it, Return it, Laptop Locker it!</h3>
            <p style="margin-bottom: 5px; font-weight: bold; color: var(--text-secondary);">🔍 What's the pattern? Look closely...</p>
            <div id="puzzle1Grid" class="puzzle1-grid"></div>
            <button id="puzzle1ResetBtn" class="puzzle1-reset">Reset Puzzle</button>
            <div id="puzzle1HintContainer" style="margin-top: 10px;"></div>
        </div>
    `;

    const gridContainer = container.querySelector('#puzzle1Grid');
    const resetBtn = container.querySelector('#puzzle1ResetBtn');
    const statusDiv = container.querySelector('#puzzle1Status');
    const hintContainer = container.querySelector('#puzzle1HintContainer');

    for (let i = 1; i <= 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'puzzle1-cell';
        cell.dataset.pos = i;
        const img = document.createElement('img');
        img.src = `images/puzzle1/${i}.jpg`;
        img.alt = `Grid cell ${i}`;
        cell.appendChild(img);
        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!solved) handleCellClick(i);
        });
        gridContainer.appendChild(cell);
    }

    function updateUI() {
        const cells = container.querySelectorAll('.puzzle1-cell');
        cells.forEach(cell => {
            const pos = parseInt(cell.dataset.pos);
            if (lockedCells.has(pos)) cell.classList.add('correct');
            else cell.classList.remove('correct');
        });
        if (selectedTargets.size === 3 && !solved) {
            solved = true;
            statusDiv.innerHTML = '✅ Well done! You found the three matching images.';
            if (hintTimeoutId) clearTimeout(hintTimeoutId);
            
            if (container.querySelector('.claim-code-btn')) return;
            
            const claimBtn = document.createElement('button');
            claimBtn.className = 'claim-code-btn';
            claimBtn.textContent = '🔓 Claim Your Code →';
            claimBtn.style.cssText = 'display: block; margin: 15px auto 0; background:#3c6e47; color:white; border:none; padding:10px 20px; border-radius:30px; cursor:pointer; font-size:1rem;';
            claimBtn.onclick = () => onSolve(ANSWER);
            container.appendChild(claimBtn);
            setTimeout(() => claimBtn.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            if (hintContainer) hintContainer.innerHTML = '';
        } else if (!solved) {
            statusDiv.innerHTML = `Found ${selectedTargets.size} of 3 special images...`;
        }
    }

    function resetPuzzle() {
        if (solved) return;
        selectedTargets.clear();
        lockedCells.clear();
        wrongAttempts = 0;
        updateUI();
        statusDiv.innerHTML = 'What’s the pattern? Look closely…';
        const cells = container.querySelectorAll('.puzzle1-cell');
        cells.forEach(cell => cell.classList.remove('wrong-flash'));
        if (hintContainer) hintContainer.innerHTML = '';
        if (hintTimeoutId) clearTimeout(hintTimeoutId);
        if (selectedTargets.size !== 3) {
            hintTimeoutId = setTimeout(showHintButton, hintTimerSeconds * 1000);
        }
    }

    function showHintButton() {
        if (!document.body.contains(container)) return;
        if (hintContainer && !hintContainer.innerHTML && !solved && selectedTargets.size !== 3) {
            hintContainer.innerHTML = `<button id="puzzle1HintBtn" style="background:#ffb347; color:#2c241a; border:none; padding:5px 12px; border-radius:30px; cursor:pointer;">💡 Show Hint</button>`;
            const hintBtn = hintContainer.querySelector('#puzzle1HintBtn');
            hintBtn.addEventListener('click', () => {
                statusDiv.innerHTML = `💡 Hint: ${hintText}`;
                hintBtn.disabled = true;
                hintBtn.style.opacity = '0.5';
            });
        }
    }

    function handleCellClick(pos) {
        if (solved) return;
        if (!TARGETS.includes(pos)) {
            const clickedCell = container.querySelector(`.puzzle1-cell[data-pos='${pos}']`);
            if (clickedCell) {
                clickedCell.classList.add('wrong-flash');
                setTimeout(() => clickedCell.classList.remove('wrong-flash'), 400);
            }
            
            wrongAttempts++;
            if (wrongAttempts >= 3) {
                statusDiv.innerHTML = '❌ Too many wrong attempts. Resetting puzzle...';
                resetPuzzle();
            } else {
                statusDiv.innerHTML = `❌ Wrong image. ${3 - wrongAttempts} attempts remaining.`;
            }
            return;
        }
        if (selectedTargets.has(pos)) {
            statusDiv.innerHTML = `❌ You already selected that one. Try another.`;
            return;
        }
        selectedTargets.add(pos);
        lockedCells.add(pos);
        updateUI();
        if (selectedTargets.size !== 3) {
            statusDiv.innerHTML = `Good! Found ${selectedTargets.size}. Keep going.`;
        }
    }

    resetBtn.addEventListener('click', resetPuzzle);
    hintTimeoutId = setTimeout(showHintButton, hintTimerSeconds * 1000);
}

// ------------------- Puzzle 2: Library Layers -------------------
function renderPuzzle2(container, onSolve) {
    const puzzleId = 2;
    const puzzleConfig = appConfig.puzzles.find(p => p.id === puzzleId);
    const hintText = puzzleConfig.hintText;
    const hintTimerSeconds = puzzleConfig.hintTimer;
    let hintTimeoutId = null;

    const EXPECTED_WORDS = ['first', 'fourth', 'second', 'third'];
    const ANSWER = "1423";
    const wordToFloor = { first: '1', fourth: '4', second: '2', third: '3' };

    const floorSlots = [
        { floor: 1, word: 'first', filled: false, value: '' },
        { floor: 2, word: 'second', filled: false, value: '' },
        { floor: 3, word: 'third', filled: false, value: '' },
        { floor: 4, word: 'fourth', filled: false, value: '' }
    ];
    let clickSequence = [];
    let puzzleSolved = false;
    let wrongAttempts = 0;

    const poemHTML = `
        <p>"A Library of Layers"</p>
        <p>The <span class="highlight" data-word="first">first</span> and <span class="highlight" data-word="fourth">fourth</span> floors are calm and still,<br>
        Quiet spaces shaped for focussed thought,<br>
        Where minds can settle, read, and write,<br>
        And silence helps ideas form.</p>
        <p>The <span class="highlight" data-word="second">second</span> and <span class="highlight" data-word="third">third</span> invite the crowd,<br>
        Where thinking happens out loud,<br>
        Through teamwork, talk, and common ground,<br>
        New ideas are easily found.</p>
    `;

    container.innerHTML = `
        <div class="puzzle2-container" style="text-align: center; max-width: 700px; margin: 0 auto;">
            <p style="margin-bottom: 5px; font-weight: bold; color: var(--text-secondary);">📖 Click the highlighted words in the poem to reveal the floor order.</p>
            <div class="puzzle2-poem" style="background: #fff9e8; color: #2c241a; padding: 20px; border-radius: 16px; font-family: 'Georgia', serif; line-height: 1.8; box-shadow: 2px 2px 5px rgba(0,0,0,0.1); transform: rotate(-0.3deg);">
                ${poemHTML}
            </div>
            <div id="buildingSlots" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 15px; margin: 20px 0; flex-wrap: wrap;"></div>
            <button id="puzzle2ResetBtn" style="background: #8b3a3a; color: white; border: none; padding: 8px 16px; border-radius: 30px; margin-top: 10px;">Reset Puzzle</button>
            <div id="puzzle2Status" style="margin-top: 15px; font-style: italic;"></div>
            <div id="puzzle2HintContainer" style="margin-top: 10px;"></div>
        </div>
    `;

    const buildingSlots = document.getElementById('buildingSlots');
    const resetBtn = document.getElementById('puzzle2ResetBtn');
    const statusDiv = document.getElementById('puzzle2Status');
    const hintContainer = document.getElementById('puzzle2HintContainer');
    const highlights = container.querySelectorAll('.highlight');

    highlights.forEach(span => {
        span.style.fontWeight = 'bold';
        span.style.textDecoration = 'underline';
        span.style.textTransform = 'capitalize';
        span.style.cursor = 'pointer';
        span.style.display = 'inline-block';
        span.style.padding = '0 4px';
        span.style.borderRadius = '12px';
        span.style.transition = '0.1s';
    });

    function renderBuilding() {
        buildingSlots.style.display = 'flex';
        buildingSlots.style.flexDirection = 'row';
        buildingSlots.style.alignItems = 'center';
        buildingSlots.style.justifyContent = 'center';
        buildingSlots.style.gap = '15px';
        buildingSlots.innerHTML = '';
        for (let floor of [1,2,3,4]) {
            const slotData = floorSlots.find(s => s.floor === floor);
            const slotDiv = document.createElement('div');
            slotDiv.style.background = slotData.filled ? 'var(--accent-green)' : 'var(--input-bg)';
            slotDiv.style.width = '60px';
            slotDiv.style.height = '60px';
            slotDiv.style.display = 'flex';
            slotDiv.style.alignItems = 'center';
            slotDiv.style.justifyContent = 'center';
            slotDiv.style.borderRadius = '12px';
            slotDiv.style.border = '2px solid var(--card-border)';
            slotDiv.style.fontSize = '1.8rem';
            slotDiv.style.fontWeight = 'bold';
            slotDiv.style.color = 'var(--text-primary)';
            slotDiv.textContent = slotData.filled ? slotData.value : '□';
            buildingSlots.appendChild(slotDiv);
        }
    }

    function updateSequenceDisplay() {
        // No longer needed, but we must check for completion when clickSequence reaches 4
        if (clickSequence.length === 4 && !puzzleSolved) {
            puzzleSolved = true;
            if (hintTimeoutId) clearTimeout(hintTimeoutId);
            statusDiv.innerHTML = '✅ Well done! Correct order.';
            
            if (container.querySelector('.claim-code-btn')) return;
            
            const claimBtn = document.createElement('button');
            claimBtn.className = 'claim-code-btn';
            claimBtn.textContent = '🔓 Claim Your Code →';
            claimBtn.style.cssText = 'display: block; margin: 15px auto 0; background:#3c6e47; color:white; border:none; padding:10px 20px; border-radius:30px; cursor:pointer; font-size:1rem;';
            claimBtn.onclick = () => onSolve(ANSWER);
            container.appendChild(claimBtn);
            setTimeout(() => claimBtn.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            if (hintContainer) hintContainer.innerHTML = '';
        }
    }

    function fillSlot(word) {
        const floorNumber = wordToFloor[word];
        const slot = floorSlots.find(s => s.floor === parseInt(floorNumber));
        if (slot && !slot.filled) {
            slot.filled = true;
            slot.value = floorNumber;
            renderBuilding();
        }
    }

    function resetPuzzle() {
        clickSequence = [];
        puzzleSolved = false;
        floorSlots.forEach(slot => { slot.filled = false; slot.value = ''; });
        renderBuilding();
        highlights.forEach(span => {
            span.style.opacity = '1';
            span.style.pointerEvents = 'auto';
            span.style.backgroundColor = '';
            span.style.boxShadow = '';
        });
        statusDiv.innerHTML = 'Studying Hard, or Hardly Studying?';
        if (hintContainer) hintContainer.innerHTML = '';
        if (hintTimeoutId) clearTimeout(hintTimeoutId);
        hintTimeoutId = setTimeout(highlightWords, hintTimerSeconds * 1000);
    }

    function highlightWords() {
        if (!document.body.contains(container)) return;
        if (puzzleSolved) return;
        highlights.forEach(span => {
            span.style.boxShadow = '0 0 8px 2px gold';
            span.style.backgroundColor = '#fff3c9';
            span.style.transition = '0.2s';
        });
        statusDiv.innerHTML = '💡 The four highlighted words are the key – click them in any order.';
    }

    function handleWordClick(e) {
        if (puzzleSolved) return;
        const span = e.currentTarget;
        const word = span.getAttribute('data-word');
        if (clickSequence.includes(word)) {
            statusDiv.innerHTML = `❌ Already used "${word}". Reset and try again.`;
            wrongAttempts++;
            return;
        }
        clickSequence.push(word);
        fillSlot(word);
        updateSequenceDisplay(); // Checks for completion
        statusDiv.innerHTML = `✓ Correct! "${word}" added.`;
        span.style.opacity = '0.5';
        span.style.cursor = 'default';
        span.style.backgroundColor = 'var(--accent-green)';
        span.style.boxShadow = 'none';
        span.style.pointerEvents = 'none';
    }

    highlights.forEach(span => {
        span.addEventListener('click', handleWordClick);
    });

    resetBtn.addEventListener('click', resetPuzzle);
    renderBuilding();
    statusDiv.innerHTML = 'Studying Hard, or Hardly Studying?';
    hintTimeoutId = setTimeout(highlightWords, hintTimerSeconds * 1000);
}

// ------------------- Puzzle 3: Email Exchange -------------------
function renderPuzzle3(container, onSolve) {
    const puzzleId = 3;
    const puzzleConfig = appConfig.puzzles.find(p => p.id === puzzleId);
    const hintText = puzzleConfig.hintText;
    const hintTimerSeconds = puzzleConfig.hintTimer;
    let hintTimeoutIdLocal = null;
    let solved = false;
    let wrongAttempts = 0;

    const expectedYear = puzzleConfig.expectedAnswer; // "2024"

    const emailsHTML = `
        <div style="font-family: 'Segoe UI', 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Email 1: Mark to Professor -->
            <div style="border: 1px solid #ccc; border-radius: 8px; margin-bottom: 20px; background: #fff;">
                <div class="puzzle3-email-header" style="padding: 12px 16px; border-bottom: 1px solid #ccc; background: #e8e8e8; border-radius: 8px 8px 0 0; color: #111;">
                    <span style="font-weight: bold; color: #004c6e;">From:</span> Mark Burgess &lt;library@mmu.ac.uk&gt;<br>
                    <span style="font-weight: bold; color: #004c6e;">To:</span> Professor Al Beback &lt;a.beback@mmu.ac.uk&gt;<br>
                    <span style="font-weight: bold; color: #004c6e;">Subject:</span> Recommended Resource for Student Study Skills
                </div>
                <div style="padding: 16px; color: #222; line-height: 1.5;">
                    <p>Dear Professor Beback,</p>
                    <p>I hope your research into botanical adaptations and human night vision is progressing well – sounds like a fascinating intersection of biology and perception!</p>
                    <p>I wanted to signpost a resource that could be particularly useful for your students: <strong><em>The Study Skills Handbook</em> (6th edition)</strong> by Stella Cottrell. It's a well-regarded guide that covers a wide range of academic skills, from managing time effectively to developing critical thinking.</p>
                    <p>It's available through the MMU Library. You might want to take a look in the usual way by visiting the Library Website and looking on Library Search.</p>
                    <p>Talk soon,<br><strong>Mark Burgess</strong><br>Academic Liaison Librarian | Manchester Metropolitan University Library</p>
                </div>
            </div>
            <!-- Email 2: Professor to Mark -->
            <div style="border: 1px solid #ccc; border-radius: 8px; margin-bottom: 20px; background: #fff;">
                <div class="puzzle3-email-header" style="padding: 12px 16px; border-bottom: 1px solid #ccc; background: #e8e8e8; border-radius: 8px 8px 0 0; color: #111;">
                    <span style="font-weight: bold; color: #004c6e;">From:</span> Professor Al Beback &lt;a.beback@mmu.ac.uk&gt;<br>
                    <span style="font-weight: bold; color: #004c6e;">To:</span> Mark Burgess &lt;library@mmu.ac.uk&gt;<br>
                    <span style="font-weight: bold; color: #004c6e;">Subject:</span> RE: Recommended Resource for Student Study Skills
                </div>
                <div style="padding: 16px; color: #222; line-height: 1.5;">
                    <p>Dear Mark,</p>
                    <p>Thanks for the recommendation – <em>The Study Skills Handbook</em> is an excellent choice. I've seen how it helps students sharpen their academic focus, even if it doesn't quite help them see in the dark!</p>
                    <p>However, I noticed you didn't include <u>the year of publication</u>. I do like to keep things up‑to‑date – especially when it comes to student resources.</p>
                    <p>I'll encourage my students to head over to Library Search and track down the most recent edition.</p>
                    <p>All the best,<br><strong>Professor Al Beback</strong><br>Faculty of Health and Education | Manchester Metropolitan University</p>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = `
        <div style="max-height: 70vh; overflow-y: auto; padding: 10px;">
            <p style="margin-bottom: 5px; font-weight: bold; color: var(--text-secondary);">📅 Find the year of publication mentioned in the emails.</p>
            ${emailsHTML}
            <div style="text-align: center; margin: 20px 0;">
                <p>🔍 <strong>Are your study skills up to date?</strong></p>
                <a href="https://www.mmu.ac.uk/library/search-tools/library-search" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #3c6e47; color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; margin: 10px 0;">📚 Open Library Search</a>
            </div>
            <div id="puzzle3AnswerArea" style="margin-top: 20px; text-align: center;">
                <div style="margin-top: 10px;">
                    <input type="text" id="yearInput" maxlength="4" pattern="\\d{4}" placeholder="????" style="padding: 8px; font-size: 1rem; text-align: center; border-radius: 30px; border: 1px solid #ccc;">
                    <button id="submitYearBtn" style="background: #3c6e47; color: white; border: none; padding: 8px 16px; border-radius: 30px; cursor: pointer; margin-left: 10px;">Submit</button>
                </div>
                <div id="puzzle3Feedback" style="margin-top: 15px; font-style: italic;"></div>
            </div>
            <div id="puzzle3HintContainer" style="margin-top: 15px; text-align: center;"></div>
        </div>
    `;

    const submitBtn = container.querySelector('#submitYearBtn');
    const yearInput = container.querySelector('#yearInput');
    const feedback = container.querySelector('#puzzle3Feedback');
    const hintContainer = container.querySelector('#puzzle3HintContainer');

    function showHintButton() {
        if (!document.body.contains(container)) return;
        if (hintContainer && !hintContainer.innerHTML && !solved) {
            hintContainer.innerHTML = `<button id="puzzle3HintBtn" style="background:#ffb347; color:#2c241a; border:none; padding:5px 12px; border-radius:30px; cursor:pointer;">💡 Show Hint</button>`;
            const hintBtn = hintContainer.querySelector('#puzzle3HintBtn');
            hintBtn.addEventListener('click', () => {
                feedback.innerHTML = `💡 Hint: ${hintText}`;
                hintBtn.disabled = true;
                hintBtn.style.opacity = '0.5';
            });
        }
    }

    function cleanup() {
        if (hintTimeoutIdLocal) clearTimeout(hintTimeoutIdLocal);
    }

    submitBtn.addEventListener('click', () => {
        if (solved) return;
        const entered = yearInput.value.trim();
        if (entered === expectedYear) {
            solved = true;
            cleanup();
            feedback.innerHTML = '✅ Well done! Correct year.';
            
            if (container.querySelector('.claim-code-btn')) return;
            
            const claimBtn = document.createElement('button');
            claimBtn.className = 'claim-code-btn';
            claimBtn.textContent = '🔓 Claim Your Code →';
            claimBtn.style.cssText = 'display:block; margin:15px auto 0; background:#3c6e47; color:white; border:none; padding:10px 20px; border-radius:30px; cursor:pointer; font-size:1rem;';
            claimBtn.onclick = () => onSolve(expectedYear);
            const answerArea = container.querySelector('#puzzle3AnswerArea');
            answerArea.appendChild(claimBtn);
            setTimeout(() => claimBtn.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        } else {
            wrongAttempts++;
            feedback.innerHTML = `❌ Wrong year. Try searching again.`;
            reportWrongAttempt(3, entered, "Wrong year");
            if (wrongAttempts >= 2 && (!hintContainer || !hintContainer.innerHTML)) {
                showHintButton();
            }
        }
    });

    hintTimeoutIdLocal = setTimeout(showHintButton, hintTimerSeconds * 1000);

    // Reset Button
    const resetBtn = document.createElement('button');
    resetBtn.id = 'puzzle3ResetBtn';
    resetBtn.textContent = 'Reset Puzzle';
    resetBtn.style.cssText = 'background: #8b3a3a; color: white; border: none; padding: 8px 16px; border-radius: 30px; margin-top: 15px; cursor: pointer;';
    resetBtn.addEventListener('click', function() {
        if (solved) return;
        yearInput.value = '';
        feedback.innerHTML = '';
        wrongAttempts = 0;
        if (hintContainer) hintContainer.innerHTML = '';
        if (hintTimeoutIdLocal) clearTimeout(hintTimeoutIdLocal);
        hintTimeoutIdLocal = setTimeout(showHintButton, hintTimerSeconds * 1000);
        feedback.innerHTML = '⏳ Ready. Type the year.';
    });
    const answerArea = container.querySelector('#puzzle3AnswerArea');
    answerArea.appendChild(resetBtn);
}

// ------------------- Puzzle 4: Open All Hours -------------------
function renderPuzzle4(container, onSolve) {
    const puzzleId = 4;
    const puzzleConfig = appConfig.puzzles.find(p => p.id === puzzleId);
    const hintText = puzzleConfig.hintText;
    const hintTimerSeconds = puzzleConfig.hintTimer;
    let hintTimeoutId = null;

    const EXPECTED_ANSWER = "247";
    const TARGETS = ['2', '4', '7'];
    let collected = [];
    let puzzleSolved = false;
    let wrongAttempts = 0;
    const W = 600, H = 400;
    const TORCH_RADIUS = 80;

    const numbers = [
        { x: 120, y: 150, symbol: '2', isTarget: true, caught: false },
        { x: 300, y: 280, symbol: '4', isTarget: true, caught: false },
        { x: 480, y: 90, symbol: '7', isTarget: true, caught: false },
        { x: 50, y: 350, symbol: '1', isTarget: false, caught: false },
        { x: 220, y: 50, symbol: '3', isTarget: false, caught: false },
        { x: 400, y: 370, symbol: '5', isTarget: false, caught: false },
        { x: 540, y: 220, symbol: '6', isTarget: false, caught: false },
        { x: 80, y: 80, symbol: '8', isTarget: false, caught: false },
        { x: 350, y: 150, symbol: '9', isTarget: false, caught: false },
        { x: 520, y: 320, symbol: '0', isTarget: false, caught: false },
    ];

    container.innerHTML = `
        <div style="text-align: center;">
            <h3>🏛️ Open All Hours</h3>
            <p style="margin-bottom: 5px; font-weight: bold; color: var(--text-secondary);">🔦 Move your torch to catch the three hidden numbers.</p>
            <p>“Here you see the Library, but can you find its opening times?”</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 10px;">💡 <strong>Move your finger or cursor</strong> around the image to reveal hidden numbers. Tap/click to catch them.</p>
            <div style="position: relative; display: inline-block;">
                <canvas id="puzzle4Canvas" width="${W}" height="${H}" style="border: 2px solid var(--card-border); border-radius: 16px; background: #1a1f2c; cursor: none; touch-action: none;"></canvas>
                <div id="torchCursor" class="torch-cursor" style="display: none;"></div>
            </div>
            <div id="found-numbers-rail" class="found-rail"></div>
            <button id="puzzle4ResetBtn" style="background: #8b3a3a; color: white; border: none; padding: 8px 16px; border-radius: 30px; margin-top: 10px;">Reset Puzzle</button>
            <div id="puzzle4Status" style="margin-top: 10px; font-style: italic;"></div>
            <div id="puzzle4HintContainer" style="margin-top: 10px;"></div>
        </div>
    `;

    const canvas = document.getElementById('puzzle4Canvas');
    const ctx = canvas.getContext('2d');
    const torchCursor = document.getElementById('torchCursor');
    const resetBtn = document.getElementById('puzzle4ResetBtn');
    const statusDiv = document.getElementById('puzzle4Status');
    const hintContainer = document.getElementById('puzzle4HintContainer');

    let mouseX = -100, mouseY = -100;
    let mouseInside = false;
    let glowTarget = null;
    let backgroundImage = new Image();
    let imageLoaded = false;

    backgroundImage.src = 'images/puzzle4/library.jpg';
    backgroundImage.onload = () => { imageLoaded = true; draw(); };
    backgroundImage.onerror = () => { console.warn('Library image missing – using fallback'); imageLoaded = true; draw(); };

    function updateRailAndCheckCompletion() {
        const rail = document.getElementById('found-numbers-rail');
        if (!rail) return;
        rail.innerHTML = '';
        const sorted = [...collected].sort((a,b) => parseInt(a) - parseInt(b));
        for (let sym of sorted) {
            const span = document.createElement('span');
            span.textContent = sym;
            span.className = 'caught-number';
            rail.appendChild(span);
        }
        if (collected.length === TARGETS.length) {
            rail.style.borderColor = 'var(--accent-gold)';
            if (!puzzleSolved && !container.querySelector('.claim-code-btn')) {
                puzzleSolved = true;
                if (hintTimeoutId) clearTimeout(hintTimeoutId);
                statusDiv.innerHTML = '✅ The Library is Open: 24/7!';
                const claimBtn = document.createElement('button');
                claimBtn.className = 'claim-code-btn';
                claimBtn.textContent = '🔓 Claim Your Code →';
                claimBtn.style.cssText = 'display: block; margin: 15px auto 0; background: var(--button-primary); color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-size: 1rem;';
                claimBtn.onclick = () => onSolve(EXPECTED_ANSWER);
                container.appendChild(claimBtn);
                setTimeout(() => claimBtn.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                if (hintContainer) hintContainer.innerHTML = '';
            }
        }
    }

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        if (imageLoaded && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
            ctx.drawImage(backgroundImage, 0, 0, W, H);
        } else {
            ctx.fillStyle = '#4a5b6e';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#ffecb3';
            ctx.font = '14px monospace';
            ctx.fillText('Library image missing – place images/puzzle4/library.jpg', 50, 200);
        }

        for (let n of numbers) {
            ctx.font = 'bold 42px monospace';
            ctx.shadowBlur = 0;
            if (n.caught) {
                ctx.fillStyle = '#d4af37';
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#d4af37';
                ctx.fillText(n.symbol, n.x - 20, n.y + 15);
                ctx.shadowBlur = 0;
                continue;
            }
            let isGlowing = false;
            if (mouseInside && !n.caught && n.isTarget) {
                const dx = mouseX - n.x, dy = mouseY - n.y;
                if (Math.hypot(dx, dy) < TORCH_RADIUS) {
                    isGlowing = true;
                    glowTarget = n;
                }
            }
            if (isGlowing) {
                ctx.fillStyle = '#00C1D3';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#ffaa00';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.strokeText(n.symbol, n.x - 20, n.y + 15);
                ctx.fillText(n.symbol, n.x - 20, n.y + 15);
            } else {
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                ctx.shadowBlur = 0;
                ctx.fillText(n.symbol, n.x - 20, n.y + 15);
            }
        }
        if (mouseInside) {
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, TORCH_RADIUS, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255,255,200,0.2)';
            ctx.fill();
            ctx.strokeStyle = '#ffecb3';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    function handleCatch(e) {
        if (puzzleSolved) return;
        if (!mouseInside) return;
        if (glowTarget && !glowTarget.caught && glowTarget.isTarget) {
            const symbol = glowTarget.symbol;
            if (!collected.includes(symbol)) {
                collected.push(symbol);
                glowTarget.caught = true;
                if (navigator.vibrate) navigator.vibrate(10);
                const left = TARGETS.length - collected.length;
                statusDiv.innerHTML = left === 0 ? '✨ All opening-time numbers found! ✨' : `✅ Found one! (${left} left)`;
                glowTarget = null;
                draw();
                updateRailAndCheckCompletion();
            }
        } else {
            wrongAttempts++;
            statusDiv.innerHTML = '❌ Nothing there. Keep searching...';
            if (wrongAttempts >= 2 && (!hintContainer || !hintContainer.innerHTML)) {
                showHintButton();
            }
            setTimeout(() => {
                if (collected.length < TARGETS.length && !puzzleSolved)
                    statusDiv.innerHTML = 'Move your torch over the image to reveal hidden numbers.';
            }, 1500);
        }
    }

    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
        let clientX, clientY;
        if (e.touches) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
        else { clientX = e.clientX; clientY = e.clientY; }
        let canvasX = (clientX - rect.left) * scaleX;
        let canvasY = (clientY - rect.top) * scaleY;
        canvasX = Math.min(Math.max(0, canvasX), canvas.width);
        canvasY = Math.min(Math.max(0, canvasY), canvas.height);
        return { x: canvasX, y: canvasY };
    }

    function onMove(e) {
        e.preventDefault();
        const { x, y } = getCanvasCoords(e);
        mouseX = x; mouseY = y;
        const rect = canvas.getBoundingClientRect();
        const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
        const clientY = (e.touches ? e.touches[0].clientY : e.clientY);
        torchCursor.style.left = clientX + 'px';
        torchCursor.style.top = clientY + 'px';
        draw();
    }

    function onEnter() { mouseInside = true; torchCursor.style.display = 'block'; canvas.style.cursor = 'none'; draw(); }
    function onLeave() { mouseInside = false; torchCursor.style.display = 'none'; canvas.style.cursor = 'default'; glowTarget = null; draw(); }

    function resetGame() {
        if (hintTimeoutId) clearTimeout(hintTimeoutId);
        collected = [];
        puzzleSolved = false;
        numbers.forEach(n => n.caught = false);
        const rail = document.getElementById('found-numbers-rail');
        if (rail) {
            rail.innerHTML = '';
            rail.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
        statusDiv.innerHTML = 'Find the hidden numbers on the library entrance.';
        glowTarget = null;
        draw();
        hintTimeoutId = setTimeout(showHintButton, hintTimerSeconds * 1000);
    }

    function showHintButton() {
        if (!document.body.contains(container)) return;
        if (hintContainer && !hintContainer.innerHTML && !puzzleSolved && collected.length < TARGETS.length) {
            hintContainer.innerHTML = `<button id="puzzle4HintBtn" style="background:#ffb347; color:#2c241a; border:none; padding:5px 12px; border-radius:30px; cursor:pointer;">💡 Show Hint</button>`;
            const hintBtn = hintContainer.querySelector('#puzzle4HintBtn');
            hintBtn.addEventListener('click', () => {
                statusDiv.innerHTML = `💡 Hint: ${hintText}`;
                hintBtn.disabled = true;
                hintBtn.style.opacity = '0.5';
            });
        }
    }

    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', handleCatch);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onEnter(); onMove(e); handleCatch(e); });
    canvas.addEventListener('touchmove', onMove);
    canvas.addEventListener('touchend', onLeave);
    resetBtn.addEventListener('click', resetGame);

    updateRailAndCheckCompletion();
    statusDiv.innerHTML = 'Find the hidden numbers on the library entrance.';
    hintTimeoutId = setTimeout(showHintButton, hintTimerSeconds * 1000);
}