import { useState } from "react";
import { getSecurityQuestion, resetPassword } from "../db/indexedDB";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const fetchSecurityQuestion = async () => {
    const question = await getSecurityQuestion(username);
    if (question) setSecurityQuestion(question);
    else setMessage("User not found.");
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const result = await resetPassword(username, securityAnswer, newPassword);
    setMessage(result.message);

    if (result.success) navigate("/login");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {message && <p>{message}</p>}
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={fetchSecurityQuestion}>Get Security Question</button>
      {securityQuestion && <p>Security Question: {securityQuestion}</p>}
      {securityQuestion && (
        <>
          <input type="text" placeholder="Answer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button onClick={handleReset}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
