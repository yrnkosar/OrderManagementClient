import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css'
import React from "react";
import Login from './Pages/LoginPage.jsx';
import HomePage from "./Pages/HomePage";
function App() {
    return (
      <Router>
      
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/home" element={<HomePage />} />
       </Routes>
    </Router>

  )
}

export default App
