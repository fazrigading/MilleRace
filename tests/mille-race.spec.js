const { test, expect } = require('@playwright/test');

test.describe('MilleRace Web Game (Google Chrome)', () => {
  test('should load the home page with correct title and elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MilleRace/i);

    const app = page.locator('#app');
    await expect(app).toBeVisible();
    
    // Ensure #app has width 100% without max-width capping the screen
    const appMaxWidth = await app.evaluate(el => window.getComputedStyle(el).maxWidth);
    expect(appMaxWidth).toBe('none');
  });

  test('should open registration modal and handle navigation', async ({ page }) => {
    await page.goto('/');
    const startBtn = page.locator('#btn-open-reg-modal, .btn-trigger-reg').first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
      const regModal = page.locator('#reg-modal, .modal-overlay');
      await expect(regModal.first()).toBeVisible();
    }
  });

  test('Stage 1: should render full background, centered cards, and gold key indicator', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof GameEngine !== 'undefined');
    await page.evaluate(() => GameEngine.initStage1());

    // Dialogue active state
    const stage1 = page.locator('#screen-stage1');
    await expect(stage1).toHaveClass(/dialogue-active/);

    // Key slot 1 active gold indicator
    const keySlot1 = page.locator('#key-slot-1');
    await expect(keySlot1).toHaveClass(/current-stage/);

    // Complete dialogue
    await page.evaluate(() => {
      GameEngine.isDialogueActive = false;
      document.getElementById('screen-stage1').classList.remove('dialogue-active');
      document.getElementById('stage1-dialog-box-wrap').style.display = 'none';
    });

    const gameplayArea = page.locator('#stage1-gameplay-area');
    await expect(gameplayArea).toBeVisible();
    const cardsGrid = page.locator('#stage1-cards-grid');
    await expect(cardsGrid).toBeVisible();
  });

  test('Stage 2: should render full background and centered puzzle card with purple key indicator', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof GameEngine !== 'undefined');
    await page.evaluate(() => {
      GameEngine.initStage2();
      GameEngine.isDialogueActive = false;
      document.getElementById('screen-stage2').classList.remove('dialogue-active');
      document.getElementById('stage2-dialog-box-wrap').style.display = 'none';
    });

    const keySlot2 = page.locator('#key-slot-2');
    await expect(keySlot2).toHaveClass(/current-stage/);

    const puzzleCard = page.locator('.stage2-puzzle-card');
    await expect(puzzleCard).toBeVisible();
  });

  test('Stage 3: should hide purple bar during dialogue, apply custom paper padding, 1000px max-width, detached text, and custom circle sizes', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof GameEngine !== 'undefined');
    await page.evaluate(() => GameEngine.initStage3());

    // Dialogue active: purple strip must be hidden
    const ratingStrip = page.locator('#stage3-rating-strip');
    const stripOpacity = await ratingStrip.evaluate(el => window.getComputedStyle(el).opacity);
    expect(Number(stripOpacity)).toBe(0);

    // Complete dialogue
    await page.evaluate(() => {
      GameEngine.isDialogueActive = false;
      document.getElementById('screen-stage3').classList.remove('dialogue-active');
      document.getElementById('stage3-dialog-box-wrap').style.display = 'none';
    });

    // Check wrap max-width is 1000px and top is 16px
    const wrap = page.locator('.stage3-gameplay-wrap');
    const wrapStyles = await wrap.evaluate(el => ({
      maxWidth: window.getComputedStyle(el).maxWidth,
      top: window.getComputedStyle(el).top
    }));
    expect(wrapStyles.maxWidth).toBe('1000px');
    expect(wrapStyles.top).toBe('16px');

    // Check paper padding and detached passage text width
    const paper = page.locator('.stage3-paper-card');
    const passage = page.locator('#stage3-passage-text');
    const passageMaxWidth = await passage.evaluate(el => window.getComputedStyle(el).maxWidth);
    expect(passageMaxWidth).toBe('100%');

    // Check circle sizes: Somewhat/Barely Human 50px vs Human/Not Human 56px
    const circles = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.rating-circle-btn'));
      return btns.map(b => ({
        rating: b.getAttribute('data-rating'),
        width: window.getComputedStyle(b).width,
        height: window.getComputedStyle(b).height
      }));
    });

    expect(circles).toEqual([
      { rating: 'Human', width: '56px', height: '56px' },
      { rating: 'Somewhat Human', width: '48px', height: '48px' },
      { rating: 'Barely Human', width: '48px', height: '48px' },
      { rating: 'Not Human', width: '56px', height: '56px' }
    ]);
  });

  test('Stage 4: should enlarge paper card and layer properly behind corner character avatar and dialog', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof GameEngine !== 'undefined');
    await page.evaluate(() => {
      GameEngine.initStage4();
      GameEngine.isDialogueActive = false;
      document.getElementById('screen-stage4').classList.remove('dialogue-active');
      document.getElementById('stage4-dialog-box-wrap').style.display = 'none';
    });

    const keySlot4 = page.locator('#key-slot-4');
    await expect(keySlot4).toHaveClass(/current-stage/);

    const layerInfo = await page.evaluate(() => {
      const wrap = document.querySelector('.stage4-gameplay-wrap');
      const cornerChar = document.querySelector('#stage4-corner-char');
      const dialogBox = document.querySelector('#stage4-dialog-box-wrap');
      return {
        wrapZIndex: parseInt(window.getComputedStyle(wrap).zIndex, 10),
        cornerCharZIndex: parseInt(window.getComputedStyle(cornerChar).zIndex, 10),
        dialogBoxZIndex: parseInt(window.getComputedStyle(dialogBox).zIndex, 10)
      };
    });

    // Paper wrap (20) < Corner character (50) < Dialog box (90)
    expect(layerInfo.wrapZIndex).toBeLessThan(layerInfo.cornerCharZIndex);
    expect(layerInfo.cornerCharZIndex).toBeLessThan(layerInfo.dialogBoxZIndex);
  });

  test('HUD: should center stage info using 3-column grid layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof UI !== 'undefined');
    await page.evaluate(() => UI.showScreen('screen-stage1'));

    const hudGrid = await page.evaluate(() => {
      const hud = document.querySelector('.game-hud');
      const info = document.querySelector('.hud-stage-info');
      return {
        display: window.getComputedStyle(hud).display,
        gridCols: window.getComputedStyle(hud).gridTemplateColumns,
        infoJustify: window.getComputedStyle(info).justifySelf
      };
    });

    expect(hudGrid.display).toBe('grid');
    expect(hudGrid.infoJustify).toBe('center');
  });

  test('Point System: should verify stage score points according to new guidelines', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof GameState !== 'undefined' && typeof GAME_CONFIG !== 'undefined');

    const scoreResults = await page.evaluate(() => {
      // 1. Stage 1 verification: 4 questions x 5 pts = 20 pts
      GameState.reset();
      GAME_CONFIG.STAGE_1.questions.forEach(q => {
        GameEngine.handleStage1Answer(q, q.correct, null);
      });
      const stage1Score = GameState.stageScores[1];

      // 2. Stage 2 verification: 10 questions x 4 pts = 40 pts
      GameState.reset();
      GAME_CONFIG.STAGE_2.questions.forEach(q => {
        GameEngine.handleStage2Answer(q, q.answer, null);
      });
      const stage2Score = GameState.stageScores[2];

      // 3. Stage 3 verification:
      // Q1, Q2, Q5: Human=5, Somewhat Human=3, Barely Human=1, Not Human=0
      // Q3, Q4: Human=0, Somewhat Human=1, Barely Human=3, Not Human=5
      const stage3MatrixResults = [];
      const p1 = GAME_CONFIG.STAGE_3.passages.find(p => p.id === 1);
      const p3 = GAME_CONFIG.STAGE_3.passages.find(p => p.id === 3);

      ['Human', 'Somewhat Human', 'Barely Human', 'Not Human'].forEach(opt => {
        GameState.reset();
        GameEngine.handleStage3Answer(p1, opt, null);
        const p1Score = GameState.stageScores[3];

        GameState.reset();
        GameEngine.handleStage3Answer(p3, opt, null);
        const p3Score = GameState.stageScores[3];

        stage3MatrixResults.push({ option: opt, p1Score, p3Score });
      });

      // Perfect run on Stage 3
      GameState.reset();
      GAME_CONFIG.STAGE_3.passages.forEach(p => {
        GameEngine.handleStage3Answer(p, p.target, null);
      });
      const stage3PerfectScore = GameState.stageScores[3];

      // 4. Stage 4 verification: 4 questions x 5 pts = 20 pts
      GameState.reset();
      GAME_CONFIG.STAGE_4.questions.forEach(q => {
        const bestOpt = q.options.find(o => o.pts === 5);
        GameEngine.handleStage4Answer(bestOpt.pts, null);
      });
      const stage4Score = GameState.stageScores[4];

      // Total Full Game Score
      GameState.reset();
      GAME_CONFIG.STAGE_1.questions.forEach(q => GameEngine.handleStage1Answer(q, q.correct, null));
      GAME_CONFIG.STAGE_2.questions.forEach(q => GameEngine.handleStage2Answer(q, q.answer, null));
      GAME_CONFIG.STAGE_3.passages.forEach(p => GameEngine.handleStage3Answer(p, p.target, null));
      GAME_CONFIG.STAGE_4.questions.forEach(q => {
        const bestOpt = q.options.find(o => o.pts === 5);
        GameEngine.handleStage4Answer(bestOpt.pts, null);
      });
      const totalScore = GameState.getTotalScore();

      return {
        stage1Score,
        stage2Score,
        stage3MatrixResults,
        stage3PerfectScore,
        stage4Score,
        totalScore
      };
    });

    // Stage 1: 20
    expect(scoreResults.stage1Score).toBe(20);

    // Stage 2: 40
    expect(scoreResults.stage2Score).toBe(40);

    // Stage 3 matrix:
    // Q1 (and Q2, Q5): Human = 5, Somewhat Human = 3, Barely Human = 1, Not Human = 0
    // Q3 (and Q4): Human = 0, Somewhat Human = 1, Barely Human = 3, Not Human = 5
    expect(scoreResults.stage3MatrixResults).toEqual([
      { option: 'Human', p1Score: 5, p3Score: 0 },
      { option: 'Somewhat Human', p1Score: 3, p3Score: 1 },
      { option: 'Barely Human', p1Score: 1, p3Score: 3 },
      { option: 'Not Human', p1Score: 0, p3Score: 5 }
    ]);

    // Stage 3: capped at 20
    expect(scoreResults.stage3PerfectScore).toBe(20);

    // Stage 4: 20
    expect(scoreResults.stage4Score).toBe(20);

    // Total Score = 100
    expect(scoreResults.totalScore).toBe(100);
  });

  test('Leaderboard: should display empty state view when no records exist and transition cleanly when score is submitted', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof UI !== 'undefined');

    // 1. Clear any local storage leaderboard entries
    await page.evaluate(() => {
      localStorage.removeItem('mille_leaderboard');
      localStorage.removeItem('mille_user_history');
      UI.showScreen('screen-leaderboard');
    });

    // Verify empty state is visible and podium/table are hidden
    const emptyState = page.locator('#leaderboard-empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText(/No Racers on the Leaderboard/i);
    await expect(emptyState).toContainText(/UNESCO MIL Pioneer/i);

    const podium = page.locator('#leaderboard-podium');
    await expect(podium).toBeHidden();

    const tableWrapper = page.locator('#leaderboard-table-wrapper');
    await expect(tableWrapper).toBeHidden();

    // 2. Click the empty state CTA button -> opens registration modal
    const emptyCta = emptyState.locator('.btn-trigger-reg');
    await expect(emptyCta).toBeVisible();
    await emptyCta.click();

    const regModal = page.locator('#reg-modal');
    await expect(regModal).toBeVisible();

    // Close modal for next test
    await page.evaluate(() => document.getElementById('reg-modal').classList.remove('active'));

    // 3. Save a score and verify leaderboard renders podium and table
    await page.evaluate(() => {
      UI.saveRaceToLeaderboard('CyberRunner', '13-17', 95, '01:30', 'Lizzy');
      UI.renderLeaderboard('all', '');
    });

    await expect(emptyState).toBeHidden();
    await expect(podium).toBeVisible();
    await expect(podium).toContainText('CyberRunner');
    await expect(podium).toContainText('95%');
    await expect(podium).toContainText('Awaiting Challenger');

    await expect(tableWrapper).toBeVisible();
    const tableBody = page.locator('#leaderboard-table-body');
    await expect(tableBody).toContainText('CyberRunner');
    await expect(tableBody).toContainText('95%');

    // 4. Test search empty state
    await page.evaluate(() => {
      UI.renderLeaderboard('all', 'NonExistentRacerXYZ');
    });

    await expect(tableBody).toContainText(/No racers found matching/i);
    const clearSearchBtn = page.locator('#btn-clear-leaderboard-search');
    await expect(clearSearchBtn).toBeVisible();
    await clearSearchBtn.click();
    await expect(tableBody).toContainText('CyberRunner');
  });
});

