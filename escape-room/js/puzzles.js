// Puzzle implementations (basic but functional)
// Each function receives a container (modal content div) and a callback `onSolve(answerString)`

// ------------------- Puzzle 1: Number Grid -------------------
function renderPuzzle1(container, onSolve) {
    // Target positions (1-indexed, top-left to bottom-right)
    const TARGETS = [1, 5, 8];      // positions to click in order
    const EXPECTED_ORDER = [1, 5, 8]; // same as targets because order is 1→5→8
    const ANSWER = "158";

    let selectedOrder = [];          // stores positions clicked in sequence
    let lockedCells = new Set();      // positions that have been correctly clicked

    // Clear any previous content
    container.innerHTML = `
        <div style="text-align: center;">
            <h3>Number Grid Puzzle</h3>
            <p style="margin-bottom: 15px;">Click the three special images <strong>in the correct order</strong> (1st, 5th, 8th).</p>
            <div id="puzzle1Grid" class="puzzle1-grid"></div>
            <button id="puzzle1ResetBtn" class="puzzle1-reset">Reset Puzzle</button>
            <div id="puzzle1Status" class="puzzle1-status">Click the first special image (position 1).</div>
        </div>
    `;

    const gridContainer = container.querySelector('#puzzle1Grid');
    const resetBtn = container.querySelector('#puzzle1ResetBtn');
    const statusDiv = container.querySelector('#puzzle1Status');

    // Generate 9 cells (1-indexed)
    for (let i = 1; i <= 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'puzzle1-cell';
        cell.dataset.pos = i;
        const img = document.createElement('img');
        // Assuming images are named 1.png, 2.png, ... 9.png
        img.src = `images/puzzle1/${i}.png`;
        img.alt = `Grid cell ${i}`;
        img.onerror = () => { img.src = `images/puzzle1/${i}.jpg`; }; // fallback if png missing
        cell.appendChild(img);
        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCellClick(i);
        });
        gridContainer.appendChild(cell);
    }

    function updateUI() {
        // Update locked cells styling
        const cells = container.querySelectorAll('.puzzle1-cell');
        cells.forEach(cell => {
            const pos = parseInt(cell.dataset.pos);
            if (lockedCells.has(pos)) {
                cell.classList.add('correct');
            } else {
                cell.classList.remove('correct');
            }
        });
        // Update status message
        const nextIndex = selectedOrder.length;
        if (nextIndex === 0) {
            statusDiv.innerHTML = 'Click the first special image (position 1).';
        } else if (nextIndex === 1) {
            statusDiv.innerHTML = 'Good! Now click the second special image (position 5).';
        } else if (nextIndex === 2) {
            statusDiv.innerHTML = 'Almost there! Click the final special image (position 8).';
        } else {
            statusDiv.innerHTML = '✓ Puzzle solved!';
        }
    }

    function resetPuzzle() {
        selectedOrder = [];
        lockedCells.clear();
        updateUI();
        statusDiv.innerHTML = 'Puzzle reset. Click the first special image (position 1).';
        // Remove any temporary flash classes
        const cells = container.querySelectorAll('.puzzle1-cell');
        cells.forEach(cell => cell.classList.remove('wrong-flash'));
    }

    function handleCellClick(pos) {
        // If puzzle already solved, ignore clicks
        if (lockedCells.size === 3) return;

        const expectedPos = EXPECTED_ORDER[selectedOrder.length];

        if (pos === expectedPos) {
            // Correct click in sequence
            selectedOrder.push(pos);
            lockedCells.add(pos);
            updateUI();

            // Check if all three are selected
            if (selectedOrder.length === 3) {
                statusDiv.innerHTML = '✅ Correct! Puzzle solved. The code is 158. ✅';
                // Call the solve callback with the answer
                onSolve(ANSWER);
            }
        } else {
            // Wrong click – flash red and reset
            const clickedCell = container.querySelector(`.puzzle1-cell[data-pos='${pos}']`);
            if (clickedCell) {
                clickedCell.classList.add('wrong-flash');
                setTimeout(() => clickedCell.classList.remove('wrong-flash'), 400);
            }
            // Show wrong message
            statusDiv.innerHTML = `❌ Wrong click! You clicked position ${pos}. Expected position ${expectedPos}. Resetting...`;
            // Reset sequence (but keep previously locked cells? No, full reset)
            resetPuzzle();
        }
    }

    resetBtn.addEventListener('click', resetPuzzle);
}

