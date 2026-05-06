# The Case of the Absent Professor – Digital Escape Room

This project is a web‑based version of the in‑person escape room game created by **Mark Burgess** (MMU Library). Student groups solve four puzzles, fill a 4×4 grid, and automatically unlock a digital lockbox when the third column spells `8227`. Results are reported in real‑time to a Google Sheet for the facilitator.

## Features

- **Team name entry screen** – teams identify themselves before starting.
- **Four interactive puzzles** – each reveals a multi‑digit answer (e.g., `2024`).
- **Live grid** – shows how digits fill the columns as puzzles are solved.
- **Auto‑unlocking lockbox** – when column 3 becomes `8227`, the lockbox opens and reports success.
- **Reset button** – clears all progress and restarts the game.
- **Google Sheets reporting** – logs team name, code, and timestamp for the facilitator.
- **Wrong attempt logging** (optional) – helps identify common mistakes.

## How Winner is Determined

The **first team to unlock the lockbox** (by submitting the correct 4×4 grid with `8227` in column 3) is recorded as the winner. The winner is determined by **submission timestamp**, not by total time spent or duration. Each successful unlock is logged to the Google Sheet with:

- Team name
- Correct code (the 4×4 grid values)
- Timestamp of unlock

The facilitator can then announce the winning team based on who submitted first.

## How to Run Locally (for testing)

Because the game uses `fetch()` to load `config.json`, you must serve the files via a web server, not open `index.html` directly from your file system.

### Option 1: Python 3 (recommended)

Open a terminal in the project folder (`escape-room/`) and run:

```bash
python -m http.server 8000
Then open http://localhost:8000 in your browser.

Option 2: VS Code Live Server
Install the “Live Server” extension, right‑click index.html, and choose “Open with Live Server”.

Setup Instructions (for the facilitator)
Configure puzzles & answers
Edit data/config.json to set each puzzle’s expectedAnswer (e.g., "2024"), clues, and hint text. The targetCode should be "8227".

Set up Google Sheets reporting

Create a new Google Sheet.

Go to Extensions → Apps Script.

Paste the contents of backend/apps-script.js into the editor.

Deploy as a web app (Execute as: “Me”, Who has access: “Anyone”).

Copy the deployment URL and paste it into config.json as googleScriptUrl.

(Optional) Create a second sheet for wrong attempts and update wrongAttemptScriptUrl.

Deploy to GitHub Pages

Push all files to a GitHub repository.

In repository Settings → Pages, set the branch to main and folder to / (root).

The site will be live at https://yourusername.github.io/repo-name.

Test the game

Open the URL, enter a team name, solve puzzles in any order.

The grid fills automatically. When column 3 shows 8227, the lockbox unlocks.

Check the Google Sheet for recorded unlocks (team name, code, timestamp).

Project Structure
text
escape-room/
├── index.html              # Main game page (team entry + UI)
├── css/
│   └── style.css           # All styling (team entry, cards, grid, modals)
├── js/
│   ├── config.js           # Loads config.json
│   ├── storage.js          # localStorage helpers (answers, team, lockbox state)
│   ├── reporting.js        # Sends success / wrong attempts to Google Sheets
│   ├── puzzles.js          # Puzzle implementations (1–4)
│   ├── lockbox.js          # Grid rendering & auto‑unlock logic
│   └── app.js              # Main controller (team entry, reset, puzzle opening)
├── data/
│   └── config.json         # Answers, clues, hint timers, script URLs
├── backend/
│   └── apps-script.js      # Google Apps Script code (copy into Sheets)
└── README.md
Customisation
Puzzle content – Edit js/puzzles.js. Each puzzle function receives a container and an onSolve(answerString) callback.

Styling – Modify css/style.css. The grid and lockbox styles are at the bottom.

Answers & clues – Change data/config.json without touching code.

Hints – The hintTimer and hintText in config.json are ready for future implementation.

Troubleshooting
Grid doesn’t appear – Make sure you are using a local web server (not file://).

Lockbox doesn’t unlock – Verify that the four answers in config.json produce 8227 in column 3 (e.g., row1=158, row2=1423, row3=2024, row4=247).

Google Sheets reporting fails – Check that the deployed Apps Script URL is correct and that the script has write access to the sheet.

Credits
Original game design: Mark Burgess, Academic Liaison Librarian, MMU

Digital development: David Haigh, Library Services and Discovery Adviser, MMU

Open source – feel free to fork and adapt for your own library orientation or teaching sessions.

Enjoy the hunt for the absent professor’s grades! 🎓🔓