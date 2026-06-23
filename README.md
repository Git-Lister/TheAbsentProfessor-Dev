# 🧩 The Case of the Absent Professor – Digital Escape Room

A web‑based version of the in‑person escape room by **Mark Burgess** (MMU Library).  
Students solve five puzzles, fill a 4×4 grid, and unlock a safe when the correct column spells `78227`.  
Results are sent live to a reporting endpoint (Google Sheets, Webhooks, or Self-hosted).

---

## ✨ Features at a glance

| Feature | What it does |
|---------|---------------|
| 👥 **Team name entry** | Teams identify themselves before starting. |
| 📖 **Story modal** | Immersive introduction with professor portrait. |
| 🧠 **Five interactive puzzles** | Each gives a multi‑digit answer (e.g., `2024`, `6471`). |
| 📊 **Live 5×4 grid** | Shows how digits fill columns as puzzles are solved. |
| 🔒 **Safe dial mechanism** | Enter the final 5-digit code with up/down dials. |
| 🔁 **Reset button** | Clears all progress and restarts the game. |
| 📈 **Flexible Reporting** | Supports Google Sheets, Webhooks, or self-hosted servers. |
| 🏆 **Winner determination** | First to unlock wins (by submission timestamp). |
| ♿ **High‑contrast mode** | Toggle with the ♿ button – persists in localStorage. |
| 📱 **Mobile responsive** | Adapts to small screens. |
| 🛠️ **Admin URL Config** | Change the reporting endpoint without editing code (`admin-config.html`). |
| 📊 **Admin Dashboard** | View a local leaderboard and download a CSV of winners (`admin.html`). |
| ❓ **Help modal** | Thematic guide (no spoilers) – click the 📓 button. |
| 🌐 **Custom favicon** | Blends perfectly with dark/light themes. |

---

## 🏆 How the winner is decided

The **first team to unlock the lockbox** (by entering the correct `78227` code) wins.  
Winner is determined by **submission timestamp**, not by total time spent.  
Each successful unlock writes a row to the reporting endpoint containing:

- Submission order (1st, 2nd, 3rd…)
- Team name
- Full concatenated code
- Individual puzzle answers (for debugging)
- Time taken (e.g., `2m 34s`)
- Readable timestamp (e.g., `07/05/2026 10:49:15`)

> **Facilitator tip:** Sort the sheet by the **Order** column to see the winner instantly.

---

## 💻 How to run locally (testing)

The game uses `fetch()` to load `config.json`, so you **must** serve it via a web server – not directly from the file system.

