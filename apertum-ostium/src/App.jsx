import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Log from "./pages/Log";

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/log">View Logs</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log" element={<Log />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;