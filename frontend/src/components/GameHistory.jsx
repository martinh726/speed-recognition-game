import { useEffect, useState } from "react";

function GameHistory({ token }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/game-history/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>{ 
      console.log(data)  // Log the data to check its structure  
      setHistory(data)})
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <h2>Your Game History</h2>
      <ul>
        {history.map((session) => (
          <li key={session.id}>
            Game #{session.id}:{" "}
            {session.correct ? "✅ Correct" : "❌ Incorrect"} —
            {session.reaction_time}s at{" "}
            {new Date(session.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameHistory;
