import React, { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; 
import "../styles/AdminDashboard.css"; 
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const AdminDashboard = () => {
  const { user, role, logout } = useAuth(); 
  console.log(user);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [processingOrders, setProcessingOrders] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: 0,
    productName: "",
    stock: 0,
    price: 0,
    description: "",
    photo: ""
  });

  useEffect(() => {
    if (!user || role !== "Admin") {
      navigate("/"); 
    }

    fetchPendingOrders();
    fetchProducts();
   
    const interval = setInterval(() => {
      fetchPendingOrders();
    }, 5000); 

    return () => clearInterval(interval);

  }, [user, role, navigate]); 
  
  
  const fetchProducts = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:5132/api/Product", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Error fetching products:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPendingOrders = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:5132/api/Order/pending-orders", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingOrders(data);
      } else {
        console.error("Error fetching pending orders:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  const handleProcessAllOrders = async () => {
    const token = localStorage.getItem("authToken");
    setProcessing(true); 

    try {
      for (const order of pendingOrders) {
        const response = await fetch(
          `http://localhost:5132/api/Orders/Process/${order.id}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          console.log(`Order ${order.id} processed successfully.`);
        } else {
          console.error(`Error processing order ${order.id}:`, response.statusText);
        }
      }

      setPendingOrders([]);
      alert("All orders have been processed.");
    } catch (error) {
      console.error("Error processing orders:", error);
    } finally {
      setProcessing(false); 
    }
  };

  if (!user || role !== "Admin") {
    return null; 
  }

  const handleCustomerPanelRedirect = () => {
    navigate("/customer-panel");
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken"); 

    try {
      const response = await fetch("http://localhost:5132/api/Product", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        console.log("New product added:", addedProduct);
        setProducts((prevProducts) => [...prevProducts, addedProduct]); 
        setIsModalOpen(false); 
      } else {
        console.error("Error adding product:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const approveAllOrders = async () => {
    const token = localStorage.getItem("authToken");
    setProcessing(true); 

    try {
      const response = await fetch("http://localhost:5132/api/Order/approve-all-orders", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        alert("All orders approved successfully.");
        setPendingOrders([]); 
      } else {
        console.error("Error approving orders:", response.statusText);
      }
    } catch (error) {
      console.error("Error approving orders:", error);
    } finally {
      setProcessing(false); 
    }
  };

  
  const openModal = () => {
    setIsModalOpen(true);
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
  };


const getStockChartData = () => {
  const productNames = products.map(product => product.productName);
  const stockValues = products.map(product => product.stock);

  
  const backgroundColors = stockValues.map(stock => 
    stock < 100 ? "rgba(255, 99, 132, 0.2)" : "rgba(75, 192, 192, 0.2)"
  );

  const borderColors = stockValues.map(stock => 
    stock < 100 ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)"
  );

  return {
    labels: productNames,
    datasets: [
      {
        label: "Stock Levels",
        data: stockValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };
};

  return (
    <div className="admin-body"> 
    <div className="admin-page">

      <h1 className="admin-heading">Admin Dashboard</h1>
      
    
      <p className="admin-welcome">Welcome, {user.customerName}!</p>


      <div className="admin-stock-chart">
  <h2>Product Stock Levels</h2>
  {products.length > 0 ? (
    <Bar data={getStockChartData()} />
  ) : (
    <p>Loading product data...</p>
  )}
</div>
  
      <div className="admin-buttons">
        <button onClick={logout} className="admin-button">Logout</button>
        <button onClick={handleCustomerPanelRedirect} className="admin-button">Go to Customer Panel</button>
        <button onClick={() => navigate("/product-list")} className="admin-button">View Product List</button>
        <button onClick={() => navigate("/view-orders")} className="admin-button">View Orders</button>
        <button onClick={() => navigate("/view-logs")} className="admin-button">View Logs</button>
        <button onClick={openModal} className="admin-button">Add Product</button>
      </div>


      <div className="admin-pending-orders-section">
        <h2 className="admin-orders-heading">Pending Orders</h2>
        {pendingOrders.length > 0 ? (
          <div>
            <ul className="admin-orders-list">
              {pendingOrders.map((order) => (
                <li key={order.orderId} className="admin-order-item">
                  <p>Order ID: {order.orderId}</p>
                  <p>Customer: {order.customerId}</p>
                  <p>Total: ${order.totalPrice}</p>
                  <p>Waiting Time: {order.waitingTime} mins</p>
                  <p>Priority Score: {order.priorityScore}</p> 
                </li>
              ))}
            </ul>
           
            <button
              onClick={approveAllOrders}
              className="admin-approve-all-button"
            >
              Approve All Orders
            </button>
          </div>
        ) : (
          <p>No pending orders at the moment.</p>
        )}
      </div>

      
      {isModalOpen && (
        <div className="admin-modal open">
          <div className="admin-modal-content">
            <span className="admin-modal-close" onClick={closeModal}>
              &times;
            </span>
            <h2 className="admin-modal-header">Add New Product</h2>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <label>
                Product Name:
                <input
                  type="text"
                  name="productName"
                  placeholder="Enter product name"
                  value={newProduct.productName}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Stock Quantity:
                <input
                  type="number"
                  name="stock"
                  placeholder="Enter stock quantity"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Product Photo URL:
                <input
                  type="text"
                  name="photo"
                  placeholder="Enter product photo URL"
                  value={newProduct.photo}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit" className="admin-modal-submit">
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);
  
};

export default AdminDashboard;
