// Puzzle implementations (basic but functional)
// Each function receives a container (modal content div) and a callback `onSolve(answerString)`

// ------------------- Puzzle 1: Number Grid -------------------
function renderPuzzle1(container, onSolve) {
    container.innerHTML = `
        <div style="text-align: center;">
            <h3>Number Grid Puzzle</h3>
            <p style="margin-bottom: 15px;">"1, 5 and 8 are all identical – the others are all odd – there is no other one like it."</p>
            <div style="display: grid; grid-template-columns: repeat(3, 80px); gap: 10px; justify-content: center; margin: 20px auto;">
                <button class="grid-btn" data-value="1">1</button>
                <button class="grid-btn" data-value="5">5</button>
                <button class="grid-btn" data-value="8">8</button>
                <button class="grid-btn" data-value="1">1</button>
                <button class="grid-btn" data-value="5">5</button>
                <button class="grid-btn" data-value="8">8</button>
                <button class="grid-btn" data-value="1">1</button>
                <button class="grid-btn" data-value="5">5</button>
                <button class="grid-btn" data-value="8">8</button>
            </div>
            <p>The odd one out appears only once. Click on it.</p>
            <div id="puzzle1Feedback" style="margin-top: 15px; font-style: italic;"></div>
        </div>
    `;

    const btns = container.querySelectorAll('.grid-btn');
    const feedback = container.querySelector('#puzzle1Feedback');
    const expected = appConfig.puzzles.find(p => p.id === 1).expectedAnswer; // "158"

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const clickedValue = btn.getAttribute('data-value');
            // The correct "odd one out" is the number that appears only once? Actually the puzzle yields three digits: 1,5,8 in order.
            // But for simplicity, we ask the user to enter the three digits in order.
            // We'll change to a text input to avoid confusion.
            // Better: show instruction to enter the three numbers.
            feedback.innerHTML = `You clicked ${clickedValue}. But this puzzle expects a three‑digit code. Let's simplify.`;
            // Replace with a proper input method
            container.innerHTML = `
                <div style="text-align: center;">
                    <h3>Number Grid Puzzle</h3>
                    <p>The grid contains the numbers 1, 5, and 8 repeated. One of them is the "odd one out" because it appears in a different orientation. What are the three numbers in the correct order?</p>
                    <input type="text" id="puzzle1Answer" placeholder="e.g., 158" maxlength="3" pattern="\\d{3}" style="padding: 8px; font-size: 1rem; text-align: center;">
                    <button id="submitPuzzle1">Submit</button>
                    <div id="puzzle1Feedback" style="margin-top: 15px;"></div>
                </div>
            `;
            const submitBtn = container.querySelector('#submitPuzzle1');
            const answerInput = container.querySelector('#puzzle1Answer');
            const newFeedback = container.querySelector('#puzzle1Feedback');
            submitBtn.addEventListener('click', () => {
                const answer = answerInput.value.trim();
                if (answer === expected) {
                    onSolve(expected);
                } else {
                    const clue = appConfig.puzzles.find(p => p.id === 1).clues.fallback;
                    newFeedback.innerHTML = `❌ ${clue}`;
                    reportWrongAttempt(1, answer, clue);
                }
            });
        });
    });
    // Initial instruction
    feedback.innerHTML = "Click any number above for more instructions.";
}

