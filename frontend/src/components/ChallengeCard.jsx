import { useState, useEffect } from "react";

function ChallengeCard({ challenge, onAnswer, feedback, difficulty }) {
  const [timeLeft, setTimeLeft] = useState(challenge?.time_limit || 5);
  const [startTime, setStartTime] = useState(null);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (challenge) {
      setTimeLeft(challenge.time_limit);
      setStartTime(Date.now());
      setTimerActive(true);
    }
  }, [challenge]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 0.1);
      }, 100);
    } else if (timeLeft <= 0 && timerActive) {
      // Time's up - submit a random answer
      const randomCategory = challenge?.all_categories?.[Math.floor(Math.random() * challenge.all_categories.length)];
      if (randomCategory) {
        const reactionTime = challenge.time_limit;
        onAnswer(randomCategory.name, reactionTime);
        setTimerActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, challenge, onAnswer]);

  const handleCategoryClick = (categoryName) => {
    if (!timerActive) return;
    
    const reactionTime = startTime ? (Date.now() - startTime) / 1000 : 0;
    setTimerActive(false);
    onAnswer(categoryName, reactionTime);
  };

  if (!challenge) return null;

  const progressPercentage = (timeLeft / challenge.time_limit) * 100;
  const isLowTime = timeLeft < 2;

  return (
    <div className="challenge-card">
      <div className="challenge-type">{challenge.type}</div>
      
      <div className="timer-container">
        <div className="timer-bar">
          <div 
            className={`timer-progress ${isLowTime ? 'low-time' : ''}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className={`timer-text ${isLowTime ? 'low-time' : ''}`}>
          {timeLeft.toFixed(1)}s
        </div>
      </div>

      <div className="challenge-prompt">
        {challenge.prompt}
      </div>

      {feedback && (
        <div className={`feedback ${feedback.includes('✅') ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}

      <div className="categories-grid">
        {challenge.all_categories?.map((category) => (
          <button
            key={category.id}
            className="category-btn"
            onClick={() => handleCategoryClick(category.name)}
            disabled={!timerActive}
            style={{ 
              background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
              opacity: timerActive ? 1 : 0.6
            }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="difficulty-indicator">
        <span className={`difficulty-badge difficulty-${difficulty}`}>
          {difficulty.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default ChallengeCard;
