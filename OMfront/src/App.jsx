import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from './AuthContext.jsx';
import './App.css'
import React from "react";
import Login from './Pages/LoginPage.jsx';
import AdminDashboard from "./Pages/AdminDashboard";
import HomePage from "./Pages/HomePage";
function App() {
    return (
      <AuthProvider>
     <Router>
      
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
       </Routes>
    </Router>
    </AuthProvider>

  )
}

export default App
