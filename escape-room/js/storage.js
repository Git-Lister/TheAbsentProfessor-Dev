const STORAGE_KEY = 'absent_professor';

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        teamName: '',
        puzzleAnswers: ['', '', '', ''],  // strings like "158", "1423", etc.
        lockboxUnlocked: false
    };
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updatePuzzleAnswer(puzzleId, answerString) {
    const state = loadState();
    state.puzzleAnswers[puzzleId-1] = answerString;
    saveState(state);
    return state;
}

function getPuzzleAnswer(puzzleId) {
    const state = loadState();
    return state.puzzleAnswers[puzzleId-1];
}

function allAnswersCollected() {
    const state = loadState();
    return state.puzzleAnswers.every(ans => ans !== null && ans !== undefined && ans !== '');
}

function setTeamName(name) {
    const state = loadState();
    state.teamName = name;
    saveState(state);
}

function getTeamName() {
    return loadState().teamName;
}

function setLockboxUnlocked(unlocked) {
    const state = loadState();
    state.lockboxUnlocked = unlocked;
    saveState(state);
}

function isLockboxUnlocked() {
    return loadState().lockboxUnlocked;
}

function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    // Also clear any other session data if needed
}