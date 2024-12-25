import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../styles/ViewLogs.css"; // You can style the page here

const ViewLogs = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || role !== "Admin") {
      navigate("/"); // Redirect to home if not admin
    }

    fetchLogs();
  }, [user, role, navigate]);

  const fetchLogs = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:5132/api/Log", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        console.error("Error fetching logs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || role !== "Admin") {
    return null; // If not admin, don't show the page
  }

  return (
    <div className="logs-body">
    <div className="logs-panel">
      <h1 className="logs-heading">System Logs</h1>
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <div className="logs-table">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.logId} className="log-item">
                <p><strong>Log ID:</strong> {log.logId}</p>
                <p><strong>Order ID:</strong> {log.orderId}</p>
                <p><strong>Customer ID:</strong> {log.customerId}</p>
                <p><strong>Log Date:</strong> {new Date(log.logDate).toLocaleString()}</p>
                <p><strong>Log Type:</strong> {log.logType}</p>
                <p><strong>Details:</strong> {log.logDetails}</p>
                <p><strong>Customer Type:</strong> {log.customerType}</p>
                <p><strong>Product Name:</strong> {log.productName}</p>
                <p><strong>Quantity:</strong> {log.quantity}</p>
                <p><strong>Result:</strong> {log.result}</p>
              </div>
            ))
          ) : (
            <p>No logs available.</p>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default ViewLogs;
