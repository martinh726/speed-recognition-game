import { useEffect, useState } from "react";

function App() {
  const [challenges, setChallenges] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/challenges/")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setCurrent(data[0]);
      });
  }, []);

  const handleAnswer = (selectedCategory) => {
    if (!current) return;

    const payload = {
      challenge_id: current.id,
      selected_category: selectedCategory,
    };

    fetch("http://127.0.0.1:8000/api/submit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from backend:", data);
        alert("Answer submitted! ✅");
      });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧠 Speed Recognition Game</h1>

      {current ? (
        <div>
          <p>
            <strong>{current.prompt}</strong> — {current.type}
          </p>
          <div>
            <button onClick={() => handleAnswer("Animal")}>Animal</button>
            <button onClick={() => handleAnswer("Object")}>Object</button>
            <button onClick={() => handleAnswer("Shape")}>Shape</button>
          </div>
        </div>
      ) : (
        <p>Loading challenge...</p>
      )}
    </div>
  );
}

export default App;
