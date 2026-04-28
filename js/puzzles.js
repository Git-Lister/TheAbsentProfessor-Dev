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
    const EXPECTED_WORD_ORDER = ['first', 'fourth', 'second', 'third'];
    const ANSWER = "1423";
    const wordToFloor = {
        'first': '1',
        'fourth': '4',
        'second': '2',
        'third': '3'
    };
    // Floor slots: floor number, corresponding word, filled status, display value
    const floorSlots = [
        { floor: 1, word: 'first', filled: false, value: '' },
        { floor: 2, word: 'second', filled: false, value: '' },
        { floor: 3, word: 'third', filled: false, value: '' },
        { floor: 4, word: 'fourth', filled: false, value: '' }
    ];

    let clickSequence = [];
    let puzzleSolved = false;

    // New shortened poem
    const poemHTML = `
        <p>"A Library of Layers</p>
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
            <div class="puzzle2-poem" style="background: #fff9e8; color: #2c241a; padding: 15px; border-radius: 16px; font-family: 'Georgia', serif; line-height: 1.6; margin-bottom: 20px; box-shadow: 2px 2px 5px rgba(0,0,0,0.1); transform: rotate(-0.3deg);">
                ${poemHTML}
                <p style="margin-top: 10px;"><strong>Click the highlighted words in order:</strong> first → fourth → second → third</p>
            </div>
            <div style="background: #4a3b2c; border-radius: 20px; padding: 20px; display: inline-block; width: 100%;">
                <h3>📚 Library Floors (enter the code)</h3>
                <div id="buildingSlots" style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin: 20px 0;">
                    <!-- slots injected bottom to top via CSS column-reverse? We'll render in natural order and reverse with CSS -->
                </div>
            </div>
            <div style="margin-top: 20px; background: #2c241a; border-radius: 30px; padding: 10px;">
                <strong>Your sequence:</strong> <span id="sequenceDisplay">_ _ _ _</span>
            </div>
            <button id="puzzle2ResetBtn" style="background: #8b3a3a; color: white; border: none; padding: 8px 16px; border-radius: 30px; margin-top: 15px;">Reset Puzzle</button>
            <div id="puzzle2Status" style="margin-top: 15px; font-style: italic;"></div>
        </div>
    `;

    const buildingSlots = document.getElementById('buildingSlots');
    const sequenceSpan = document.getElementById('sequenceDisplay');
    const resetBtn = document.getElementById('puzzle2ResetBtn');
    const statusDiv = document.getElementById('puzzle2Status');
    const highlights = container.querySelectorAll('.highlight');

    // Render building with floor 1 at bottom, floor 4 at top using flex-direction column-reverse
    function renderBuilding() {
        buildingSlots.style.display = 'flex';
        buildingSlots.style.flexDirection = 'column-reverse';
        buildingSlots.style.alignItems = 'center';
        buildingSlots.style.gap = '10px';
        buildingSlots.innerHTML = '';
        // Floors 1 to 4 in natural order (1 top? No, we want 1 at bottom, so we'll append in order 1,2,3,4 and rely on column-reverse)
        const orderedSlots = [1,2,3,4];
        for (let floor of orderedSlots) {
            const slotData = floorSlots.find(s => s.floor === floor);
            const slotDiv = document.createElement('div');
            slotDiv.style.background = slotData.filled ? '#6a9e7b' : '#3a3228';
            slotDiv.style.width = '100px';
            slotDiv.style.height = '70px';
            slotDiv.style.display = 'flex';
            slotDiv.style.alignItems = 'center';
            slotDiv.style.justifyContent = 'center';
            slotDiv.style.borderRadius = '12px';
            slotDiv.style.border = '2px solid #b5926a';
            slotDiv.style.fontSize = '2rem';
            slotDiv.style.fontWeight = 'bold';
            slotDiv.style.color = '#ffecb3';
            slotDiv.textContent = slotData.filled ? slotData.value : '?';
            // Add label
            const label = document.createElement('div');
            label.style.fontSize = '0.7rem';
            label.style.marginTop = '4px';
            label.textContent = `Floor ${floor}`;
            const wrapper = document.createElement('div');
            wrapper.style.textAlign = 'center';
            wrapper.appendChild(slotDiv);
            wrapper.appendChild(label);
            buildingSlots.appendChild(wrapper);
        }
    }

    function updateSequenceDisplay() {
        let display = '';
        for (let i = 0; i < 4; i++) {
            display += (clickSequence[i] ? wordToFloor[clickSequence[i]] : '_') + ' ';
        }
        sequenceSpan.innerText = display.trim();
        if (clickSequence.length === 4 && clickSequence.join('') === EXPECTED_WORD_ORDER.join('')) {
            if (!puzzleSolved) {
                puzzleSolved = true;
                statusDiv.innerHTML = '✅ Perfect! Library floors arranged correctly. Puzzle solved! ✅';
                onSolve(ANSWER);
            }
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
        floorSlots.forEach(slot => {
            slot.filled = false;
            slot.value = '';
        });
        renderBuilding();
        updateSequenceDisplay();
        // Re-enable all highlighted words
        highlights.forEach(span => {
            span.style.opacity = '1';
            span.style.cursor = 'pointer';
            span.style.backgroundColor = '';
            span.style.pointerEvents = 'auto';
        });
        statusDiv.innerHTML = 'Puzzle reset. Click the highlighted words in order: first → fourth → second → third.';
    }

    function handleWordClick(e) {
        if (puzzleSolved) return;
        const span = e.currentTarget;
        const word = span.getAttribute('data-word');
        if (clickSequence.includes(word)) {
            statusDiv.innerHTML = `❌ You already used "${word}". Reset to try again.`;
            return;
        }
        const nextExpected = EXPECTED_WORD_ORDER[clickSequence.length];
        if (word !== nextExpected) {
            statusDiv.innerHTML = `❌ Wrong order! Expected "${nextExpected}" next, but you clicked "${word}". Resetting puzzle.`;
            resetPuzzle();
            return;
        }
        // Correct click
        clickSequence.push(word);
        fillSlot(word);
        updateSequenceDisplay();
        statusDiv.innerHTML = `✓ Correct! "${word}" added.`;
        // Disable the clicked word
        span.style.opacity = '0.5';
        span.style.cursor = 'default';
        span.style.backgroundColor = '#6a9e7b';
        span.style.pointerEvents = 'none';
        if (clickSequence.length === 4) {
            // already handled in updateSequenceDisplay
        }
    }

    // Attach click listeners to highlighted words
    highlights.forEach(span => {
        span.style.cursor = 'pointer';
        span.style.display = 'inline-block';
        span.style.padding = '0 4px';
        span.style.borderRadius = '12px';
        span.style.transition = '0.1s';
        span.addEventListener('click', handleWordClick);
    });

    resetBtn.addEventListener('click', resetPuzzle);
    // Initial render
    renderBuilding();
    updateSequenceDisplay();
    statusDiv.innerHTML = 'Click the highlighted words in order: first → fourth → second → third.';
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
                <a href="https://www.mmu.ac.uk/library/search-tools/library-search" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #3c6e47; color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; margin: 10px 0;">📚 Search Library Catalogue</a>
                <p style="font-size: 0.9rem; color: #555;">(Opens in a new tab – look for the <strong>publication year</strong> of the 6th edition.)</p>
            </div>
            <div id="puzzle3AnswerArea" style="margin-top: 20px; text-align: center;">
                <label>Once you have the year, enter the <strong>4-digit year</strong> below:</label>
                <div style="margin-top: 10px;">
                    <input type="text" id="yearInput" maxlength="4" pattern="\\d{4}" placeholder="????" style="padding: 8px; font-size: 1rem; text-align: center; border-radius: 30px; border: 1px solid #ccc;">
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
    const EXPECTED_ANSWER = "247";
    const TARGETS = ['2', '4', '7'];
    let collected = [];

    // Canvas dimensions
    const W = 600, H = 400;

    // Define fixed number positions (x, y, symbol, isTarget)
    // Coordinates are relative to canvas (0,0 top-left). Adjust as needed.
    const numbers = [
        // Targets (2,4,7)
        { x: 120, y: 150, symbol: '2', isTarget: true, caught: false },
        { x: 300, y: 280, symbol: '4', isTarget: true, caught: false },
        { x: 480, y: 90, symbol: '7', isTarget: true, caught: false },
        // Decoys (0,1,3,5,6,8,9)
        { x: 50, y: 350, symbol: '1', isTarget: false, caught: false },
        { x: 220, y: 50, symbol: '3', isTarget: false, caught: false },
        { x: 400, y: 370, symbol: '5', isTarget: false, caught: false },
        { x: 540, y: 220, symbol: '6', isTarget: false, caught: false },
        { x: 80, y: 80, symbol: '8', isTarget: false, caught: false },
        { x: 350, y: 150, symbol: '9', isTarget: false, caught: false },
        { x: 520, y: 320, symbol: '0', isTarget: false, caught: false },
    ];

    // Create container
    container.innerHTML = `
        <div style="text-align: center;">
            <h3>Library Entrance – Find the Hidden Numbers</h3>
            <p>Move the torch (mouse/finger) over the image. When a <strong>target number (2,4,7)</strong> becomes visible, click to catch it!</p>
            <div style="position: relative; display: inline-block;">
                <canvas id="puzzle4Canvas" width="${W}" height="${H}" style="border: 2px solid #b5926a; border-radius: 16px; background: #2c241a; cursor: none;"></canvas>
                <div id="torchCursor" class="torch-cursor" style="display: none;"></div>
            </div>
            <div class="puzzle4-collected" style="margin-top: 15px; font-size: 1.5rem; background: #2c241a; display: inline-block; padding: 5px 15px; border-radius: 40px;">
                Caught: <span id="caughtDisplay">_ _ _</span>
            </div>
            <button id="puzzle4ResetBtn" style="background: #8b3a3a; color: white; border: none; padding: 8px 16px; border-radius: 30px; margin-top: 10px;">Reset Puzzle</button>
            <div id="puzzle4Status" style="margin-top: 10px; font-style: italic;"></div>
        </div>
    `;

    const canvas = document.getElementById('puzzle4Canvas');
    const ctx = canvas.getContext('2d');
    const torchCursor = document.getElementById('torchCursor');
    const caughtSpan = document.getElementById('caughtDisplay');
    const resetBtn = document.getElementById('puzzle4ResetBtn');
    const statusDiv = document.getElementById('puzzle4Status');

    let mouseX = -100, mouseY = -100;
    let mouseInside = false;
    let glowTarget = null;
    let backgroundImage = new Image();
    let imageLoaded = false;

    // Load library image
    backgroundImage.src = 'images/puzzle4/library.jpg';
    backgroundImage.onload = () => {
        imageLoaded = true;
        draw();
    };
    backgroundImage.onerror = () => {
        console.warn('Library image not found – using fallback colour');
        imageLoaded = true; // proceed with fallback
        draw();
    };

    function updateCaughtDisplay() {
        let display = '';
        for (let t of TARGETS) {
            if (collected.includes(t)) display += t + ' ';
            else display += '_ ';
        }
        caughtSpan.innerText = display.trim();
        if (collected.length === TARGETS.length) {
            statusDiv.innerHTML = '🎉 All numbers caught! Puzzle solved! 🎉';
            onSolve(EXPECTED_ANSWER);
        }
    }

    function draw() {
        if (!ctx) return;
        // Clear canvas
        ctx.clearRect(0, 0, W, H);
        // Draw background (image or fallback)
        if (imageLoaded && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
            ctx.drawImage(backgroundImage, 0, 0, W, H);
        } else {
            ctx.fillStyle = '#4a5b6e';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#ffecb3';
            ctx.font = '14px monospace';
            ctx.fillText('Library image missing – place images/puzzle4/library.jpg', 50, 200);
        }

        // Draw all numbers (faint, nearly invisible)
        for (let n of numbers) {
            if (n.caught) continue;
            ctx.font = 'bold 28px monospace';
            ctx.shadowBlur = 0;
            let isGlowing = false;
            if (mouseInside && !n.caught && n.isTarget) {
                const dx = mouseX - n.x;
                const dy = mouseY - n.y;
                if (Math.hypot(dx, dy) < 45) { // torch radius
                    isGlowing = true;
                    glowTarget = n;
                }
            }
            if (isGlowing) {
                ctx.fillStyle = '#00C1D3';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#ffaa00';
            } else {
                // Nearly invisible (blends with image)
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
            }
            ctx.fillText(n.symbol, n.x - 12, n.y + 10);
        }

        // Draw torch cursor circle
        if (mouseInside) {
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 40, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255,255,200,0.2)';
            ctx.fill();
            ctx.strokeStyle = '#ffecb3';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    function handleCatch(e) {
        if (!mouseInside) return;
        if (glowTarget && !glowTarget.caught && glowTarget.isTarget) {
            const symbol = glowTarget.symbol;
            if (!collected.includes(symbol)) {
                collected.push(symbol);
                glowTarget.caught = true;
                updateCaughtDisplay();
                statusDiv.innerHTML = `✅ Caught ${symbol}! ${3 - collected.length} left.`;
                glowTarget = null;
                draw(); // redraw to remove caught number
            }
        } else {
            statusDiv.innerHTML = '❌ No target under torch. Keep searching!';
            setTimeout(() => {
                if (collected.length < TARGETS.length)
                    statusDiv.innerHTML = 'Move torch over the image – hidden numbers will appear. Click to catch 2,4,7.';
            }, 1500);
        }
    }

    // Mouse/touch tracking
    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        let canvasX = (clientX - rect.left) * scaleX;
        let canvasY = (clientY - rect.top) * scaleY;
        canvasX = Math.min(Math.max(0, canvasX), canvas.width);
        canvasY = Math.min(Math.max(0, canvasY), canvas.height);
        return { x: canvasX, y: canvasY };
    }

    function onMove(e) {
        e.preventDefault();
        const { x, y } = getCanvasCoords(e);
        mouseX = x;
        mouseY = y;
        const rect = canvas.getBoundingClientRect();
        const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
        const clientY = (e.touches ? e.touches[0].clientY : e.clientY);
        torchCursor.style.left = clientX + 'px';
        torchCursor.style.top = clientY + 'px';
        draw();
    }

    function onEnter() {
        mouseInside = true;
        torchCursor.style.display = 'block';
        canvas.style.cursor = 'none';
        draw();
    }
    function onLeave() {
        mouseInside = false;
        torchCursor.style.display = 'none';
        canvas.style.cursor = 'default';
        glowTarget = null;
        draw();
    }

    function resetGame() {
        collected = [];
        for (let n of numbers) {
            n.caught = false;
        }
        updateCaughtDisplay();
        statusDiv.innerHTML = 'Puzzle reset. Find and catch 2, 4, and 7.';
        glowTarget = null;
        draw();
    }

    // Attach events
    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', handleCatch);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onEnter(); onMove(e); handleCatch(e); });
    canvas.addEventListener('touchmove', onMove);
    canvas.addEventListener('touchend', onLeave);

    resetBtn.addEventListener('click', resetGame);

    // Initial draw
    updateCaughtDisplay();
    statusDiv.innerHTML = 'Move torch over the image – hidden numbers will glow. Click to catch 2,4,7.';
}