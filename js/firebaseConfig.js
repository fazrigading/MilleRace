/* ==========================================================================
   MilleRace - Firebase Configuration & Initialization
   ========================================================================== */

// Place your Firebase Project credentials here (from Firebase Console)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBg_YUSum_JQlJyg62m5eKYWKczQJdGS_E",
  authDomain: "millerace-unesco2026.firebaseapp.com",
  projectId: "millerace-unesco2026",
  storageBucket: "millerace-unesco2026.firebasestorage.app",
  messagingSenderId: "864802505502",
  appId: "1:864802505502:web:7099e4e2ee4be734193f0f"
};

// Check if credentials have been set (not default placeholders)
const isFirebaseConfigured = () => {
  return FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.includes("YOUR_API_KEY");
};


