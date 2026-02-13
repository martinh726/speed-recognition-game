import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brain-emoji">🧠</span>
          <span className="brand-text">Speed Recognition</span>
        </NavLink>

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
            <NavLink to="/" className="nav-link" onClick={closeMenu} end>
              🏠 Home
            </NavLink>
            <NavLink to="/leaderboard" className="nav-link" onClick={closeMenu}>
              🏆 Leaderboard
            </NavLink>
            <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
              👤 Profile
            </NavLink>
            <NavLink to="/stats" className="nav-link" onClick={closeMenu}>
              📊 Stats
            </NavLink>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>

          {user && (
            <div className="user-info">
              <span className="user-avatar">{user.avatar || "👤"}</span>
              <div className="user-details">
                <div className="user-name">
                  {user.user?.username || user.username || "User"}
                </div>
                <div className="user-level">Level {user.level || 1}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