// ------------------- Puzzle 2: Library Layers Poem -------------------
function renderPuzzle2(container, onSolve) {
    const EXPECTED_ORDER = ['first', 'fourth', 'second', 'third']; // words to drop in order
    const ANSWER = "1423"; // numeric answer for the lockbox grid

    let dropSequence = []; // stores words dropped in order
    let zoneSequence = []; // stores which zone each drop went to ('silent' or 'collab')

    container.innerHTML = `
        <div class="puzzle2-container">
            <div class="puzzle2-poem">
                <p>In Manchester's heart, where knowledge flows,<br>
                A library stands where ambition grows.<br>
                Each floor a realm, each space designed,<br>
                To suit the needs of every mind.</p>
                <p>Where silence reigns and thoughts run deep,<br>
                The <span class="highlight" draggable="true" data-word="first">first</span> and <span class="highlight" draggable="true" data-word="fourth">fourth</span> are calm and still,<br>
                For focused minds and scholarly will.<br>
                No chatter here, just quiet grace,<br>
                A haven built for study's pace.</p>
                <p>Where voices blend and ideas are caught,<br>
                The <span class="highlight" draggable="true" data-word="second">second</span> and <span class="highlight" draggable="true" data-word="third">third</span> invite the crowd,<br>
                Where learning thrives in shared insight.<br>
                Collaboration finds its home,<br>
                In open zones of shared workspace.</p>
                <p>From hushed retreats to lively aisles,<br>
                Each level plays its vital part,<br>
                In shaping minds and stirring hearts.<br>
                So choose your floor, your pace, your way---<br>
                The Library meets you every day.</p>
            </div>
            <div class="puzzle2-zones">
                <div class="puzzle2-zone" data-zone="silent">
                    <h4>🔇 Silent Study (Calm & Still)</h4>
                    <div class="zone-slots" id="silentSlots"></div>
                </div>
                <div class="puzzle2-zone" data-zone="collab">
                    <h4>🗣️ Group Study (Voices Blend)</h4>
                    <div class="zone-slots" id="collabSlots"></div>
                </div>
            </div>
            <button id="puzzle2ResetBtn" class="puzzle2-reset">Reset Puzzle</button>
            <div id="puzzle2Status" class="puzzle2-status">Drag the highlighted words from the poem into the correct study zones, in order.</div>
        </div>
    `;

    const silentSlots = container.querySelector('#silentSlots');
    const collabSlots = container.querySelector('#collabSlots');
    const statusDiv = container.querySelector('#puzzle2Status');
    const resetBtn = container.querySelector('#puzzle2ResetBtn');

    // Map word to floor number
    const wordToNumber = {
        'first': '1',
        'fourth': '4',
        'second': '2',
        'third': '3'
    };

    // Expected zone for each word (silent for 1,4; collab for 2,3)
    function expectedZone(word) {
        return (word === 'first' || word === 'fourth') ? 'silent' : 'collab';
    }

    function updateUI() {
        // Show placed words in zones
        const silentPlaced = dropSequence.filter((_, idx) => zoneSequence[idx] === 'silent');
        const collabPlaced = dropSequence.filter((_, idx) => zoneSequence[idx] === 'collab');
        
        silentSlots.innerHTML = '';
        collabSlots.innerHTML = '';
        
        for (let i = 0; i < 2; i++) {
            const silentSlot = document.createElement('div');
            silentSlot.className = 'puzzle2-tile placed';
            silentSlot.textContent = silentPlaced[i] ? wordToNumber[silentPlaced[i]] : '⬚';
            silentSlot.style.backgroundColor = silentPlaced[i] ? '#6a9e7b' : '#4a3b2c';
            silentSlots.appendChild(silentSlot);
            
            const collabSlot = document.createElement('div');
            collabSlot.className = 'puzzle2-tile placed';
            collabSlot.textContent = collabPlaced[i] ? wordToNumber[collabPlaced[i]] : '⬚';
            collabSlot.style.backgroundColor = collabPlaced[i] ? '#6a9e7b' : '#4a3b2c';
            collabSlots.appendChild(collabSlot);
        }
        
        // Check if puzzle solved
        if (dropSequence.length === 4) {
            const orderCorrect = dropSequence.every((word, idx) => word === EXPECTED_ORDER[idx]);
            if (orderCorrect) {
                statusDiv.innerHTML = '✅ Perfect! You’ve arranged the floors correctly. Puzzle solved! ✅';
                onSolve(ANSWER);
            }
        }
    }

    // Drag and drop handlers
    const draggables = container.querySelectorAll('.highlight');
    const dropZones = container.querySelectorAll('.puzzle2-zone');
    
    draggables.forEach(dragEl => {
        dragEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', dragEl.getAttribute('data-word'));
            e.dataTransfer.effectAllowed = 'copy';
        });
        dragEl.addEventListener('dragend', (e) => {
            // Optional: remove temporary styling
        });
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const word = e.dataTransfer.getData('text/plain');
            const targetZone = zone.getAttribute('data-zone');
            
            // Check if already used (cannot drop same word twice)
            if (dropSequence.includes(word)) {
                statusDiv.innerHTML = `❌ The word "${word}" has already been used. Reset to try again.`;
                return;
            }
            
            const nextExpected = EXPECTED_ORDER[dropSequence.length];
            if (word !== nextExpected) {
                statusDiv.innerHTML = `❌ Wrong order! Expected "${nextExpected}" next, but you dropped "${word}". Reset and try again.`;
                return;
            }
            
            const neededZone = expectedZone(word);
            if (targetZone !== neededZone) {
                statusDiv.innerHTML = `❌ "${word}" belongs in the ${neededZone === 'silent' ? 'Silent Study' : 'Group Study'} zone. Drop it there.`;
                return;
            }
            
            // Correct drop
            dropSequence.push(word);
            zoneSequence.push(targetZone);
            updateUI();
            statusDiv.innerHTML = `✓ Correct! Dropped "${word}" into ${targetZone === 'silent' ? 'Silent Study' : 'Group Study'}.`;
            
            // Disable drag of this word after use (optional: make it non-draggable)
            const usedDraggable = Array.from(draggables).find(el => el.getAttribute('data-word') === word);
            if (usedDraggable) {
                usedDraggable.setAttribute('draggable', 'false');
                usedDraggable.style.opacity = '0.5';
                usedDraggable.style.cursor = 'default';
            }
        });
    });
    
    function resetPuzzle() {
        dropSequence = [];
        zoneSequence = [];
        // Re-enable drag for all words
        draggables.forEach(el => {
            el.setAttribute('draggable', 'true');
            el.style.opacity = '1';
            el.style.cursor = 'grab';
        });
        updateUI();
        statusDiv.innerHTML = 'Puzzle reset. Drag the highlighted words from the poem into the correct zones, in order.';
    }
    
    resetBtn.addEventListener('click', resetPuzzle);
    updateUI();
}

