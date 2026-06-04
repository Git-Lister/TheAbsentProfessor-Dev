function logSuccessLocally(teamName, code, timeString) {
    const log = JSON.parse(localStorage.getItem('winners_log') || '[]');
    log.push({
        team: teamName,
        code: code,
        time: new Date().toISOString(),
        duration: timeString,
        sessionId: sessionStorage.getItem('gameSessionId') || 'unknown'
    });
    localStorage.setItem('winners_log', JSON.stringify(log));
}

// In reportSuccess(), call this first
function reportSuccess(teamName, code, timeString) {
    // 1. Always save locally first
    logSuccessLocally(teamName, code, timeString);
    
    // 2. Try Google Sheets if available
    const url = localStorage.getItem('googleScriptUrl') || appConfig.googleScriptUrl;
    if (url) {
        fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ team: teamName, code, time: timeString })
        }).catch(() => console.warn('Google sheet failed – using local backup'));
    }
}