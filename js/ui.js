/* MilleRace - UI Rendering & Screen Transition Engine */

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: "Aurelia S.", ageGroup: "18+", score: 100, time: "01:14 remaining", character: "Lizzy", date: "Aug 14, 2026" },
  { rank: 2, name: "Reza Pratama", ageGroup: "13-17", score: 96, time: "00:52 remaining", character: "Lizzy", date: "Aug 14, 2026" },
  { rank: 3, name: "Nadia K.", ageGroup: "18+", score: 92, time: "00:45 remaining", character: "Aidan", date: "Aug 13, 2026" },
  { rank: 4, name: "Bima Arya", ageGroup: "13-17", score: 88, time: "00:38 remaining", character: "Aidan", date: "Aug 13, 2026" },
  { rank: 5, name: "Siti Rahma", ageGroup: "6-12", score: 84, time: "00:30 remaining", character: "Aidan", date: "Aug 12, 2026" },
  { rank: 6, name: "Kevin Chandra", ageGroup: "18+", score: 76, time: "00:25 remaining", character: "Aidan", date: "Aug 12, 2026" },
  { rank: 7, name: "Dewi Lestari", ageGroup: "13-17", score: 72, time: "00:20 remaining", character: "Jen", date: "Aug 11, 2026" },
  { rank: 8, name: "Dimas Nugroho", ageGroup: "6-12", score: 68, time: "00:15 remaining", character: "Jen", date: "Aug 11, 2026" },
  { rank: 9, name: "Maya Putri", ageGroup: "13-17", score: 60, time: "00:10 remaining", character: "Jen", date: "Aug 10, 2026" },
  { rank: 10, name: "Farhan A.", ageGroup: "6-12", score: 52, time: "00:05 remaining", character: "Miller", date: "Aug 10, 2026" }
];

