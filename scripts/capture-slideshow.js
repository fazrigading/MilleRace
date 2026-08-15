const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

async function captureSlideshow() {
  const outputDir = path.join(__dirname, '..', 'assets', 'images', 'ui', 'slideshow');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await page.goto('http://localhost:3000/');
  await page.waitForFunction(() => typeof UI !== 'undefined' && typeof GameEngine !== 'undefined');

  // Dismiss registration or setup player
  await page.evaluate(() => {
    GameState.reset();
    GameState.setPlayer('Racer', '13-17');
  });

  // 1. Capture Stage 1
  await page.evaluate(() => {
    GameEngine.initStage1();
    const dlg = document.getElementById('stage1-dialog-box-wrap');
    if (dlg) dlg.style.display = 'none';
    const scr = document.getElementById('screen-stage1');
    if (scr) scr.classList.remove('dialogue-active');
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(outputDir, 'stage-1-visual-aias-gameplay.png')
  });
  console.log('✅ Captured Stage 1');

  // 2. Capture Stage 2
  await page.evaluate(() => {
    GameEngine.initStage2();
    const dlg = document.getElementById('stage2-dialog-box-wrap');
    if (dlg) dlg.style.display = 'none';
    const scr = document.getElementById('screen-stage2');
    if (scr) scr.classList.remove('dialogue-active');
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(outputDir, 'stage-2-literary-reconstruction-gameplay.png')
  });
  console.log('✅ Captured Stage 2');

  // 3. Capture Stage 3
  await page.evaluate(() => {
    GameEngine.initStage3();
    const dlg = document.getElementById('stage3-dialog-box-wrap');
    if (dlg) dlg.style.display = 'none';
    const scr = document.getElementById('screen-stage3');
    if (scr) scr.classList.remove('dialogue-active');
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(outputDir, 'stage-3-textual-authenticity-gameplay.png')
  });
  console.log('✅ Captured Stage 3');

  // 4. Capture Stage 4
  await page.evaluate(() => {
    GameEngine.initStage4();
    const dlg = document.getElementById('stage4-dialog-box-wrap');
    if (dlg) dlg.style.display = 'none';
    const scr = document.getElementById('screen-stage4');
    if (scr) scr.classList.remove('dialogue-active');
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(outputDir, 'stage-4-pisa-comprehension-gameplay.png')
  });
  console.log('✅ Captured Stage 4');

  // 5. Capture Final Result
  await page.evaluate(() => {
    GameState.stageScores = { 1: 20, 2: 40, 3: 20, 4: 20 };
    GameEngine.renderResultPage(true);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, 'final-result-archetype-match.png')
  });
  console.log('✅ Captured Final Result');

  await browser.close();
  console.log('🎉 All 5 slideshow screenshots captured successfully!');
}

captureSlideshow().catch(err => {
  console.error(err);
  process.exit(1);
});
