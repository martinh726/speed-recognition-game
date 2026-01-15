import { useEffect, useState } from "react";
import "./App.css";
import Leaderboard from "./components/Leaderboard";
import ChallengeCard from "./components/ChallengeCard";
import LoginForm from "./components/LoginForm";
import GameHistory from "./components/GameHistory";
import PlayerProfile from "./components/PlayerProfile";
import GameMenu from "./components/GameMenu";
import GameStats from "./components/GameStats";

function App() {
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [userProfile, setUserProfile] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [gameRound, setGameRound] = useState(null);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameTimer, setGameTimer] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  // Fetch user profile
  const fetchUserProfile = () => {
    if (!token) return;
    setProfileLoading(true);
    fetch("http://127.0.0.1:8000/api/current-user/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUserProfile(data);
        setProfileLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setProfileLoading(false);
      });
  };

  // Fetch challenges from the API
  const fetchChallenges = () => {
    setLoading(true);
    fetch(
      `http://127.0.0.1:8000/api/challenges/?difficulty=${difficulty}&limit=20`
    )
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching challenges:", err);
        setLoading(false);
      });
  };

  // Fetch leaderboard data
  const fetchLeaderboard = () => {
    fetch("http://127.0.0.1:8000/api/player-profiles/")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
      })
      .catch((err) => console.error("Error fetching leaderboard:", err));
  };

  useEffect(() => {
    if (loggedIn) {
      fetchUserProfile();
      fetchLeaderboard();
    }
  }, [loggedIn]);

  // Start a new game round
  const startGameRound = () => {
    fetch("http://127.0.0.1:8000/api/start-round/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ difficulty }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGameRound(data);
        setGameStarted(true);
        setScore(0);
        setCurrentIndex(0);
        setGameOver(false);
        setFeedback("");
        setStreak(0);
        fetchChallenges();
      })
      .catch((err) => console.error("Error starting game round:", err));
  };

  // End the current game round
  const endGameRound = () => {
    if (gameRound) {
      fetch("http://127.0.0.1:8000/api/end-round/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ game_round_id: gameRound.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Game round ended:", data);
          fetchUserProfile(); // Refresh profile to get updated stats
        })
        .catch((err) => console.error("Error ending game round:", err));
    }
  };

  // When player selects a category
  const handleAnswer = (selectedCategory, reactionTime) => {
    const currentChallenge = challenges[currentIndex];
    if (!currentChallenge) return;

    const payload = {
      challenge_id: currentChallenge.id,
      selected_category: selectedCategory,
      reaction_time: reactionTime,
      game_round_id: gameRound?.id,
    };

    fetch("http://127.0.0.1:8000/api/submit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.correct) {
          setScore(score + data.points_earned);
          setStreak(data.current_streak);
          setFeedback(`✅ Correct! +${data.points_earned} points`);
        } else {
          setStreak(0);
          setFeedback(
            `❌ Oops! The correct answer was: ${data.correct_category}`
          );
        }

        // Delay 1.5 seconds, then go to next or end
        setTimeout(() => {
          setFeedback("");

          if (currentIndex + 1 < challenges.length) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setGameOver(true);
            endGameRound();
          }
        }, 1500);
      })
      .catch((err) => console.error("Error submitting answer:", err));
  };

  // Restart game from beginning
  const handleRestart = () => {
    startGameRound();
  };

  // Logout to clear token and reset state
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
    setUserProfile(null);
    setScore(0);
    setCurrentIndex(0);
    setGameStarted(false);
    setGameRound(null);
  };

  if (!loggedIn) {
    return <LoginForm onLogin={() => setLoggedIn(true)} />;
  }

  if (profileLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (loading && gameStarted) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading challenges...</p>
      </div>
    );
  }

  const current =
    currentIndex < challenges.length ? challenges[currentIndex] : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="game-title">
            <span className="brain-emoji">🧠</span>
            Speed Recognition Game
          </h1>
          {userProfile && (
            <div className="user-info">
              <span className="user-avatar">{userProfile.avatar}</span>
              <span className="username">Welcome, {userProfile.username}!</span>
              <span className="user-level">Level {userProfile.level}</span>
            </div>
          )}
        </div>

        <nav className="game-nav">
          <button
            className={`nav-btn ${showProfile ? "active" : ""}`}
            onClick={() => setShowProfile(!showProfile)}
          >
            👤 Profile
          </button>
          <button
            className={`nav-btn ${showStats ? "active" : ""}`}
            onClick={() => setShowStats(!showStats)}
          >
            📊 Stats
          </button>
          <button
            className={`nav-btn ${showLeaderboard ? "active" : ""}`}
            onClick={() => setShowLeaderboard(!showLeaderboard)}
          >
            🏆 Leaderboard
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </header>

      <main className="game-main">
        {showProfile && <PlayerProfile profile={userProfile} />}
        {showStats && <GameStats token={token} />}
        {showLeaderboard && <Leaderboard players={players} />}

        {!gameStarted && !showProfile && !showStats && !showLeaderboard && (
          <GameMenu
            onStartGame={startGameRound}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            userProfile={userProfile}
          />
        )}

        {gameStarted && !gameOver && current && (
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

            <ChallengeCard
              challenge={current}
              feedback={feedback}
              onAnswer={handleAnswer}
              difficulty={difficulty}
            />
          </div>
        )}

        {gameOver && (
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
                <button className="btn btn-primary" onClick={handleRestart}>
                  🔄 Play Again
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setGameStarted(false)}
                >
                  🏠 Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
