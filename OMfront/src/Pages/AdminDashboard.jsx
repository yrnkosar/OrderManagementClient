import React , { useEffect, useState  }from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; 
import "../styles/AdminDashboard.css"; 

const AdminDashboard = () => {
  const { user } = useAuth(); 
  console.log(user);  
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

// Modal state management
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
      return; 
    }

    if (user.customerType !== "Admin") {
      navigate("/home"); 
    }
  }, [user, navigate]); 

  
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
    <p>Welcome, {user.username}!</p>
    <p>Here you can manage users, settings, etc.</p>
    
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
