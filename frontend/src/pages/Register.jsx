import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../utils/registerHelpers.js";
import RegisterUI from "../components/register/RegisterUI.jsx";

// ---------------------- REGISTRATION PAGE ----------------------
function Register() {
  const navigate = useNavigate();

  // States
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    await registerUser({ email, username, password, confirmPassword, setError, navigate });
  };

  return (
    <RegisterUI
      email={email}
      setEmail={setEmail}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      error={error}
      setError={setError}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      handleRegister={handleRegister}
    />
  );
}

export default Register;
