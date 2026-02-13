import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="game-logo">
            <span className="logo-emoji">🧠</span>
            <h1>Speed Recognition Game</h1>
          </div>
          <p className="login-subtitle">
            Test your brain's reaction time and accuracy!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-tabs">
            <button
              type="button"
              className={`tab-btn ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={`tab-btn ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                {isLogin ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              <>
                <span className="btn-icon">
                  {isLogin ? "🚀" : "✨"}
                </span>
                {isLogin ? "Login" : "Create Account"}
              </>
            )}
          </button>
        </form>

        <div className="login-features">
          <h3>Game Features</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Fast-paced challenges</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🧠</span>
              <span>Brain training exercises</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span>Leaderboards & achievements</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Detailed progress tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
