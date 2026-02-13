import { useState, useEffect } from "react";
import { apiFetch } from "../api";

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/player-profiles/")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leaderboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  const sortedPlayers = [...players].sort(
    (a, b) => b.high_score - a.high_score
  );

  return (
    <div className="leaderboard">
      <div className="leaderboard-container">
        <h2>🏆 Leaderboard</h2>
        <p className="leaderboard-subtitle">Top players by high score</p>

        <div className="leaderboard-list">
          {sortedPlayers.length > 0 ? (
            sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`leaderboard-item ${
                  index < 3 ? "top-three" : ""
                }`}
              >
                <div className="rank-section">
                  <div className={`rank-badge rank-${index + 1}`}>
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `#${index + 1}`}
                  </div>
                </div>

                <div className="player-section">
                  <div className="player-avatar">
                    {player.avatar || "🎮"}
                  </div>
                  <div className="player-info">
                    <div className="player-name">{player.username}</div>
                    <div className="player-level">Level {player.level}</div>
                  </div>
                </div>

                <div className="stats-section">
                  <div className="stat-group">
                    <div className="stat-label">High Score</div>
                    <div className="stat-value primary">
                      {player.high_score}
                    </div>
                  </div>
                  <div className="stat-group">
                    <div className="stat-label">Accuracy</div>
                    <div className="stat-value">
                      {player.accuracy_percentage}%
                    </div>
                  </div>
                  <div className="stat-group">
                    <div className="stat-label">Avg Time</div>
                    <div className="stat-value">
                      {player.avg_reaction_time}s
                    </div>
                  </div>
                  <div className="stat-group">
                    <div className="stat-label">Best Streak</div>
                    <div className="stat-value">{player.best_streak}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-players">
              <div className="no-players-icon">👥</div>
              <p>No players yet. Be the first to play!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
