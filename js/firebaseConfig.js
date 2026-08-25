/* ==========================================================================
   MilleRace - Firebase Configuration & Initialization
   ========================================================================== */

// Base Firebase config (injected by Vercel build or falling back to local/overrides)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBg_YUSum_JQlJyg62m5eKYWKczQJdGS_E",
  authDomain: "millerace-unesco2026.firebaseapp.com",
  projectId: "millerace-unesco2026",
  storageBucket: "millerace-unesco2026.firebasestorage.app",
  messagingSenderId: "864802505502",
  appId: "1:864802505502:web:7099e4e2ee4be734193f0f"
};

const getFirebaseConfig = () => {
  return window.__FIREBASE_CONFIG__ || DEFAULT_FIREBASE_CONFIG;
};

// Dynamic proxy so FIREBASE_CONFIG always reads window.__FIREBASE_CONFIG__ if available
const FIREBASE_CONFIG = new Proxy(DEFAULT_FIREBASE_CONFIG, {
  get(target, prop) {
    const active = getFirebaseConfig();
    return active[prop];
  }
});

// Check if credentials have been set (not default placeholders)
const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return !!(
    config.apiKey && 
    !config.apiKey.includes("YOUR_API_KEY") && 
    !config.apiKey.includes("__FIREBASE_API_KEY__")
  );
};