const UI = {
  activeLeaderboardFilter: 'all',
  activeLeaderboardSearch: '',

  // Typewriter dialogue internal state encapsulation
  _dialogue: {
    intervalId: null,
    isTyping: false,
    fullText: '',
    containerId: null,
    onComplete: null
  },

  // Safe HTML string escape to prevent XSS in dynamic rendering
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Switch visible screen SPA-style
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      target.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Update active nav indicators (yellow round rectangle)
    this.updateNav(screenId);

    // If switching to leaderboard, refresh data
    if (screenId === 'screen-leaderboard') {
      this.renderLeaderboard(this.activeLeaderboardFilter, this.activeLeaderboardSearch);
    }

    // Toggle HUD visibility (only visible during actual game stages)
    const hud = document.getElementById('game-hud');
    if (hud) {
      if (screenId.startsWith('screen-stage')) {
        hud.style.display = 'flex';
        this.updateHUD();
      } else {
        hud.style.display = 'none';
      }
    }
  },

  // Update navigation items and position active yellow pill
  updateNav(screenId) {
    document.querySelectorAll('.nav-item').forEach(btn => {
      const isActive = (btn.getAttribute('data-nav') === screenId);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  },

  // Render standardized progress dots
  renderProgressDots(containerId, total, activeIndex) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = Array.from({ length: total }, (_, idx) => `
      <div class="progress-dot ${idx === activeIndex ? 'active' : ''} ${idx < activeIndex ? 'completed' : ''}"></div>
    `).join('');
  },

  // Update Top HUD (Stage Info, Timer, Keys, Paused Status)
  updateHUD(stageNum = GameState.currentStage, isPaused = null) {
    const stageTitles = {
      1: "Stage 1: Miller's Gallery",
      2: "Stage 2: Jen's Door Passwords",
      3: "Stage 3: Aidan's Room of Letters",
      4: "Stage 4: Lizzy's Room of Colors"
    };

    const stageSubtitles = {
      1: "Eliminate decoys and help me find real art works",
      2: "Complete the book titles",
      3: "Classify passage authenticity",
      4: "Deep inferential comprehension"
    };

    const titleEl = document.getElementById('hud-stage-title');
    if (titleEl && stageTitles[stageNum]) {
      titleEl.textContent = stageTitles[stageNum];
    }

    const subtitleEl = document.getElementById('hud-stage-subtitle');
    if (subtitleEl && stageSubtitles[stageNum]) {
      subtitleEl.textContent = stageSubtitles[stageNum];
    }

    const timerEl = document.getElementById('hud-timer-display');
    if (timerEl) timerEl.textContent = GameTimer.getFormattedTime();

    // Update Paused state on timer pill & icon
    const timerPill = document.getElementById('hud-timer-pill');
    const timerIcon = document.getElementById('hud-timer-icon');
    const paused = (isPaused !== null) ? isPaused : (GameEngine.isDialogueActive || !GameTimer.isRunning());

    if (timerPill) {
      timerPill.classList.toggle('paused', paused);
      if (timerIcon) {
        timerIcon.textContent = paused ? '⏸' : '⏱️';
      }
    }

    // Update keys slots
    for (let i = 1; i <= 4; i++) {
      const slot = document.getElementById(`key-slot-${i}`);
      if (slot) {
        const hasKey = GameState.hasKey(i);
        slot.classList.toggle('collected', hasKey);
        slot.innerHTML = hasKey ? '🔑' : i;
      }
    }
  },

  // Typewriter dialogue effect with instant completion support
  typeDialogue(containerId, text, speed = 22, onComplete = null) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.textContent = '';
    let i = 0;
    
    if (this._dialogue.intervalId) {
      clearInterval(this._dialogue.intervalId);
      this._dialogue.intervalId = null;
    }

    this._dialogue.isTyping = true;
    this._dialogue.fullText = text;
    this._dialogue.containerId = containerId;
    this._dialogue.onComplete = onComplete;
    
    this._dialogue.intervalId = setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this._dialogue.intervalId);
        this._dialogue.intervalId = null;
        this._dialogue.isTyping = false;
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    }, speed);
  },

  // Check if dialogue is currently typing
  isDialogueTyping() {
    return this._dialogue.isTyping;
  },

  // Complete typing current sentence instantly
  finishCurrentDialogueImmediately() {
    if (this._dialogue.isTyping && this._dialogue.intervalId) {
      clearInterval(this._dialogue.intervalId);
      this._dialogue.intervalId = null;
      this._dialogue.isTyping = false;
      const el = document.getElementById(this._dialogue.containerId);
      if (el && this._dialogue.fullText) {
        el.textContent = this._dialogue.fullText;
      }
      if (typeof this._dialogue.onComplete === 'function') {
        this._dialogue.onComplete();
      }
      return true;
    }
    return false;
  },

  // Show Modal Popup (Instruction or Key Unlock)
  showModal(title, bodyHtml, buttonText, onConfirm) {
    const modal = document.getElementById('game-modal');
    if (!modal) return;

    const titleEl = document.getElementById('modal-title-text');
    const bodyEl = document.getElementById('modal-body-content');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = bodyHtml;
    
    if (confirmBtn) {
      confirmBtn.textContent = buttonText || 'Continue';

      // Clean persistent onclick handler assignment
      confirmBtn.onclick = () => {
        modal.classList.remove('active');
        if (typeof onConfirm === 'function') {
          onConfirm();
        }
      };
    }

    modal.classList.add('active');
  },

  // Retrieve & aggregate leaderboard entries from localStorage + defaults
  getLeaderboardData() {
    let customEntries = [];
    try {
      const stored = localStorage.getItem('mille_leaderboard');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          customEntries = parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read local leaderboard:", e);
    }

    const combined = [...customEntries, ...DEFAULT_LEADERBOARD];
    // Sort descending by score
    combined.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

    // Re-assign ranks
    return combined.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  },

  // Save a completed race result to localStorage leaderboard
  saveRaceToLeaderboard(nickname, ageGroup, score, timeFormatted, characterName) {
    try {
      const stored = localStorage.getItem('mille_leaderboard');
      let entries = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(entries)) entries = [];
      
      const newEntry = {
        name: (nickname || 'Racer').trim(),
        ageGroup: ageGroup || '13-17',
        score: score,
        time: `${timeFormatted} remaining`,
        character: characterName || 'Miller',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      entries.unshift(newEntry);
      localStorage.setItem('mille_leaderboard', JSON.stringify(entries.slice(0, 50)));
    } catch (e) {
      console.warn("Could not save to leaderboard:", e);
    }
  },

  // Render Leaderboard Podium & Table
  renderLeaderboard(filter = 'all', searchQuery = '') {
    this.activeLeaderboardFilter = filter;
    this.activeLeaderboardSearch = searchQuery;

    const data = this.getLeaderboardData();
    let filtered = data;

    if (filter !== 'all') {
      filtered = filtered.filter(item => item.ageGroup === filter);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => (item.name || '').toLowerCase().includes(q));
    }

    // Render Podium (top 3 from filtered)
    const podiumEl = document.getElementById('leaderboard-podium');
    if (podiumEl) {
      const first = filtered[0];
      const second = filtered[1];
      const third = filtered[2];

      const renderPodiumCard = (entry, rankNumber, rankBadge, cardClass) => {
        if (!entry) {
          return `
            <div class="podium-card ${cardClass}">
              <div class="podium-rank-badge">${rankBadge}</div>
              <h3 class="podium-name">—</h3>
              <div class="podium-score">—</div>
              <div class="podium-archetype">No Racer</div>
            </div>
          `;
        }
        return `
          <div class="podium-card ${cardClass}">
            <div class="podium-rank-badge">${rankBadge}</div>
            <h3 class="podium-name">${this.escapeHtml(entry.name)}</h3>
            <div class="podium-score">${entry.score}%</div>
            <div class="podium-archetype">Matched: ${this.escapeHtml(entry.character)}</div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; color: #CBD5E1;">${this.escapeHtml(entry.time)}</div>
          </div>
        `;
      };

      podiumEl.innerHTML = `
        <!-- 2nd Place -->
        ${renderPodiumCard(second, 2, '2', 'second')}
        <!-- 1st Place -->
        ${renderPodiumCard(first, 1, '👑 1', 'first')}
        <!-- 3rd Place -->
        ${renderPodiumCard(third, 3, '3', 'third')}
      `;
    }

    // Render Table Rows
    const tbody = document.getElementById('leaderboard-table-body');
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 30px; color: #CBD5E1;">
              No racers found matching criteria. Be the first to race!
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(item => {
        const charLower = (item.character || 'miller').toLowerCase();
        let badgeClass = 'char-badge-miller';
        if (charLower.includes('lizzy')) badgeClass = 'char-badge-lizzy';
        else if (charLower.includes('aidan')) badgeClass = 'char-badge-aidan';
        else if (charLower.includes('jen')) badgeClass = 'char-badge-jen';

        return `
          <tr>
            <td><strong>#${item.rank}</strong></td>
            <td><strong>${this.escapeHtml(item.name)}</strong></td>
            <td>${this.escapeHtml(item.ageGroup)}</td>
            <td style="color: var(--color-yellow); font-weight: bold;">${item.score}%</td>
            <td>${this.escapeHtml(item.time)}</td>
            <td><span class="char-badge-small ${badgeClass}">✦ ${this.escapeHtml(item.character)}</span></td>
            <td style="color: #94A3B8; font-size: 0.9rem;">${this.escapeHtml(item.date)}</td>
          </tr>
        `;
      }).join('');
    }
  }
};
