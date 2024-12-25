import React, { useEffect, useState } from "react";
import "../styles/CustomerPanel.css"; // İsteğe bağlı özel stil
import { useAuth } from "../AuthContext.jsx";

const CustomerPanel = () => {
  const { auth, logout } = useAuth(); // AuthContext'ten auth ve logout'u al
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    if (!auth?.token) {
      console.error("Token bulunamadı.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5132/api/Customer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.status === 401) {
        console.error("Yetkilendirme hatası.");
        logout(); // Eğer token geçersizse kullanıcıyı çıkış yap
        return;
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="customer-body">
    <div className="customer-panel">
      <h1>Customer Panel</h1>
      {loading && <p>Loading customers...</p>}
      {error && <p className="customer-error">{error}</p>}
      {!loading && !error && (
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Budget</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.customerName}</td>
                <td>{customer.customerType}</td>
                <td>{customer.budget}</td>
                <td>{customer.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  );
};

export default CustomerPanel;
