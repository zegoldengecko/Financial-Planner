import { useState } from "react";
import { login } from "../utils/homeHelpers.js";
import { useNavigate } from "react-router-dom";
import HomeUI from "../components/home/HomeUI.jsx";

// ---------------------- HOME PAGE FOR LOGIN ----------------------
function Home() {
  const navigate = useNavigate();

  // States
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await login({ username, password, setError, navigate });
  };

  return (
     <HomeUI
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        error={error}
        setError={setError}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleLogin={handleLogin}
      />
  );
}

export default Home;