// ------------------- Puzzle 2: Library Layers Poem -------------------
function renderPuzzle2(container, onSolve) {
    const poem = `In Manchester's heart, where knowledge flows,
A library stands where ambition grows.
Each floor a realm, each space designed,
To suit the needs of every mind.

Where silence reigns and thoughts run deep,
The first and fourth are calm and still,
For focused minds and scholarly will.
No chatter here, just quiet grace,
A haven built for study's pace.

Where voices blend and ideas are caught,
The second and third invite the crowd,
Where learning thrives in shared insight.
Collaboration finds its home,
In open zones of shared workspace.

From hushed retreats to lively aisles,
Each level plays its vital part,
In shaping minds and stirring hearts.
So choose your floor, your pace, your way---
The Library meets you every day.`;

    container.innerHTML = `
        <div style="text-align: center; max-height: 60vh; overflow-y: auto;">
            <h3>Library Layers</h3>
            <pre style="font-family: monospace; white-space: pre-wrap; background: #f0e6d2; color: #2c241a; padding: 15px; border-radius: 10px; text-align: left;">${poem}</pre>
            <p>What is the four‑digit code from the floors? (Hint: order of silent floors then collaborative floors)</p>
            <input type="text" id="puzzle2Answer" placeholder="e.g., 1423" maxlength="4" pattern="\\d{4}" style="padding: 8px; font-size: 1rem; text-align: center;">
            <button id="submitPuzzle2">Submit</button>
            <div id="puzzle2Feedback" style="margin-top: 15px;"></div>
        </div>
    `;

    const submitBtn = container.querySelector('#submitPuzzle2');
    const answerInput = container.querySelector('#puzzle2Answer');
    const feedback = container.querySelector('#puzzle2Feedback');
    const expected = appConfig.puzzles.find(p => p.id === 2).expectedAnswer; // "1423"

    submitBtn.addEventListener('click', () => {
        const answer = answerInput.value.trim();
        if (answer === expected) {
            onSolve(expected);
        } else {
            const clue = appConfig.puzzles.find(p => p.id === 2).clues.fallback;
            feedback.innerHTML = `❌ ${clue}`;
            reportWrongAttempt(2, answer, clue);
        }
    });
}

