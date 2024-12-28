import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom"; 
import premiumLogo from "../assets/premium-logo.png";
import standardLogo from "../assets/standard-logo.png";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [profileData, setProfileData] = useState({
    customerId: 0,
    customerName: "",
    customerPassword: "",
    budget: 0,
    customerType: "",
    totalSpent: 0,
    photo: "",
  }); 
  const { auth, userDetails, logout } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.customerId) {
      console.log("User Details:", auth);  
      setProfileData({
        customerId: auth.customerId,
        customerName: userDetails?.customerName || "",
        customerPassword: "",
        budget: userDetails?.budget || 0,
        customerType: userDetails?.customerType || "Regular",
        totalSpent: userDetails?.totalSpent || 0,
        photo: userDetails?.photo || "default-profile.png",
      });
      console.log("User Budget:", userDetails?.budget); 
    }
  }, [auth, userDetails]);

     const openModal = () => setIsModalOpen(true);
     const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };


  const saveProfileChanges = async () => {
    try {
      const response = await fetch("http://localhost:5132/api/Customer/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(profileData),
      });

      const responseText = await response.text();
  
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status} - ${responseText}`);
      }
  
      try {
        const updatedProfile = JSON.parse(responseText);
        alert("Profile updated successfully!");
        setProfileData(updatedProfile);
      } catch (error) {
        
        alert(responseText); 
      }
  
      closeModal();
  
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const logoutHandler = () => {
    logout(); 
    navigate("/"); 
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5132/api/Product", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);
  const addToCart = (product) => {
    const newItem = {
      id: product.productId || product.id,
      productName: product.productName,
      price: product.price,
      quantity: 1,
    };
  
    if (!newItem.id) {
      console.error("Product ID eksik:", product);
      return;
    }
  
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === newItem.id
      );
  
      if (existingItemIndex !== -1) {
        const existingItem = prevCart[existingItemIndex];
  
   
        if (existingItem.quantity >= 5) {
          alert(`You can add a maximum of 5 units for ${product.productName}!`);
          return prevCart; 
        }
  
        const updatedCart = prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return updatedCart;
      }
  
      return [...prevCart, newItem];
    });
  
    alert(`${product.productName} has been added to the cart!`);
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add some products to place an order!");
      return;
    }

  
    const token = auth?.token || localStorage.getItem("authToken"); 
    const customerId = auth?.customerId || localStorage.getItem("customerId");  
  
    if (!token || !customerId) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    
    for (const item of cart) {
      const orderData = {
        productId: item.id || item.productId,
        quantity: item.quantity,
      };

      console.log("Order Data:", JSON.stringify(orderData, null, 2));

      try {
        const response = await fetch("http://localhost:5132/api/Order/place-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Error:", errorMessage);
          throw new Error(`Failed to place order: ${response.status} - ${errorMessage}`);
        }

        const result = await response.json();
        console.log("Order placed successfully:", result);
      } catch (error) {
        console.error("Error placing order for product:", orderData.productId, error);
        alert(`Failed to place order for product ID: ${orderData.productId}. Please try again.`);
      }
    }

    alert("All orders have been placed successfully!");
    setCart([]);
  };

  return (
    <div className="home-page">
      <img
  src={auth?.role === "Premium" ? premiumLogo : standardLogo}
  alt="Logo"
  className="home-logo"
/>
 <div className="home-header">
        <img
          src={profileData.photo}
          alt="Profile"
          className="home-profile-image"
        />
        <button className="home-edit-profile-button" onClick={openModal}>
          Edit Profile
        </button>
       
        <button className="home-logout-button" onClick={logoutHandler}>
          Logout
        </button>

      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <label>
              Name:
              <input
                type="text"
                name="customerName"
                value={profileData.customerName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="customerPassword"
                value={profileData.customerPassword}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Budget:
              <input
                type="number"
                name="budget"
                value={profileData.budget}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Profile Picture URL:
              <input
                type="text"
                name="photo"
                value={profileData.photo}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={saveProfileChanges}>Save Changes</button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}


      {auth?.customerId ? (
        <div className="home-user-info">
          <p>Welcome, {auth?.user?.customerName || "User"}!</p>
          <p>
            Your balance: ${userDetails?.budget ? userDetails.budget.toFixed(2) : "N/A"}
          </p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
  
      <button
        className="home-toggle-cart-button"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        {isCartOpen ? "Close Cart" : "View Cart"} ({cart.length})
      </button>
  
   
      <button
        className="home-my-orders-button"
        onClick={() => navigate("/my-orders")} 
      >
        My Orders
      </button>

      <h1 className="home-title">Welcome to Our Store</h1>
      {error && <p className="home-error-message">{error}</p>}
  
      <div className="home-product-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.id || index} className="home-product-card">
              <img
                src={product.photo || "default-image-url.jpg"}
                alt={product.productName}
                className="home-product-image"
              />
              <h2 className="home-product-name">{product.productName}</h2>
              <p className="home-product-price">${product.price.toFixed(2)}</p>
              <p className="home-product-description">{product.description}</p>
              <button
                className="home-add-to-cart-button"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="home-no-products">No products available</p>
        )}
      </div>
  
      {isCartOpen && (
        <div className="home-cart">
          <h2>Your Cart</h2>
          {cart.length > 0 ? (
            <>
              <ul>
                {cart.map((item, index) => (
                  <li key={index} className="home-cart-item">
                    <span>{item.productName}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                    <span>Quantity: {item.quantity}</span>
                    <button
                      className="home-remove-from-cart-button"
                      onClick={() => removeFromCart(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button className="home-place-order-button" onClick={placeOrder}>
                Place Order
              </button>
            </>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
