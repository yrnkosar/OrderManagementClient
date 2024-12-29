import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "../styles/MyOrders.css";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    const fetchOrdersAndLogs = async () => {
      const token = auth?.token || localStorage.getItem("authToken");

      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }

      try {
        const orderResponse = await fetch(
          `http://localhost:5132/api/Order/my-orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!orderResponse.ok) {
          throw new Error(`HTTP error! Status: ${orderResponse.status}`);
        }

        let ordersData = await orderResponse.json();
       
    ordersData = ordersData.sort((a, b) => {
      if (a.orderStatus.toLowerCase() === "processing" && b.orderStatus.toLowerCase() !== "processing") {
        return -1;
      }
      if (a.orderStatus.toLowerCase() !== "processing" && b.orderStatus.toLowerCase() === "processing") {
        return 1;
      }
      return b.orderId - a.orderId;
    });
        setOrders(ordersData);
  

        const logResponse = await fetch(
          `http://localhost:5132/api/Log/my-logs`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!logResponse.ok) {
          throw new Error(`HTTP error! Status: ${logResponse.status}`);
        }

        const logsData = await logResponse.json();
        setLogs(logsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchOrdersAndLogs();

    const interval = setInterval(() => {
      fetchOrdersAndLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [auth]);

  const getLogDetailsForOrder = (orderId) => {
    const log = logs.find((log) => log.orderId === orderId && log.logType === "Hata");
    if (log) {
      const startIndex = log.logDetails.indexOf("Sebep:");
      return startIndex !== -1 ? log.logDetails.substring(startIndex) : "No details available.";
    }
    return "No details available.";
  };

  
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


  return (
    <div className="my-orders-body">
        <div className="my-orders-panel">
      <h1 className="my-orders-title">My Orders</h1>
      {error && <p className="my-orders-error">{error}</p>}
      {orders.length > 0 ? (
        <table className="my-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Date</th>
              <th>Photo</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
  {orders.map((order) => {
    const progress = getProgressPercentage(order.orderStatus);
    const progressClass = getProgressClass(order.orderStatus); 
            
    const logDetails =
    order.orderStatus.toLowerCase() === "cancelled"
      ? getLogDetailsForOrder(order.orderId)
      : null;
    return (
      <tr key={order.orderId}>
        <td>{order.orderId}</td>
        <td>{order.product.productName}</td>
        <td>{order.quantity}</td>
        <td>${order.totalPrice}</td>
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
        <td>{new Date(order.orderDate).toLocaleString()}</td>
        <td>
          <img
            src={order.product.photo}
            alt={order.product.productName}
            style={{ width: "100px", height: "100px", objectFit: "contain" }}
          />
        </td>
        <td>{logDetails || "-"}</td>
      </tr>
    );
  })}
</tbody>
        </table>
      ) : (
        <p className="my-orders-empty">You have no orders yet.</p>
      )}
    </div>
    </div>
  );
};

export default MyOrdersPage;
