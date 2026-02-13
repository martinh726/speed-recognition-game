import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./App.css";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import GamePage from "./components/GamePage";
import Leaderboard from "./components/Leaderboard";
import PlayerProfile from "./components/PlayerProfile";
import GameStats from "./components/GameStats";
import GameHistory from "./components/GameHistory";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main className="game-main">{children}</main>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginForm />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GamePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Leaderboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PlayerProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GameStats />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GameHistory />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
