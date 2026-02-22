import React from "react";
import { Link } from "react-router-dom";

const HomeUI = ({ username, setUsername, password, setPassword, error, setError, showPassword, setShowPassword, handleLogin }) => {
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
        <h1>WELCOME TO THE FINANCIAL PLANNER</h1>

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

        
        {/* Login button*/}
        <button
        onFocus={() => setError("")} 
        onClick={handleLogin}
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
        Login
        </button>

        {/* Registration link */}
        <p style = {{ marginTop: "16px", fontSize: "14px" }}>
        <Link
            to="/register"
            style = {{
            color: "#003366",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "bold"
            }}
        >
            Don't have an account?
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
};

export default HomeUI;