// ------------------- Puzzle 3: Email Chain (already implemented) -------------------
function renderPuzzle3(container, onSolve) {
    // Email content (from original Word doc)
    const emailsHTML = `
        <div style="font-family: monospace; background: #f0e6d2; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <p><strong>From:</strong> Mark Burgess &lt;library@mmu.ac.uk&gt;<br>
            <strong>To:</strong> Professor Al Beback &lt;a.beback@mmu.ac.uk&gt;<br>
            <strong>Subject:</strong> Recommended Resource for Student Study Skills</p>
            <hr>
            <p>Dear Professor Beback,</p>
            <p>I hope your research into botanical adaptations and human night vision is progressing well - sounds like a fascinating intersection of biology and perception!</p>
            <p>I wanted to signpost a resource that could be particularly useful for your students: <em>The Study Skills Handbook</em> 6th edition by Stella Cottrell. It's a well-regarded guide that covers a wide range of academic skills, from managing time effectively to developing critical thinking.</p>
            <p>It's available through the MMU Library. You might want to take a look in the usual way by visiting the Library Website and looking on Library Search.</p>
            <p>Talk soon,<br><strong>Mark Burgess</strong><br>Academic Liaison Librarian | Manchester Metropolitan University Library</p>
        </div>
        <div style="font-family: monospace; background: #e6dcc8; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <p><strong>From:</strong> Professor Al Beback &lt;a.beback@mmu.ac.uk&gt;<br>
            <strong>To:</strong> Mark Burgess &lt;library@mmu.ac.uk&gt;<br>
            <strong>Subject:</strong> RE: Recommended Resource for Student Study Skills</p>
            <hr>
            <p>Dear Mark,</p>
            <p>Thanks for the recommendation - <em>The Study Skills Handbook</em> is an excellent choice. I've seen how it helps students sharpen their academic focus, even if it doesn't quite help them see in the dark!</p>
            <p>However, I noticed you didn't include <u>the year of publication</u>. I do like to keep things up-to-date - especially when it comes to student resources.</p>
            <p>I'll encourage my students to head over to Library Search and track down the most recent edition.</p>
            <p>All the best,<br><strong>Professor Al Beback</strong><br>Faculty of Health and Education | Manchester Metropolitan University</p>
        </div>
    `;

    container.innerHTML = `
        <div style="max-height: 70vh; overflow-y: auto;">
            ${emailsHTML}
            <div style="text-align: center; margin: 20px 0;">
                <button id="mockSearchBtn" style="padding: 10px 20px; font-size: 1.2rem;">🔍 Search Library for the handbook</button>
            </div>
            <div id="mockSearchResults" style="display: none; background: #fff8e7; padding: 15px; border-radius: 10px; margin-top: 10px;">
                <!-- Simulated search results appear here -->
            </div>
            <div id="puzzle3AnswerArea" style="margin-top: 20px; text-align: center;"></div>
        </div>
    `;

    const searchBtn = container.querySelector('#mockSearchBtn');
    const resultsDiv = container.querySelector('#mockSearchResults');
    const answerArea = container.querySelector('#puzzle3AnswerArea');

    searchBtn.addEventListener('click', () => {
        // Simulate library search
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <div style="border: 1px solid #b5926a; border-radius: 10px; padding: 15px; background: #fff;">
                <h3 style="margin:0 0 5px 0;">The Study Skills Handbook (6th edition)</h3>
                <p><strong>Author:</strong> Stella Cottrell</p>
                <p><strong>Publication year:</strong> <span style="font-size:1.5rem; font-weight:bold; background: #ffecb3; padding: 2px 8px;">2024</span></p>
                <button id="useYearBtn" style="margin-top: 10px; background: #3c6e47; color: white; border: none; padding: 8px 16px; border-radius: 30px; cursor: pointer;">Use this year</button>
            </div>
        `;
        const useBtn = resultsDiv.querySelector('#useYearBtn');
        useBtn.addEventListener('click', () => {
            // Ask for the full year (the answer is "2024")
            answerArea.innerHTML = `
                <label>Enter the full publication year (4 digits):</label>
                <input type="text" id="yearInput" maxlength="4" pattern="\\d{4}" placeholder="e.g., 2024" style="margin-left: 10px; padding: 5px;">
                <button id="submitYearBtn">Submit</button>
            `;
            const submitBtn = answerArea.querySelector('#submitYearBtn');
            const yearInput = answerArea.querySelector('#yearInput');
            submitBtn.addEventListener('click', () => {
                const entered = yearInput.value.trim();
                const expected = appConfig.puzzles.find(p => p.id === 3).expectedAnswer;
                if (entered === expected) {
                    // Correct
                    onSolve(expected);
                } else {
                    // Wrong – show clue
                    const puzzleConfig = appConfig.puzzles.find(p => p.id === 3);
                    const clue = puzzleConfig.clues.fallback;
                    alert(clue);
                    // Log wrong attempt
                    reportWrongAttempt(3, entered, clue);
                }
            });
        });
    });
}

// ------------------- Puzzle 4: Blank Page (UV Torch) -------------------
function renderPuzzle4(container, onSolve) {
    container.innerHTML = `
        <div style="text-align: center;">
            <h3>Blank Page (UV Torch)</h3>
            <div id="torchCanvas" style="width: 300px; height: 200px; background: #f5f5dc; margin: 20px auto; border: 2px solid #b5926a; position: relative; overflow: hidden; cursor: none;">
                <div id="hiddenNumber" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; font-weight: bold; color: #f5f5dc; text-shadow: none; transition: none;">247</div>
            </div>
            <p>Move your mouse (or finger) over the blank page to reveal the hidden number.</p>
            <button id="revealManually">I see the number! Enter it</button>
            <div id="puzzle4Area" style="margin-top: 15px;"></div>
        </div>
    `;

    const canvas = container.querySelector('#torchCanvas');
    const hiddenDiv = container.querySelector('#hiddenNumber');
    const revealBtn = container.querySelector('#revealManually');
    const area = container.querySelector('#puzzle4Area');

    // Torch effect: on mousemove, change the hidden number's color to black (reveal) only near cursor
    // For simplicity, we'll just make the entire number visible when mouse enters canvas, and hide when leaves.
    // But a more immersive effect: a circular spotlight.
    // Basic version: on mouseenter, show number; on mouseleave, hide.
    canvas.addEventListener('mouseenter', () => {
        hiddenDiv.style.color = '#000';
    });
    canvas.addEventListener('mouseleave', () => {
        hiddenDiv.style.color = '#f5f5dc';
    });
    // For touch devices
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        hiddenDiv.style.color = '#000';
    });
    canvas.addEventListener('touchend', () => {
        hiddenDiv.style.color = '#f5f5dc';
    });

    revealBtn.addEventListener('click', () => {
        area.innerHTML = `
            <label>Enter the three‑digit number you found:</label>
            <input type="text" id="puzzle4Answer" maxlength="3" pattern="\\d{3}" placeholder="e.g., 247">
            <button id="submitPuzzle4">Submit</button>
        `;
        const submitBtn = area.querySelector('#submitPuzzle4');
        const answerInput = area.querySelector('#puzzle4Answer');
        submitBtn.addEventListener('click', () => {
            const answer = answerInput.value.trim();
            const expected = appConfig.puzzles.find(p => p.id === 4).expectedAnswer; // "247"
            if (answer === expected) {
                onSolve(expected);
            } else {
                const clue = appConfig.puzzles.find(p => p.id === 4).clues.fallback;
                alert(`❌ ${clue}`);
                reportWrongAttempt(4, answer, clue);
            }
        });
    });
}