/* MilleRace - Player & Game State Management */

const GameState = {
  player: {
    nickname: '',
    ageGroup: '13-17'
  },
  currentStage: 1, // 1 to 4
  currentQuestionIndex: 0,
  timerSecondsRemaining: 180, // 3 Minutes countdown
  timerInterval: null, // Maintained for backwards compatibility with external references
  
  // Scores per stage (Stage 1: 20 max, Stage 2: 40 max, Stage 3: 20 max, Stage 4: 20 max)
  stageScores: {
    1: 0,
    2: 0,
    3: 0,
    4: 0
  },

  // Max score limits per stage
  stageMaxScores: {
    1: 20,
    2: 40,
    3: 20,
    4: 20
  },

  // Collected keys
  keysCollected: [false, false, false, false],

  // Set player info cleanly
  setPlayer(nickname, ageGroup = '13-17') {
    this.player.nickname = (nickname || 'Player').trim();
    this.player.ageGroup = ageGroup;
  },

  // Increment stage score safely with ceiling per stage
  addStageScore(stageNum, points) {
    if (this.stageScores[stageNum] !== undefined) {
      const maxPts = (this.stageMaxScores && this.stageMaxScores[stageNum] !== undefined) ? this.stageMaxScores[stageNum] : 20;
      this.stageScores[stageNum] = Math.min(maxPts, this.stageScores[stageNum] + points);
    }
  },

  // Reset Game State
  reset() {
    this.currentStage = 1;
    this.currentQuestionIndex = 0;
    this.timerSecondsRemaining = (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.TIMER_SECONDS) ? GAME_CONFIG.TIMER_SECONDS : 180;
    this.stageScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
    this.keysCollected = [false, false, false, false];
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  // Calculate Total Score (0 - 100)
  getTotalScore() {
    const total = Object.values(this.stageScores).reduce((sum, val) => sum + val, 0);
    return Math.min(100, Math.max(0, Math.round(total)));
  },

  // Award key for completed stage
  awardKey(stageNum) {
    if (stageNum >= 1 && stageNum <= 4) {
      this.keysCollected[stageNum - 1] = true;
    }
  },

  // Check if a specific stage key was unlocked
  hasKey(stageNum) {
    return !!this.keysCollected[stageNum - 1];
  },

  // Get matched character based on total score
  getMatchedCharacter() {
    const total = this.getTotalScore();
    if (typeof GAME_CONFIG === 'undefined' || !GAME_CONFIG.CHARACTERS) {
      return null;
    }
    if (total <= 25) return GAME_CONFIG.CHARACTERS.miller;
    if (total <= 50) return GAME_CONFIG.CHARACTERS.jen;
    if (total <= 75) return GAME_CONFIG.CHARACTERS.aidan;
    return GAME_CONFIG.CHARACTERS.lizzy;
  }
};
