

## README.md

Below is the **complete revised README**. It incorporates:
- The new jungle theme and colour palette (CSS variables)
- High‑contrast accessibility mode (♿ button)
- Improved Google Sheets reporting (order, split answers, readable timestamp)
- Admin area for changing the reporting URL
- Winner determination by submission timestamp (not duration)
- Mobile responsiveness notes
- Updated puzzle descriptions (Puzzle 2 simplified, Puzzle 4 larger numbers, etc.)

**Copy and paste this into your `README.md` file.**

```markdown
# The Case of the Absent Professor – Digital Escape Room

This project is a web‑based version of the in‑person escape room game created by **Mark Burgess** (MMU Library). Student groups solve four puzzles, fill a 4×4 grid, and unlock a digital lockbox when the third column spells `8227`. Results are reported in real‑time to a Google Sheet for the facilitator.

## Features

- **Team name entry screen** – teams identify themselves before starting.
- **Story modal** with professor portrait and immersive introduction.
- **Four interactive puzzles** – each reveals a multi‑digit answer (e.g., `2024`).
- **Live 4×4 grid** – shows how digits fill the columns as puzzles are solved.
- **Safe dial mechanism** – students enter the final code using up/down dials.
- **Reset button** – clears all progress and restarts the game.
- **Google Sheets reporting** – logs team name, split puzzle answers, time taken, and a readable timestamp.
- **Winner determination** – by submission timestamp (first to unlock wins).
- **High‑contrast accessibility mode** – toggle with the ♿ button (persists via localStorage).
- **Mobile responsive** – adapts to small screens and portrait orientation with helpful warnings.
- **Admin page** – allows facilitator to change the Google Sheets URL without editing code.

## How Winner is Determined

The **first team to unlock the lockbox** (by entering the correct 4‑digit code `8227`) is recorded as the winner. The winner is determined by **submission timestamp**, not by total time spent. Each successful unlock is logged to the Google Sheet with:

- Submission order (1st, 2nd, 3rd…)
- Team name
- Full concatenated code
- Individual puzzle answers (for debugging)
- Time taken (formatted as `Xm Ys`)
- Readable timestamp (e.g., `07/05/2026 10:49:15`)

The facilitator can sort by the **Order** column to see the winning team immediately.

## How to Run Locally (for testing)

Because the game uses `fetch()` to load `config.json`, you must serve the files via a web server, not open `index.html` directly.

### Option 1: Python 3 (recommended)

Open a terminal in the project folder (`TheAbsentProfessor-Dev/`) and run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: VS Code Live Server

Install the “Live Server” extension, right‑click `index.html`, and choose “Open with Live Server”.

## Setup Instructions (for the facilitator)

### 1. Configure puzzles & answers
Edit `data/config.json` to set each puzzle’s `expectedAnswer` (e.g., `"2024"`), clues, and hint text. The `targetCode` should be `"8227"`.

### 2. Set up Google Sheets reporting

1. Create a new Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Replace the default code with the script from `backend/apps-script.js` (or the enhanced version below).
4. Deploy as a **web app**:
   - Execute as: `Me`
   - Who has access: `Anyone`
5. Copy the deployment URL (ends with `/exec`).

**Enhanced script (recommended) – adds order, split answers, readable timestamp:**

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  const lastRow = sheet.getLastRow();
  const order = lastRow === 0 ? 1 : lastRow;
  const puzzle1 = data.code.substring(0, 3);
  const puzzle2 = data.code.substring(3, 7);
  const puzzle3 = data.code.substring(7, 11);
  const puzzle4 = data.code.substring(11);
  const isoDate = new Date(data.timestamp);
  const readableTimestamp = Utilities.formatDate(isoDate, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
  sheet.appendRow([order, data.team, data.code, puzzle1, puzzle2, puzzle3, puzzle4, data.timeTaken, readableTimestamp]);
  return ContentService.createTextOutput("OK");
}
```

After deploying, paste the URL into `data/config.json` as `googleScriptUrl`.  
Alternatively, use the **admin page** (see below) to save the URL without editing code.

