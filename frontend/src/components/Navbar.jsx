import { useState } from "react";
import "./Navbar.css";

function Navbar({
  userProfile,
  onProfileClick,
  onStatsClick,
  onLeaderboardClick,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleProfileClick = () => {
    onProfileClick();
    closeMenu();
  };

  const handleStatsClick = () => {
    onStatsClick();
    closeMenu();
  };

  const handleLeaderboardClick = () => {
    onLeaderboardClick();
    closeMenu();
  };

  const handleLogoutClick = () => {
    onLogout();
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brain-emoji">🧠</span>
          <span className="brand-text">Speed Recognition Game</span>
        </div>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <div className="navbar-nav">
            <button className="nav-btn" onClick={handleProfileClick}>
              👤 Profile
            </button>
            <button className="nav-btn" onClick={handleStatsClick}>
              📊 Stats
            </button>
            <button className="nav-btn" onClick={handleLeaderboardClick}>
              🏆 Leaderboard
            </button>
            <button className="nav-btn logout-btn" onClick={handleLogoutClick}>
              🚪 Logout
            </button>
          </div>

          {userProfile && (
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <div className="user-details">
                <div className="user-name">
                  {userProfile.user?.username || "User"}
                </div>
                <div className="user-level">Level {userProfile.level || 1}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
