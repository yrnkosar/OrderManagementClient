import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // AuthContext'ten kullanıcı bilgilerini almak için

const AdminDashboard = () => {
  const { user } = useAuth(); // Kullanıcı bilgilerini alıyoruz
  const navigate = useNavigate();

  // Eğer kullanıcı admin değilse, home sayfasına yönlendirelim.
  if (!user || user.customerType !== "Admin") {
    navigate("/home"); // Admin olmayan bir kullanıcı home sayfasına yönlendiriliyor
    return null; // Yönlendirme işlemi yapıldıktan sonra bir şey render edilmez
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.username}!</p>
      <p>Here you can manage users, settings, etc.</p>
      
      {/* Yönetim paneli özellikleri eklenebilir */}
      <div>
        <button onClick={() => alert("Manage Users")}>Manage Users</button>
        <button onClick={() => alert("Settings")}>Settings</button>
        <button onClick={() => alert("Logs")}>View Logs</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
