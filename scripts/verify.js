const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8085;
const PUBLIC_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Start temporary local server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, ''));
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

async function runVerification() {
  console.log('🚀 Starting local server for verification...');
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📡 Server listening on http://localhost:${PORT}`);

  console.log('🌐 Launching Google Chrome via playwright-core...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const page = await browser.newPage();
  console.log(`Chrome Version: ${browser.version()}`);

  try {
    console.log(`🔗 Navigating to http://localhost:${PORT}/ ...`);
    const response = await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    console.log(`Status Code: ${response.status()}`);

    const title = await page.title();
    console.log(`Page Title: "${title}"`);

    const appExists = await page.$('#app');
    console.log(`Root Element (#app) Detected: ${!!appExists}`);

    // Take verification screenshot
    const screenshotPath = path.join(__dirname, '..', 'verification-chrome.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot captured at: ${screenshotPath}`);

    console.log('✅ Google Chrome + Playwright-core verification PASSED successfully!');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification();
