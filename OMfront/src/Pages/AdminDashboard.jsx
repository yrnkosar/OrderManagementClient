import React , { useEffect, useState  }from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; 
import "../styles/AdminDashboard.css"; 

const AdminDashboard = () => {
  const { user, logout } = useAuth(); // Kullanıcı ve çıkış fonksiyonu
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
    if (!user) {
       navigate("/"); 
    }

    if (user.customerType !== "Admin") {
      navigate("/home"); 
    }
  // Fetch pending orders
  fetchPendingOrders();
  }, [user, navigate]); 

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
    setProcessing(true); // İşlemin başladığını belirt

    try {
      // Tüm siparişleri tek tek işleyin
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

      // Tüm işlemler tamamlandıktan sonra listeyi temizle
      setPendingOrders([]);
      alert("All orders have been processed.");
    } catch (error) {
      console.error("Error processing orders:", error);
    } finally {
      setProcessing(false); // İşlemin bittiğini belirt
    }
  };

  if (!user) {
    return null; 
  }

  if (user.customerType !== "Admin") {
    return null; 
  }
  const handleCustomerPanelRedirect = () => {
    navigate("/customer-panel");
  };
    // Handle form input change
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewProduct((prevState) => ({
        ...prevState,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const token = localStorage.getItem("authToken"); // Token'ı yerel depolamadan alabilirsiniz
    
      try {
        const response = await fetch("http://localhost:5132/api/Product", {  
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Token'ı Authorization başlığına ekleyin
          },
          body: JSON.stringify(newProduct),
        });
    
        if (response.ok) {
          const addedProduct = await response.json();
          console.log("New product added:", addedProduct);
          setProducts((prevProducts) => [...prevProducts, addedProduct]); // Add new product to list
          setIsModalOpen(false); // Close modal after submission
        } else {
          console.error("Error adding product:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
    };
    const approveAllOrders = async () => {
      const token = localStorage.getItem("authToken");
      setProcessing(true); // İşlemin başladığını belirt
  
      try {
        // Tüm siparişleri onaylayacağız
        const response = await fetch("http://localhost:5132/api/Order/approve-all-orders", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
  
        if (response.ok) {
          alert("All orders approved successfully.");
          setPendingOrders([]); // Onaylandıktan sonra siparişleri temizle
        } else {
          console.error("Error approving orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error approving orders:", error);
      } finally {
        setProcessing(false); // İşlem tamamlandığında
      }
    };

// Open modal
const openModal = () => {
  setIsModalOpen(true);
};

// Close modal
const closeModal = () => {
  setIsModalOpen(false);
};
    

return (
  <div className="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <p>Welcome, {user.CustomerName}!</p>
    <p>Here you can manage users, settings, etc.</p>
    <button onClick={logout}>Logout</button>
    <div>
      <button className="customer-panel-button" onClick={handleCustomerPanelRedirect}>
        Go to Customer Panel
      </button>
      <button
        className="product-panel-button"
        onClick={() => navigate("/product-list")}
      >
        View Product List
      </button>
     
      <button onClick={openModal} className="add-product-button">
        Add Product
      </button>
    </div>
    <div className="pending-orders-section">
  <h2>Pending Orders</h2>
  {pendingOrders.length > 0 ? (
    <div>
      <ul>
  {pendingOrders.map((order) => (
    <li key={order.orderId} className="order-item">
      <p>Order ID: {order.orderId}</p>
      <p>Customer: {order.customerId}</p>
      <p>Total: ${order.totalPrice}</p>
    </li>
  ))}
</ul>
      <button
        onClick={handleProcessAllOrders}
        className="process-all-button"
        disabled={processing} // İşlem devam ederken butonu devre dışı bırak
      >
        {processing ? "Processing All Orders..." : "Process All Orders"}
      </button>
      <button
        onClick={approveAllOrders} // Onaylama butonunu çağırıyoruz
        className="approve-all-button"
      >
        Approve All Orders
      </button>
    </div>
  ) : (
    <p>No pending orders at the moment.</p>
  )}
</div>
    {/* Product Modal */}
    {isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close-modal" onClick={closeModal}>&times;</span>
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit">Add Product</button>
          </form>
        </div>
      </div>
    )}
  </div>
);
};

export default AdminDashboard;
