// --- HELPER: Generate a unique Session ID per browser session ---
function generateSessionId() {
    // Uses sessionStorage which clears when the browser tab/window is closed
    let id = sessionStorage.getItem('gameSessionId');
    if (!id) {
        // Creates a unique code: SESS- + timestamp + random 4 chars
        id = 'SESS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        sessionStorage.setItem('gameSessionId', id);
    }
    return id;
}

// --- LOCAL BACKUP: Store data on the facilitator's device ---
function logSuccessLocally(teamName, code, timeString) {
    // Load existing log or create a new empty array
    const log = JSON.parse(localStorage.getItem('winners_log') || '[]');
    
    const newEntry = {
        order: log.length + 1, // Auto-calculates submission order (1, 2, 3...)
        team: teamName,
        code: code,
        time: new Date().toISOString(), // The exact datetime they unlocked
        duration: timeString, // Time taken (e.g. "2m 34s")
        sessionId: generateSessionId() // Attach the session ID
    };

    log.push(newEntry);
    localStorage.setItem('winners_log', JSON.stringify(log));
    console.log('📦 Local backup saved:', log.length, 'winners recorded.');
}

// --- WRONG ATTEMPT LOGGING (used by Puzzle 3 and 4) ---
function reportWrongAttempt(puzzleId, wrongInput, context) {
    // Currently logs silently to console. Can be expanded to track wrong attempts in future.
    console.warn(`⚠️ Wrong attempt on Puzzle ${puzzleId}: "${wrongInput}" (${context})`);
}

// --- MAIN REPORTING ENDPOINT ---
function reportSuccess(teamName, code, timeString) {
    // 1. Always save locally first (totally independent fallback)
    logSuccessLocally(teamName, code, timeString);

    // 2. Try sending to Google Sheets or a self-hosted endpoint
    // Retrieves the custom URL set via admin-config.html, or falls back to config.json
    const url = localStorage.getItem('customGoogleScriptUrl') || (typeof appConfig !== 'undefined' ? appConfig.googleScriptUrl : null);
    
    if (url) {
        fetch(url, {
            method: 'POST',
            mode: 'no-cors', // Bypasses CORS policies for Google Apps Script
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ 
                team: teamName, 
                code: code, 
                time: timeString,
                timestamp: new Date().toISOString() 
            })
        })
        .then(() => console.log('✅ Successfully reported to external endpoint.'))
        .catch((err) => {
            console.warn('❌ External endpoint unreachable. Data is safe in the local backup.', err);
        });
    } else {
        console.warn('⚠️ No reporting URL configured. Data has been saved locally only.');
    }
}