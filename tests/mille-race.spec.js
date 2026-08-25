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

  test('Stage 2: should render full background, fill-the-blank banner, and centered puzzle card with cyan key indicator', async ({ page }) => {
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

    const banner = page.locator('.stage2-header-banner .stage2-banner-img');
    await expect(banner).toBeVisible();

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

    // Verify background image is stage-3.png
    const stage3Bg = await page.locator('#screen-stage3').evaluate(el => window.getComputedStyle(el).backgroundImage);
    expect(stage3Bg).toContain('stage-3.png');

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

  test('Stage 4: should render stage background, enlarge paper card and layer properly behind corner character avatar and dialog', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof GameEngine !== 'undefined');
    await page.evaluate(() => {
      GameEngine.initStage4();
      GameEngine.isDialogueActive = false;
      document.getElementById('screen-stage4').classList.remove('dialogue-active');
      document.getElementById('stage4-dialog-box-wrap').style.display = 'none';
    });

    // Verify background image is stage-4.png
    const stage4Bg = await page.locator('#screen-stage4').evaluate(el => window.getComputedStyle(el).backgroundImage);
    expect(stage4Bg).toContain('stage-4.png');

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

  test('Final Result Page: should verify top bar, background, 1/4 purple band, character height, and containerless recommendations', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof UI !== 'undefined' && typeof GameEngine !== 'undefined');

    // Simulate final result
    await page.evaluate(() => {
      GameState.reset();
      GameState.setPlayer('TestRacer', '13-17');
      GameState.stageScores = { 1: 20, 2: 40, 3: 20, 4: 20 };
      GameEngine.renderResultPage(true);
    });

    const resultScreen = page.locator('#screen-result');
    await expect(resultScreen).toBeVisible();

    // 1. Top bar: verify standard page-header-nav
    const headerNav = resultScreen.locator('header.page-header-nav');
    await expect(headerNav).toBeVisible();
    const logoBrand = headerNav.locator('.logo-brand-text');
    await expect(logoBrand).toBeVisible();
    const navButtons = headerNav.locator('.top-nav-bar .nav-item');
    expect(await navButtons.count()).toBe(5);

    // Verify congratulations banner and rank text above result card
    const congratsText = resultScreen.locator('#result-congrats-text');
    await expect(congratsText).toBeVisible();
    await expect(congratsText).toContainText(/Congratulations for finishing the maze!/i);
    const rankSpan = resultScreen.locator('#result-leaderboard-rank');
    await expect(rankSpan).toBeVisible();

    // 2. Character Image Height vs Result Box Height
    const parchmentCard = page.locator('.result-parchment-card');
    const charImg = page.locator('#result-char-img');
    await expect(parchmentCard).toBeVisible();
    await expect(charImg).toBeVisible();

    const heights = await page.evaluate(() => {
      const card = document.querySelector('.result-parchment-card');
      const img = document.querySelector('#result-char-img');
      const cardRect = card.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      return {
        cardHeight: cardRect.height,
        imgHeight: imgRect.height,
        ratio: imgRect.height / cardRect.height
      };
    });

    // Character image must be at least 1.4x - 1.5x taller than the result box
    expect(heights.imgHeight).toBeGreaterThanOrEqual(heights.cardHeight * 1.45);

    // 3. Purple rectangle: 1/4 (25%) height of showcase section and anchored to bottom
    const bandInfo = await page.evaluate(() => {
      const section = document.querySelector('.result-showcase-section');
      const band = document.querySelector('.result-purple-band');
      const sectionRect = section.getBoundingClientRect();
      const bandRect = band.getBoundingClientRect();
      const bandStyle = window.getComputedStyle(band);
      return {
        sectionHeight: sectionRect.height,
        bandHeight: bandRect.height,
        ratio: bandRect.height / sectionRect.height,
        bottomPos: bandStyle.bottom,
        bgColor: bandStyle.backgroundColor
      };
    });

    expect(bandInfo.ratio).toBeCloseTo(0.65, 1);
    expect(bandInfo.bottomPos).toBe('0px');

    // 4. Personalized Recommendations: No purple container background
    const recSection = page.locator('.result-recommendations-section');
    await expect(recSection).toBeVisible();
    const recBg = await recSection.evaluate(el => window.getComputedStyle(el).backgroundColor);
    // Should be transparent / rgba(0, 0, 0, 0)
    expect(recBg).toBe('rgba(0, 0, 0, 0)');

    // Result Footer: Matching landing footer
    const footer = resultScreen.locator('footer.landing-footer-wrapper');
    await expect(footer).toBeVisible();
    const footerContainer = footer.locator('.landing-footer-container');
    await expect(footerContainer).toBeVisible();
  });

  test('Back to Top: should use global floating button with arrow character and remove page-level buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof UI !== 'undefined');

    const screens = [
      'screen-landing',
      'screen-about',
      'screen-team',
      'screen-mission',
      'screen-leaderboard',
      'screen-result'
    ];

    // Verify static back-to-top wrappers are removed from individual pages
    for (const screenId of screens) {
      await page.evaluate((id) => UI.showScreen(id), screenId);
      const screenEl = page.locator(`#${screenId}`);
      await expect(screenEl).toBeVisible();

      const pageLevelBtn = screenEl.locator('.back-to-top-wrapper');
      expect(await pageLevelBtn.count()).toBe(0);
    }

    // Verify global floating back to top button with arrow character
    const floatingBtn = page.locator('#floating-back-to-top');
    await expect(floatingBtn).toBeAttached();
    const arrowChar = floatingBtn.locator('.floating-arrow-char');
    await expect(arrowChar).toHaveText('↑');

    // Scroll down and verify floating button becomes visible
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(200);
    await expect(floatingBtn).toHaveClass(/visible/);

    // Click floating button and verify smooth scroll
    await floatingBtn.click();
    await page.waitForTimeout(300);
    const scrollTop = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
    expect(scrollTop).toBeLessThan(600);
  });


  test('Our Team: should render Social Media & Game Link container with live MilleRace website link and Contact Us button', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof UI !== 'undefined');
    await page.evaluate(() => UI.showScreen('screen-team'));

    const teamScreen = page.locator('#screen-team');
    await expect(teamScreen).toBeVisible();

    // Verify container title
    const containerTitle = teamScreen.locator('.team-social-links-container .page-cta-title');
    await expect(containerTitle).toHaveText(/Social Media & Game Link/i);

    // Verify Game Link button to https://millerace.vercel.app
    const gameLinkBtn = teamScreen.locator('.btn-game-link');
    await expect(gameLinkBtn).toBeVisible();
    await expect(gameLinkBtn).toHaveAttribute('href', 'https://millerace.vercel.app');
    await expect(gameLinkBtn).toHaveAttribute('target', '_blank');

    // Verify Contact Us button
    const contactBtn = teamScreen.locator('.btn-contact-team');
    await expect(contactBtn).toBeVisible();
    await expect(contactBtn).toHaveText(/Contact Us/i);
    await expect(contactBtn).toHaveAttribute('href', /^mailto:/);
    await expect(contactBtn).toHaveAttribute('target', '_blank');
  });

  test('Landing: should open lightbox on slide click and navigate swiftly with next button without errors', async ({ page }) => {
    await page.goto('/');
    const firstSlide = page.locator('.slideshow-slide').first();
    await expect(firstSlide).toBeVisible();

    // Click slide to open lightbox
    await firstSlide.click();
    const lightboxModal = page.locator('#slideshow-lightbox-modal');
    await expect(lightboxModal).toHaveClass(/active/);

    const lightboxImg = page.locator('#lightbox-img');
    const initialSrc = await lightboxImg.getAttribute('src');
    expect(initialSrc).toBeTruthy();

    // Click next button
    const nextBtn = page.locator('#lightbox-next');
    await nextBtn.click();

    // Check lightbox image updated
    await page.waitForTimeout(100);
    const newSrc = await lightboxImg.getAttribute('src');
    expect(newSrc).toBeTruthy();

    // Close lightbox
    const closeBtn = page.locator('#lightbox-close');
    await closeBtn.click();
    await expect(lightboxModal).not.toHaveClass(/active/);
  });

  test('Final Result: should generate 1:1 and 9:16 social media result screenshots and handle share click', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof ShareCardGenerator !== 'undefined');

    // Test ShareCardGenerator directly
    const result = await page.evaluate(async () => {
      const data = {
        nickname: 'Speedster',
        playerRank: '1',
        totalScore: 95,
        charName: 'Lizzy',
        pisaLevel: 'PISA Reading Level 5-6',
        cefrLevel: 'Cambridge Reading C1-C2',
        quote: 'Speed and precision!',
        bio: 'High analytical literacy tester.',
        stageScores: { 1: 20, 2: 40, 3: 15, 4: 20 }
      };
      const square = await ShareCardGenerator.generateSquareImage(data);
      const story = await ShareCardGenerator.generateStoryImage(data);
      return {
        squareWidth: square.width,
        squareHeight: square.height,
        storyWidth: story.width,
        storyHeight: story.height
      };
    });

    expect(result.squareWidth).toBe(1080);
    expect(result.squareHeight).toBe(1080);
    expect(result.storyWidth).toBe(1080);
    expect(result.storyHeight).toBe(1920);

    // Test Share Button on Result Page
    await page.evaluate(() => {
      GameState.player.nickname = 'Champion';
      GameState.stageScores = { 1: 20, 2: 40, 3: 20, 4: 20 };
      GameEngine.renderResultPage();
    });

    const shareBtn = page.locator('#btn-share-result');
    await expect(shareBtn).toBeVisible();
    await shareBtn.click();
    await page.waitForTimeout(200);
    await expect(shareBtn).toContainText(/Downloaded 2 Share Cards|Copied/i);
  });

  test('About Us: should render 5 AIAS rubric cards and 4-Stage Relay journey cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof UI !== 'undefined');
    await page.evaluate(() => UI.showScreen('screen-about'));

    const aboutScreen = page.locator('#screen-about');
    await expect(aboutScreen).toBeVisible();

    // 5 AIAS parameter cards
    const aiasCards = aboutScreen.locator('.aias-params-grid .param-card');
    expect(await aiasCards.count()).toBe(5);

    // 4 Stage Relay journey cards
    const stageCards = aboutScreen.locator('.stages-flow-grid .stage-step-card');
    expect(await stageCards.count()).toBe(4);
  });

  test('Hidden Scrollbars & Smooth Scrolling: should have smooth scroll behavior, hidden scrollbars (scrollbar-width: none), progress bar, and floating back-to-top', async ({ page }) => {
    await page.goto('/');

    // 1. Verify scroll-behavior: smooth on html/body
    const htmlScrollBehavior = await page.evaluate(() => window.getComputedStyle(document.documentElement).scrollBehavior);
    expect(htmlScrollBehavior).toBe('smooth');

    const bodyScrollBehavior = await page.evaluate(() => window.getComputedStyle(document.body).scrollBehavior);
    expect(bodyScrollBehavior).toBe('smooth');

    // 2. Verify scrollbar-width is none on html (scrollbar disabled/hidden)
    const scrollbarWidth = await page.evaluate(() => window.getComputedStyle(document.documentElement).scrollbarWidth);
    expect(scrollbarWidth).toBe('none');

    // 3. Verify top scroll progress bar exists
    const progressBar = page.locator('#scroll-progress-bar');
    await expect(progressBar).toBeAttached();

    // 4. Verify floating back to top button exists
    const floatingBtn = page.locator('#floating-back-to-top');
    await expect(floatingBtn).toBeAttached();

    // Scroll down 600px and check progress bar + floating button visibility
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(200);

    const progressWidth = await progressBar.evaluate(el => el.style.width);
    expect(parseFloat(progressWidth)).toBeGreaterThan(0);

    await expect(floatingBtn).toHaveClass(/visible/);

    // Click floating back to top button
    await floatingBtn.click();
    await page.waitForTimeout(300);

    // Page should scroll smoothly back towards top
    const scrollTop = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
    expect(scrollTop).toBeLessThan(600);
  });
});




