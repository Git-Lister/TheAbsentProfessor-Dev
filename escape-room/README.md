# The Case of the Absent Professor – Digital Escape Room

This project is a web-based version of the in-person escape room game created by Mark Burgess (MMU Library). It allows student groups to solve four puzzles, collect a 4-digit code, and “unlock” a digital lockbox, with real-time reporting to a Google Sheet for the facilitator.

## Setup Instructions

1. **Configure the puzzles and answers**  
   Edit `data/config.json` to set the expected digit for each puzzle, the lockbox code, and the clues/hints. The `googleScriptUrl` will be updated after step 3.

2. **Set up Google Sheets reporting**  
   - Create a new Google Sheet.  
   - Go to **Extensions → Apps Script**.  
   - Paste the contents of `backend/apps-script.js` into the editor.  
   - Deploy the script as a **web app** (Execute as: “Me”, Who has access: “Anyone”).  
   - Copy the deployment URL and paste it into `config.json` as `googleScriptUrl`.  
   - (Optional) Add a second sheet for logging wrong attempts; modify the script accordingly.

3. **Deploy to GitHub Pages**  
   - Push all files to a GitHub repository.  
   - Enable Pages in the repository settings, selecting the root folder.  
   - The site will be available at `https://yourusername.github.io/repo-name`.

4. **Test**  
   - Open the site, enter a team name, and solve puzzles.  
   - Verify that the lockbox appears after all four digits are collected.  
   - Check the Google Sheet to see recorded unlocks.

## Customization

- **Puzzle content**: Replace the placeholder puzzle implementations in `js/puzzles.js` with actual interactive HTML/JS for each puzzle. The current version uses a simple `prompt()` for testing.  
- **Styling**: Modify `css/style.css` to match your branding.  
- **Hints**: Adjust the `hintTimer` and `hintText` in `config.json` for each puzzle (future implementation).

## Files and Structure

- `index.html` – Main page  
- `css/style.css` – Styling  
- `js/` – All JavaScript modules  
- `data/config.json` – Game configuration (answers, hints, Google Script URL)  
- `backend/` – Google Apps Script reference  

Enjoy the game!
