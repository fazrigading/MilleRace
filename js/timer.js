/* MilleRace - Countdown Timer Controller */

const GameTimer = {
  _intervalId: null,

  // Helper to format remaining seconds into MM:SS string
  formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  // Start timer tick loop
  start(onTick, onComplete) {
    this.stop(); // Clear any existing timer

    this._intervalId = setInterval(() => {
      if (GameState.timerSecondsRemaining > 0) {
        GameState.timerSecondsRemaining--;
      }

      const formatted = this.formatTime(GameState.timerSecondsRemaining);
      
      if (typeof onTick === 'function') {
        onTick(formatted, GameState.timerSecondsRemaining);
      }
      
      if (GameState.timerSecondsRemaining <= 0) {
        this.stop();
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    }, 1000);

    GameState.timerInterval = this._intervalId;
  },

  // Stop active timer
  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    if (GameState.timerInterval) {
      clearInterval(GameState.timerInterval);
      GameState.timerInterval = null;
    }
  },

  // Check if timer is actively ticking
  isRunning() {
    return this._intervalId !== null;
  },

  // Get current formatted countdown time
  getFormattedTime() {
    return this.formatTime(GameState.timerSecondsRemaining);
  }
};
