import React from "react";
import { Link } from "react-router-dom";

const RegisterUI = ({ email, setEmail, username, setUsername, password, setPassword, confirmPassword, setConfirmPassword, error, setError, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, handleRegister }) => {
    return ( 
    <div style={{
      backgroundColor: "#dbeeff",
      border: "5px solid #003366",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
      textAlign: "center"
    }}>
        <h1>REGISTER ACCOUNT</h1>
        
        {/* Email input */}
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setError("")} 
            style={{
            marginTop: "20px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #003366",
            width: "250px"
            }}
        />

        {/* Username input */}
        <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onFocus={() => setError("")} 
        style={{
            marginTop: "20px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #003366",
            width: "250px"
        }}
        />

        {/* Password input */}
        <div style={{ position: "relative", marginTop: "20px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setError("")} 
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #003366",
              width: "250px",
              textAlign: "left",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "-70px",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "6px 10px",
              backgroundColor: "#003366",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div style={{ position: "relative", marginTop: "20px" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setError("")} 
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #003366",
              width: "250px",
              textAlign: "left",
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              right: "-70px",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "6px 10px",
              backgroundColor: "#003366",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Register Button */}
        <button
        onFocus={() => setError("")} 
        onClick={handleRegister}
        style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#003366",
            color: "white",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer"
        }}
        >
        Register
        </button>
    
        {/* Login link */}
        <p style={{ marginTop: "16px", fontSize: "14px" }}>
            <Link to="/" style={{
            color: "#003366",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "bold"
            }}>
            Already have an account? Login
            </Link>
        </p>

        {/* Error Message */}
        {error && (
          <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
            {error}
          </p>
        )}
    </div>
    );
}

export default RegisterUI;