### Option 1: Python 3 (recommended)
```bash
cd TheAbsentProfessor-Dev
python -m http.server 8000
Then open http://localhost:8000.

Option 2: VS Code Live Server
Install the “Live Server” extension, right‑click index.html, and choose “Open with Live Server”.

🛠️ Setup instructions (facilitator)
1. Configure puzzles & answers
Edit data/config.json – set each puzzle’s expectedAnswer (e.g., "2024", "6471"), clues, and hint text.
Keep targetCode as "78227".

2. Set up reporting (Choose your method)
Option A: Google Sheets (Recommended for standard setup)

Create a new Google Sheet.

Extensions → Apps Script.

Paste the script below.

Deploy as a web app: Execute as Me, Who has access Anyone.

Copy the deployment URL (ends with /exec).

Apps Script (enhanced):

javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  const lastRow = sheet.getLastRow();
  const order = lastRow === 0 ? 1 : lastRow;
  // 5-puzzle concat index logic
  const puzzle1 = data.code.substring(0, 3);
  const puzzle2 = data.code.substring(3, 7);
  const puzzle3 = data.code.substring(7, 11);
  const puzzle4 = data.code.substring(11, 15);
  const puzzle5 = data.code.substring(15);
  const isoDate = new Date(data.timestamp);
  const readableTimestamp = Utilities.formatDate(isoDate, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
  sheet.appendRow([order, data.team, data.code, puzzle1, puzzle2, puzzle3, puzzle4, puzzle5, data.timeTaken, readableTimestamp]);
  return ContentService.createTextOutput("OK");
}
Option B: Self-hosted Server (Totally independent)
If you prefer total independence from Google, you can run a simple Node.js server.
Update reporting.js to point to your server URL (e.g., https://your-server.com/report).

3. Save the reporting URL
Open: https://your-username.github.io/your-repo-name/admin-config.html
Paste the reporting URL and click Save. This overrides config.json locally.

4. View local winners (No internet required)
Open: https://your-username.github.io/your-repo-name/admin.html
This page reads the localStorage backup of winners. You can also download a CSV file of all successful teams.

5. Deploy to GitHub Pages
Push all files to your GitHub repository.

In Settings → Pages, set branch to main and folder to / (root).

The site will be live at https://your-username.github.io/repo-name.

6. Test the game
Enter a team name, read the story, solve puzzles in any order.

The 4×4 grid fills automatically. When column 3 spells 78227, use the 5 dials to enter that code and click Check Combination.

The lockbox unlocks and reports success to your endpoint.

♿ Accessibility
High‑contrast mode – toggle with the ♿ button. White background, dark text, strong borders – persists in localStorage.

Mobile responsive – adapts to small screens.

Keyboard navigation – focus indicators visible, especially in high‑contrast mode.

Help modal – 📓 button (top‑left) opens a thematic guide listing each puzzle’s goal and a hint tip.

📁 Project structure
text
TheAbsentProfessor-Dev/
├── index.html              # Main game page
├── admin.html              # Dashboard to view/download winners locally
├── admin-config.html       # Page to change the reporting endpoint URL
├── css/
│   └── style.css           # All styling (default + high‑contrast)
├── js/
│   ├── config.js           # Loads config.json
│   ├── storage.js          # localStorage helpers
│   ├── reporting.js        # Sends data to reporting endpoints
│   ├── puzzles.js          # Puzzle implementations (1–5)
│   ├── lockbox.js          # Grid, dials, unlock logic
│   └── app.js              # Main controller (entry, story, reset)
├── data/
│   └── config.json         # Answers, clues, hints, Reporting URL
├── images/
│   ├── jungle-bg.jpg       # Jungle background
│   ├── mmu-logo.png
│   ├── professor-portrait.jpg
│   ├── puzzle1/            # 1.jpg … 9.jpg
│   └── puzzle4/
│       └── library.jpg     # UV torch background
├── backend/
│   └── apps-script.js      # Reference copy of Apps Script
└── README.md
🎨 Customisation
Puzzle content – Edit js/puzzles.js. Each puzzle receives a container and an onSolve(answerString) callback.

Styling – Modify css/style.css. Default theme uses CSS variables (teal, gold, dark overlays). High‑contrast mode is independent.

Answers & clues – Change data/config.json without touching code.

Hints – hintTimer (seconds) and hintText in config.json control timed hints.

🔧 Troubleshooting
Problem	Likely fix
Grid doesn’t appear	Use a local web server (not file://).
Lockbox won’t unlock	Verify the five answers in config.json produce 78227 in column 3 (e.g., 247, 158, 1423, 2024, 6471).
Reporting fails	Check the Apps Script URL is correct and has write access. For self-hosted servers, check the console logs.
High‑contrast mode missing some elements	Hard refresh (Ctrl+Shift+R); ensure CSS selectors are up to date.
Puzzle 1 images 404	Name your images 1.jpg … 9.jpg and place them in images/puzzle1/.
Puzzle 4 numbers don’t glow / no claim button	Hard refresh – numbers now glow teal with a black outline when the torch passes over them.
🙏 Credits
Original game design: Mark Burgess, Academic Liaison Librarian, MMU

Digital development: David Haigh, Library Services and Discovery Adviser, MMU

Open source – feel free to fork and adapt.

Enjoy the hunt for the absent professor’s grades! 🎓🔓