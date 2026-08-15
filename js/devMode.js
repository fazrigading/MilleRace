/* ==========================================================================
   MilleRace Developer Mode & Quick Page Navigation Module
   ========================================================================== */

const DevMode = {
  isTimerDisabled: false, // Default: False so timer runs normally in game
  skipDialogues: false,
  isOpen: false,

  init() {
    this.createDevMarkup();
    this.bindEvents();
    console.log('🛠️ MilleRace Dev Mode initialized. Press Ctrl+Shift+D, Alt+D, or ~ (tilde) to toggle.');
  },

  createDevMarkup() {
    // Dev Mode Panel Overlay (No bottom-left floating pill)
    const panel = document.createElement('div');
    panel.id = 'dev-mode-panel';
    panel.className = 'dev-mode-panel';
    panel.innerHTML = `
      <!-- Header -->
      <div class="dev-header">
        <div>
          <div class="dev-title">🛠️ Dev Controller</div>
          <div class="dev-subtitle">Shortcut: Ctrl+Shift+D or ~</div>
        </div>
        <button id="btn-dev-close" class="dev-close-btn" title="Close Panel (Esc)">✕</button>
      </div>

      <!-- Quick Screen Navigator -->
      <div class="dev-section">
        <div class="dev-section-title">Jump to Screen</div>
        <div class="dev-nav-grid">
          <button class="dev-nav-btn" data-target="screen-landing">🏠 Landing Page</button>
          <button class="dev-nav-btn" data-target="screen-about">ℹ️ About & Lore</button>
          <button class="dev-nav-btn" data-target="screen-team">👥 Our Team</button>
          <button class="dev-nav-btn" data-target="screen-mission">🎯 Mission</button>
          <button class="dev-nav-btn" data-target="screen-stage1">🎨 Stage 1 (Miller)</button>
          <button class="dev-nav-btn" data-target="screen-stage2">📚 Stage 2 (Jen)</button>
          <button class="dev-nav-btn" data-target="screen-stage3">✍️ Stage 3 (Aidan)</button>
          <button class="dev-nav-btn" data-target="screen-stage4">🌈 Stage 4 (Lizzy)</button>
          <button class="dev-nav-btn" data-target="screen-result">🏆 Final Result</button>
          <button class="dev-nav-btn" data-target="screen-leaderboard">📊 Leaderboard</button>
          <button class="dev-nav-btn" data-target="reg-modal">📝 Register Modal</button>
        </div>
      </div>

      <!-- Dialogue & Timer Settings -->
      <div class="dev-section">
        <div class="dev-section-title">Settings & Toggles</div>
        <div class="dev-toggle-row">
          <span>⏱️ Pause Countdown Timer</span>
          <label class="dev-switch">
            <input type="checkbox" id="dev-toggle-timer" ${this.isTimerDisabled ? 'checked' : ''}>
            <span id="dev-timer-label">${this.isTimerDisabled ? 'PAUSED' : 'LIVE'}</span>
          </label>
        </div>
        <div class="dev-toggle-row">
          <span>💬 Skip Intro Dialogue</span>
          <label class="dev-switch">
            <input type="checkbox" id="dev-toggle-dialogue" ${this.skipDialogues ? 'checked' : ''}>
            <span>${this.skipDialogues ? 'YES' : 'NO'}</span>
          </label>
        </div>
      </div>

      <!-- Character Match & Result Simulator -->
      <div class="dev-section">
        <div class="dev-section-title">Simulate Character Result</div>
        <div class="dev-score-row">
          <button class="dev-score-btn" data-score="20">20% Miller</button>
          <button class="dev-score-btn" data-score="45">45% Jen</button>
          <button class="dev-score-btn" data-score="70">70% Aidan</button>
          <button class="dev-score-btn" data-score="95">95% Lizzy</button>
        </div>
      </div>

      <!-- Key Slots Modifier -->
      <div class="dev-section">
        <div class="dev-section-title">Keys Unlocked</div>
        <div class="dev-keys-row">
          <button class="dev-key-btn" data-key="1">Key 1</button>
          <button class="dev-key-btn" data-key="2">Key 2</button>
          <button class="dev-key-btn" data-key="3">Key 3</button>
          <button class="dev-key-btn" data-key="4">Key 4</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
  },

  bindEvents() {
    const panel = document.getElementById('dev-mode-panel');
    const closeBtn = document.getElementById('btn-dev-close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.togglePanel(false));
    }

    // Keyboard shortcuts:
    // 1. Ctrl + Shift + D
    // 2. Alt + D
    // 3. ` (backtick) or ~ (tilde)
    // 4. Escape to close
    document.addEventListener('keydown', (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);

      if (e.key === 'Escape' && this.isOpen) {
        this.togglePanel(false);
        return;
      }

      const isCtrlShiftD = (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd');
      const isAltD = (e.altKey && e.key.toLowerCase() === 'd');
      const isTilde = (!isInput && (e.key === '`' || e.key === '~'));

      if (isCtrlShiftD || isAltD || isTilde) {
        e.preventDefault();
        this.togglePanel();
      }
    });

    // Screen navigation buttons
    panel.querySelectorAll('.dev-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.navigateTo(target);
      });
    });

    // Timer Pause Toggle
    const timerToggle = document.getElementById('dev-toggle-timer');
    const timerLabel = document.getElementById('dev-timer-label');
    if (timerToggle) {
      timerToggle.addEventListener('change', () => {
        this.isTimerDisabled = timerToggle.checked;
        if (timerLabel) {
          timerLabel.textContent = this.isTimerDisabled ? 'PAUSED' : 'LIVE';
        }
        this.updateHUDTimerState();
      });
    }

    // Dialogue Toggle
    const dialogueToggle = document.getElementById('dev-toggle-dialogue');
    if (dialogueToggle) {
      dialogueToggle.addEventListener('change', () => {
        this.skipDialogues = dialogueToggle.checked;
        const span = dialogueToggle.parentElement.querySelector('span');
        if (span) span.textContent = this.skipDialogues ? 'YES' : 'NO';
      });
    }

    // Score / Character Match buttons
    panel.querySelectorAll('.dev-score-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const score = parseInt(btn.getAttribute('data-score'), 10) || 0;
        this.setMockScore(score);
      });
    });

    // Keys toggle buttons
    panel.querySelectorAll('.dev-key-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const keyNum = parseInt(btn.getAttribute('data-key'), 10);
        this.toggleKey(keyNum, btn);
      });
    });
  },

  togglePanel(forcedState) {
    const panel = document.getElementById('dev-mode-panel');
    if (!panel) return;
    this.isOpen = forcedState !== undefined ? forcedState : !this.isOpen;
    if (this.isOpen) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  },

  navigateTo(screenId) {
    if (this.isTimerDisabled) {
      GameTimer.stop();
    }

    // Ensure player object exists
    if (!GameState.player.nickname) {
      GameState.setPlayer('DevRacer', '13-17');
    }

    if (screenId === 'reg-modal') {
      const regModal = document.getElementById('reg-modal');
      if (regModal) regModal.classList.add('active');
      return;
    }

    if (screenId === 'screen-landing' || screenId === 'screen-about' || screenId === 'screen-team' || screenId === 'screen-mission' || screenId === 'screen-leaderboard') {
      UI.showScreen(screenId);
      return;
    }

    if (screenId === 'screen-stage1') {
      GameEngine.initStage1();
      if (this.skipDialogues) this.dismissActiveDialogue(1);
      if (this.isTimerDisabled) this.updateHUDTimerState();
      return;
    }

    if (screenId === 'screen-stage2') {
      GameEngine.initStage2();
      if (this.skipDialogues) this.dismissActiveDialogue(2);
      if (this.isTimerDisabled) this.updateHUDTimerState();
      return;
    }

    if (screenId === 'screen-stage3') {
      GameEngine.initStage3();
      if (this.skipDialogues) this.dismissActiveDialogue(3);
      if (this.isTimerDisabled) this.updateHUDTimerState();
      return;
    }

    if (screenId === 'screen-stage4') {
      GameEngine.initStage4();
      if (this.skipDialogues) this.dismissActiveDialogue(4);
      if (this.isTimerDisabled) this.updateHUDTimerState();
      return;
    }

    if (screenId === 'screen-result') {
      GameEngine.renderResultPage();
      return;
    }
  },

  dismissActiveDialogue(stageNum) {
    const dialogWrap = document.getElementById(`stage${stageNum}-dialog-box-wrap`);
    const screen = document.getElementById(`screen-stage${stageNum}`);
    if (dialogWrap) dialogWrap.style.display = 'none';
    if (screen) screen.classList.remove('dialogue-active');
    GameEngine.isDialogueActive = false;
  },

  setMockScore(totalScore) {
    // Distribute score proportionally across the 4 stages (Max: Stage 1 = 20, Stage 2 = 40, Stage 3 = 20, Stage 4 = 20)
    const ratio = Math.max(0, Math.min(100, totalScore)) / 100;
    GameState.stageScores[1] = Math.min(20, Math.round(20 * ratio));
    GameState.stageScores[2] = Math.min(40, Math.round(40 * ratio));
    GameState.stageScores[3] = Math.min(20, Math.round(20 * ratio));
    GameState.stageScores[4] = Math.min(20, Math.max(0, totalScore - GameState.stageScores[1] - GameState.stageScores[2] - GameState.stageScores[3]));

    if (!GameState.player.nickname) {
      GameState.setPlayer('DevRacer', '13-17');
    }

    GameEngine.renderResultPage();
  },

  toggleKey(keyNum, btnEl) {
    const idx = keyNum - 1;
    GameState.keysCollected[idx] = !GameState.keysCollected[idx];
    if (btnEl) {
      btnEl.classList.toggle('unlocked', GameState.keysCollected[idx]);
    }
    UI.updateHUD(GameState.currentStage);
  },

  updateHUDTimerState() {
    const timerDisplay = document.getElementById('hud-timer-display');
    const timerPill = document.getElementById('hud-timer-pill');
    if (this.isTimerDisabled) {
      GameTimer.stop();
      if (timerDisplay) timerDisplay.textContent = 'DEV (PAUSED)';
      if (timerPill) timerPill.classList.add('paused');
    } else {
      if (timerDisplay) timerDisplay.textContent = GameTimer.getFormattedTime();
    }
  }
};
