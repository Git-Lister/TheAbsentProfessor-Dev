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