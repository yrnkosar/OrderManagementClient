import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {AuthProvider} from "./AuthContext";
import './App.css'
import React from "react";
import Login from './Pages/LoginPage.jsx';
import AdminDashboard from "./Pages/AdminDashboard";
import HomePage from "./Pages/HomePage";
import CustomerPanel from "./Pages/CustomerPanel";
import ProductPanel from "./Pages/ProductPanel.jsx";
import ViewOrders from "./Pages/ViewOrders.jsx";
import MyOrders from "./Pages/MyOrders.jsx";

function App() {
    return (
     
     <Router> 
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/customer-panel" element={<CustomerPanel />} />      
        <Route path="/product-list" element={<ProductPanel />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/view-orders" element={<ViewOrders />} />
       </Routes>
       </AuthProvider>
    </Router>
    

  )
}

export default App
