import { useState } from "react";
import { registerUser } from "../db/indexedDB";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("What is your favorite color?");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await registerUser(username, password, securityQuestion, securityAnswer);
    setMessage(result.message);

    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {message && <p className="text-gray-700">{message}</p>}
      <form onSubmit={handleSignup} className="space-y-3">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Security Answer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
