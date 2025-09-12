function PlayerProfile({ profile }) {
  if (!profile) return null;

  const xpProgress = (profile.experience_points / profile.next_level_xp) * 100;

  return (
    <div className="player-profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-emoji">{profile.avatar}</span>
          </div>
          <div className="profile-info">
            <h2 className="profile-username">{profile.username}</h2>
            <div className="profile-level">
              <span className="level-badge">Level {profile.level}</span>
            </div>
          </div>
        </div>

        <div className="xp-section">
          <div className="xp-header">
            <span className="xp-label">Experience Points</span>
            <span className="xp-current">{profile.experience_points} / {profile.next_level_xp}</span>
          </div>
          <div className="xp-bar">
            <div 
              className="xp-progress" 
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-label">High Score</div>
              <div className="stat-value">{profile.high_score}</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-label">Games Played</div>
              <div className="stat-value">{profile.total_games_played}</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-label">Correct Answers</div>
              <div className="stat-value">{profile.total_correct_answers}</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Accuracy</div>
              <div className="stat-value">{profile.accuracy_percentage}%</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-label">Best Streak</div>
              <div className="stat-value">{profile.best_streak}</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-label">Avg Reaction Time</div>
              <div className="stat-value">{profile.avg_reaction_time}s</div>
            </div>
          </div>
        </div>

        <div className="achievements-section">
          <h3>Achievements</h3>
          <div className="achievements-grid">
            {profile.high_score >= 100 && (
              <div className="achievement earned">
                <div className="achievement-icon">🏆</div>
                <div className="achievement-text">High Scorer</div>
              </div>
            )}
            {profile.best_streak >= 10 && (
              <div className="achievement earned">
                <div className="achievement-icon">🔥</div>
                <div className="achievement-text">Streak Master</div>
              </div>
            )}
            {profile.accuracy_percentage >= 80 && (
              <div className="achievement earned">
                <div className="achievement-icon">🎯</div>
                <div className="achievement-text">Sharp Shooter</div>
              </div>
            )}
            {profile.total_games_played >= 50 && (
              <div className="achievement earned">
                <div className="achievement-icon">🎮</div>
                <div className="achievement-text">Dedicated Player</div>
              </div>
            )}
            {profile.level >= 5 && (
              <div className="achievement earned">
                <div className="achievement-icon">⭐</div>
                <div className="achievement-text">Rising Star</div>
              </div>
            )}
            {profile.avg_reaction_time <= 1.5 && (
              <div className="achievement earned">
                <div className="achievement-icon">⚡</div>
                <div className="achievement-text">Lightning Fast</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;