// ------------------- Puzzle 3: Email Exchange -------------------//
function renderPuzzle3(container, onSolve) {
    // Email content styled like typical email client
    const emailsHTML = `
        <div style="font-family: 'Segoe UI', 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Email 1: Mark to Professor -->
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 20px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; background: #f0f0f0; border-radius: 8px 8px 0 0; color: #333;">
                    <span style="font-weight: bold; color: #005a9c;">From:</span> Mark Burgess &lt;library@mmu.ac.uk&gt;<br>
                    <span style="font-weight: bold; color: #005a9c;">To:</span> Professor Al Beback &lt;a.beback@mmu.ac.uk&gt;<br>
                    <span style="font-weight: bold; color: #005a9c;">Subject:</span> Recommended Resource for Student Study Skills
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
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 20px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; background: #f0f0f0; border-radius: 8px 8px 0 0; color: #333;">
                    <span style="font-weight: bold; color: #005a9c;">From:</span> Professor Al Beback &lt;a.beback@mmu.ac.uk&gt;<br>
                    <span style="font-weight: bold; color: #005a9c;">To:</span> Mark Burgess &lt;library@mmu.ac.uk&gt;<br>
                    <span style="font-weight: bold; color: #005a9c;">Subject:</span> RE: Recommended Resource for Student Study Skills
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
            ${emailsHTML}
            <div style="text-align: center; margin: 20px 0;">
                <p>🔍 <strong>Find the publication year of the 6th edition of <em>The Study Skills Handbook</em></strong> using the link below:</p>
                <a href="https://mmu.on.worldcat.org/oclc/1437528165" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #3c6e47; color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; margin: 10px 0;">📚 Search Library Catalogue</a>
                <p style="font-size: 0.9rem; color: #555;">(Opens in a new tab – look for the <strong>publication year</strong> of the 6th edition.)</p>
            </div>
            <div id="puzzle3AnswerArea" style="margin-top: 20px; text-align: center;">
                <label>Once you have the year, enter the <strong>4-digit year</strong> below:</label>
                <div style="margin-top: 10px;">
                    <input type="text" id="yearInput" maxlength="4" pattern="\\d{4}" placeholder="e.g., 2024" style="padding: 8px; font-size: 1rem; text-align: center; border-radius: 30px; border: 1px solid #ccc;">
                    <button id="submitYearBtn" style="background: #3c6e47; color: white; border: none; padding: 8px 16px; border-radius: 30px; cursor: pointer; margin-left: 10px;">Submit</button>
                </div>
                <div id="puzzle3Feedback" style="margin-top: 15px; font-style: italic;"></div>
            </div>
        </div>
    `;

    const submitBtn = container.querySelector('#submitYearBtn');
    const yearInput = container.querySelector('#yearInput');
    const feedback = container.querySelector('#puzzle3Feedback');
    const expected = appConfig.puzzles.find(p => p.id === 3).expectedAnswer; // "2024"

    submitBtn.addEventListener('click', () => {
        const entered = yearInput.value.trim();
        if (entered === expected) {
            onSolve(expected);
        } else {
            const puzzleConfig = appConfig.puzzles.find(p => p.id === 3);
            const clue = puzzleConfig.clues.fallback;
            feedback.innerHTML = `❌ ${clue}`;
            reportWrongAttempt(3, entered, clue);
        }
    });
}

