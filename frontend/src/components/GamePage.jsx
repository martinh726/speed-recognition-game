import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { apiFetch } from "../api";
import ChallengeCard from "./ChallengeCard";
import GameMenu from "./GameMenu";

function GamePage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [gameRound, setGameRound] = useState(null);
  const [streak, setStreak] = useState(0);

  const fetchChallenges = useCallback(async (diff) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/challenges/?difficulty=${diff}&limit=20`);
      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      console.error("Error fetching challenges:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startGameRound = async () => {
    try {
      const res = await apiFetch("/start-round/", {
        method: "POST",
        body: JSON.stringify({ difficulty }),
      });
      const data = await res.json();
      setGameRound(data);
      setGameStarted(true);
      setScore(0);
      setCurrentIndex(0);
      setGameOver(false);
      setFeedback("");
      setStreak(0);
      await fetchChallenges(difficulty);
    } catch (err) {
      console.error("Error starting game round:", err);
    }
  };

  const endGameRound = async (roundId) => {
    try {
      await apiFetch("/end-round/", {
        method: "POST",
        body: JSON.stringify({ game_round_id: roundId }),
      });
      refreshProfile();
    } catch (err) {
      console.error("Error ending game round:", err);
    }
  };

  const handleAnswer = async (selectedCategory, reactionTime) => {
    const currentChallenge = challenges[currentIndex];
    if (!currentChallenge) return;

    try {
      const res = await apiFetch("/submit/", {
        method: "POST",
        body: JSON.stringify({
          challenge_id: currentChallenge.id,
          selected_category: selectedCategory,
          reaction_time: reactionTime,
          game_round_id: gameRound?.id,
        }),
      });
      const data = await res.json();

      if (data.correct) {
        setScore((s) => s + data.points_earned);
        setStreak(data.current_streak);
        setFeedback(`✅ Correct! +${data.points_earned} points`);
      } else {
        setStreak(0);
        setFeedback(
          `❌ Oops! The correct answer was: ${data.correct_category}`
        );
      }

      setTimeout(() => {
        setFeedback("");
        if (currentIndex + 1 < challenges.length) {
          setCurrentIndex((i) => i + 1);
        } else {
          setGameOver(true);
          endGameRound(gameRound?.id);
        }
      }, 1500);
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setCurrentIndex(0);
    setStreak(0);
    setFeedback("");
    setGameRound(null);
  };

  if (loading && gameStarted) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading challenges...</p>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <GameMenu
        onStartGame={startGameRound}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        userProfile={user}
      />
    );
  }

  if (gameOver) {
    return (
      <div className="game-over-container">
        <div className="game-over-content">
          <h2>🎉 Game Complete!</h2>
          <div className="final-stats">
            <div className="final-stat">
              <span className="final-stat-label">Final Score</span>
              <span className="final-stat-value">{score}</span>
            </div>
            <div className="final-stat">
              <span className="final-stat-label">Best Streak</span>
              <span className="final-stat-value">{streak}</span>
            </div>
            <div className="final-stat">
              <span className="final-stat-label">Accuracy</span>
              <span className="final-stat-value">
                {challenges.length > 0
                  ? Math.round((score / challenges.length) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
          <div className="game-over-actions">
            <button className="btn btn-primary" onClick={startGameRound}>
              🔄 Play Again
            </button>
            <button className="btn btn-secondary" onClick={handleBackToMenu}>
              🏠 Main Menu
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/leaderboard")}
            >
              🏆 Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current =
    currentIndex < challenges.length ? challenges[currentIndex] : null;

  return (
    <div className="game-container">
      <div className="game-stats-bar">
        <div className="stat-item">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Streak</span>
          <span className="stat-value">{streak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Progress</span>
          <span className="stat-value">
            {currentIndex + 1}/{challenges.length}
          </span>
        </div>
      </div>

      {current && (
        <ChallengeCard
          challenge={current}
          feedback={feedback}
          onAnswer={handleAnswer}
          difficulty={difficulty}
        />
      )}
    </div>
  );
}

export default GamePage;
