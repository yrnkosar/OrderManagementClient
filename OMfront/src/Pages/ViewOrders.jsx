import React, { useState, useEffect } from "react";
import "../styles/ViewOrders.css"; // Stil dosyası isteğe bağlı
import { useAuth } from "../AuthContext.jsx";

const ViewOrders = () => {
  
  const { auth, logout } = useAuth(); // AuthContext'ten auth ve logout'u al
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth?.token) {
        console.error("Token bulunamadı.");
        return;
      }
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5132/api/Order/all-orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          });
          
        if (!response.ok) {
          throw new Error("Veri alınırken bir hata oluştu!");
        }

        const data = await response.json();

        const sortedOrders = data.sort((a, b) => b.orderId - a.orderId);
        
        setOrders(sortedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => {
      clearInterval(interval);
    };

  }, []);
  const getProgressPercentage = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 25;
      case "processing":
        return 75;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  const getProgressClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "pending";
      case "processing":
        return "processing";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "";
    }
  };

  if (loading) return <div className="order-body"><p>Yükleniyor...</p></div>;
  if (error) return <div className="order-body"><p className="order-error">Hata: {error}</p></div>;

  return (
    <div className="order-body">
      <div className="order-panel">
        <h1>Siparişler</h1>
        {orders.length === 0 ? (
          <p>Hiç sipariş bulunmamaktadır.</p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Sipariş ID</th>
                <th>Müşteri Adı</th>
                <th>Ürün</th>
                <th>Adet</th>
                <th>Toplam Fiyat</th>
                <th>Durum</th>
                <th>Progress</th>
                <th>Waiting Time</th>
                <th>Priority Score</th>
                <th>Tarih</th>
                <th>Ürün Görseli</th>
              </tr>
            </thead>
            <tbody>
            {orders.map((order) => {
               const progress = getProgressPercentage(order.orderStatus);
               const progressClass = getProgressClass(order.orderStatus); 
               return (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customer.customerName}</td>
                    <td>{order.product.productName}</td>
                    <td>{order.quantity}</td>
                    <td>{order.totalPrice} TL</td>
                    <td>{order.orderStatus}</td>
                    <td>
                    <div className="order-progress-bar-container">
                      <div
                        className={`order-progress-bar ${progressClass}`}
                        style={{ width: `${progress}%` }}
                      >
                        {progress}%
                      </div>
                    </div>
                  </td>
                    <td>{order.waitingTime} mins</td>
                    <td>{order.priorityScore}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>
                      <img
                        src={order.product.photo}
                        alt={order.product.productName}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;
