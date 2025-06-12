import { useEffect, useState } from "react";

function App() {
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // 👈 New
  const [score, setScore] = useState(0); // 👈 Optional (bonus)
  const [loading, setLoading] = useState(true); // 👈 Show loading while fetching

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/challenges/")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false); // ✅ Done loading
      });
  }, []);

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

        // ✅ OPTIONAL: update score if correct
        if (data.correct) {
          setScore(score + 1);
        }

        // ✅ Move to next challenge
        if (currentIndex + 1 < challenges.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          alert("🎉 All done! Your score: " + score);
        }
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
        </div>
      ) : (
        <p>No more challenges!</p>
      )}
    </div>
  );
}

export default App;
