import { useState, useEffect } from "react";
import { apiFetch } from "../api";

function GameStats() {
  const [gameHistory, setGameHistory] = useState([]);
  const [gameRounds, setGameRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/game-history/").then((res) => res.json()),
      apiFetch("/game-rounds-history/").then((res) => res.json()),
    ])
      .then(([historyData, roundsData]) => {
        setGameHistory(historyData);
        setGameRounds(roundsData);
      })
      .catch((err) => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading stats...</p>
      </div>
    );
  }

  const recentGames = gameHistory.slice(0, 10);
  const recentRounds = gameRounds.slice(0, 5);

  return (
    <div className="game-stats">
      <div className="stats-container">
        <h2>📊 Game Statistics</h2>

        <div className="stats-sections">
          <div className="stats-section">
            <h3>Recent Game Sessions</h3>
            <div className="sessions-list">
              {recentGames.length > 0 ? (
                recentGames.map((session) => (
                  <div key={session.id} className="session-item">
                    <div className="session-challenge">
                      <span className="challenge-prompt">
                        {session.challenge.prompt}
                      </span>
                      <span className="challenge-type">
                        ({session.challenge.type})
                      </span>
                    </div>
                    <div className="session-result">
                      <span
                        className={`result-badge ${
                          session.correct ? "correct" : "incorrect"
                        }`}
                      >
                        {session.correct ? "✅" : "❌"}
                      </span>
                      <span className="reaction-time">
                        {session.reaction_time.toFixed(2)}s
                      </span>
                      <span className="points">
                        +{session.points_earned}pts
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">
                  No game sessions yet. Start playing to see your stats!
                </p>
              )}
            </div>
          </div>

          <div className="stats-section">
            <h3>Recent Game Rounds</h3>
            <div className="rounds-list">
              {recentRounds.length > 0 ? (
                recentRounds.map((round) => (
                  <div key={round.id} className="round-item">
                    <div className="round-header">
                      <span className="round-difficulty">
                        {round.difficulty.toUpperCase()}
                      </span>
                      <span className="round-date">
                        {new Date(round.end_time).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="round-stats">
                      <div className="round-stat">
                        <span className="stat-label">Score</span>
                        <span className="stat-value">
                          {round.total_score}
                        </span>
                      </div>
                      <div className="round-stat">
                        <span className="stat-label">Accuracy</span>
                        <span className="stat-value">
                          {round.accuracy_percentage}%
                        </span>
                      </div>
                      <div className="round-stat">
                        <span className="stat-label">Avg Time</span>
                        <span className="stat-value">
                          {round.average_reaction_time.toFixed(2)}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">
                  No completed rounds yet. Finish a game to see your round
                  stats!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="performance-insights">
          <h3>Performance Insights</h3>
          <div className="insights-grid">
            {gameHistory.length > 0 ? (
              <>
                <div className="insight-item">
                  <div className="insight-icon">⚡</div>
                  <div className="insight-content">
                    <div className="insight-label">
                      Average Reaction Time
                    </div>
                    <div className="insight-value">
                      {(
                        gameHistory.reduce(
                          (sum, s) => sum + s.reaction_time,
                          0
                        ) / gameHistory.length
                      ).toFixed(2)}
                      s
                    </div>
                  </div>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-content">
                    <div className="insight-label">Overall Accuracy</div>
                    <div className="insight-value">
                      {Math.round(
                        (gameHistory.filter((s) => s.correct).length /
                          gameHistory.length) *
                          100
                      )}
                      %
                    </div>
                  </div>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">🔥</div>
                  <div className="insight-content">
                    <div className="insight-label">Best Single Score</div>
                    <div className="insight-value">
                      {Math.max(
                        ...gameHistory.map((s) => s.points_earned)
                      )}{" "}
                      points
                    </div>
                  </div>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <div className="insight-content">
                    <div className="insight-label">Total Points</div>
                    <div className="insight-value">
                      {gameHistory.reduce(
                        (sum, s) => sum + s.points_earned,
                        0
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="no-data">
                Play some games to see your performance insights!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameStats;
