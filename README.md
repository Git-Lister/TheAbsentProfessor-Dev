# 🧩 The Case of the Absent Professor – Digital Escape Room

*A digitised escape-room and library induction tool for students.*

This web-based escape room introduces new students to library services through five interactive puzzles. As teams solve each puzzle, they reveal numbers that fill a lockbox grid. The first team to enter the final 5-digit code wins!

Built by **Mark Burgess** and **David Haigh** (MMU Library).

---

## 👩‍🏫 Quick Start for Facilitators

### 1. Play the Game
Send your students to the live URL:
> **[https://git-lister.github.io/TheAbsentProfessor-Dev/](https://git-lister.github.io/TheAbsentProfessor-Dev/)**

### 2. Set up the Session Code
At the start of the session, decide on a unique Session ID (e.g., `MMU-2026`) and tell students to enter this when they enter their team name.

### 3. View Live Results (Admin Dashboard)
To see which teams have won, go to:
> **[https://git-lister.github.io/TheAbsentProfessor-Dev/staff/admin.html](https://git-lister.github.io/TheAbsentProfessor-Dev/staff/admin.html)**

- **Login:** Use the unique facilitator login details provided directly by David or Mark. Please request these directly—do not attempt to access the Supabase dashboard.
- **Features:** View the winners list, filter results by Session ID, download a CSV, and delete results if necessary.

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
| 📈 **Live Reporting** | Reports wins to a secure cloud database, accessible by any facilitator. |
| 🏆 **Winner determination** | First to unlock the safe wins (logged by submission timestamp). |
| ♿ **High‑contrast mode** | Toggle with the ♿ button – persists in localStorage. |
| 📱 **Mobile responsive** | Adapts to small screens and uses large touch targets. |
| 📊 **Admin Dashboard** | View winners, filter by session, and manage results. (Staff only). |

---

## 🏆 How the winner is decided

The **first team to unlock the lockbox** wins. It is determined by the order of the submission timestamp saved to the dashboard, not by total time spent.
Each unlock records:
- Team name
- Full 5-puzzle concatenated code
- Individual puzzle answers (for debugging)
- Time taken (e.g., `2m 34s`)
- Exact timestamp of submission
- A unique `Session ID`

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

**The final target code is `78227`.**

### 2. Deploy the game to GitHub Pages
1. Push all files to your GitHub repository.
2. Go to **Settings → Pages**.
3. Set branch to `main` and folder to `/ (root)`.
4. The game will be live at `https://your-username.github.io/repo-name`.

### 3. Access the Admin Dashboard
**The backend and database are fully managed by David and Mark.** You do not need to set up or access any external cloud accounts. If you have any issues accessing the dashboard, please contact them directly.

---

## 💻 How to run locally (for testing & editing)

The game must be run via a local web server. You cannot open `index.html` directly from your computer's file explorer (browsers block the `fetch()` request).
Open your terminal (command prompt) and run:

```bash
cd TheAbsentProfessor-Dev
python -m http.server 8000
Then open http://localhost:8000 in your browser.


___________________________________________________

🔧 Technical Setup (Developers Only)
This section is for the project maintainers only. Do not modify these settings unless you are fully aware of the implications.

The game uses Supabase as its live database. This requires a one-time setup by a facilitator:

Create a free project at supabase.com.

In the SQL Editor, run the provided SQL script to create the winners table and security policies (see docs/supabase_setup.sql).

In Authentication → Users, create the shared staff account (email + password).

CRITICAL: Update js/reporting.js with your specific SUPABASE_URL and SUPABASE_ANON_KEY.

📁 Project structure
text
TheAbsentProfessor-Dev/
├── index.html              # Main game interface
├── staff/
│   ├── admin.html          # Live results dashboard (password protected)
│   └── supabase.js         # Local copy of the Supabase JS library
├── css/
│   └── style.css           # All styles (standard + high‑contrast)
├── js/
│   ├── config.js           # Loads config.json
│   ├── storage.js          # localStorage save/load helpers
│   ├── reporting.js        # Handles data to Supabase & Local Backup
│   ├── puzzles.js          # All 5 puzzle implementations
│   ├── lockbox.js          # Grid, dials, and safe unlock logic
│   └── app.js              # Main controller (entry, story, reset)
├── data/
│   └── config.json         # Answers, clues, hints, and endpoint URL
├── images/                 # All game assets
└── README.md
🙏 Credits
Original game design: Mark Burgess, Academic Liaison Librarian, MMU

Digital development: David Haigh, Library Services and Discovery Adviser, MMU

Open source – Feel free to fork and adapt.

Enjoy the hunt for the absent professor’s grades! 🎓🔓