const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../js/firebaseConfig.js');

function injectEnv() {
  const apiKey = process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    console.log('ℹ️ No FIREBASE_API_KEY environment variable detected; keeping default placeholders.');
    return;
  }

  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found at: ${configPath}`);
    return;
  }

  let content = fs.readFileSync(configPath, 'utf8');
  content = content.replace(/__FIREBASE_API_KEY__/g, apiKey);
  fs.writeFileSync(configPath, content, 'utf8');
  console.log('✅ Successfully injected FIREBASE_API_KEY into js/firebaseConfig.js for production build.');
}

injectEnv();
