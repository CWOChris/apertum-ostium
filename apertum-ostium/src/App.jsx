import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Log from "./pages/Log";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { logoutUser, getLoggedInUser } from "./db/indexedDB";

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          {!getLoggedInUser() ? (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/log" className="ml-4">View Logs</Link>
              <button onClick={() => { logoutUser(); window.location.reload(); }} className="ml-4 bg-red-500 text-white px-2 py-1 rounded">Logout</button>
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
