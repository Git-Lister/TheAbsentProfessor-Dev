// reporting.js – sends success data to Google Sheet (custom URL support)
function getReportingUrl() {
    // Check if facilitator has saved a custom URL via admin page
    const custom = localStorage.getItem('customGoogleScriptUrl');
    if (custom && custom.startsWith('https://script.google.com/')) {
        return custom;
    }
    // Fallback to config.json URL
    return appConfig && appConfig.googleScriptUrl ? appConfig.googleScriptUrl : null;
}

function reportSuccess(team, code, timeTaken) {
    const url = getReportingUrl();
    if (!url) {
        console.warn('No Google Script URL configured – reporting disabled');
        return;
    }
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            team: team,
            code: code,
            timestamp: new Date().toISOString(),
            timeTaken: timeTaken   // e.g., "2m 34s"
        })
    }).catch(err => console.error('Reporting error:', err));
}

function reportWrongAttempt(puzzleId, wrongAnswer, clueShown) {
    // wrong attempt logging is optional; we keep console logging for now
    console.log(`Wrong attempt: Puzzle ${puzzleId}, entered "${wrongAnswer}", clue: "${clueShown}"`);
}