import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "../styles/MyOrders.css";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = auth?.token || localStorage.getItem("authToken");
      const customerId = auth?.customerId || localStorage.getItem("customerId");

      if (!token || !customerId) {
        setError("User is not authenticated. Please log in.");
        return;
      }

      try {console.log(auth?.token); 
        const response = await fetch(
          `http://localhost:5132/api/Order/my-orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      }
    };

    fetchOrders();
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
            </tr>
          </thead>
          <tbody>
  {orders.map((order) => {
    const progress = getProgressPercentage(order.orderStatus);

    return (
      <tr key={order.orderId}>
        <td>{order.orderId}</td>
        <td>{order.product.productName}</td>
        <td>{order.quantity}</td>
        <td>${order.totalPrice}</td>
        <td>{order.orderStatus}</td>
        <td>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ "--progress-width": `${progress}%` }}
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
