// Function to log a user in
export async function login({ username, password, setError, navigate }) {
    // username or password not entered
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      // Call backend API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      // If login fails
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Clear error messages
      setError("");
      localStorage.setItem("token", data.token);

      // Navigate to planner page
      navigate("/planner", { state: { user: data.user } });
    } catch (error) {
      console.error("Error calling backend:", error);
      setError("Network error. Please try again.");
    }
}
