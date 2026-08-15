/* ==========================================================================
   MilleRace - Cloud & Local Hybrid Leaderboard & User History Service
   ========================================================================== */

const LeaderboardService = {
  db: null,
  isOnline: false,

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

  // Fetch top leaderboard scores (Cloud first, localStorage fallback)
  async fetchTopScores(ageFilter = 'all') {
    if (this.isOnline && this.db) {
      try {
        const { collection, getDocs, query, orderBy, limit, where } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
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

        const snapshot = await getDocs(q);
        const cloudEntries = snapshot.docs.map((doc, idx) => {
          const data = doc.data();
          return {
            id: doc.id,
            rank: idx + 1,
            name: data.name || 'Anonymous',
            ageGroup: data.ageGroup || '13-17',
            score: Number(data.score) || 0,
            time: data.time || 'Completed',
            character: data.character || 'Miller',
            date: data.timestamp ? data.timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'
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
        await addDoc(collection(this.db, "leaderboard"), {
          name: (entry.nickname || 'Racer').trim().slice(0, 25),
          ageGroup: entry.ageGroup || '13-17',
          score: Number(entry.totalScore) || 0,
          time: entry.timeFormatted ? `${entry.timeFormatted} remaining` : 'Completed',
          character: entry.characterName || 'Miller',
          timestamp: serverTimestamp()
        });
        console.log("✅ Score synced to Firebase Firestore!");
      } catch (err) {
        console.error("⚠️ Failed to sync score to cloud:", err);
      }
    }
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
