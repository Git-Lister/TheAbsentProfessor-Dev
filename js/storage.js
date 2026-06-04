const STORAGE_KEY = 'absent_';

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    // Determine number of puzzles from config (requires appConfig to be loaded before storage.js)
    const numPuzzles = (typeof appConfig !== 'undefined' && appConfig.puzzles) ? appConfig.puzzles.length : 5;
    return {
        teamName: '',
        puzzleAnswers: new Array(numPuzzles).fill(''),
        lockboxUnlocked: false,
        startTime: null
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
}

function setStartTime() {
    const state = loadState();
    if (!state.startTime) {
        state.startTime = Date.now();
        saveState(state);
    }
}

function getStartTime() {
    return loadState().startTime;
}

function getElapsedTime() {
    const start = getStartTime();
    if (!start) return null;
    const elapsed = Date.now() - start;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return { minutes, seconds: remainingSeconds };
}