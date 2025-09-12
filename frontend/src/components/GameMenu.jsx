function GameMenu({ onStartGame, difficulty, onDifficultyChange, userProfile }) {
  const difficulties = [
    { value: 'easy', label: 'Easy', icon: '🟢', description: '5 seconds per challenge' },
    { value: 'medium', label: 'Medium', icon: '🟡', description: '4 seconds per challenge' },
    { value: 'hard', label: 'Hard', icon: '🔴', description: '3 seconds per challenge' }
  ];

  return (
    <div className="game-menu">
      <div className="menu-container">
        <div className="welcome-section">
          <h2>Welcome to Speed Recognition!</h2>
          <p className="game-description">
            Test your brain's reaction time and accuracy by quickly categorizing words, emojis, and more!
          </p>
        </div>

        {userProfile && (
          <div className="player-stats-preview">
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <div className="stat-label">High Score</div>
                <div className="stat-value">{userProfile.high_score}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-label">Level</div>
                <div className="stat-value">{userProfile.level}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-label">Accuracy</div>
                <div className="stat-value">{userProfile.accuracy_percentage}%</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <div className="stat-label">Best Streak</div>
                <div className="stat-value">{userProfile.best_streak}</div>
              </div>
            </div>
          </div>
        )}

        <div className="difficulty-selection">
          <h3>Choose Difficulty</h3>
          <div className="difficulty-options">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                className={`difficulty-option ${difficulty === diff.value ? 'selected' : ''}`}
                onClick={() => onDifficultyChange(diff.value)}
              >
                <div className="difficulty-icon">{diff.icon}</div>
                <div className="difficulty-label">{diff.label}</div>
                <div className="difficulty-description">{diff.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="game-features">
          <h3>Game Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">Fast-paced challenges</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🧠</div>
              <div className="feature-text">Brain training</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <div className="feature-text">Leaderboards</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <div className="feature-text">Progress tracking</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">Multiple categories</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔥</div>
              <div className="feature-text">Streak system</div>
            </div>
          </div>
        </div>

        <button className="start-game-btn" onClick={onStartGame}>
          <span className="btn-icon">🚀</span>
          <span className="btn-text">Start Game</span>
        </button>
      </div>
    </div>
  );
}

export default GameMenu;
