# MilleRace UI & Stage Alignment TODO

This document tracks upcoming UI/UX refinements, container asset integrations, and design system alignments based on Figma reference designs.

---

## 📋 Task Checklist (15/08/2026)

- [x] **1. Question Text Container Assets for Stage 3 & Stage 4**
  - **Stage 3 (Aidan's Room of Letters - Textual AIAS)**:
    - Replace the generic text container with [`assets/images/ui/questions/level-3/Paper.svg`](file:///e:/Downloads/MilleRace/assets/images/ui/questions/level-3/Paper.svg) as the background paper frame for the passage text.
    - Ensure dynamic text scaling, proper padding/margins, and typography alignment within the paper container.
  - **Stage 4 (Lizzy's Room of Colors - PISA Reading Scale)**:
    - Replace the current passage box with [`assets/images/ui/questions/level-4/Paper.svg`](file:///e:/Downloads/MilleRace/assets/images/ui/questions/level-4/Paper.svg) as the background parchment container for the comprehension questions.
    - Preserve responsiveness and text legibility across desktop and mobile viewports.

- [x] **2. Background Fallback for Stage 3 & Stage 4**
  - Due to lack of dedicated background environment artwork for Stages 3 & 4:
    - Remove placeholder/reused background images (`Level 1.png` / `Level 2.png`) from Stage 3 and Stage 4.
    - Apply default background color directly from the brand guidelines: **Ink Night (`#16141C`)**.
    - Retain ambient glow effects or subtle radial gradients consistent with the design tokens.

- [x] **3. Button Styling Alignment for Stage 3 & Stage 4**
  - **Stage 3 (Question Type 3)**:
    - Refactor rating buttons (`[Human]`, `[Somewhat Human]`, `[Barely Human]`, `[Not Human]`) to match the visual styling in [`docs/design-references/ui-references/Question Type 3.png`](file:///e:/Downloads/MilleRace/docs/design-references/ui-references/Question Type 3.png).
    - Align button dimensions, borders, hover/focus states, and selected state animations.
  - **Stage 4 (Question Type 4)**:
    - Refactor multiple-choice option buttons (`A`, `B`, `C`) to follow the UI reference layout in [`docs/design-references/ui-references/Question Type 4.png`](file:///e:/Downloads/MilleRace/docs/design-references/ui-references/Question Type 4.png).
    - Align option card typography, letter badges, borders, spacing, and selection highlighting.

- [x] **4. Final Result Page UI Alignment**
  - Align the scorecard layout, score display, and character profile cards to match [`docs/design-references/ui-references/Final-Result.png`](file:///e:/Downloads/MilleRace/docs/design-references/ui-references/Final-Result.png).
  - Use result UI vector components from [`assets/images/ui/result/`](file:///e:/Downloads/MilleRace/assets/images/ui/result/):
    - Score badge & glow dots (`YELLOW GOWING TITIK.svg`, `Group 20.svg`, `Rectangle 80.svg`)
    - Character showcase card and action buttons (`Start Button.svg`, `Vector.svg`)
  - Ensure interactive sections (book links, resources, home activities, and leaderboard CTA) match the reference layout hierarchy.

---

## 🎨 Design System References

* **Primary Palette**:
  * Ink Night (Background): `#16141C`
  * Arcane Purple: `#6B21A8`
  * Mystic Teal: `#2E9E85`
  * Gilded Gold: `#F3CD50`
  * Parchment: `#FAF8F4`
* **Typography**:
  * Display: `'Cinzel', serif`
  * Body & Narrative: `'Bona Nova', serif`
  * UI & Metrics: `'Cutive Mono', monospace`

---

## 📁 Key File Locations

* **UI References**: [`docs/design-references/ui-references/`](file:///e:/Downloads/MilleRace/docs/design-references/ui-references/)
* **Brand Guidelines**: [`docs/design-references/brand-guidelines/`](file:///e:/Downloads/MilleRace/docs/design-references/brand-guidelines/)
* **Figma CSS Exports**: [`docs/design-references/figma-css/`](file:///e:/Downloads/MilleRace/docs/design-references/figma-css/)
* **Question UI Assets**: [`assets/images/ui/questions/`](file:///e:/Downloads/MilleRace/assets/images/ui/questions/)
* **Result UI Assets**: [`assets/images/ui/result/`](file:///e:/Downloads/MilleRace/assets/images/ui/result/)
* **Stylesheets**: [`css/game-stages.css`](file:///e:/Downloads/MilleRace/css/game-stages.css), [`css/result.css`](file:///e:/Downloads/MilleRace/css/result.css)
