import { useEffect, useState } from "react";

function App() {
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  // Fetch challenges on first load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/challenges/")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      });
  }, []);

  // Restart game from beginning
  const handleRestart = () => {
    setScore(0);
    setCurrentIndex(0);
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

        // Delay 1.5 seconds, then clear feedback and go to next
        setTimeout(() => {
          setFeedback(""); // clear message

          if (currentIndex + 1 < challenges.length) {
            setCurrentIndex(currentIndex + 1);
          } else {
            alert("🎉 All done! Your score: " + score);
          }
        }, 1500);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const current = challenges[currentIndex];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧠 Speed Recognition Game</h1>
      <p>Score: {score}</p>

      {current ? (
        <div>
          <p>
            <strong>{current.prompt}</strong> — {current.type}
          </p>
          <button onClick={() => handleAnswer("Animal")}>Animal</button>
          <button onClick={() => handleAnswer("Object")}>Object</button>
          <button onClick={() => handleAnswer("Shape")}>Shape</button>
          {feedback && <p style={{ fontWeight: "bold" }}>{feedback}</p>}
        </div>
      ) : (
        <>
          <p>No more challenges!</p>
          <button onClick={handleRestart}>Restart Game</button>
        </>
      )}
    </div>
  );
}

export default App;
