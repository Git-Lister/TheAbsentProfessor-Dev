function reportSuccess(team, code) {
    if (!appConfig || !appConfig.googleScriptUrl) {
        console.warn('No Google Script URL configured');
        return;
    }
    fetch(appConfig.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            team: team,
            code: code,
            timestamp: new Date().toISOString()
        })
    }).catch(err => console.error('Reporting error:', err));
}

function reportWrongAttempt(puzzleId, wrongAnswer, clueShown) {
    if (!appConfig || !appConfig.wrongAttemptScriptUrl) {
        console.warn('No wrong attempt script URL configured – logging to console only');
        console.log(`Wrong attempt: Puzzle ${puzzleId}, entered "${wrongAnswer}", clue: "${clueShown}"`);
        return;
    }
    fetch(appConfig.wrongAttemptScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            puzzleId: puzzleId,
            wrongAnswer: wrongAnswer,
            clueShown: clueShown,
            timestamp: new Date().toISOString()
        })
    }).catch(err => console.error('Wrong attempt report error:', err));
}