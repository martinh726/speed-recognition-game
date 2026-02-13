import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function GameHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/game-history/")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching game history:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div className="game-stats">
      <div className="stats-container">
        <h2>📜 Game History</h2>
        <div className="sessions-list">
          {history.length > 0 ? (
            history.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-challenge">
                  <span className="challenge-prompt">
                    {session.challenge?.prompt || `Game #${session.id}`}
                  </span>
                  <span className="challenge-type">
                    {session.challenge?.type
                      ? `(${session.challenge.type})`
                      : ""}
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
                    {Number(session.reaction_time).toFixed(2)}s
                  </span>
                  <span className="points">
                    +{session.points_earned}pts
                  </span>
                  <span className="round-date">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">
              No game history yet. Start playing to build your history!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameHistory;
