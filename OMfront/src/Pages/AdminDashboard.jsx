import React , { useEffect }from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // AuthContext'ten kullanıcı bilgilerini almak için
import "../styles/AdminDashboard.css"; // Stil dosyası isteğe bağlı

const AdminDashboard = () => {
  const { user } = useAuth(); // Kullanıcı bilgilerini alıyoruz
  console.log(user);  // Burada user verisini kontrol edin.
  const navigate = useNavigate();
   // useEffect ile yönlendirme işlemini yapalım
   useEffect(() => {
    if (!user) {
      return; // Eğer kullanıcı verisi yoksa, render etmeden geç
    }

    if (user.customerType !== "Admin") {
      navigate("/home"); // Admin olmayan bir kullanıcı home sayfasına yönlendiriliyor
    }
  }, [user, navigate]); // user veya navigate değiştiğinde çalışır

  if (!user) {
    return null; // User verisi gelmediyse, hiçbir şey render edilmesin
  }

  if (user.customerType !== "Admin") {
    return null; // Admin olmayan bir kullanıcı render edilmesin
  }
  const handleCustomerPanelRedirect = () => {
    navigate("/customer-panel");
  };
  
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.username}!</p>
      <p>Here you can manage users, settings, etc.</p>
      
      {/* Yönetim paneli özellikleri eklenebilir */}
      <div>
      <button className="customer-panel-button" onClick={handleCustomerPanelRedirect}>
        Go to Customer Panel
      </button>
        <button onClick={() => alert("Settings")}>Settings</button>
        <button onClick={() => alert("Logs")}>View Logs</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
