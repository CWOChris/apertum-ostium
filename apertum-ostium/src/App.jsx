import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Log from "./pages/Log";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { logoutUser, getLoggedInUser } from "./db/indexedDB";
import { useState, useEffect } from "react";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getLoggedInUser()); // Check if a user is logged in
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    window.location.reload(); // Reload to update UI
  };

  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          {!user ? (
            // Show Login/Signup when no user is logged in
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            // Show Home, View Logs, and Logout when logged in
            <>
              <Link to="/">Home</Link>
              <Link to="/log" className="ml-4">View Logs</Link>
              <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-2 py-1 rounded">Logout</button>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/log" element={<ProtectedRoute><Log /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
