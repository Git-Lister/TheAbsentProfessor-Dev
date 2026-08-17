Here is the complete, fully updated `README.md`. It is rewritten with **facilitators and library staff in mind**—keeping the developer sections neatly separated, while putting the important admin setup steps front and center so anyone can get it running quickly.

You can copy and paste this directly into your `README.md` file.

```markdown
# 🧩 The Case of the Absent Professor – Digital Escape Room
*A gamified library induction tool for MMU students.*

This web-based escape room introduces new students to library services through five interactive puzzles. As teams solve each puzzle, they reveal numbers that fill a lockbox grid. The first team to enter the final 5-digit code wins!

Built by **Mark Burgess** and **David Haigh** (MMU Library). 

---

## 👩‍🏫 Quick Start for Facilitators (You are here)

To get this running for your students, you only need to do three things:

### 1. Set up a Reporting Sheet (Google Sheets)
1. Create a new Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Delete any default code and paste the script provided below (under *"Reporting & Data"*).
4. Click **Deploy → New deployment** → **Web app**:
   - Description: `Escape Room Reporting`
   - Execute as: `Me`
   - Who has access: `Anyone`
   - Click **Deploy**.
5. Copy the Web App URL (it will end in `/exec`).

### 2. Tell the game where to send the data
Open the game's **Admin Configuration Page**:
> **[https://git-lister.github.io/TheAbsentProfessor-Dev/admin-config.html](https://git-lister.github.io/TheAbsentProfessor-Dev/admin-config.html)**  

Paste your Web App URL into the box and click **Save**. That's it!

### 3. Get the results during/after the session
Open the **Live Admin Dashboard**:
> **[https://git-lister.github.io/TheAbsentProfessor-Dev/admin.html](https://git-lister.github.io/TheAbsentProfessor-Dev/admin.html)**

This dashboard shows a live leaderboard of winning teams, their completion times, and unique session IDs. Use the **"Clear Local Logs"** button at the start of each new class to reset the dashboard for your fresh session.

---

## ✨ Features at a glance

| Feature | What it does |
|---------|---------------|
| 👥 **Team name entry** | Teams identify themselves before starting. |
| 📖 **Immersive story intro** | A Pokémon-style typewriter cutscene introduces the "Absent Professor". |
| 🧠 **Five interactive puzzles** | A mix of visual matching, poetry, web searching, and a UV torch puzzle. |
| 📊 **Live 5×4 grid** | As teams solve puzzles, their answers fill the lockbox grid. |
| 🔒 **Safe dial mechanism** | Enter the final 5-digit code (e.g., `78227`) using up/down dials. |
| 🔁 **Game reset button** | Restarts the entire game for a new team or class. |
| 📈 **Flexible Reporting** | Supports Google Sheets, Custom Webhooks, or Self-hosted servers. |
| 🏆 **Winner determination** | First to unlock the safe wins (logged by submission timestamp). |
| ♿ **High‑contrast mode** | Toggle with the ♿ button – persists in localStorage. |
| 📱 **Mobile responsive** | Adapts to small screens and uses large touch targets. |
| 🛠️ **Admin URL Config** | Change the reporting endpoint without editing code (`admin-config.html`). |
| 📊 **Admin Dashboard** | View winners, download a CSV, and clear logs for new sessions (`admin.html`). |
| ❓ **Help modal** | Thematic professor's notebook guide – click the 📓 button. |
| 🌐 **Custom favicon** | Blends perfectly with dark/light themes. |

---

## 🏆 How the winner is decided

The **first team to unlock the lockbox** wins. It is determined by the order of submission timestamp sent to your reporting sheet, not by total time spent.
Each unlock records:
- Team name
- Full 5-puzzle concatenated code
- Individual puzzle answers (for debugging)
- Time taken (e.g., `2m 34s`)
- Exact timestamp of submission
- A unique `Session ID` (useful if you run multiple classes on the same device)

> **Facilitator tip:** Sort your Google Sheet by the **Order** column to instantly see the winner.

---

## 🛠️ Detailed Setup Instructions (Facilitator)

### 1. Configure the 5 Puzzles
Edit `data/config.json` to set each puzzle's `expectedAnswer`, `hintTimer`, and `hintText`.
The game automatically calculates the final lockbox code from the **third digit** of each answer. 
For example:
- Open All Hours: `247` -> 3rd digit is **7**
- Check it, Return it...: `158` -> 3rd digit is **8**
- Library Layers: `1423` -> 3rd digit is **2**
- Email Chain: `2024` -> 3rd digit is **2**
- Reading List Roadmap: `6471` -> 3rd digit is **7**

**The final target code is `78227`.** Keep this as your `targetCode` in the config file.

### 2. Choose your reporting method

**Option A: Google Sheets (Standard)**
1. Create a new Google Sheet.
2. **Extensions → Apps Script**.
3. Paste the script below.
4. Deploy as a Web App (Execute as: `Me`, Who has access: `Anyone`).
5. Copy the generated URL.

**Google Apps Script (supports 5 puzzles):**
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  const lastRow = sheet.getLastRow();
  const order = lastRow === 0 ? 1 : lastRow;
  
  // Extract 5 puzzle answers from the concatenated code
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
```

