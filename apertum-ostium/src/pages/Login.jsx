import { useState } from "react";
import { loginUser, setLoggedInUser } from "../db/indexedDB";
import { useNavigate, Link } from "react-router-dom";  // ✅ Import Link for navigation

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(username, password);

    if (result.success) {
      setLoggedInUser(username);
      setUser(username);
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-3">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>

      {/* ✅ Forgot Password Link */}
      <div className="mt-4 text-center">
        <Link to="/reset-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default Login;
