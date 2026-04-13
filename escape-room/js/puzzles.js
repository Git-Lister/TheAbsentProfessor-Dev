// Puzzle implementations
// Each function receives a container (modal content div) and a callback `onSolve(answerString)`

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

// Placeholder for other puzzles (to be implemented later)
function renderPuzzle1(container, onSolve) {
    container.innerHTML = `<p>Puzzle 1 will be implemented soon.</p><button id="dummySolve">Demo solve (set answer "158")</button>`;
    container.querySelector('#dummySolve')?.addEventListener('click', () => onSolve("158"));
}

function renderPuzzle2(container, onSolve) {
    container.innerHTML = `<p>Puzzle 2 will be implemented soon.</p><button id="dummySolve">Demo solve (set answer "1423")</button>`;
    container.querySelector('#dummySolve')?.addEventListener('click', () => onSolve("1423"));
}

function renderPuzzle4(container, onSolve) {
    container.innerHTML = `<p>Puzzle 4 (UV torch) will be implemented soon.</p><button id="dummySolve">Demo solve (set answer "247")</button>`;
    container.querySelector('#dummySolve')?.addEventListener('click', () => onSolve("247"));
}