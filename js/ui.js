/* MilleRace - UI Rendering & Screen Transition Engine */

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

    // Reset scroll progress indicator and floating controls
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) progressBar.style.width = '0%';
    const floatingBtn = document.getElementById('floating-back-to-top');
    if (floatingBtn) floatingBtn.classList.remove('visible');

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
        hud.style.display = 'grid';
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

    // Update keys pill active stage & key slots
    const keysPill = document.getElementById('hud-keys-pill');
    if (keysPill) {
      keysPill.setAttribute('data-stage', stageNum);
    }

    for (let i = 1; i <= 4; i++) {
      const slot = document.getElementById(`key-slot-${i}`);
      if (slot) {
        const hasKey = GameState.hasKey(i);
        slot.classList.toggle('collected', hasKey);
        slot.classList.toggle('current-stage', i === stageNum && !hasKey);
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

  // Retrieve & aggregate leaderboard entries from localStorage
  getLeaderboardData(filter = 'all') {
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

    let combined = [...customEntries];
    if (filter !== 'all') {
      combined = combined.filter(item => item.ageGroup === filter);
    }
    // Sort descending by score
    combined.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

    // Re-assign ranks
    return combined.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  },

  // Save to local storage cache
  saveRaceToLocalLeaderboard(entry) {
    try {
      const stored = localStorage.getItem('mille_leaderboard');
      let entries = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(entries)) entries = [];

      const newEntry = {
        name: (entry.nickname || 'Racer').trim().slice(0, 25),
        ageGroup: entry.ageGroup || '13-17',
        score: Number(entry.totalScore) || 0,
        time: entry.timeFormatted ? `${entry.timeFormatted} remaining` : 'Completed',
        character: entry.characterName || 'Miller',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      entries.unshift(newEntry);
      localStorage.setItem('mille_leaderboard', JSON.stringify(entries.slice(0, 50)));
    } catch (e) {
      console.warn("Could not save to local leaderboard:", e);
    }
  },

  // Save a completed race result (Hybrid Cloud + Local + History)
  saveRaceToLeaderboard(nickname, ageGroup, score, timeFormatted, characterName) {
    const runData = {
      nickname: nickname || GameState.player.nickname || 'Racer',
      ageGroup: ageGroup || GameState.player.ageGroup || '13-17',
      totalScore: score,
      stageScores: { ...GameState.stageScores },
      characterName: characterName || 'Miller',
      characterKey: (characterName || 'miller').toLowerCase(),
      timeFormatted: timeFormatted || GameTimer.getFormattedTime()
    };

    if (typeof LeaderboardService !== 'undefined' && LeaderboardService.submitScore) {
      LeaderboardService.submitScore(runData);
    } else {
      this.saveRaceToLocalLeaderboard(runData);
    }
  },

  // Reset Leaderboard (invoked via password-protected DevMode)
  async resetLeaderboard() {
    let result = { success: true };
    if (typeof LeaderboardService !== 'undefined' && LeaderboardService.resetLeaderboard) {
      result = await LeaderboardService.resetLeaderboard();
    } else {
      try {
        localStorage.removeItem('mille_leaderboard');
        localStorage.setItem('mille_leaderboard_reset_at', Date.now().toString());
      } catch (e) {
        console.warn("Could not clear local storage leaderboard:", e);
      }
    }
    await this.renderLeaderboard(this.activeLeaderboardFilter || 'all', this.activeLeaderboardSearch || '');
    return result;
  },

  // Switch between "Global Leaderboard" and "Your Results" views
  switchLeaderboardView(viewName) {
    const globalBtn = document.getElementById('btn-view-global-leaderboard');
    const historyBtn = document.getElementById('btn-view-user-history');
    const globalSec = document.getElementById('leaderboard-global-section');
    const historySec = document.getElementById('leaderboard-history-section');

    if (viewName === 'history') {
      if (globalBtn) globalBtn.classList.remove('active');
      if (historyBtn) historyBtn.classList.add('active');
      if (globalSec) globalSec.style.display = 'none';
      if (historySec) historySec.style.display = 'flex';
      this.renderUserHistory();
    } else {
      if (historyBtn) historyBtn.classList.remove('active');
      if (globalBtn) globalBtn.classList.add('active');
      if (historySec) historySec.style.display = 'none';
      if (globalSec) globalSec.style.display = 'flex';
      this.renderLeaderboard(this.activeLeaderboardFilter || 'all', this.activeLeaderboardSearch || '');
    }
  },

  // Render User's Persistent Race History
  renderUserHistory() {
    const container = document.getElementById('user-history-list');
    if (!container) return;

    const history = (typeof LeaderboardService !== 'undefined' && LeaderboardService.getUserHistory)
      ? LeaderboardService.getUserHistory()
      : [];

    if (history.length === 0) {
      container.innerHTML = `
        <div class="history-empty-state">
          <div class="history-empty-icon">🏁</div>
          <div class="history-empty-text">
            <strong>No race results recorded yet!</strong><br>
            Conquer the maze, collect all 4 keys, and your full analytical performance will be saved right here.
          </div>
          <button class="btn-primary btn-trigger-reg" style="margin-top: 10px;">Take the Test Now 🚀</button>
        </div>
      `;
      return;
    }

    container.innerHTML = history.map(run => {
      const charKey = (run.characterName || 'Miller').toLowerCase();
      let badgeClass = 'char-badge-miller';
      if (charKey.includes('lizzy')) badgeClass = 'char-badge-lizzy';
      else if (charKey.includes('aidan')) badgeClass = 'char-badge-aidan';
      else if (charKey.includes('jen')) badgeClass = 'char-badge-jen';

      const s1 = run.stageScores?.[1] ?? 0;
      const s2 = run.stageScores?.[2] ?? 0;
      const s3 = run.stageScores?.[3] ?? 0;
      const s4 = run.stageScores?.[4] ?? 0;

      return `
        <div class="history-card" data-run-id="${run.id}">
          <div class="history-card-top">
            <div>
              <span class="history-date">📅 ${this.escapeHtml(run.dateFormatted || 'Recently')}</span>
              <h3 class="history-player-name">${this.escapeHtml(run.nickname)} <span style="font-size: 0.85rem; color: #CBD5E1; font-weight: normal;">(${this.escapeHtml(run.ageGroup)})</span></h3>
            </div>
            <div class="history-score-chip">${run.totalScore}%</div>
          </div>

          <div class="history-stages-row">
            <span>V-AIAS: <strong>${s1}/20</strong></span>
            <span>Lit: <strong>${s2}/40</strong></span>
            <span>T-AIAS: <strong>${s3}/20</strong></span>
            <span>Crit: <strong>${s4}/20</strong></span>
          </div>

          <div class="history-card-footer">
            <span class="char-badge-small ${badgeClass}">✦ ${this.escapeHtml(run.characterName || 'Miller')}</span>
            <button class="btn-history-lookup" data-run-id="${run.id}">
              <span>View Final Result</span>
              <span aria-hidden="true">➔</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to "View Final Result" buttons
    container.querySelectorAll('.btn-history-lookup').forEach(btn => {
      btn.addEventListener('click', () => {
        const runId = btn.getAttribute('data-run-id');
        const runSnapshot = history.find(r => r.id === runId);
        if (runSnapshot && typeof GameEngine !== 'undefined' && GameEngine.renderHistoricalResult) {
          GameEngine.renderHistoricalResult(runSnapshot);
        }
      });
    });
  },

  // Internal renderer for leaderboard podium, empty view, and table
  renderLeaderboardData(data, filter = 'all', searchQuery = '') {
    const podiumEl = document.getElementById('leaderboard-podium');
    const tableWrapper = document.getElementById('leaderboard-table-wrapper');
    const emptyStateEl = document.getElementById('leaderboard-empty-state');
    const tbody = document.getElementById('leaderboard-table-body');

    const isSearching = searchQuery && searchQuery.trim() !== '';
    let filtered = data;

    if (isSearching) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => (item.name || '').toLowerCase().includes(q));
    }

    // 1. Overall Empty State: When no racers exist for this demographic filter
    if (data.length === 0) {
      if (podiumEl) podiumEl.style.display = 'none';
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (emptyStateEl) {
        const filterNames = {
          '6-12': 'Early Readers (6-12)',
          '13-17': 'Young Adults (13-17)',
          '18+': 'Advanced Readers (18+)'
        };
        const categoryLabel = filter !== 'all' ? ` in the ${filterNames[filter] || filter} category` : '';
        emptyStateEl.style.display = 'flex';
        emptyStateEl.innerHTML = `
          <div class="leaderboard-empty-icon-wrap">🏆</div>
          <h2 class="leaderboard-empty-title">No Racers on the Leaderboard <span>Yet!</span></h2>
          <p class="leaderboard-empty-desc">
            The race track is open, but no one has claimed the throne${categoryLabel}. 
            Be the first to escape the maze, master Media & Information Literacy, and claim the #1 spot in the Hall of Fame!
          </p>
          <div class="leaderboard-empty-perks">
            <span class="leaderboard-perk-item">👑 #1 Spot Open</span>
            <span class="leaderboard-perk-item">📜 UNESCO MIL Pioneer</span>
            <span class="leaderboard-perk-item">⚡ Set High Score Record</span>
          </div>
          <button class="btn-primary btn-trigger-reg" style="margin-top: 6px;">Be the First Champion 🚀</button>
        `;
      }
      return;
    }

    // 2. Data exists: hide full empty state view
    if (emptyStateEl) emptyStateEl.style.display = 'none';

    // 3. Search yields 0 results
    if (isSearching && filtered.length === 0) {
      if (podiumEl) podiumEl.style.display = 'none';
      if (tableWrapper) tableWrapper.style.display = 'block';
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="search-empty-box">
              🔍 No racers found matching "<strong>${this.escapeHtml(searchQuery)}</strong>".
              <br>
              <button class="btn-clear-search" id="btn-clear-leaderboard-search">Clear Search</button>
            </td>
          </tr>
        `;
        const clearBtn = document.getElementById('btn-clear-leaderboard-search');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('leaderboard-search-input');
            if (searchInput) searchInput.value = '';
            this.renderLeaderboard(filter, '');
          });
        }
      }
      return;
    }

    // 4. Render Table Wrapper & Podium
    if (tableWrapper) tableWrapper.style.display = 'block';

    if (podiumEl) {
      if (isSearching) {
        // HIDE podium when searching
        podiumEl.style.display = 'none';
      } else {
        podiumEl.style.display = 'grid';
        const first = filtered[0];
        const second = filtered[1];
        const third = filtered[2];

        const renderPodiumCard = (entry, rankNumber, rankBadge, cardClass) => {
          if (!entry) {
            return `
              <div class="podium-card awaiting ${cardClass}">
                <div class="podium-rank-badge">${rankBadge}</div>
                <h3 class="podium-name">Awaiting Challenger</h3>
                <div class="podium-score">—</div>
                <div class="podium-archetype">Rank #${rankNumber} Open</div>
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
          ${renderPodiumCard(first, 1, '1', 'first')}
          <!-- 3rd Place -->
          ${renderPodiumCard(third, 3, '3', 'third')}
        `;
      }
    }

    // 5. Render Table Rows
    if (tbody) {
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
  },

  // Render Leaderboard Podium & Table (Hybrid Cloud & Local Fast-render)
  async renderLeaderboard(filter = 'all', searchQuery = '') {
    this.activeLeaderboardFilter = filter;
    this.activeLeaderboardSearch = searchQuery;

    // Instant local render
    const localData = this.getLeaderboardData(filter);
    this.renderLeaderboardData(localData, filter, searchQuery);

    // If online Firestore is active, fetch cloud data and update seamlessly
    if (typeof LeaderboardService !== 'undefined' && LeaderboardService.isOnline) {
      try {
        const cloudData = await LeaderboardService.fetchTopScores(filter);
        if (this.activeLeaderboardFilter === filter && this.activeLeaderboardSearch === searchQuery) {
          this.renderLeaderboardData(cloudData, filter, searchQuery);
        }
      } catch (err) {
        console.warn("Could not fetch cloud leaderboard:", err);
      }
    }
  }
};
