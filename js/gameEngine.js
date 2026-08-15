/* MilleRace - Game Engine & Stage Logic */

const GameEngine = {
  activeSentenceIndex: 0,
  isDialogueActive: false,
  isAnswering: false,

  // Start sentence-by-sentence dialogue for any stage (pauses timer, hides stage gameplay)
  startStageDialogue(stageNum, onComplete) {
    const stageConfig = GAME_CONFIG[`STAGE_${stageNum}`];
    if (!stageConfig) return;

    // Pause timer whenever dialogue is shown and show paused indicator
    GameTimer.stop();
    UI.updateHUD(stageNum, true);

    const stageScreen = document.getElementById(`screen-stage${stageNum}`);
    if (stageScreen) {
      stageScreen.classList.add('dialogue-active');
    }

    const sentences = stageConfig.introSentences;
    this.activeSentenceIndex = 0;
    this.isDialogueActive = true;

    const containerId = `stage${stageNum}-dialogue-text`;
    const hintEl = document.getElementById(`stage${stageNum}-dialog-hint`);
    const boxWrap = document.getElementById(`stage${stageNum}-dialog-box-wrap`);

    if (boxWrap) {
      boxWrap.style.display = 'flex';
      boxWrap.style.opacity = '1';
    }

    const showSentence = (index) => {
      if (index >= sentences.length) {
        this.isDialogueActive = false;
        if (stageScreen) {
          stageScreen.classList.remove('dialogue-active');
        }
        if (boxWrap) {
          boxWrap.style.display = 'none';
        }
        UI.updateHUD(stageNum, false);
        if (typeof onComplete === 'function') {
          onComplete();
        }
        return;
      }

      if (hintEl) {
        hintEl.style.opacity = '1';
        const isLast = (index === sentences.length - 1);
        hintEl.innerHTML = `<span class="hint-text">${isLast ? 'Click to start stage 🏁' : 'Click to continue'}</span><span class="hint-icon">▼</span>`;
      }

      UI.typeDialogue(containerId, sentences[index], 22);
    };

    const advanceHandler = () => {
      if (!this.isDialogueActive) return;

      if (UI.isDialogueTyping()) {
        UI.finishCurrentDialogueImmediately();
      } else {
        this.activeSentenceIndex++;
        showSentence(this.activeSentenceIndex);
      }
    };

    if (boxWrap) {
      boxWrap.onclick = advanceHandler;
      boxWrap.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceHandler();
        }
      };
    }

    showSentence(0);
  },

  // Start countdown timer if not yet running
  ensureTimerStarted() {
    if (!GameTimer.isRunning() && GameState.timerSecondsRemaining > 0) {
      GameTimer.start(
        (formattedTime) => {
          UI.updateHUD();
        },
        () => {
          UI.showModal(
            'Time Expired! ⏳',
            '<p>The 3-minute timer has reached zero! Let us tally your progress so far.</p>',
            'View Results',
            () => {
              GameEngine.renderResultPage();
            }
          );
        }
      );
    }
  },

  // Initialize Stage 1: Miller's Gallery (Visual AIAS)
  initStage1() {
    GameState.currentStage = 1;
    GameState.currentQuestionIndex = 0;
    this.isAnswering = false;

    UI.showScreen('screen-stage1');
    UI.updateHUD(1);

    this.renderStage1Question();

    // Start intro dialogue with timer paused and gameplay hidden
    this.startStageDialogue(1, () => {
      this.ensureTimerStarted();
    });
  },

  renderStage1Question() {
    const stageConfig = GAME_CONFIG.STAGE_1;
    const qIndex = GameState.currentQuestionIndex;
    if (qIndex >= stageConfig.questions.length) {
      this.completeStage(1);
      return;
    }

    const q = stageConfig.questions[qIndex];
    const promptEl = document.getElementById('stage1-prompt');
    if (promptEl) promptEl.textContent = q.prompt;

    // Render Progress Dots
    UI.renderProgressDots('stage1-progress-dots', stageConfig.questions.length, qIndex);

    // Render Artwork Cards
    const cardsGrid = document.getElementById('stage1-cards-grid');
    if (cardsGrid) {
      cardsGrid.innerHTML = q.options.map(opt => `
        <div class="art-card" data-letter="${opt.letter}" tabindex="0" role="button" aria-label="Artwork Option ${opt.letter}">
          <img src="${opt.img}" alt="Artwork Option ${opt.letter}" onerror="this.src='docs/design-references/ui-references/Question Type 1 with Cards.png'">
        </div>
      `).join('');

      // Add Click & Keyboard Listeners
      cardsGrid.querySelectorAll('.art-card').forEach(card => {
        const selectCard = () => {
          if (this.isDialogueActive || this.isAnswering) return;
          const selectedLetter = card.getAttribute('data-letter');
          this.handleStage1Answer(q, selectedLetter, card);
        };

        card.addEventListener('click', selectCard);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectCard();
          }
        });
      });
    }
  },

  handleStage1Answer(q, selectedLetter, cardEl) {
    this.isAnswering = true;
    const isCorrect = (selectedLetter === q.correct);
    if (isCorrect) {
      GameState.addStageScore(1, 5); // 4 questions x 5 points = 20 max
    }

    // Visual selection feedback
    if (cardEl) cardEl.classList.add('selected-choice');

    setTimeout(() => {
      this.isAnswering = false;
      GameState.currentQuestionIndex++;
      this.renderStage1Question();
    }, 450);
  },

  // Initialize Stage 2: Jen's Door Passwords (Literary Knowledge)
  initStage2() {
    GameState.currentStage = 2;
    GameState.currentQuestionIndex = 0;
    this.isAnswering = false;

    UI.showScreen('screen-stage2');
    UI.updateHUD(2);
    this.renderStage2Question();

    this.startStageDialogue(2, () => {
      this.ensureTimerStarted();
    });
  },

  renderStage2Question() {
    const stageConfig = GAME_CONFIG.STAGE_2;
    const qIndex = GameState.currentQuestionIndex;
    if (qIndex >= stageConfig.questions.length) {
      this.completeStage(2);
      return;
    }

    const q = stageConfig.questions[qIndex];

    // Format title with blank
    const titleEl = document.getElementById('stage2-title-display');
    if (titleEl) {
      const formattedTitle = q.title.replace('_____', `<span class="title-blank">_____</span>`);
      titleEl.innerHTML = formattedTitle;
    }

    // Render Progress Dots
    UI.renderProgressDots('stage2-progress-dots', stageConfig.questions.length, qIndex);

    // Render Word Chips
    const optionsGrid = document.getElementById('stage2-word-options');
    if (optionsGrid) {
      optionsGrid.innerHTML = q.choices.map(word => `
        <button class="word-chip" data-word="${UI.escapeHtml(word)}">${UI.escapeHtml(word)}</button>
      `).join('');

      optionsGrid.querySelectorAll('.word-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.isDialogueActive || this.isAnswering) return;
          const chosenWord = btn.getAttribute('data-word');
          this.handleStage2Answer(q, chosenWord, btn);
        });
      });
    }
  },

  handleStage2Answer(q, chosenWord, btnEl) {
    this.isAnswering = true;
    if (btnEl) btnEl.classList.add('selected-choice');
    if (chosenWord === q.answer) {
      GameState.addStageScore(2, 4); // 10 questions x 4 points = 40 max
    }

    setTimeout(() => {
      this.isAnswering = false;
      GameState.currentQuestionIndex++;
      this.renderStage2Question();
    }, 400);
  },

  // Initialize Stage 3: Aidan's Room of Letters (Textual AIAS)
  initStage3() {
    GameState.currentStage = 3;
    GameState.currentQuestionIndex = 0;
    this.isAnswering = false;

    UI.showScreen('screen-stage3');
    UI.updateHUD(3);
    this.renderStage3Question();

    this.startStageDialogue(3, () => {
      this.ensureTimerStarted();
    });
  },

  renderStage3Question() {
    const stageConfig = GAME_CONFIG.STAGE_3;
    const qIndex = GameState.currentQuestionIndex;
    if (qIndex >= stageConfig.passages.length) {
      this.completeStage(3);
      return;
    }

    const p = stageConfig.passages[qIndex];
    const passageEl = document.getElementById('stage3-passage-text');
    if (passageEl) passageEl.textContent = p.text;

    // Progress Dots
    UI.renderProgressDots('stage3-progress-dots', stageConfig.passages.length, qIndex);

    // Rating Buttons: Empty Circles with Bold Yellow Stroke & Tooltips
    const buttonsGroup = document.getElementById('stage3-rating-buttons');
    if (buttonsGroup) {
      buttonsGroup.innerHTML = stageConfig.ratingOptions.map(opt => `
        <button class="rating-circle-btn rating-btn" data-rating="${UI.escapeHtml(opt)}" aria-label="${UI.escapeHtml(opt)}" tabindex="0">
          <span class="rating-tooltip">${UI.escapeHtml(opt)}</span>
          <span class="rating-check-icon">✓</span>
        </button>
      `).join('');

      buttonsGroup.querySelectorAll('.rating-circle-btn').forEach(btn => {
        const chooseRating = () => {
          if (this.isDialogueActive || this.isAnswering) return;
          const selectedRating = btn.getAttribute('data-rating');
          this.handleStage3Answer(p, selectedRating, btn);
        };

        btn.addEventListener('click', chooseRating);
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            chooseRating();
          }
        });
      });
    }
  },

  handleStage3Answer(p, selectedRating, btnEl) {
    this.isAnswering = true;
    if (btnEl) btnEl.classList.add('selected-choice');

    let pts = 0;
    if (p.scores && p.scores[selectedRating] !== undefined) {
      pts = p.scores[selectedRating];
    } else {
      const normalizedRating = (selectedRating || '').toLowerCase().trim();
      const isHumanTarget = (p.id === 1 || p.id === 2 || p.id === 5 || p.target === 'Human');
      if (isHumanTarget) {
        if (normalizedRating === 'human') pts = 5;
        else if (normalizedRating === 'somewhat human') pts = 3;
        else if (normalizedRating === 'barely human') pts = 1;
        else if (normalizedRating === 'not human') pts = 0;
      } else {
        if (normalizedRating === 'human') pts = 0;
        else if (normalizedRating === 'somewhat human') pts = 1;
        else if (normalizedRating === 'barely human') pts = 3;
        else if (normalizedRating === 'not human') pts = 5;
      }
    }

    GameState.addStageScore(3, pts);

    setTimeout(() => {
      this.isAnswering = false;
      GameState.currentQuestionIndex++;
      this.renderStage3Question();
    }, 400);
  },

  // Initialize Stage 4: Lizzy's Room of Colors (PISA Comprehension)
  initStage4() {
    GameState.currentStage = 4;
    GameState.currentQuestionIndex = 0;
    this.isAnswering = false;

    UI.showScreen('screen-stage4');
    UI.updateHUD(4);
    this.renderStage4Question();

    this.startStageDialogue(4, () => {
      this.ensureTimerStarted();
    });
  },

  renderStage4Question() {
    const stageConfig = GAME_CONFIG.STAGE_4;
    const qIndex = GameState.currentQuestionIndex;
    if (qIndex >= stageConfig.questions.length) {
      this.completeStage(4);
      return;
    }

    const q = stageConfig.questions[qIndex];
    const passageEl = document.getElementById('stage4-passage-box');
    if (passageEl) passageEl.textContent = q.passage;

    // Progress Dots
    UI.renderProgressDots('stage4-progress-dots', stageConfig.questions.length, qIndex);

    // Render Options
    const optionsList = document.getElementById('stage4-options-list');
    if (optionsList) {
      optionsList.innerHTML = q.options.map(opt => `
        <div class="option-item" data-pts="${opt.pts}" tabindex="0" role="button">
          <span class="option-letter">${opt.letter}</span>
          <span>${UI.escapeHtml(opt.text)}</span>
        </div>
      `).join('');

      optionsList.querySelectorAll('.option-item').forEach(item => {
        const chooseOption = () => {
          if (this.isDialogueActive || this.isAnswering) return;
          const pts = parseInt(item.getAttribute('data-pts'), 10) || 0;
          this.handleStage4Answer(pts, item);
        };

        item.addEventListener('click', chooseOption);
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            chooseOption();
          }
        });
      });
    }
  },

  handleStage4Answer(pts, itemEl) {
    this.isAnswering = true;
    if (itemEl) itemEl.classList.add('selected-choice');
    GameState.addStageScore(4, pts);

    setTimeout(() => {
      this.isAnswering = false;
      GameState.currentQuestionIndex++;
      this.renderStage4Question();
    }, 400);
  },

  // Stage Completion Handler
  completeStage(stageNum) {
    GameState.awardKey(stageNum);
    UI.updateHUD();

    const keyMessages = {
      1: "Miller presents you with Key #1! Miller now leads you to Jen's playground of doors.",
      2: "Jen shouts: 'Old ways won't open new doors!' Key #2 obtained! Moving to Aidan's Room of Letters.",
      3: "Aidan smiles: 'You've been reading! Key #3 is yours!' Onward to Lizzy's Room of Colors.",
      4: "Lizzy hands you the Final Key! You unlocked the Maze Exit!"
    };

    const keyMessage = keyMessages[stageNum] || `Key #${stageNum} obtained!`;

    UI.showModal(`Key #${stageNum} Obtained! 🗝️`, `<p>${keyMessage}</p>`, 'Proceed to Next Stage', () => {
      if (stageNum < 4) {
        if (stageNum === 1) this.initStage2();
        else if (stageNum === 2) this.initStage3();
        else if (stageNum === 3) this.initStage4();
      } else {
        this.renderResultPage();
      }
    });
  },

  // Render Final Result Page
  renderResultPage() {
    GameTimer.stop();
    UI.showScreen('screen-result');

    const totalScore = GameState.getTotalScore();
    const charMatch = GameState.getMatchedCharacter();

    if (!charMatch) return;

    // 1. Animate MIL Score Number (Count up from 0 to totalScore)
    const scoreEl = document.getElementById('result-score-num');
    if (scoreEl) {
      scoreEl.textContent = '0%';
      let startScore = 0;
      const duration = 1200;
      const startTime = performance.now();

      const animateScore = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(easeOut * totalScore);
        scoreEl.textContent = `${currentVal}%`;

        if (progress < 1) {
          requestAnimationFrame(animateScore);
        } else {
          scoreEl.textContent = `${totalScore}%`;
        }
      };
      requestAnimationFrame(animateScore);
    }

    // 2. Animate Progress Track Fill
    const progressFill = document.getElementById('result-progress-fill');
    if (progressFill) {
      progressFill.style.width = '0%';
      setTimeout(() => {
        progressFill.style.width = `${totalScore}%`;
      }, 100);
    }

    // 3. Populate Stage Score Milestones Breakdown
    const s1El = document.getElementById('result-stage1-score');
    const s2El = document.getElementById('result-stage2-score');
    const s3El = document.getElementById('result-stage3-score');
    const s4El = document.getElementById('result-stage4-score');
    if (s1El) s1El.textContent = `${GameState.stageScores[1] || 0}/20`;
    if (s2El) s2El.textContent = `${GameState.stageScores[2] || 0}/40`;
    if (s3El) s3El.textContent = `${GameState.stageScores[3] || 0}/20`;
    if (s4El) s4El.textContent = `${GameState.stageScores[4] || 0}/20`;

    // 4. Save to Leaderboard automatically
    UI.saveRaceToLeaderboard(
      GameState.player.nickname || 'Racer',
      GameState.player.ageGroup || '13-17',
      totalScore,
      GameTimer.getFormattedTime(),
      charMatch.name
    );

    // 5. Render Character Details
    const badgeEl = document.getElementById('result-char-badge');
    if (badgeEl) badgeEl.textContent = `YOU ARE ${charMatch.name.toUpperCase()}!`;

    const pisaPill = document.getElementById('result-pisa-pill');
    if (pisaPill) pisaPill.textContent = charMatch.pisaLevel;

    const cefrPill = document.getElementById('result-cefr-pill');
    if (cefrPill) cefrPill.textContent = charMatch.cefrLevel;

    const quoteEl = document.getElementById('result-char-quote');
    if (quoteEl) quoteEl.textContent = `“${charMatch.quote}”`;

    const bioEl = document.getElementById('result-char-bio');
    if (bioEl) bioEl.textContent = charMatch.bio;

    const charImg = document.getElementById('result-char-img');
    if (charImg) {
      charImg.src = charMatch.avatar;
      charImg.onerror = () => { charImg.src = 'assets/images/characters/stills/Miller-no-bg.png'; };
    }

    // 6. Misinformation Resources from character-profiles.txt
    const misinfoList = document.getElementById('result-misinfo-links');
    if (misinfoList && Array.isArray(charMatch.misinfoLinks)) {
      misinfoList.innerHTML = charMatch.misinfoLinks.map(item => `
        <li><a href="${UI.escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${UI.escapeHtml(item.url)}</a></li>
      `).join('');
    }

    // 7. Home Activities
    const actList = document.getElementById('result-activities-list');
    if (actList && Array.isArray(charMatch.activities)) {
      actList.innerHTML = charMatch.activities.map(act => `<li>✨ ${UI.escapeHtml(act)}</li>`).join('');
    }

    // 8. Curated Books List
    const booksList = document.getElementById('result-books-list');
    if (booksList && Array.isArray(charMatch.books)) {
      booksList.innerHTML = charMatch.books.map(b => `
        <li>📖 <strong>${UI.escapeHtml(b.title)}</strong> by ${UI.escapeHtml(b.author)}${b.note ? ` (${UI.escapeHtml(b.note)})` : ''} - <a href="${UI.escapeHtml(b.link)}" target="_blank" rel="noopener noreferrer">Access Book</a></li>
      `).join('');
    }

    // 9. Critical Thinking & Fact-Check Toolkit Resources
    const resList = document.getElementById('result-resources-list');
    if (resList && Array.isArray(charMatch.resources)) {
      resList.innerHTML = charMatch.resources.map(r => `
        <li>💡 <a href="${UI.escapeHtml(r.link)}" target="_blank" rel="noopener noreferrer">${UI.escapeHtml(r.title)}</a></li>
      `).join('');
    }
  }
};
