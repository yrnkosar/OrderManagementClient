import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css'
import React from "react";
import Login from './Pages/LoginPage.jsx';
function App() {
    return (
      <Router>
      
      <Routes>
        <Route path="/" element={<Login />} /> 
        
       </Routes>
    </Router>

  )
}

export default App