### 3. (Optional) Use the admin page to change the reporting URL

The game includes an admin page that saves the Google Sheets URL to your browser’s `localStorage`.  
Open: `https://your‑github‑username.github.io/your‑repo‑name/admin-config.html`  
Paste the URL and click **Save**. The game will then use that URL instead of the one in `config.json`.

### 4. Deploy to GitHub Pages

- Push all files to a GitHub repository.
- In repository **Settings → Pages**, set the branch to `main` and folder to `/ (root)`.
- Your site will be live at `https://yourusername.github.io/repo-name`.

### 5. Test the game

- Open the URL, enter a team name, read the story, and solve puzzles in any order.
- The 4×4 grid fills automatically. When column 3 shows `8227`, use the dials to enter that code and click **Check Combination**.
- The lockbox unlocks and the game reports success.
- Check your Google Sheet – new columns should appear with the enhanced data.

## Accessibility

- **High‑contrast mode**: Click the ♿ button at the top right to toggle a high‑contrast theme (white background, dark text, strong borders). The setting is saved for future visits.
- **Mobile responsive**: The interface adapts to small screens, and Puzzle 4 displays a warning when in portrait orientation.
- **Keyboard navigation**: All interactive elements have focus indicators (especially visible in high‑contrast mode).

## Project Structure

```
TheAbsentProfessor-Dev/
├── index.html              # Main game page
├── admin-config.html       # Admin page for changing reporting URL
├── css/
│   └── style.css           # All styling (default theme + high‑contrast)
├── js/
│   ├── config.js           # Loads config.json
│   ├── storage.js          # localStorage helpers
│   ├── reporting.js        # Sends success data to Google Sheets
│   ├── puzzles.js          # Puzzle implementations (1–4)
│   ├── lockbox.js          # Lockbox grid, dials, and unlock logic
│   └── app.js              # Main controller (team entry, story, reset)
├── data/
│   └── config.json         # Answers, clues, hints, Google Script URL
├── images/
│   ├── jungle-bg.jpg       # New jungle background
│   ├── mmu-logo.png
│   ├── professor-portrait.jpg
│   ├── puzzle1/            # 1.jpg – 9.jpg for Puzzle 1
│   └── puzzle4/
│       └── library.jpg     # Background image for UV torch puzzle
├── backend/
│   └── apps-script.js      # Reference copy of Google Apps Script
└── README.md
```

## Customisation

- **Puzzle content** – Edit `js/puzzles.js`. Each puzzle function receives a container and an `onSolve(answerString)` callback.
- **Styling** – Modify `css/style.css`. The default theme uses CSS variables (teal, gold, dark overlays). High‑contrast mode is separate.
- **Answers & clues** – Change `data/config.json` without touching code.
- **Hints** – The `hintTimer` (in seconds) and `hintText` in `config.json` are used for timed hints.

## Troubleshooting

- **Grid doesn’t appear** – Ensure you are using a local web server (not `file://`).
- **Lockbox doesn’t unlock** – Check that the four answers in `config.json` produce `8227` in column 3 (e.g., row1=`158`, row2=`1423`, row3=`2024`, row4=`247`).
- **Google Sheets reporting fails** – Verify that the deployed Apps Script URL is correct, that the script has write access to the sheet, and that you have redeployed the script after updating it.
- **High‑contrast mode doesn’t affect lockbox** – The CSS has been updated to cover all lockbox elements. If something still looks wrong, open an issue.
- **Puzzle 1 images 404** – Ensure your images are named `1.jpg` … `9.jpg` and placed in `images/puzzle1/`. The code now uses `.jpg` directly (no fallback).

## Credits

- **Original game design:** Mark Burgess, Academic Liaison Librarian, MMU  
- **Digital development:** David Haigh, Library Services and Discovery Adviser, MMU  
- **Open source** – feel free to fork and adapt for your own library orientation or teaching sessions.

Enjoy the hunt for the absent professor’s grades! 🎓🔓
```

