# MilleRace Project TODO 📋

> This document tracks upcoming tasks, feature requests, bug fixes, and development notes for **MilleRace**.

---

## 📌 In Progress

### Easy
- none

### Medium
- none

### Hard
- [ ] Fix Quiz Stage 3 - The question text is not located at the center of the white question card, adjust the size of the card and make sure it can fit all of the question text. If possible, make the question card slightly skewed/leaning, following the card look.
- [ ] Fix Global Leaderboard Firestore connection in Vercel. Localhost works fine, but Vercel does not.
- [ ] Add a way to reset leaderboard at `Global Leaderboard` page (password protected by the devMode popup). This needs to be stored in Firestore and need to be manually triggered by dev, we cant let the user to reset it.
- [ ] Lock the devMode with password: `mil2026`
- [ ] Make devmode popup draggable

---

## 📝 Backlog / Future Enhancements

- [ ] Change "Contact Us" mail link to real contact email (not available for now, we havent prepared the email account). 
- [ ] **Performance & Asset Optimization ([Plan](docs/web-optimization-plan.md)):**
  - [ ] Compress raster images to WebP format, optimize SVGs via SVGO, and prune unused assets.
  - [ ] CSS / JS Minification & Bundling (pipeline with PostCSS/LightningCSS and esbuild/Vite).
  - [ ] Setup production HTTP caching headers and immutable asset delivery on Edge CDN.
  - [ ] Build-time component modularization (split `index.html` into `src/pages/` and `src/components/` partials).

---

## ✅ Completed Tasks

- [x] Initial project setup & documentation modularization
- [x] Change the "Join the Race" button to be "Contact Us" inside "Collaborate with UNMUL Team" container at `Our Team` page. The button should link to `mailto:[EMAIL_ADDRESS]` and open in new tab.
- [x] Plan new design of AIAS section and The 4-Stage Relay Journey section in `About Us` page.
- [x] Increase `landing-hero-section` height to 100% of screen height. Adjust the whole layout of `Landing Page` if necessary.
- [x] Animate circle radial gradient that shown on the `Landing Page` and `Final Result` page: Purple start at bottom-left and ends at the top-left, yellow start at center-top and ends at the top-right, cyan start at middle-right and ends at bottom-center. The animation must keep rotating like a clock hands slowly.
- [x] Add stars overlay `assets/images/ui/stars.svg` for the `Landing Page` and `Final Result` page, animate the transition to be ease in from top of the screen.
- [x] If necessary add stars random offset x and y axis of the screen, add animation of them going bigger small, and random direction to make the `Landing Page` and `Final Result` page more alive.
- [x] Implement `fill-the-blank.svg` into the Stage 2, put it above the question number indicator.
- [x] Change Stage Hud Keys color scheme based on the landing page character color scheme (yellow, cyan, green, pink). Change the `stage-step-card` also, following that color scheme.
- [x] Fix Stage 3 and 4 background that did not work, I have followed Stage 1 and 2 code in the `index.html`.
- [x] Fix performance issue `button#lightbox-next.lightbox-nav-btn.next` with 392 ms delay (landing page).
- [x] Add link to `MilleRace` website (https://millerace.vercel.app) to the `Social Media` container at `Our Team` page, change the container to `Social Media & Game Link`.
- [x] Generate a final result screenshot (png image) with dimensions 1:1 and 9:16 to share to social media that automatically download when user click `Share on Social Media` button in Final Result page. Show MIL Score Badge, Rank, and the character that the user got.
- [x] Fix 9:16 and 1:1 share image on Final Result page (2x font sizes, circular MIL score progress bar with score at center, all 4 stage indicators, fix top accent leakage, eliminate text overlaps, and proportional avatar).