**Option B: Self-hosted Server (Totally Independent)**
If you prefer not to use Google, you can run a tiny Node.js server on Render.com or your own university network. The game can send data to `https://your-server-url.com/report`.

### 3. Configure the Admin Endpoint
Open your live deployment URL (or localhost) and add `/admin-config.html` to the end:
`https://[your-username].github.io/[repo-name]/admin-config.html`
Paste your reporting URL (Google Script or Self-hosted) into the box and click **Save**.

### 4. View Live Results
Open the Live Dashboard by adding `/admin.html` to your URL:
`https://[your-username].github.io/[repo-name]/admin.html`
Here you can view the winners, download a CSV file for record-keeping, and use the **🗑️ Clear Local Logs** button to reset the dashboard for your next class.

### 5. Deploy to GitHub Pages
1. Push all files to your GitHub repository.
2. Go to **Settings → Pages**.
3. Set branch to `main` and folder to `/ (root)`.
4. Your game will be live at `https://your-username.github.io/repo-name`.

---

## 💻 How to run locally (for testing & editing)

The game must be run via a local web server. You cannot open `index.html` directly from your computer's file explorer (browsers block the `fetch()` request).
Open your terminal (command prompt) and run:

```bash
cd TheAbsentProfessor-Dev
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

---

## 📁 Project structure

```
TheAbsentProfessor-Dev/
├── index.html              # The main game interface
├── admin.html              # Local winners dashboard & CSV download
├── admin-config.html       # Page to change the reporting endpoint URL
├── css/
│   └── style.css           # All styles (standard + high‑contrast)
├── js/
│   ├── config.js           # Loads config.json
│   ├── storage.js          # localStorage save/load helpers
│   ├── reporting.js        # Handles data to Google/Server & Local Backup
│   ├── puzzles.js          # All 5 puzzle implementations
│   ├── lockbox.js          # Grid, dials, and safe unlock logic
│   └── app.js              # Main controller (entry, story, reset)
├── data/
│   └── config.json         # Answers, clues, hints, and endpoint URL
├── images/
│   ├── jungle-bg.jpg
│   ├── mmu-logo.png
│   ├── professor-portrait.jpg
│   ├── puzzle1/            # 1.jpg … 9.jpg
│   ├── puzzle4/
│   │   └── library.jpg     # UV torch background
│   └── lockbox-outer.jpg   # Optional safe textures
├── backend/
│   └── apps-script.js      # Reference copy of the Google Apps Script
└── README.md
```

---

## 🎨 Customisation

- **Puzzle content** – Edit `js/puzzles.js`. Each puzzle receives a container and an `onSolve(answerString)` callback.
- **Styling** – Modify `css/style.css`. The theme uses CSS variables (teal, gold, dark overlays). High‑contrast mode is separate.
- **Answers & clues** – Change `data/config.json` without touching any JavaScript.
- **Hints** – Set `hintTimer` (in seconds) and `hintText` in `config.json` to control timed hints.

---

## 🔧 Troubleshooting

| Problem | Likely fix |
|---------|-------------|
| **Grid doesn’t appear** | You are opening the file directly. Use a local web server (`python -m http.server`). |
| **Lockbox won’t unlock** | Check that the 3rd digits of the 5 answers in `config.json` correctly make `78227`. |
| **Reporting fails / no data arrives** | Check your Apps Script URL is correct in `admin-config.html`. Ensure the script is deployed as a **Web app** with access set to **Anyone**. |
| **High‑contrast mode missing some elements** | Hard refresh (`Ctrl+Shift+R`) to force CSS to reload. |
| **Puzzle 1 images 404** | Name your images `1.jpg` … `9.jpg` and place them in `images/puzzle1/`. |
| **Puzzle 4 numbers don’t glow** | Hard refresh the page. Numbers glow teal with a black outline when the torch passes over them. |
| **The admin dashboard is empty** | Run a test game on the localhost version first to populate `localStorage`. The dashboard reads the local backup. |

---

## 🙏 Credits

- **Original escape-room game design:** Mark Burgess,
- **Digital development:** David Haigh,


