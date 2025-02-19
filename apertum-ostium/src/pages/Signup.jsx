import { useState } from "react";
import { registerUser } from "../db/indexedDB";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await registerUser(username, password, role, securityQuestion, securityAnswer);
    setMessage(result.message);
    
    if (result.success) navigate("/login");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {message && <p className="text-gray-700">{message}</p>}
      <form onSubmit={handleSignup} className="space-y-3">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
          <option value="user">Regular User</option>
          <option value="admin">Administrator</option>
          <option value="super-user">Super User</option>
        </select>
        <input type="text" placeholder="Security Question" value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Security Answer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
