
# 🧩 The Case of the Absent Professor – Digital Escape Room

A web‑based version of the in‑person escape room by **Mark Burgess** (MMU Library).  
Students solve four puzzles, fill a 4×4 grid, and unlock a safe when the third column spells `8227`.  
Results are sent live to a Google Sheet.

---

## ✨ Features at a glance

| Feature | What it does |
|---------|---------------|
| 👥 **Team name entry** | Teams identify themselves before starting. |
| 📖 **Story modal** | Immersive introduction with professor portrait. |
| 🧠 **Four interactive puzzles** | Each gives a multi‑digit answer (e.g., `2024`). |
| 📊 **Live 4×4 grid** | Shows how digits fill columns as puzzles are solved. |
| 🔒 **Safe dial mechanism** | Enter the final code with up/down dials. |
| 🔁 **Reset button** | Clears all progress and restarts the game. |
| 📈 **Google Sheets reporting** | Logs team name, split answers, time taken, readable timestamp. |
| 🏆 **Winner determination** | First to unlock wins (by submission timestamp). |
| ♿ **High‑contrast mode** | Toggle with the ♿ button – persists in localStorage. |
| 📱 **Mobile responsive** | Adapts to small screens; portrait warning for Puzzle 4. |
| 🛠️ **Admin page** | Change the Google Sheets URL without editing code. |
| ❓ **Help modal** | Thematic guide (no spoilers) – click the ❓ button. |
| 🌐 **Custom favicon** | No more `favicon.ico` 404. |

---

## 🏆 How the winner is decided

The **first team to unlock the lockbox** (by entering the correct `8227` code) wins.  
Winner is determined by **submission timestamp**, not by total time spent.  
Each successful unlock writes a row to the Google Sheet containing:

- Submission order (1st, 2nd, 3rd…)
- Team name
- Full concatenated code
- Individual puzzle answers (for debugging)
- Time taken (e.g., `2m 34s`)
- Readable timestamp (e.g., `07/05/2026 10:49:15`)

> **Facilitator tip:** sort the sheet by the **Order** column to see the winner instantly.

---

## 💻 How to run locally (testing)

The game uses `fetch()` to load `config.json`, so you **must** serve it via a web server – not directly from the file system.

### Option 1: Python 3 (recommended)
```bash
cd TheAbsentProfessor-Dev
python -m http.server 8000
```
Then open `http://localhost:8000`.

### Option 2: VS Code Live Server
Install the “Live Server” extension, right‑click `index.html`, and choose “Open with Live Server”.

---

## 🛠️ Setup instructions (facilitator)

### 1. Configure puzzles & answers
Edit `data/config.json` – set each puzzle’s `expectedAnswer` (e.g., `"2024"`), clues, and hint text.  
Keep `targetCode` as `"8227"`.

### 2. Set up Google Sheets reporting

1. Create a new Google Sheet.
2. **Extensions → Apps Script**.
3. Paste the enhanced script below.
4. **Deploy as a web app**:
   - Execute as: `Me`
   - Who has access: `Anyone`
5. Copy the deployment URL (ends with `/exec`).

**Enhanced script (adds order, split answers, readable timestamp):**

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

Paste the URL into `data/config.json` as `googleScriptUrl`, **or** use the admin page (see below).

### 3. (Optional) Use the admin page to change the reporting URL

Open: `https://your‑username.github.io/your‑repo‑name/admin-config.html`  
Paste the URL and click **Save** – the game will use this URL (overrides `config.json`).

### 4. Deploy to GitHub Pages

- Push all files to your GitHub repository.
- In **Settings → Pages**, set branch to `main` and folder to `/ (root)`.
- The site will be live at `https://your‑username.github.io/repo‑name`.

### 5. Test the game

- Enter a team name, read the story, solve puzzles in any order.
- The 4×4 grid fills automatically. When column 3 shows `8227`, use the dials to enter that code and click **Check Combination**.
- The lockbox unlocks and reports success to the Google Sheet.

---

## ♿ Accessibility

- **High‑contrast mode** – toggle with the ♿ button (top‑right). White background, dark text, strong borders – persists in `localStorage`.
- **Mobile responsive** – adapts to small screens; Puzzle 4 shows a warning in portrait orientation.
- **Keyboard navigation** – focus indicators visible, especially in high‑contrast mode.
- **Help modal** – ❓ button (top‑left) opens a thematic guide listing each puzzle’s goal and a hint tip.

---

## 📁 Project structure

```
TheAbsentProfessor-Dev/
├── index.html              # Main game page
├── admin-config.html       # Admin page for reporting URL
├── css/
│   └── style.css           # All styling (default + high‑contrast)
├── js/
│   ├── config.js           # Loads config.json
│   ├── storage.js          # localStorage helpers
│   ├── reporting.js        # Sends data to Google Sheets
│   ├── puzzles.js          # Puzzle implementations (1–4)
│   ├── lockbox.js          # Grid, dials, unlock logic
│   └── app.js              # Main controller (entry, story, reset)
├── data/
│   └── config.json         # Answers, clues, hints, Google Script URL
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
```

---

## 🎨 Customisation

- **Puzzle content** – Edit `js/puzzles.js`. Each puzzle receives a container and an `onSolve(answerString)` callback.
- **Styling** – Modify `css/style.css`. Default theme uses CSS variables (teal, gold, dark overlays). High‑contrast mode is independent.
- **Answers & clues** – Change `data/config.json` without touching code.
- **Hints** – `hintTimer` (seconds) and `hintText` in `config.json` control timed hints.

---

## 🔧 Troubleshooting

| Problem | Likely fix |
|---------|-------------|
| Grid doesn’t appear | Use a local web server (not `file://`). |
| Lockbox won’t unlock | Verify the four answers in `config.json` produce `8227` in column 3 (e.g., `158`, `1423`, `2024`, `247`). |
| Google Sheets reporting fails | Check the Apps Script URL is correct, redeployed, and has write access. |
| High‑contrast mode missing some elements | Hard refresh (`Ctrl+Shift+R`); ensure CSS selectors are up to date. |
| Puzzle 1 images 404 | Name your images `1.jpg` … `9.jpg` and place them in `images/puzzle1/`. |
| Puzzle 4 numbers don’t glow / no claim button | Hard refresh – numbers now glow teal with a black outline when the torch passes over them. |

---

## 🙏 Credits

- **Original game design:** Mark Burgess, Academic Liaison Librarian, MMU  
- **Digital development:** David Haigh, Library Services and Discovery Adviser, MMU  
- **Open source** – feel free to fork and adapt.

Enjoy the hunt for the absent professor’s grades! 🎓🔓
```

