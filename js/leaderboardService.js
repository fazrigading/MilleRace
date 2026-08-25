/* ==========================================================================
   MilleRace - Cloud & Local Hybrid Leaderboard & User History Service
   ========================================================================== */

const LeaderboardService = {
  db: null,
  isOnline: false,
  lastResetTime: 0,

  // Initialize Cloud Firestore if configured
  async init() {
    if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
      try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
        const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const app = initializeApp(FIREBASE_CONFIG);
        this.db = getFirestore(app);
        this.isOnline = true;
        console.log("🔥 Firebase Firestore connected successfully.");
      } catch (err) {
        console.warn("⚠️ Firebase connection unavailable, using offline localStorage fallback.", err);
        this.isOnline = false;
      }
    } else {
      console.log("ℹ️ Running Leaderboard in offline / localStorage mode.");
    }
  },

  // Fetch top leaderboard scores (Cloud first with graceful index fallback, localStorage fallback)
  async fetchTopScores(ageFilter = 'all') {
    if (this.isOnline && this.db) {
      try {
        const { collection, getDocs, doc, getDoc, query, orderBy, limit, where } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        
        // Check if there is a global reset cutoff timestamp
        let resetMillis = 0;
        try {
          const metaSnap = await getDoc(doc(this.db, "leaderboard_meta", "config"));
          if (metaSnap.exists()) {
            const metaData = metaSnap.data();
            if (metaData.lastResetAt && typeof metaData.lastResetAt.toMillis === 'function') {
              resetMillis = metaData.lastResetAt.toMillis();
            } else if (typeof metaData.lastResetAt === 'number') {
              resetMillis = metaData.lastResetAt;
            }
          }
        } catch (metaErr) {
          console.debug("No leaderboard_meta config found or accessible:", metaErr);
        }

        let localReset = 0;
        try {
          localReset = parseInt(localStorage.getItem('mille_leaderboard_reset_at') || '0', 10);
        } catch (e) {}

        const effectiveReset = Math.max(this.lastResetTime || 0, resetMillis || 0, localReset || 0);

        let snapshot;

        try {
          // Primary query (composite index optimized)
          let q;
          if (ageFilter !== 'all') {
            q = query(
              collection(this.db, "leaderboard"),
              where("ageGroup", "==", ageFilter),
              orderBy("score", "desc"),
              orderBy("timestamp", "asc"),
              limit(50)
            );
          } else {
            q = query(
              collection(this.db, "leaderboard"),
              orderBy("score", "desc"),
              orderBy("timestamp", "asc"),
              limit(50)
            );
          }
          snapshot = await getDocs(q);
        } catch (indexErr) {
          console.warn("⚠️ Composite index query pending or unavailable, falling back to simple query:", indexErr);
          // Fallback query: single-field order (always works out of the box without manual indexes)
          const fallbackQ = query(
            collection(this.db, "leaderboard"),
            orderBy("score", "desc"),
            limit(100)
          );
          snapshot = await getDocs(fallbackQ);
        }

        let rawDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter out entries before the last global reset
        if (effectiveReset > 0) {
          rawDocs = rawDocs.filter(d => {
            const dTime = d.timestamp?.toMillis ? d.timestamp.toMillis() : (Number(d.timestamp) || 0);
            return dTime > effectiveReset;
          });
        }

        // If simple fallback query was used, apply in-memory filter & secondary sort
        if (ageFilter !== 'all') {
          rawDocs = rawDocs.filter(d => d.ageGroup === ageFilter);
        }

        // Sort by score DESC, then timestamp ASC
        rawDocs.sort((a, b) => {
          const scoreDiff = (Number(b.score) || 0) - (Number(a.score) || 0);
          if (scoreDiff !== 0) return scoreDiff;
          const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : (a.timestamp || 0);
          const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : (b.timestamp || 0);
          return aTime - bTime;
        });

        const cloudEntries = rawDocs.slice(0, 50).map((data, idx) => {
          return {
            id: data.id,
            rank: idx + 1,
            name: data.name || 'Anonymous',
            ageGroup: data.ageGroup || '13-17',
            score: Number(data.score) || 0,
            time: data.time || 'Completed',
            character: data.character || 'Miller',
            date: data.timestamp && typeof data.timestamp.toDate === 'function' 
              ? data.timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
              : 'Recently'
          };
        });

        return cloudEntries;
      } catch (err) {
        console.warn("⚠️ Error fetching cloud leaderboard, falling back to local:", err);
      }
    }

    // Fallback to local aggregate data
    return UI.getLeaderboardData(ageFilter);
  },

  // Submit a completed race score to Cloud and Local
  async submitScore(entry) {
    // 1. Always save to Local Leaderboard & User History
    this.saveUserHistoryRun(entry);
    UI.saveRaceToLocalLeaderboard(entry);

    // 2. Sync to Firestore Cloud if available
    if (this.isOnline && this.db) {
      try {
        const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        
        const VALID_AGE_GROUPS = ['6-12', '13-17', '18+'];
        const VALID_CHARACTERS = ['Miller', 'Jen', 'Aidan', 'Lizzy'];

        const rawName = (entry.nickname || '').trim().slice(0, 25);
        const safeName = rawName.length > 0 ? rawName : 'Racer';
        const safeScore = Math.max(0, Math.min(100, Math.round(Number(entry.totalScore) || 0)));
        const safeAgeGroup = VALID_AGE_GROUPS.includes(entry.ageGroup) ? entry.ageGroup : '13-17';
        
        let safeCharacter = 'Miller';
        if (entry.characterName) {
          const matched = VALID_CHARACTERS.find(c => c.toLowerCase() === entry.characterName.toLowerCase());
          if (matched) safeCharacter = matched;
        }

        await addDoc(collection(this.db, "leaderboard"), {
          name: safeName,
          ageGroup: safeAgeGroup,
          score: safeScore,
          time: entry.timeFormatted ? `${entry.timeFormatted} remaining` : 'Completed',
          character: safeCharacter,
          timestamp: serverTimestamp()
        });
        console.log("✅ Score synced to Firebase Firestore!");
      } catch (err) {
        console.error("⚠️ Failed to sync score to cloud:", err);
      }
    }
  },

  // Reset Leaderboard in Cloud Firestore and LocalStorage
  async resetLeaderboard() {
    let deletedCount = 0;
    let cloudResetSuccess = false;
    this.lastResetTime = Date.now();

    // 1. Clear Local Storage Leaderboard
    try {
      localStorage.removeItem('mille_leaderboard');
      localStorage.setItem('mille_leaderboard_reset_at', Date.now().toString());
    } catch (e) {
      console.warn("Could not clear local storage leaderboard:", e);
    }

    // 2. Clear Cloud Firestore if connected
    if (this.isOnline && this.db) {
      try {
        const { collection, getDocs, doc, deleteDoc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        
        // Write global reset timestamp to metadata
        await setDoc(doc(this.db, "leaderboard_meta", "config"), {
          lastResetAt: serverTimestamp(),
          resetBy: "DevController",
          resetDateString: new Date().toISOString()
        });

        // Delete all documents in leaderboard collection
        const snapshot = await getDocs(collection(this.db, "leaderboard"));
        deletedCount = snapshot.docs.length;
        
        const deleteOps = snapshot.docs.map(d => deleteDoc(doc(this.db, "leaderboard", d.id)));
        await Promise.all(deleteOps);

        cloudResetSuccess = true;
        console.log(`🔥 Cloud Leaderboard reset completed. Deleted ${deletedCount} score entries.`);
      } catch (err) {
        console.error("⚠️ Error resetting Cloud Firestore leaderboard:", err);
      }
    }

    return {
      success: true,
      cloudReset: cloudResetSuccess,
      deletedCount: deletedCount
    };
  },

  // Persistent User Run History in browser localStorage
  getUserHistory() {
    try {
      const stored = localStorage.getItem('mille_user_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read user history:", e);
    }
    return [];
  },

  saveUserHistoryRun(runData) {
    try {
      const history = this.getUserHistory();
      const newRun = {
        id: `run_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        nickname: runData.nickname || 'Racer',
        ageGroup: runData.ageGroup || '13-17',
        totalScore: Number(runData.totalScore) || 0,
        stageScores: {
          1: Number(runData.stageScores?.[1]) || 0,
          2: Number(runData.stageScores?.[2]) || 0,
          3: Number(runData.stageScores?.[3]) || 0,
          4: Number(runData.stageScores?.[4]) || 0
        },
        characterName: runData.characterName || 'Miller',
        characterKey: (runData.characterKey || 'miller').toLowerCase(),
        timeFormatted: runData.timeFormatted || '03:00',
        dateFormatted: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        timestamp: Date.now()
      };

      history.unshift(newRun);
      localStorage.setItem('mille_user_history', JSON.stringify(history.slice(0, 100)));
      return newRun;
    } catch (e) {
      console.warn("Could not save user history run:", e);
    }
  }
};
