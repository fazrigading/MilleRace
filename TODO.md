# MilleRace Project TODO 📋

> This document tracks upcoming tasks, feature requests, bug fixes, and development notes for **MilleRace**.

---

## 📌 In Progress / High Priority

### Easy Fixes

- [ ] Create 

### Medium Fixes
- [x] Fix Global Leaderboard: connect to Cloud Firestore, embed Web App credentials, remove missing local config 404/MIME error, and enhance query resilience and data validation.

### Hard Fixes
- [ ] Increase `landing-hero-section` height to 100% of screen height. Adjust the whole layout of `Landing Page` if necessary.
- [ ] Animate circle radial gradient that shown on the `Landing Page` and `Final Result` page: Purple start at bottom-left and ends at the top-left, yellow start at center-top and ends at the top-right, cyan start at middle-right and ends at bottom-center. The animation must keep rotating like a clock hands slowly.
- [ ] Add stars overlay `assets/images/ui/stars.svg` for the `Landing Page` and `Final Result` page, animate the transition to be ease in from top of the screen.
- [ ] If necessary add stars random offset x and y axis of the screen, add animation of them going bigger small, and random direction to make the `Landing Page` and `Final Result` page more alive.

---

## 📝 Backlog / Future Enhancements

- [ ] Change "Contact Us" mail link to real contact email.

---

## ✅ Completed Tasks

- [x] Initial project setup & documentation modularization
- [x] Change the "Join the Race" button to be "Contact Us" inside "Collaborate with UNMUL Team" container at `Our Team` page. The button should link to `mailto:[EMAIL_ADDRESS]` and open in new tab.
- [x] Plan new design of AIAS section and The 4-Stage Relay Journey section in `About Us` page.
- [x] Fix Global Leaderboard Firestore connection & resolve production 404/MIME error for `firebaseConfig.local.js`
