// --- HELPER: Generate a unique Session ID per browser session ---
function generateSessionId() {
    let id = sessionStorage.getItem('gameSessionId');
    if (!id) {
        id = 'SESS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        sessionStorage.setItem('gameSessionId', id);
    }
    return id;
}

// --- LOCAL BACKUP ---
function logSuccessLocally(teamName, code, timeString) {
    const log = JSON.parse(localStorage.getItem('winners_log') || '[]');
    const newEntry = {
        order: log.length + 1,
        team: teamName,
        code: code,
        time: new Date().toISOString(),
        duration: timeString,
        sessionId: generateSessionId()
    };
    log.push(newEntry);
    localStorage.setItem('winners_log', JSON.stringify(log));
    console.log('📦 Local backup saved:', log.length, 'winners recorded.');
}

// --- WRONG ATTEMPT LOGGING ---
function reportWrongAttempt(puzzleId, wrongInput, context) {
    console.warn(`⚠️ Wrong attempt on Puzzle ${puzzleId}: "${wrongInput}" (${context})`);
}

// --- SUPABASE & GOOGLE CONFIG ---
const SUPABASE_URL = 'https://gvzujgnaozmevlbfhwfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2enVqZ25hb3ptZXZsYmZod2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTc1MzksImV4cCI6MjEwNDAzMzUzOX0.EQfgDbZ60jUUzCwguBw5VBpLFKUZvcBe18ezCLEnthE';

function reportSuccess(teamName, code, timeString) {
    // 1. Always save locally first
    logSuccessLocally(teamName, code, timeString);

    // 2. Build the payload
    const state = loadState();
    const payload = {
        session_id: state.sessionId || 'N/A',
        team_name: teamName,
        full_code: code,
        puzzle_answers: state.puzzleAnswers,
        duration: timeString
    };

    // 3. Send to Supabase (Primary)
    fetch(`${SUPABASE_URL}/rest/v1/winners`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) console.log('✅ Successfully reported to Supabase');
        else console.error('Supabase error:', response.status, response.statusText);
    })
    .catch(err => console.warn('⚠️ Supabase network error (data saved locally)', err));

    // 4. Send to Google Sheets (Backup - if URL is set)
    const googleUrl = localStorage.getItem('customGoogleScriptUrl') || (typeof appConfig !== 'undefined' ? appConfig.googleScriptUrl : null);
    if (googleUrl) {
        fetch(googleUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ team: teamName, code: code, time: timeString, timestamp: new Date().toISOString() })
        }).catch(() => console.warn('⚠️ Google backup failed (data safe in Supabase/Local)'));
    }
}