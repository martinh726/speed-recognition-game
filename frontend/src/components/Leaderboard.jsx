function Leaderboard({ players }) {
  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Player</th>
            <th>High Score</th>
            <th>Avg Reaction Time</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.user}>
              <td>{player.user}</td>
              <td>{player.high_score}</td>
              <td>{player.average_reaction_time.toFixed(2)}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
