# TheAbsentProfessor-Dev: Upgrade Plan

**Date:** May 6, 2026  
**Status:** Planning Phase  
**Reviewed against:** Specifications from Meeting Notes

---

## Executive Summary

This document maps the refined specifications (from the meeting notes) against the **current implementation status** and outlines a prioritized upgrade roadmap.

**Key Findings:**
- ✅ Core functionality is in place (puzzles, lockbox, Google Sheets reporting)
- ⚠️ Some features partially implemented (responsive design, hints, accessibility)
- ❌ Several polish/UX improvements needed (messaging, hints, simplification)

---

## 1. LOCKBOX & GRID IMPROVEMENTS

### 1.1 Code Hints – Remove Answer Reveals
| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| "Column 3 contains safe code: 8227" text removed | Riddle: "The Box is Locked..." + "Which column holds the key?" | ✅ DONE | Already replaced with riddle in lockbox.js line 45-46 |
| Replace with riddle | Riddle provided | ✅ DONE | - |

**Action:** None needed. ✅ Already implemented.

---

### 1.2 Highlight Column 3 When All Numbers Entered
| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Green border/glow on column 3 cells | Gold border + background color (#5f7a5c) when all solved | ✅ DONE | In lockbox.js lines 116–127 |
| CSS class `.col3-highlight` applied | Not named as class, but styling applied | ⚠️ PARTIAL | Inline styles used instead of CSS class |

**Action:** Optional: Move to CSS class for cleaner code (low priority).

---

### 1.3 Remove Column Labels – Add Lock Icon Above Column 3
| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Remove "Col 1", "Col 2" etc. headers | Headers use 🔒 icons (4 of them) | ✅ DONE | lockbox.js line 57 |
| Add lock icon above column 3 | Currently 🔒 appears on all 4 columns | ⚠️ PARTIAL | Need to change header to show lock only above col 3 |
| Add 🔐 above column 3 specifically | Not implemented | ❌ TODO | Could add a separate "key" indicator |

**Action:** 
- Change lockbox header to show only the lock emoji above column 3
- Keep simpler column headers (or remove them entirely)
- **File to edit:** `js/lockbox.js`, line 57

**Priority:** Medium (polish)

---

### 1.4 Lockbox Responsiveness on Small Screens
| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Dials + grid fit on small screens | Partial media queries in CSS | ⚠️ PARTIAL | Need audit + testing |
| Reduce dial button size on mobile | Not explicitly configured | ❌ TODO | Add `@media (max-width: 600px)` rules |
| Reduce font size on mobile | Partial | ⚠️ PARTIAL | - |
| Grid padding on mobile | Partial | ⚠️ PARTIAL | - |

**Action:**
- Test on actual small screens (iPhone SE, etc.)
- Add/refine media queries for dials, grid, button sizes
- **Files to edit:** `css/style.css`, `js/lockbox.js`

**Priority:** High (usability)

---

## 2. PUZZLE-SPECIFIC TWEAKS

### 2.1 Puzzle 1 (Number Grid) – Title/Header Text

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Title: "Can't see what you're looking for?..." or remove heading | "📇 The Laptop‑Locker Onlooker" | ⚠️ PARTIAL | Heading exists + riddle below |
| Shorter, riddle-like phrase | Heading + riddle line | ⚠️ PARTIAL | Both shown – could be clearer |

**Current Code (puzzles.js, line 17–18):**
```html
<h3>📇 The Laptop‑Locker Onlooker</h3>
<p>The Laptop‑Locker onlooker must not check out, if they are to return the correct answer.</p>
```

**Action:**
- Option A: Keep both (current)
- Option B: Remove `<h3>` and keep only riddle line
- Decision: Per spec, change to simpler instruction; remove title
- **New instruction:** "Can't see what you're looking for? It's the same every time."

**File to edit:** `js/puzzles.js` (renderPuzzle1, lines 14–20)

**Priority:** Medium (clarity)

---

### 2.2 Puzzle 2 (Library Layers) – Instruction & Hint Separation

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Main: "Click highlighted words in correct order" | Unclear – need to check puzzles.js | ❌ TODO | Need code review |
| Hint (after 60s): "Are you floored?..." | Separate hintText in config.json | ⚠️ PARTIAL | Hint exists but timing unclear |

**Action:**
- Review `renderPuzzle2()` in `js/puzzles.js`
- Replace main instruction with neutral text
- Move "Are you floored?" to hint system
- Ensure hint appears after 60s OR 2 wrong clicks

**Files to edit:** `js/puzzles.js`, `data/config.json`

**Priority:** High (UX clarity)

---

### 2.3 Puzzle 2 – Simplify UI (Remove Building Visual)

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Show 4 answer slots as single row (1,4,2,3) | Building visual metaphor (need to verify) | ❌ TODO | Need code review |
| Remove building metaphor | Current structure unclear | ❌ TODO | - |

**Action:**
- Review `renderPuzzle2()` in `js/puzzles.js`
- Simplify to: 4-slot flex row, click poem words in order, slots fill automatically
- Remove building image/graphics if present
- **Example layout:** `[ _ ][ _ ][ _ ][ _ ]` with numbers filling in order (1,4,2,3)

**File to edit:** `js/puzzles.js` (renderPuzzle2, entire function)

**Priority:** High (UX simplification)

---

### 2.4 Puzzle 4 (Library Entrance) – Mobile Portrait Support

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Crop/prompt landscape mode | MMU image + torch canvas (need to check size) | ❌ TODO | Need code review |
| Add message: "Rotate to landscape" | Not implemented | ❌ TODO | - |
| Canvas CSS: `object-fit: cover` | Canvas is fixed 600x400 (need audit) | ⚠️ PARTIAL | May need CSS adjustment |
| Make hidden numbers larger | Already 28px | ✅ OK | Check if still readable on mobile |

**Action:**
- Review `renderPuzzle4()` in `js/puzzles.js`
- Test on portrait mode
- Add CSS `@media (orientation: portrait)` with warning message
- Consider reducing canvas size or adding landscape prompt
- **File to edit:** `js/puzzles.js`, `css/style.css`

**Priority:** High (mobile support)

---

### 2.5 Puzzle 4 – Instructions Simplification

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Remove "Move the torch..." line | Per spec, already done | ✅ OK | Check current code |
| Show only riddle | "Here you see the Library – can you find its opening times?" | ✅ OK | Verify in code |

**Action:**
- Verify current instruction text in `renderPuzzle4()`
- Keep only the riddle; ensure no extra hints visible initially
- **File to verify:** `js/puzzles.js` (renderPuzzle4)

**Priority:** Low (already likely done)

---

## 3. REPORTING & WINNER DETERMINATION

### 3.1 Time Taken – Winner Metric Clarification

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Winner = first to submit (by timestamp) | Google Sheet records timestamp | ✅ OK | No code change needed |
| Not shortest duration | Logic in place | ✅ OK | Clarify in README only |

**Action:**
- Update README.md with winner determination explanation
- No code changes needed

**Priority:** Low (documentation)

---

### 3.2 Final Screen – Remove "Time Taken" Display to User

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Show "Wait and see – results announced by facilitator" | Current: Shows time (need to verify) | ❌ TODO | Review renderUnlockedState() |
| Hide time from user display | Time may be logged to sheet | ⚠️ PARTIAL | Keep in backend, hide from UI |

**Current Code (lockbox.js, lines 176–179):**
```javascript
const timeString = elapsed ? `${elapsed.minutes}m ${elapsed.seconds}s` : "a fantastic effort";
reportSuccess(team, code, timeString);
renderUnlockedState(container);
```

**Check renderUnlockedState():** Verify if time is displayed. If yes, remove from celebration text.

**Action:**
- Review `renderUnlockedState()` in `js/lockbox.js`
- Replace time display with: "Your completion has been recorded. The facilitator will announce the winning team."
- Keep time in background reporting (sent to Google Sheet)

**File to edit:** `js/lockbox.js` (renderUnlockedState, lines 165–195)

**Priority:** High (UX improvement)

---

### 3.3 "Well Done" Message After Each Puzzle Solve

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Show "✅ Correct! Well done." after solve | Not visible currently | ❌ TODO | Need to add to puzzle logic |
| Brief success message before auto-close | Modals close without feedback | ❌ TODO | Add 1s delay + success text |

**Action:**
- In each puzzle's `onSolve()` callback:
  - Add status div with "✅ Correct! Well done."
  - Delay modal close by 1 second
  - Could also use toast notification (nicer UX)
- **Files to edit:** `js/puzzles.js` (all renderPuzzle functions' onSolve callbacks)

**Priority:** High (UX feedback)

---

## 4. ACCESSIBILITY & VISUAL THEME

### 4.1 High Contrast Toggle

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Two modes: "Standard" + "High Contrast" | Single dark theme | ❌ TODO | No toggle implemented |
| Toggle button (♿) in header | Not present | ❌ TODO | - |
| High contrast: white bg, black text, distinct borders | Not implemented | ❌ TODO | Need CSS |
| Store preference in localStorage | Not applicable yet | ❌ TODO | - |

**Action:**
- Add accessibility toggle button (♿) to header
- Create `.high-contrast` CSS class with:
  - White/light background
  - Black/dark text
  - Distinct borders
  - No gradients
  - High contrast colors
- Store preference in localStorage
- Load preference on page init

**Files to edit:** `index.html`, `css/style.css`, `js/app.js` or new `js/accessibility.js`

**Priority:** Medium (accessibility)

---

### 4.2 MMU Logo – Remove Text, Logo-Only Header

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Keep logo only, remove "Manchester Metropolitan University" text | Both shown | ⚠️ PARTIAL | Logo + text currently both visible |
| Adjust CSS for centered/right-aligned logo | Not optimized | ⚠️ PARTIAL | - |

**Current Code (index.html, lines 21–24):**
```html
<div class="uni-header">
    <div class="uni-name">Manchester Metropolitan University</div>
    <img src="images/mmu-logo.png" alt="MMU Logo" class="uni-logo">
</div>
```

**Action:**
- Remove or hide `.uni-name` div
- Adjust `.uni-header` CSS for logo-only layout
- Consider positioning: center, right-aligned, or top-left

**Files to edit:** `index.html`, `css/style.css`

**Priority:** Medium (visual polish)

---

### 4.3 Immersion – Professor Portrait in Story Modal

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Add character portrait (Prof Oak style) | Story text only | ❌ TODO | No image implemented |
| Silhouette or stock photo | Not added | ❌ TODO | - |
| Use float or flex layout | Story modal is basic `<div>` | ⚠️ PARTIAL | Can add flex |

**Action:**
- Create placeholder professor portrait (SVG silhouette or emoji like 👩‍🏫)
- Add to story modal with flex layout
- Position: left side, text on right (or top/bottom on mobile)
- Use `float: left` or `flex` row layout

**Files to edit:** `index.html` (story-modal section), `css/style.css`

**Priority:** Medium (immersion – optional enhancement)

---

### 4.4 "Open Door" / "Enter Office" Transition

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| "Enter Office" button after story modal | Not implemented | ❌ TODO | Currently: story modal → game UI |
| Fade-in animation of game UI | Basic display change | ⚠️ PARTIAL | No animation |

**Current Flow (app.js, lines 27–30):**
```javascript
beginBtn.addEventListener('click', () => {
    const storyModal = document.getElementById('storyModal');
    storyModal.style.display = 'none';
    mainGameUI.style.display = 'block';
    initGame();
    setStartTime();
});
```

**Action:**
- (Low priority) Add CSS fade-in animation to mainGameUI
- Consider: "Enter Office" button is extra complexity; simpler to keep "Begin Investigation" and add fade transition

**Priority:** Low (nice-to-have polish)

---

## 5. MOBILE RESPONSIVENESS (AUDIT & FIXES)

### 5.1 MMU Logo – Mobile Size

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| `max-width: 80px; height: auto;` on default | Assumed large | ❌ TODO | Need to audit CSS |
| `max-width: 50px;` on mobile (≤600px) | Not set | ❌ TODO | - |

**Action:**
- Audit current logo CSS in `style.css` (search for `.uni-logo`)
- Add/adjust media query: `@media (max-width: 600px) { .uni-logo { max-width: 50px; } }`

**File to edit:** `css/style.css`

**Priority:** Medium (mobile support)

---

### 5.2 Puzzle 4 Canvas – Portrait Mode Warning

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Add CSS `@media (orientation: portrait)` | Not implemented | ❌ TODO | - |
| Message: "📱 Rotate to landscape" | Not shown | ❌ TODO | - |

**Action:**
- Add CSS rule for portrait orientation
- Show warning message in landscape prompt
- Hide or shrink canvas on portrait, show message instead (or both)

**File to edit:** `css/style.css`, `js/puzzles.js`

**Priority:** High (mobile support)

---

### 5.3 Lockbox Dials – Mobile Responsiveness

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Reduce dial button padding on mobile | Partial | ⚠️ PARTIAL | Need to audit |
| Reduce dial gap on mobile | Using `gap: 20px` | ⚠️ PARTIAL | May need to reduce |
| Reduce font size on mobile | Not explicit | ⚠️ PARTIAL | Add media query |

**Current Code (lockbox.js, line 79):**
```javascript
<div class="dials-container" style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 15px 0;">
```

**Action:**
- Add CSS class `.dials-container` with media queries for mobile
- Reduce gap, padding, and font size on small screens
- **File to edit:** `css/style.css` (add `.dials-container` class), `js/lockbox.js` (remove inline styles, use class)

**Priority:** High (mobile support)

---

## 6. TIMED HINTS ENHANCEMENT

| Spec | Current | Status | Notes |
|------|---------|--------|-------|
| Hint appears after 60s (timer) | Implemented | ✅ OK | In config.json `hintTimer` |
| Also appear after 2 wrong answers | Not implemented | ❌ TODO | Only timer-based currently |

**Action:**
- Track `wrongCount` in each puzzle
- When `wrongCount >= 2`, immediately show hint button
- Keep timer as fallback/additional trigger
- **Files to edit:** `js/puzzles.js` (all renderPuzzle functions)

**Priority:** Medium (hint system enhancement)

---

## 7. STORY & IMMERSION (OPTIONAL)

### 7.1 Professor Portrait (Already Covered Above – Section 4.3)

### 7.2 "Open Door" Transition (Already Covered Above – Section 4.4)

---

## IMPLEMENTATION PRIORITY MATRIX

### 🔴 HIGH PRIORITY (Must Fix for Usability)

1. **Remove "Time Taken" from Final Screen** → Show "Wait and see..."
   - File: `js/lockbox.js` (renderUnlockedState)
   - Effort: ~15 min
   - Impact: High (UX clarity for teams)

2. **Add "Well Done" Message After Each Puzzle**
   - Files: `js/puzzles.js` (all 4 puzzles)
   - Effort: ~30 min
   - Impact: High (immediate feedback)

3. **Mobile Responsive Audit & Fixes**
   - Puzzle 4 canvas on portrait
   - Lockbox dials responsiveness
   - MMU logo sizing
   - Files: `css/style.css`, `js/puzzles.js`, `js/lockbox.js`
   - Effort: ~1 hour (includes testing)
   - Impact: High (usability on target devices)

4. **Simplify Puzzle 2** (if building visual is confusing)
   - File: `js/puzzles.js` (renderPuzzle2)
   - Effort: ~45 min
   - Impact: High (UX clarity)

5. **Hint on 2 Wrong Attempts Enhancement**
   - File: `js/puzzles.js` (all puzzles)
   - Effort: ~30 min
   - Impact: Medium-High (UX improvement)

### 🟡 MEDIUM PRIORITY (Improves Experience)

6. **Puzzle 1 Title Simplification**
   - File: `js/puzzles.js` (renderPuzzle1)
   - Effort: ~10 min
   - Impact: Medium (clarity)

7. **High Contrast Accessibility Toggle**
   - Files: `index.html`, `css/style.css`, `js/app.js`
   - Effort: ~1 hour
   - Impact: Medium (accessibility)

8. **Professor Portrait in Story Modal**
   - Files: `index.html`, `css/style.css`
   - Effort: ~30 min (placeholder image)
   - Impact: Medium (immersion)

9. **MMU Logo & Header Simplification**
   - Files: `index.html`, `css/style.css`
   - Effort: ~15 min
   - Impact: Medium (visual polish)

10. **Lockbox Column 3 Indicator Enhancement**
    - File: `js/lockbox.js`
    - Effort: ~15 min
    - Impact: Medium (visual polish)

### 🟢 LOW PRIORITY (Polish & Nice-to-Have)

11. **"Enter Office" Transition Animation**
    - Files: `js/app.js`, `css/style.css`
    - Effort: ~20 min
    - Impact: Low (immersion)

12. **Move Column 3 Highlight to CSS Class**
    - File: `js/lockbox.js`, `css/style.css`
    - Effort: ~10 min
    - Impact: Low (code cleanliness)

13. **Update README.md with Winner Determination Note**
    - File: `README.md`
    - Effort: ~10 min
    - Impact: Low (documentation)

---

## RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Core UX Fixes (1–2 hours)
1. Remove "Time Taken" from final screen
2. Add "Well Done" after each puzzle
3. Mobile responsiveness audit + fixes

### Phase 2: Feature Enhancements (1–1.5 hours)
4. Simplify Puzzle 2 (if needed)
5. Hint on 2 wrong attempts
6. Puzzle 1 title change

### Phase 3: Polish & Accessibility (1 hour)
7. High contrast toggle
8. Professor portrait
9. Logo/header cleanup

### Phase 4: Optional Nice-to-Haves (30 min)
10. Enter Office transition
11. CSS class refactoring
12. README update

---

## TESTING CHECKLIST

After implementation, test the following:

- [ ] **Team Entry Screen** – Logo visible, text clear
- [ ] **Story Modal** – Professor portrait (if added), "Begin Investigation" button works
- [ ] **Puzzle Cards** – All 4 cards display correctly
- [ ] **Puzzle 1** – Title changed, grid clicks work, "Well done" appears after solve
- [ ] **Puzzle 2** – Simplified UI (if changed), 4 answer slots, hint system works
- [ ] **Puzzle 3** – Normal functionality, hint + "Well done" work
- [ ] **Puzzle 4** – Canvas visible on landscape, portrait warning shown, hint system works
- [ ] **Lockbox Grid** – Column 3 highlights when all solved, riddle instruction clear
- [ ] **Lockbox Dials** – Dials responsive on mobile (≤600px), buttons clickable
- [ ] **Final Screen** – Shows "Wait and see..." (not time taken), celebration confetti works
- [ ] **Reset Button** – Works, clears all data, returns to team entry
- [ ] **Mobile (portrait)** – All elements readable, no overflow, responsive dials/buttons
- [ ] **Mobile (landscape)** – Canvas + dials visible, no horizontal scroll
- [ ] **Accessibility Toggle** – ♿ button toggles high-contrast mode, preference persists
- [ ] **Google Sheets Reporting** – Timestamp + code recorded for each team

---

## SUMMARY

**Current Strengths:**
- ✅ Core game loop works (puzzles → lockbox → reporting)
- ✅ Google Sheets integration functional
- ✅ Most UX elements in place (modals, cards, grid)
- ✅ Styling theme consistent

**Key Gaps:**
- ⚠️ Mobile responsiveness needs audit + testing
- ❌ Puzzle 2 may need simplification
- ❌ Final screen UX messaging needs update
- ❌ Missing success feedback after puzzle solve
- ❌ Accessibility toggle not implemented
- ❌ Hint system doesn't respond to wrong attempts

**Estimated Total Effort:** ~4–5 hours (if all items tackled)  
**Priority Path (1–2 hours):** Phase 1 + 2 (UX fixes + features)

---

**Next Step:** Confirm implementation priorities with stakeholders, then proceed with code changes.
