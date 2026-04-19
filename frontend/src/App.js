import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Activities from './pages/Activities';
import Challenges from './pages/Challenges';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider, useAuth } from './hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-fitness-primary">🏋️ FitTrack</Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-fitness-primary">Dashboard</Link>
          <Link to="/activities" className="hover:text-fitness-primary">Activities</Link>
          <Link to="/challenges" className="hover:text-fitness-primary">Challenges</Link>
          {user?.isAdmin && <Link to="/admin" className="hover:text-fitness-primary">Admin</Link>}
          {user ? (
            <>
              <span>Hi, {user.username}</span>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-fitness-primary text-white px-4 py-2 rounded hover:bg-fitness-secondary">Login</Link>
              <Link to="/register" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-primary/10 to-fitness-secondary/10">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