// ------------------- Puzzle 4: Blank Page (UV Torch) -------------------
function renderPuzzle4(container, onSolve) {
    const EXPECTED_ANSWER = "2470";
    const QUADRANTS = [
        { x: 0, y: 0, w: 250, h: 150, digit: '2', revealed: false },
        { x: 250, y: 0, w: 250, h: 150, digit: '4', revealed: false },
        { x: 0, y: 150, w: 250, h: 150, digit: '7', revealed: false },
        { x: 250, y: 150, w: 250, h: 150, digit: '0', revealed: false }
    ];
    let foundDigits = ['_', '_', '_', '_']; // order of quadrants 1-4
    let hoverTimers = [null, null, null, null];
    let puzzleSolved = false;

    container.innerHTML = `
        <div style="text-align: center;">
            <h3>Blank Page (UV Torch)</h3>
            <p style="margin-bottom: 10px;">Move the torch over the dark page to reveal the hidden numbers.<br>Hover over each section until the number stays visible.</p>
            <div id="puzzle4CanvasWrapper" style="position: relative; display: inline-block;">
                <canvas id="puzzle4Canvas" width="500" height="300" class="puzzle4-canvas" style="width:100%; height:auto; max-width:500px; border:2px solid #b5926a; border-radius:16px;"></canvas>
                <div id="torchCursor" class="torch-cursor" style="display: none;"></div>
            </div>
            <div id="foundDigitsDisplay" style="margin: 15px 0; font-size: 1.5rem; letter-spacing: 8px;">Found: _ _ _ _</div>
            <div id="puzzle4SubmitArea" style="margin-top: 15px;"></div>
            <button id="puzzle4ResetBtn" style="background: #8b3a3a; color: white; border: none; padding: 8px 16px; border-radius: 30px; margin-top: 10px;">Reset Puzzle</button>
            <div id="puzzle4Status" style="margin-top: 10px; font-style: italic;"></div>
        </div>
    `;

    const canvas = document.getElementById('puzzle4Canvas');
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('puzzle4CanvasWrapper');
    const torchCursor = document.getElementById('torchCursor');
    const foundDisplay = document.getElementById('foundDigitsDisplay');
    const submitArea = document.getElementById('puzzle4SubmitArea');
    const resetBtn = document.getElementById('puzzle4ResetBtn');
    const statusDiv = document.getElementById('puzzle4Status');

    let mouseX = 0, mouseY = 0;
    let mouseInside = false;

    // Draw canvas (dark background with subtle quadrant borders)
    function drawCanvas() {
        ctx.clearRect(0, 0, 500, 300);
        // Dark background
        ctx.fillStyle = '#1a1f2c';
        ctx.fillRect(0, 0, 500, 300);
        // Draw faint grid lines to hint quadrants (optional)
        ctx.strokeStyle = '#3a4a5a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(250, 0); ctx.lineTo(250, 300); ctx.stroke();
        ctx.moveTo(0, 150); ctx.lineTo(500, 150); ctx.stroke();
        // Draw any already revealed digits (persistent)
        ctx.font = 'bold 48px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        for (let i = 0; i < QUADRANTS.length; i++) {
            if (QUADRANTS[i].revealed) {
                const q = QUADRANTS[i];
                const centerX = q.x + q.w/2;
                const centerY = q.y + q.h/2;
                ctx.fillText(q.digit, centerX - 20, centerY + 15);
            }
        }
    }

    // Update the found display
    function updateFoundDisplay() {
        let displayStr = 'Found: ';
        for (let i = 0; i < foundDigits.length; i++) {
            displayStr += foundDigits[i] + ' ';
        }
        foundDisplay.innerText = displayStr;
        // Check if all digits found
        const allFound = foundDigits.every(d => d !== '_');
        if (allFound && !puzzleSolved) {
            statusDiv.innerHTML = '✅ All four numbers revealed! Enter the 4-digit code below.';
            // Show submit input
            submitArea.innerHTML = `
                <label>Enter the 4-digit code (in order from top-left to bottom-right):</label><br>
                <input type="text" id="finalCodeInput" maxlength="4" pattern="\\d{4}" placeholder="e.g., 2470" style="padding: 8px; font-size: 1rem; text-align: center; margin-top: 8px;">
                <button id="submitFinalCode" style="background: #3c6e47; color: white; border: none; padding: 8px 16px; border-radius: 30px; margin-left: 8px;">Unlock</button>
            `;
            const finalInput = document.getElementById('finalCodeInput');
            const finalSubmit = document.getElementById('submitFinalCode');
            finalSubmit.addEventListener('click', () => {
                const code = finalInput.value.trim();
                if (code === EXPECTED_ANSWER) {
                    onSolve(EXPECTED_ANSWER);
                    puzzleSolved = true;
                    statusDiv.innerHTML = '🎉 Correct! Puzzle solved. The answer is 2470.';
                    submitArea.innerHTML = ''; // clear
                } else {
                    statusDiv.innerHTML = `❌ Wrong code. Expected 2470. Try again.`;
                    reportWrongAttempt(4, code, "Wrong final code");
                }
            });
        }
    }

    // Mark a quadrant as revealed
    function revealQuadrant(index) {
        if (QUADRANTS[index].revealed) return;
        QUADRANTS[index].revealed = true;
        foundDigits[index] = QUADRANTS[index].digit;
        drawCanvas();
        updateFoundDisplay();
        statusDiv.innerHTML = `✨ You found the number ${QUADRANTS[index].digit}! ✨`;
    }

    // Check which quadrant the cursor is in
    function getQuadrantIndex(mouseCanvasX, mouseCanvasY) {
        for (let i = 0; i < QUADRANTS.length; i++) {
            const q = QUADRANTS[i];
            if (mouseCanvasX >= q.x && mouseCanvasX < q.x + q.w &&
                mouseCanvasY >= q.y && mouseCanvasY < q.y + q.h) {
                return i;
            }
        }
        return -1;
    }

    // Mouse/touch move handler
    function handleMove(clientX, clientY) {
        if (!mouseInside) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;   // canvas physical width 500
        const scaleY = canvas.height / rect.height;
        let canvasX = (clientX - rect.left) * scaleX;
        let canvasY = (clientY - rect.top) * scaleY;
        canvasX = Math.min(Math.max(0, canvasX), canvas.width);
        canvasY = Math.min(Math.max(0, canvasY), canvas.height);
        
        // Update torch position
        torchCursor.style.left = clientX + 'px';
        torchCursor.style.top = clientY + 'px';
        
        const quadrantIdx = getQuadrantIndex(canvasX, canvasY);
        if (quadrantIdx !== -1 && !QUADRANTS[quadrantIdx].revealed) {
            // Start or reset timer for this quadrant
            if (hoverTimers[quadrantIdx] === null) {
                hoverTimers[quadrantIdx] = setTimeout(() => {
                    revealQuadrant(quadrantIdx);
                    hoverTimers[quadrantIdx] = null;
                }, 1000); // 1 second hover
            }
        } else {
            // Clear any pending timer if not hovering over an unrevealed quadrant
            for (let i = 0; i < hoverTimers.length; i++) {
                if (hoverTimers[i] !== null) {
                    clearTimeout(hoverTimers[i]);
                    hoverTimers[i] = null;
                }
            }
        }
    }

    // Mouse/touch events
    function onMouseMove(e) {
        handleMove(e.clientX, e.clientY);
    }
    function onTouchMove(e) {
        e.preventDefault();
        if (e.touches.length) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }
    function onMouseEnter(e) {
        mouseInside = true;
        torchCursor.style.display = 'block';
        canvas.style.cursor = 'none';
    }
    function onMouseLeave(e) {
        mouseInside = false;
        torchCursor.style.display = 'none';
        canvas.style.cursor = 'default';
        // Clear all timers
        for (let i = 0; i < hoverTimers.length; i++) {
            if (hoverTimers[i] !== null) {
                clearTimeout(hoverTimers[i]);
                hoverTimers[i] = null;
            }
        }
    }

    // Reset puzzle
    function resetPuzzle() {
        for (let i = 0; i < QUADRANTS.length; i++) {
            QUADRANTS[i].revealed = false;
            if (hoverTimers[i]) clearTimeout(hoverTimers[i]);
            hoverTimers[i] = null;
        }
        foundDigits = ['_', '_', '_', '_'];
        puzzleSolved = false;
        drawCanvas();
        updateFoundDisplay();
        submitArea.innerHTML = '';
        statusDiv.innerHTML = 'Puzzle reset. Move the torch over the dark page to find hidden numbers.';
    }

    // Attach events
    canvas.addEventListener('mouseenter', onMouseEnter);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onMouseEnter(); });
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onMouseLeave);
    // Also handle global mouse move when torch is active? Already covered.

    resetBtn.addEventListener('click', resetPuzzle);

    // Initial draw
    drawCanvas();
    updateFoundDisplay();
    statusDiv.innerHTML = 'Hover over the dark page with your mouse (or finger) to reveal hidden numbers. Hold still for 1 second on each quadrant.';
}