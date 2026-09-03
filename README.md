# 🧩 The Case of the Absent Professor – Digital Escape Room
*A gamified library induction tool for MMU students.*

This web-based escape room introduces new students to library services through five interactive puzzles. As teams solve each puzzle, they reveal numbers that fill a lockbox grid. The first team to enter the final 5-digit code wins!

Built by **Mark Burgess** and **David Haigh** (MMU Library). 

---

## 👩‍🏫 Quick Start for Facilitators (You are here)

You don't need to set up any external cloud accounts to use this game. The game automatically stores winning team data locally on the device you are using. Here is everything you need to run it:

### 1. Tell the game where to send the data (Optional)
If you *do* want to save winning data to a permanent external sheet (like Google Sheets or your own web server), open this page:
> **[https://git-lister.github.io/TheAbsentProfessor-Dev/admin-config.html](https://git-lister.github.io/TheAbsentProfessor-Dev/admin-config.html)**

Paste your custom Web App/Endpoint URL into the box and click **Save**. *(If you skip this step, the game still works perfectly and saves data locally).*

### 2. Get the results during/after the session
Open the **Live Admin Dashboard** at any time on your facilitator device:
> **[https://git-lister.github.io/TheAbsentProfessor-Dev/admin.html](https://git-lister.github.io/TheAbsentProfessor-Dev/admin.html)**

This dashboard reads the local save data. It shows the winning teams, their completion times, and unique session IDs. Use the **"Clear Local Logs"** button at the start of each new class to reset the dashboard for your fresh session.

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
| 📈 **Self-contained Reporting** | Records all wins directly to the browser's `localStorage`. |
| 🏆 **Winner determination** | First to unlock the safe wins (logged by submission timestamp). |
| ♿ **High‑contrast mode** | Toggle with the ♿ button – persists in localStorage. |
| 📱 **Mobile responsive** | Adapts to small screens and uses large touch targets. |
| 🛠️ **Admin URL Config** | Change an external reporting endpoint without editing code (`admin-config.html`). |
| 📊 **Admin Dashboard** | View winners, download a CSV, and clear logs for new sessions (`admin.html`). |
| ❓ **Help modal** | Thematic professor's notebook guide – click the 📓 button. |
| 🌐 **Custom favicon** | Blends perfectly with dark/light themes. |

---

## 🏆 How the winner is decided

The **first team to unlock the lockbox** wins. It is determined by the order of the submission timestamp saved to the dashboard, not by total time spent.
Each unlock records:
- Team name
- Full 5-puzzle concatenated code
- Individual puzzle answers (for debugging)
- Time taken (e.g., `2m 34s`)
- Exact timestamp of submission
- A unique `Session ID` (useful if you run multiple classes on the same device)

> **Facilitator tip:** The Admin Dashboard automatically sorts winners by submission order, so you can see who won instantly.

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

### 2. Deploy the game to GitHub Pages
1. Push all files to your GitHub repository.
2. Go to **Settings → Pages**.
3. Set branch to `main` and folder to `/ (root)`.
4. The game will be live at `https://your-username.github.io/repo-name`.

### 3. Admin Dashboard & External Backups
The game works entirely offline. When teams complete the game, their data is saved to the browser's `localStorage` on whatever device you are using to run the game.

- **To view the winners locally:** Append `/admin.html` to your game URL (`https://[your-username].github.io/[repo-name]/admin.html`). 
- **To set an external cloud backup (Optional):** Append `/admin-config.html` to your game URL (`https://[your-username].github.io/[repo-name]/admin-config.html`). Paste your Google Apps Script URL or self-hosted server endpoint here.

---

## 💻 How to run locally (for testing & editing)

The game must be run via a local web server. You cannot open `index.html` directly from your computer's file explorer (browsers block the `fetch()` request).
Open your terminal (command prompt) and run:

```bash
cd TheAbsentProfessor-Dev
python -m http.server 8000