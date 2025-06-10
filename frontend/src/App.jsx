import { useEffect, useState } from "react";

function App() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/challenges/")
      .then((res) => res.json())
      .then((data) => setChallenges(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1> Speed Recognition Game</h1>
      <ul>
        {challenges.map((item) => (
          <li key={item.id}>
            <strong>{item.prompt}</strong> – {item.type} –{" "}
            {item.correct_category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
