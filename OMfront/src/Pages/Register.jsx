import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPassword: "",
    budget: 0,
    photo: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // React Router'dan yönlendirme hook'u

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      customerType: "Standard", 
      totalSpent: 0,           
    };

    try {
      const response = await fetch("http://localhost:5132/api/Customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSuccessMessage("Registration successful!");
      setError("");
      console.log("Registration successful:", data);

      // Yönlendirme
      setTimeout(() => {
        navigate("/"); // "/" sayfasına yönlendirme
      }, 2000); // 2 saniye bekleme süresi
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-body">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <label htmlFor="customerName">Name</label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="customerPassword">Password</label>
        <input
          type="password"
          id="customerPassword"
          name="customerPassword"
          value={formData.customerPassword}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="budget">Budget</label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          min="0"
          required
        />

        <label htmlFor="photo">Photo URL</label>
        <input
          type="text"
          id="photo"
          name="photo"
          value={formData.photo}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
