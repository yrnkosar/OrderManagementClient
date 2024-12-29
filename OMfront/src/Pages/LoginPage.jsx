import React, { useState } from "react";
import { useAuth } from "../AuthContext"; 
import "../styles/Login.css"; 
import { useNavigate } from "react-router-dom"; 
import jwtDecode from "jwt-decode";

const LoginPage = () => {
  const { setAuthTokenAndUser, setUser, setRole, setUserDetails } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5132/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CustomerName: formData.username,
          Password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const data = await response.json();
      console.log("Parsed response data:", data);  

      const decoded = jwtDecode(data.token);

      
      setAuthTokenAndUser(data.token);
      setUser(decoded); 
      setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      setUserDetails(data); 

    
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log("User Role:", role);

      if (role === "Admin") {
        console.log("Navigating to Admin Dashboard");
        navigate("/admin-dashboard");
      } else if (role === "Standard"|| role === "Premium") {
        console.log("Navigating to Home");
        navigate("/home");
      } else {
        console.log("Role not recognized.");
        setError("Role not recognized.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Log in to continue</p>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="username" className="login-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="login-input"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="login-input"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="login-error-message">{error}</p>}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <div className="login-footer">
            <p>
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default LoginPage;


