// Function to register users
export async function registerUser({ email, username, password, confirmPassword, setError, navigate }) {
    // All fields are filled
    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Email is not valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Username is wrong length
    if (username.length < 2 || username.length > 64) {
      setError("Username must be between 2 and 64 characters");
      return;
    }

    // Password and confirm password don't match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Password is wrong length
    if (password.length < 8 || password.length > 64) {
      setError("Password must be between 8 and 64 characters");
      return;
    }

    // Password is not varied enough
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).*$/
    if (!passwordRegex.test(password)) {
      setError("Password must contain uppercase letters, lowercase letters, at least one number and a special character");
      return;
    }

    // Sending registration request
    try {
      const response = await fetch("http://localhost:5000/api/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      navigate("/"); 
    } catch (error) {
      console.error("Error registering:", error);
      setError("Network error.");
    }
}
