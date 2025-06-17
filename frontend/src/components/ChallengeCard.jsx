function ChallengeCard({ challenge, onAnswer, feedback }) {
  return (
    <div>
      {feedback && <p style={{ fontWeight: "bold" }}>{feedback}</p>}
      <p>
        <strong>{challenge.prompt}</strong> — {challenge.type}
      </p>
      <button onClick={() => onAnswer("Animal")}>Animal</button>
      <button onClick={() => onAnswer("Object")}>Object</button>
      <button onClick={() => onAnswer("Shape")}>Shape</button>
    </div>
  );
}

export default ChallengeCard;
