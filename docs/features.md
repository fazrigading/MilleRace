# Key Features & User Interface 🌟

> Detailed overview of user interface systems, gameplay components, responsive design features, and interactive tooling across **MilleRace**.

---

## 🎮 Core Game Features

### 1. Shared 3-Minute Relay Timer
* A persistent countdown clock located in the upper HUD bar.
* Tracks time across all 4 maze stages.
* **Intelligent Pausing:** Automatically pauses during dialogue sequences with characters, ensuring racers can enjoy narrative lore without pressure.
* Visual urgency cues when timer approaches critical thresholds.

### 2. Multi-Stage Literacy Challenges
* **Visual AIAS Discrimination (Stage 1):** Side-by-side comparative inspection of subtle prompt artifacts, anatomical anomalies, and synthetic symmetry to eliminate AI-generated decoy artwork.
* **Literary Title Reconstruction (Stage 2):** Fast-paced title restoration with classic and modern literature titles.
* **Textual Authenticity Classification (Stage 3):** 4-tier graduated scale (`Human`, `Somewhat Human`, `Barely Human`, `Not Human`) scoring passage authenticity.
* **High-Order PISA Inferencing (Stage 4):** Weighted multi-choice inferential comprehension reading questions.

### 3. Key Inventory & Progress HUD
* Visual tracking of Keys #1, #2, #3, and #4 embedded directly into the top navigation HUD.
* Unlocking animations upon completing each stage.

---

## 🖼️ Interactive Game Preview Slideshow

Located directly on the Home Landing screen:
* **5 Interactive Slides:**
  1. *Stage 1 — Miller's Visual AIAS Gallery*
  2. *Stage 2 — Jen's Door Passwords*
  3. *Stage 3 — Aidan's Room of Letters*
  4. *Stage 4 — Lizzy's Room of Colors*
  5. *Final Result — Character Profile & Breakdown*
* **Controls & Interactions:**
  - Auto-play carousel with smooth slide transitions.
  - Hover-pause functionality so users can inspect details.
  - Interactive bullet indicators and left/right navigation arrows.
  - **Click-to-Enlarge Lightbox Preview:** Modal popup allowing users to inspect stage screenshots in high resolution.

---

## 🏆 Global Leaderboard & "Your Results" History

Located under the **Leaderboard** navigation view:

### 1. Global Cloud Leaderboard
* Real-time synchronization powered by **Google Firebase Firestore**.
* Demographic age filters: **All Ages**, **6–12 Years**, **13–17 Years**, **18+ Years**.
* Live search input to locate specific player usernames.
* **Dynamic Podium:** Visual Top-3 podium cards that automatically collapse into a streamlined view during active search queries.

### 2. "Your Results" Local History
* Offline-first personal history stored in browser `localStorage`.
* Tracks every test run completed on the current device with full stage score breakdowns (20 / 40 / 20 / 20).
* **"View Final Result ➔" Action:** Opens the full, rich historical result screen for any past race with one click.

---

## 📜 Redesigned Serif Final Result Screen

A premium, certificate-inspired performance card styled in rich dark theme radial gradients and serif typography (`Cinzel`, `Bona Nova`):

* **Dynamic Celebratory Rank Banner:** Real-time calculation (`"Congratulations for finishing the maze! You placed in #{rank} 🎉"`).
* **Prominent Character Avatar:** Scaled character illustration standing over 50% taller than the parchment card with a bottom-anchored purple accent band.
* **MIL Score & Milestone Breakdown:** Animated circular score progress meter with stage milestone chips.
* **Golden Ribbon Badge:** Level pill badges indicating PISA Reading Level and Cambridge CEFR proficiency.
* **Containerless Recommendations:** Open, uncluttered layout for curated book lists, local library links, and critical thinking toolkits.
* **Post-Game Actions:** Quick restart button, share card action, and direct link to the Leaderboard.

---

## 🧭 Universal Navigation & Accessibility

* **Glassmorphic Top Navigation Bar:** Persistent header with active state pill indicators across all routes (`Home`, `About Us`, `Our Team`, `Our Mission`, `Leaderboard`).
* **Global "Back to Top" Floating Button:** Centered, accessible smooth-scroll button above footers and on all long-form pages.
* **Keyboard Accessible:** Full keyboard navigation support and focus states across buttons, modals, and stage options.

---

[⬅️ Character Archetypes](character-archetypes.md) | [Next: Design System & Style Guidelines ➔](design-system.md)
