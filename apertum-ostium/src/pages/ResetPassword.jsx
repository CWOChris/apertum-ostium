import { useState } from "react";
import { getSecurityQuestion, resetPassword } from "../db/indexedDB";
import { useNavigate, Link } from "react-router-dom";  // ✅ Import Link for "Back to Login"

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const fetchSecurityQuestion = async () => {
    const question = await getSecurityQuestion(username);
    if (question) {
      setSecurityQuestion(question);
      setMessage(null);
    } else {
      setMessage("User not found.");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const result = await resetPassword(username, securityAnswer, newPassword);
    setMessage(result.message);

    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {message && <p className="text-red-500">{message}</p>}
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" />
      <button onClick={fetchSecurityQuestion} className="bg-blue-500 text-white px-2 py-1 rounded mt-2">Get Security Question</button>
      
      {securityQuestion && <p className="mt-2"><strong>Security Question:</strong> {securityQuestion}</p>}
      
      {securityQuestion && (
        <>
          <input type="text" placeholder="Answer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} className="w-full p-2 border rounded mt-2" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded mt-2" />
          <button onClick={handleReset} className="bg-green-500 text-white px-2 py-1 rounded mt-2">Reset Password</button>
        </>
      )}

      {/* ✅ Add a Back to Login Link */}
      <div className="mt-4 text-center">
        <Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};

export default ResetPassword;
