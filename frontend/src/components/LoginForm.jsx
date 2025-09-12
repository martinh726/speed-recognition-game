import { useState } from "react";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("accessToken", data.access);
          onLogin();
        } else {
          setError("Invalid username or password");
        }
      } else {
        // Register
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          setError("");
          setIsLogin(true);
          // Auto-login after registration
          const loginResponse = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          if (loginResponse.ok) {
            const data = await loginResponse.json();
            localStorage.setItem("accessToken", data.access);
            onLogin();
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Registration failed");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
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

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              <>
                <span className="btn-icon">
                  {isLogin ? '🚀' : '✨'}
                </span>
                {isLogin ? 'Login' : 'Create Account'}
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
