import React, { useState } from "react";
import "../styles/Login.css"; // Özel stiller için bir CSS dosyası
import { useNavigate } from "react-router-dom"; // Yönlendirme için

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(""); // Hata mesajlarını saklamak için
  const [loading, setLoading] = useState(false); // Yüklenme durumu
  const navigate = useNavigate(); // useNavigate tanımlandı!

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Hata durumunu temizle

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
        // Yanıt başarısızsa hata mesajını işle
        const errorData = await response.json();
        throw new Error(errorData || "Login failed.");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Token'ı localStorage'a kaydedin
      localStorage.setItem("authToken", data.Token);
      navigate("/home"); // Ana sayfaya yönlendirme

    } catch (error) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Log in to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
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
  );
};

export default LoginPage;
