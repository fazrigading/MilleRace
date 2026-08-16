# Automated Testing & Verification Guide 🧪

> Playwright testing configuration, diagnostic verification scripts, and verification commands for **MilleRace**.

---

## 🛠️ Testing Stack & Philosophy

MilleRace uses **`playwright-core`** and `@playwright/test` wired directly to the system-installed **Google Chrome** browser (`channel: 'chrome'`). This ensures:
- Direct, true-to-life testing against the actual browser engine used by the majority of end users.
- Zero bulky Chromium bundle downloads during setup.
- Fast, deterministic end-to-end execution.

---

## 📦 Prerequisites

Ensure you have **Node.js** (v18+) and **Google Chrome** installed on your system.

Install test dependencies:
```bash
npm install
```

---

## 🧪 Test Commands

| Command | Description |
|---|---|
| `npm test` | Runs the full Playwright test suite headlessly in Google Chrome with automatic local web server lifecycle management. |
| `npm run verify` | Runs a standalone `playwright-core` diagnostic runner (`scripts/verify.js`) that boots the local server, navigates to the app in Google Chrome, tests DOM nodes, and saves a verification screenshot. |
| `npm run test:chrome` | Explicitly targets the Google Chrome browser configuration. |
| `npm run test:ui` | Launches the interactive Playwright UI mode for visual debugging, time-travel inspection, and step-by-step tracing. |

---

## 📋 Test Coverage Matrix

The Playwright test suite (`tests/mille-race.spec.js`) validates:
1. **Landing & Home Page:** Title rendering, hero elements, navigation links, and how-to-play cards.
2. **Registration Modal:** Input validation, age group selection, and maze entry transitions.
3. **Stage 1 (Visual AIAS Gallery):** Background rendering, centered card layout, AI decoy elimination mechanics, and Key #1 acquisition.
4. **Stage 2 (Literary Passwords):** Book title reconstruction questions, fill-in-the-blank validation, and Key #2 acquisition.
5. **Stage 3 (Textual AIAS):** 4-tier graduated rating interaction (`Human`, `Somewhat Human`, `Barely Human`, `Not Human`), paper container layout, and Key #3 acquisition.
6. **Stage 4 (PISA Comprehension):** High-order inferential questions, weighted option scoring (0, 3, 5 pts), and Final Key acquisition.
7. **Upper HUD:** Centered 3-column layout, timer engine, and real-time key inventory.
8. **Point System:** Correct cumulative score calculation totaling up to 100 points.
9. **Leaderboard & Personal History:** Empty-state handling, score submission, demographic tab filtering, and personal test run history lookup.
10. **Final Result Profile:** Celebratory rank banner calculation, enlarged character hero card, MIL score breakdown, and containerless recommendations.
11. **Global "Back to Top":** Centered smooth-scroll button presence and behavior across all content screens.

---

[⬅️ Developer Guide](developer-guide.md) | [Next: Production Deployment Plan ➔](deployment.md)
