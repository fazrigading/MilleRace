# MilleRace 🏁
### *Escape the Maze AI Wove for You*

[![UNESCO Youth Hackathon 2026](https://img.shields.io/badge/UNESCO_Hackathon-2026_Submission-854EB4.svg)](https://en.unesco.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F3CD50.svg)](LICENSE)
[![Mulawarman University](https://img.shields.io/badge/Developed_At-Mulawarman_University-2E9E85.svg)](https://unmul.ac.id/)
[![Framework: AIAS & PISA](https://img.shields.io/badge/Standard-AIAS%20%7C%20PISA%20%7C%20CEFR-16141C.svg)](docs/theoretical-frameworks.md)
[![Firebase Firestore](https://img.shields.io/badge/Cloud%20Database-Firebase%20Firestore-FFCA28.svg?logo=firebase&logoColor=black)](docs/architecture-and-tech-stack.md#-cloud-firestore--persistence-layer)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel%20Edge%20CDN-000000.svg?logo=vercel&logoColor=white)](docs/deployment.md)

**MilleRace** is an immersive, gamified Media and Information Literacy (MIL) relay race web game. Built for the **UNESCO Youth Hackathon 2026** under the theme *"Play Your Part: Youth Designing the Future of Media Information and Literacy"*, MilleRace challenges players to race against a 3-minute countdown across 4 interactive puzzle stages to outread generative machine algorithms, collect keys, escape the digital maze, and match with an inspiring literary character archetype.

---

## 📖 Background & Problem Statement

### 1. The Indonesian Literacy Paradox
According to Badan Pusat Statistik (BPS, 2024), only 14 of 34 provinces in Indonesia maintain accessible public libraries with digital catalogue data. With an average borrowing rate of only 2 literacy items per person annually and historically low rankings on triennial PISA reading tests, physical access and format fatigue remain significant bottlenecks.

However, seasonal public book exhibitions such as *Semesta Buku* and *Big Bad Wolf* regularly draw millions of attendees and distribute over 5 million newly published books. The latent passion for literature and storytelling is immense—readers simply need modern, interactive, and non-punitive digital entry points.

### 2. Generative AI & Digital Misinformation
The explosion of generative image models and Large Language Models (LLMs) has blurred the line between genuine human creativity and algorithmic output. From synthesized artwork to fabricated news and hallucinated citations, modern readers must cultivate sharp critical evaluation skills.

MilleRace gamifies media discernment, teaching users how to detect AI-generated artifacts, verify sources, and evaluate complex textual inferences under timed pressure.

---

## 📚 Documentation Index

The technical details, pedagogical frameworks, and design specifications are documented in dedicated guides:

| Document | Description |
|---|---|
| 📐 [**Theoretical Frameworks**](docs/theoretical-frameworks.md) | Deep dive into the 5 AIAS Parameters, PISA Reading Scale Levels 1–6, and Cambridge CEFR A1–C1 mapping. |
| 🗺️ [**The 4-Stage Relay Journey**](docs/gameplay-and-stages.md) | Comprehensive stage breakdown, settings, puzzle mechanics, and key rewards for Stages 1 to 4. |
| 🎯 [**Point System & Scoring Matrix**](docs/scoring-system.md) | 100-point scoring breakdown, Stage 3 Graduated Rating Matrix, and Stage 4 Weighted Inferencing rubrics. |
| 🎭 [**Character Archetypes & Matching**](docs/character-archetypes.md) | Character profiles for Miller, Jen, Aidan, and Lizzy, matching matrices, and personalized reading roadmaps. |
| ✨ [**Key Features & UI System**](docs/features.md) | Comprehensive breakdown of game features, preview slideshow, leaderboard, and result screen systems. |
| 🎨 [**Design System & UI Guidelines**](docs/design-system.md) | Design tokens, color palette, font hierarchy, UI container frames, and key asset file locations. |
| 💻 [**Architecture & Tech Stack**](docs/architecture-and-tech-stack.md) | Zero-framework Vanilla JS architecture, reactive state store, Firebase Firestore cloud persistence, and file structure. |
| 📅 [**3-Year Strategic Roadmap**](docs/roadmap.md) | Detailed 2026–2028 institutional scaling milestones, school roadshows, and internationalization plans. |
| 📋 [**Product Requirement Document (PRD)**](docs/prd.md) | Baseline product requirement document and UNESCO Youth Hackathon alignment dossier. |
| 🛠️ [**Developer Guide**](docs/developer-guide.md) | Local setup, Developer Debug Panel, and troubleshooting workflows. |
| 🧪 [**Automated Testing & Verification**](docs/testing.md) | Playwright test suite wired to Google Chrome, coverage matrix, and diagnostic verification script. |
| 🚀 [**Production Deployment Plan**](docs/deployment.md) | Vercel Edge CDN setup, cache policies, HTTP security headers, and GitHub Actions CI/CD automation. |

---

## ✨ Key Features

- ⏱️ **Shared 3-Minute Relay Timer:** Fast-paced countdown engine keeping racers engaged across all 4 stages with pauses during narrative dialogues.
- 🎨 **Visual AIAS Discrimination (Stage 1):** Spot subtle prompt artifacts, spatial anomalies, and synthetic symmetry to eliminate AI-generated decoy artwork.
- 📚 **Literary Title Reconstruction (Stage 2):** Fill missing words from world classics and modern literature to unlock door passwords.
- 🔍 **Textual Authenticity Classification (Stage 3):** Grade text excerpts on a 4-point graduated human-to-synthetic scale.
- 🧠 **High-Order PISA Inferential Reading (Stage 4):** Multi-layered reading comprehension questions with weighted scoring.
- 🏆 **Global Leaderboard & "Your Results" History:** Real-time Firebase Firestore global leaderboard with age filtering and persistent local history with full stage score breakdowns.
- 📜 **Comprehensive Character Profile & Result Breakdown:** Detailed performance analysis, CEFR/PISA rating badges, and stage milestone chips.
- 🎁 **Tailored Post-Game Recommendations:** Direct access to digitized public libraries, open archives, and critical thinking toolkits.

Check [docs/features.md](docs/features.md) for more information.

---

## 🎮 The 4-Stage Relay Journey

```mermaid
flowchart LR
    A[🏁 Registration & Maze Entry] --> B[Stage 1: Miller<br/>Visual AIAS Gallery<br/>20 Pts]
    B -->|Key #1| C[Stage 2: Jen<br/>Door Passwords<br/>40 Pts]
    C -->|Key #2| D[Stage 3: Aidan<br/>Room of Letters<br/>20 Pts]
    D -->|Key #3| E[Stage 4: Lizzy<br/>Room of Colors<br/>20 Pts]
    E -->|Final Key| F[🎉 Escape & Character Match<br/>Max 100 Pts]
    F --> G[🏆 Global Leaderboard & Your Results]
```

1. **Stage 1 — Miller's Gallery (Visual AIAS):** Spot subtle prompt artifacts and anatomical anomalies to eliminate AI decoy paintings (4 questions $\times$ 5 pts = 20 pts).
2. **Stage 2 — Jen's Door Passwords (Literary Knowledge):** Complete 10 famous classic and modern book titles to unlock maze doors (10 questions $\times$ 4 pts = 40 pts).
3. **Stage 3 — Aidan's Room of Letters (Textual AIAS):** Classify text excerpts on a 4-point graduated human-to-synthetic authenticity scale (5 passages, capped at 20 pts).
4. **Stage 4 — Lizzy's Room of Colors (PISA Reading Scale):** High-order inferential reading comprehension with weighted scoring (4 questions $\times$ 5 pts = 20 pts).

Check [docs/gameplay-and-stages.md](docs/gameplay-and-stages.md) for more information.

---

## 🎭 Character Archetypes

| Character | Score Band | PISA Level | CEFR Level | Persona Profile |
|---|---|---|---|---|
| **Miller** | **1 – 25 pts** | Level 1–2 | A1–A2 | *Curious Explorer:* Loves adventures and clues; benefits from comics, bedtime stories, and fun facts. |
| **Jen** | **26 – 50 pts** | Level 3–4 | B1 | *Energetic Fact-Checker:* Exploring the world with imagination; builds habits through diaries and fact-checking. |
| **Aidan** | **51 – 75 pts** | Level 5 | B2 | *Critical Inquirer:* Books are his window to the world; inspects citations, timelines, and primary sources. |
| **Lizzy** | **76 – 100 pts** | Level 6 | C1 | *Literary Wiz:* Deep analytical thinker; reads complex charts, creates literature-inspired art, and combats misinformation. |

Check [docs/character-archetypes.md](docs/character-archetypes.md) for more information.

---

## 👥 Project Team

Developed with pride by students of **Mulawarman University**, Samarinda, East Kalimantan, Indonesia:

1. **Syahna Maryam** — *Project Manager 1, Lead UX Writer & Character Designer* (Senior-year, English Literature)
   - Orchestrates overall project scope, character backstories, and stage scripts. Researched the pedagogical alignment with CEFR and PISA standards to build Miller, Jen, Aidan, and Lizzy.
2. **Chairil Aminullah** — *Project Manager 2, Creative Director & UI/UX Designer* (Junior-year, English Literature)
   - Spearheads brand aesthetics, Figma interactive UI/UX architecture, visual style guidelines, and the regional outreach campaign across East Kalimantan schools.
3. **Syema Chaelint Joshepine Karundaeng** — *Lead Illustrator & Visual Artist* (Junior-year, International Relations)
   - Hand-illustrated the iconic character designs, stage backgrounds, and original sketch assets used in Stage 1 to challenge AI-generated decoys.
4. **Fazri Rahmad Nor Gading** — *Lead Software Engineer & Full-Stack Developer* (Postgraduate, Computer Science)
   - Architected and built the entire web game application end-to-end (SPA framework, all 4 game stages, UI/UX implementation, cloud & local leaderboard synchronization, timer engine, and deployment pipeline).
5. **Muhammad Farrel Sirah** — *Game Logic & Project Planner* (Penultimate, Computer Science)
   - Formulated foundational game logic, scoring distribution rules, and coding project planning.
6. **Muhammad Fahrezy Al Faris** — *Lead Researcher & Pitch Presenter* (Senior-year, International Relations)
   - Authored academic syntheses connecting MilleRace to the UNESCO MIL 2024 Framework and global literacy metrics, leading strategic competition pitches and research reports.

---

## 📅 3-Year Strategic Roadmap

- **Year 1 (2026) — Foundation & Pilot Validation:** Alpha/Beta testing with 30–50 regional users in Samarinda; school tours; user testimonies; public library partnerships.
- **Year 2 (2027) — Regional Scaling across East Kalimantan:** Partnerships with 5+ schools and 5+ public libraries; 1,000+ active racers; curriculum integration.
- **Year 3 (2028) — National & Global Outreach:** Multi-language support; partnership with UNESCO City of Literature networks; scaling to 5,000+ youth readers globally.

Check [docs/roadmap.md](docs/roadmap.md) for more information.

---

## 🚀 Quick Start

### 1. Live Web Demo
Play directly in your browser: **[https://millerace.vercel.app](https://millerace.vercel.app)**

### 2. Direct Browser Launch
Simply open `index.html` in your favorite web browser (Chrome, Edge, Firefox, Safari):
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 3. Local HTTP Server (Node.js)
Start the built-in zero-dependency static server on `http://localhost:8080`:
```bash
npm start
```

### 4. Local HTTP Server (Python)
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### 5. Developer Mode Shortcuts
Open the built-in developer debug panel at any time by pressing `Ctrl + Shift + D`, `Alt + D`, or `~` key (Tilde).
This allows you to jump to any stage, pause the countdown timer, skip narrative dialogues, or simulate archetype scores.

### 6. Automated Testing
Run the automated Playwright test suite wired to Google Chrome: `npm test`.
Check [docs/testing.md](docs/testing.md) for full testing workflows and diagnostics.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built for educational, research, and non-profit public impact for the **UNESCO Youth Hackathon 2026**.
