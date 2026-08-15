/* MilleRace - Application Bootstrap & Event Binding */

document.addEventListener('DOMContentLoaded', () => {
  console.log("MilleRace Web App Initialized.");

  const regModal = document.getElementById('reg-modal');

  // Helper to open registration modal
  function openRegistrationModal() {
    if (regModal) {
      regModal.classList.add('active');
      const nicknameInput = document.getElementById('input-modal-nickname');
      if (nicknameInput) {
        setTimeout(() => nicknameInput.focus(), 50);
      }
    }
  }

  // Open Registration Modal from Landing Page Hero CTA
  const openRegBtn = document.getElementById('btn-open-reg-modal');
  if (openRegBtn) {
    openRegBtn.addEventListener('click', openRegistrationModal);
  }

  // Open Registration Modal from any page CTA buttons (.btn-trigger-reg)
  document.querySelectorAll('.btn-trigger-reg').forEach(btn => {
    btn.addEventListener('click', openRegistrationModal);
  });

  // Close modal if clicking outside backdrop
  if (regModal) {
    regModal.addEventListener('click', (e) => {
      if (e.target === regModal) {
        regModal.classList.remove('active');
      }
    });
  }

  // Navigation and Modal Click Event Delegation
  document.addEventListener('click', (e) => {
    // 1. Navigation items (Home, About Us, Our Team, Our Mission, Leaderboard)
    const navBtn = e.target.closest('.nav-item');
    if (navBtn) {
      e.preventDefault();
      const targetScreen = navBtn.getAttribute('data-nav');
      if (targetScreen) {
        UI.showScreen(targetScreen);
      }
      return;
    }

    // 2. Logo link click -> Back to Home
    const logoBtn = e.target.closest('.logo-link');
    if (logoBtn) {
      e.preventDefault();
      UI.showScreen('screen-landing');
      return;
    }

    // 3. CTA buttons (.btn-trigger-reg)
    const ctaBtn = e.target.closest('.btn-trigger-reg');
    if (ctaBtn) {
      e.preventDefault();
      openRegistrationModal();
      return;
    }
  });

  // 5 Strategic Pillars: Interactive Mission Dossier Tab Switching
  const dossierConsole = document.getElementById('mission-dossier-console');
  if (dossierConsole) {
    const tabs = Array.from(dossierConsole.querySelectorAll('.dossier-nav-item'));
    const panels = Array.from(dossierConsole.querySelectorAll('.dossier-panel'));

    tabs.forEach((tab, index) => {
      // Click event
      tab.addEventListener('click', () => {
        const pillarId = tab.getAttribute('data-pillar');
        if (!pillarId) return;

        // Update active tab states
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Update active panel display
        panels.forEach(p => {
          if (p.getAttribute('data-panel') === pillarId) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
      });

      // Keyboard navigation (Arrow keys, Home, End)
      tab.addEventListener('keydown', (e) => {
        let targetIndex = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = tabs.length - 1;
        }

        if (targetIndex !== null) {
          tabs[targetIndex].focus();
          tabs[targetIndex].click();
        }
      });
    });
  }

  // Leaderboard Demographic Filter Tabs
  const filterTabsContainer = document.getElementById('leaderboard-demographic-tabs');
  if (filterTabsContainer) {
    filterTabsContainer.querySelectorAll('.tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        filterTabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');
        const filter = tabBtn.getAttribute('data-filter') || 'all';
        const searchVal = document.getElementById('leaderboard-search-input')?.value || '';
        UI.renderLeaderboard(filter, searchVal);
      });
    });
  }

  // Leaderboard Live Search Input
  const searchInput = document.getElementById('leaderboard-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('#leaderboard-demographic-tabs .tab-btn.active');
      const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
      UI.renderLeaderboard(filter, e.target.value);
    });
  }

  // Result Page "View Leaderboard" Button
  const resultLeaderboardBtn = document.getElementById('btn-result-leaderboard');
  if (resultLeaderboardBtn) {
    resultLeaderboardBtn.addEventListener('click', () => {
      UI.showScreen('screen-leaderboard');
    });
  }

  // Registration & Start Game Form inside modal
  const regModalForm = document.getElementById('form-registration-modal');
  if (regModalForm) {
    regModalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('input-modal-nickname');
      const ageSelect = document.getElementById('select-modal-age');

      const nickname = nameInput ? nameInput.value.trim() : 'Player';
      const ageGroup = ageSelect ? ageSelect.value : '13-17';

      if (!nickname) {
        alert('Please enter your nickname to enter the maze!');
        return;
      }

      // Close registration modal
      if (regModal) {
        regModal.classList.remove('active');
      }

      // Save player state cleanly
      GameState.setPlayer(nickname, ageGroup);
      GameState.reset();

      // Initialize Stage 1
      GameEngine.initStage1();
    });
  }

  // Result Page "Share your result!" Button Listener
  const shareBtn = document.getElementById('btn-share-result');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const totalScore = GameState.getTotalScore();
      const charMatch = GameState.getMatchedCharacter();
      const charName = charMatch ? charMatch.name : 'Miller';
      const shareText = `🏁 I scored ${totalScore}% in MilleRace and escaped the maze! My Character Match is ${charName}. Can you outread the machine? Play now!`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(() => {
          const originalContent = shareBtn.innerHTML;
          shareBtn.innerHTML = `<span>Copied to Clipboard!</span> <span aria-hidden="true">✓</span>`;
          shareBtn.style.background = '#2E9E85';
          shareBtn.style.color = '#FFFFFF';
          setTimeout(() => {
            shareBtn.innerHTML = originalContent;
            shareBtn.style.background = '';
            shareBtn.style.color = '';
          }, 2400);
        }).catch(err => {
          console.warn('Clipboard write failed:', err);
          alert(shareText);
        });
      } else {
        alert(shareText);
      }
    });
  }

  // Play Again Button Listener
  const playAgainBtn = document.getElementById('btn-play-again');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      GameState.reset();
      UI.showScreen('screen-landing');
    });
  }

  // Initialize Dev Mode Toolbar & Quick Navigator
  if (typeof DevMode !== 'undefined') {
    DevMode.init();
  }

  // Initial Screen Display
  UI.showScreen('screen-landing');
});
