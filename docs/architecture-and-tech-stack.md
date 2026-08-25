# Architecture & Tech Stack 💻

> High-level architecture, module breakdown, state management, offline-first persistence, and codebase layout for **MilleRace**.

---

## 🛠️ Technology Stack

MilleRace is intentionally engineered with **zero heavy frontend frameworks**, ensuring lightning-fast load times, zero bundle bloat, and universal compatibility.

```mermaid
graph TB
    subgraph Client Layer
        HTML["HTML5 Semantic Structure"]
        CSS["Vanilla CSS3 + Design Tokens"]
        JS["Vanilla ES6+ JavaScript Modules"]
    end

    subgraph State & Engine
        State["Custom Reactive State Store (state.js)"]
        Engine["Game Engine (gameEngine.js)"]
        Timer["Timer Engine (timer.js)"]
        UI["UI Manager & Renderer (ui.js)"]
    end

    subgraph Persistence Layer
        Firestore["Google Firebase Firestore (Cloud)"]
        LocalStorage["Web Storage API (localStorage)"]
    end

    subgraph Infrastructure
        Vercel["Vercel Edge CDN Hosting"]
        GitHubActions["GitHub Actions CI/CD"]
        Playwright["Playwright Core (Google Chrome)"]
    end

    Client Layer --> State & Engine
    State & Engine --> Persistence Layer
    Client Layer --> Infrastructure
```

### Core Technologies

| Layer | Technology | Details & Rationale |
|---|---|---|
| **Markup** | HTML5 Semantic | Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dialog>`) optimized for screen readers and SEO. |
| **Styling** | Vanilla CSS3 | Custom design system using CSS Variables (`design-tokens.css`), Flexbox/Grid, Glassmorphism backdrop filters, and keyframe micro-animations. |
| **Logic** | Vanilla JS (ES6 Modules) | Native JavaScript module imports (`type="module"`) without build-step compilation overhead. |
| **Typography** | Google Fonts | `Cinzel` (display serif), `Bona Nova` (body/serif result text), `Cutive Mono` (metrics/HUD). |
| **Database** | Firebase Firestore | Real-time global leaderboard score synchronization with strict schema validation rules. |
| **Local Cache** | Browser `localStorage` | Offline-first test run history persistence and cached leaderboard data. |
| **Testing** | `playwright-core` | System-installed Google Chrome testing (`channel: 'chrome'`) without heavy browser binary downloads. |
| **Hosting** | Vercel Edge CDN | Static Edge CDN deployment configured with custom HTTP security headers and long-term asset caching. |

---

## 📁 Repository Directory Structure

```
MilleRace/
├── index.html                    # Single Page Application entry point
├── package.json                  # Dependencies and test/verification scripts
├── playwright.config.js          # Playwright test config wired to Google Chrome
├── firestore.rules               # Production Firebase Firestore security rules
├── firestore.indexes.json        # Firestore composite query index definitions
├── vercel.json                   # Vercel Edge CDN configuration & security headers
├── README.md                     # Executive master documentation hub
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions CI/CD automated deployment workflow
├── assets/                       # Unified asset library
│   ├── fonts/                    # Local TTF fonts (bona-nova, cinzel, cutive-mono)
│   └── images/
│       ├── backgrounds/          # Stage backgrounds (Level 1 - Level 4)
│       ├── characters/
│       │   ├── stills/           # Transparent character portraits (Miller, Jen, Aidan, Lizzy)
│       │   └── animations/       # Walk, jump, talk sprite sequences
│       ├── questions/
│       │   └── stage-1/          # Stage 1 artwork questions (1A.jpg to 4C.jpg)
│       ├── ui/                   # Vector containers, paper frames, score badges
│       └── icons/                # Brand logos and interface icons
├── css/
│   ├── design-tokens.css         # Color palette, typography tokens, and CSS variables
│   ├── main.css                  # Global layout, HUD bar, modal overlay, and buttons
│   ├── landing.css               # Landing hero, how-to-play cards, character intros
│   ├── pages.css                 # About Us, Our Team, Our Mission, Leaderboard & History styles
│   ├── game-stages.css           # Puzzle layouts for Stages 1 to 4
│   ├── result.css                # Final results card, serif styling, and recommendation toolkit
│   └── dev-mode.css              # Developer panel styling
├── js/
│   ├── config.js                 # Stage question matrices, dialogue, scoring matrix, and character profiles
│   ├── firebaseConfig.js         # Firebase configuration template & detection
│   ├── leaderboardService.js     # Hybrid Cloud Firestore + localStorage leaderboard & history service
│   ├── state.js                  # Player profile, stage scores (20/40/20/20), and key tracking
│   ├── timer.js                  # 3-minute global countdown timer component
│   ├── ui.js                     # Screen switcher, dialogue typewriter, leaderboard & history renderer
│   ├── gameEngine.js             # Stage transition engine, puzzle validation, and result renderer
│   ├── devMode.js                # Developer quick-stage navigation and state inspector
│   └── app.js                    # Event listeners, modal controllers, and app bootstrap
├── scripts/
│   ├── server.js                 # Zero-dependency local static HTTP server (port 8080)
│   └── verify.js                 # Standalone playwright-core Google Chrome test runner
├── tests/
│   └── mille-race.spec.js        # Playwright test suite for UI flows and Point System
└── docs/                         # Project Documentation & Reference Vault
    ├── prd.md                    # Product Requirement Document
    ├── theoretical-frameworks.md # AIAS & PISA frameworks
    ├── gameplay-and-stages.md    # 4-stage relay journey details
    ├── scoring-system.md         # Point system & graduated scoring matrix
    ├── character-archetypes.md   # Character profiles & reading pathways
    ├── character-profiles.md     # Source character dialogue, quotes & reading lists
    ├── features.md               # User interface & gameplay features
    ├── design-system.md          # Design tokens, typography & asset locations
    ├── architecture-and-tech-stack.md # High-level architecture & stack
    ├── roadmap.md                # 3-Year Strategic Roadmap (2026–2028)
    ├── developer-guide.md        # Debug controls & local setup guide
    ├── testing.md                # Automated testing & Playwright verification
    └── deployment.md             # Production Vercel & Firebase deployment plan
```

---

## 💾 State Management & Data Flow

MilleRace maintains state via a centralized reactive state store (`js/state.js`):

1. **Player Registration:** Captures username and demographic age bracket (`all`, `6-12`, `13-17`, `18+`).
2. **Stage Progression:** Tracks current stage ($0 \dots 4$), locked/unlocked keys, and individual stage scores ($20 / 40 / 20 / 20$).
3. **Dialogue & Animation State:** Tracks active dialogue typewriter sequences and sprite states.
4. **Result Generation:** Once Stage 4 is completed, triggers `gameEngine.js` to compute total score, match character archetype, persist result to Firestore & `localStorage`, and render the final result screen.

---

## 🔥 Cloud Firestore & Persistence Layer

* **Hybrid Architecture:** All scores are immediately written to local `localStorage` history (`mille_user_history`) and asynchronously synchronized with **Firebase Firestore** collection `leaderboard`.
* **Security Rules (`firestore.rules`):**
  - Username validation ($\le 25$ chars).
  - Score bounds ($0 \le \text{score} \le 100$).
  - Age bracket validation against permitted enum set.
  - Read public; updates/deletes strictly disallowed.
* **Composite Query Indexes (`firestore.indexes.json`):**
  - Optimized queries on `score` (DESC) + `timestamp` (ASC) for global leaderboard tie-breaking.

---

[⬅️ Design System & Style Guidelines](design-system.md) | [Next: 3-Year Strategic Roadmap ➔](roadmap.md)
