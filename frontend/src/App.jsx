import { useEffect, useState } from "react";
import Leaderboard from "./components/Leaderboard";
import ChallengeCard from "./components/ChallengeCard";
import LoginForm from "./components/LoginForm";

function App() {
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [username, setUsername] = useState("");

  // Fetch challenges from the API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/challenges/")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      });
  }, [loggedIn]); // runs useEffect /fetch challenges if loggedIn state changes

  // Fetch username from the API
  const fetchUsername = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/current-user/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
      });
  };

  useEffect(() => {
    if (loggedIn) {
      fetchUsername();
    }
  }, [loggedIn]);

  // Fetch player leaderboard data
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/player-profile/")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
      });
  }, []);

  // Restart game from beginning
  const handleRestart = () => {
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setFeedback("");
  };

  // When player selects a category
  const handleAnswer = (selectedCategory) => {
    const currentChallenge = challenges[currentIndex];
    if (!currentChallenge) return;

    const payload = {
      challenge_id: currentChallenge.id,
      selected_category: selectedCategory,
    };

    fetch("http://127.0.0.1:8000/api/submit/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Submitted:", data);

        if (data.correct) {
          setScore(score + 1);
          setFeedback("✅ Correct!");
        } else {
          setFeedback(
            `❌ Oops! The correct answer was: ${data.correct_category}`
          );
        }

        // Delay 1.1 seconds, then go to next or end
        setTimeout(() => {
          setFeedback("");

          if (currentIndex + 1 < challenges.length) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setGameOver(true);

            // Update backend with final score
            fetch("http://127.0.0.1:8000/api/update-stats/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({ score }),
            })
              .then((res) => res.json())
              .then((data) => console.log("Stats updated:", data));
          }
        }, 1100);
      });
  };
  // Logout to clear token and reset state
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
    setUsername("");
    setScore(0);
    setCurrentIndex(0);
  };

  if (!loggedIn) {
    return <LoginForm onLogin={() => setLoggedIn(true)} />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const current =
    currentIndex < challenges.length ? challenges[currentIndex] : null;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧠 Speed Recognition Game</h1>
      {username && <p>Welcome, {username}!</p>}
      <p>Score: {score}</p>

      {!gameOver && current ? (
        <ChallengeCard
          challenge={current}
          feedback={feedback}
          onAnswer={handleAnswer}
        />
      ) : (
        <div>
          <p>No more challenges!</p>
          <button onClick={handleRestart}>Restart Game</button>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => setShowLeaderboard(!showLeaderboard)}>
            {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
          </button>
          {showLeaderboard && <Leaderboard players={players} />}
        </div>
      )}
    </div>
  );
}

export default App;
