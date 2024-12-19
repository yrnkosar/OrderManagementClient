import React, { useEffect, useState } from "react";
import "../styles/Home.css"; // Özel stiller için bir CSS dosyası
import { useAuth } from "../AuthContext";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { auth } = useAuth();

  // Ürünleri alıyoruz
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

  // Sepete ürün ekliyoruz
  const addToCart = (product) => {
    const productId = product.id || product.productId;  // Burada doğru alanı kullanıyoruz
    if (!productId) {
      console.error("Product ID is missing.");
      return;
    }
  
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.productName} has been added to the cart!`);
  };

  // Sepetten ürün çıkarıyoruz
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Sipariş veriyoruz
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add some products to place an order!");
      return;
    }

    // Kullanıcı ID'sini auth'dan veya localStorage'dan alıyoruz
    const customerId = auth?.user?.customerId || localStorage.getItem("customerId");

    if (!customerId) {
      alert("User is not authenticated. Please log in.");
      return;
    }

// Sipariş verilerini hazırlıyoruz
const orderData = {
  items: cart.map((item) => ({
    productId: item.id || item.productId,  // Ürün ID'sini doğru alıyoruz
    quantity: 1,  // Varsayılan olarak quantity 1
  })),
  customerId: customerId,  // Kullanıcı ID'si
};

console.log("Order Data:", orderData);  // Sipariş verisini yazdırıyoruz

try {
  const response = await fetch("http://localhost:5132/api/Order/place-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth?.token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorMessage = await response.text();  // Detaylı hata mesajı
    console.error("Error:", errorMessage);
    throw new Error(`Failed to place order: ${response.status} - ${errorMessage}`);
  }

  const result = await response.json();
  alert("Your order has been placed successfully!");
  setCart([]);  // Sipariş sonrası sepeti temizle
  console.log("Order Result:", result);
} catch (error) {
  console.error("Error placing order:", error);
  alert("Failed to place order. Please try again.");
}
  };

  return (
    <div className="home-page">
      <button
        className="toggle-cart-button"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        {isCartOpen ? "Close Cart" : "View Cart"} ({cart.length})
      </button>

      <h1 className="home-title">Welcome to Our Store</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.id || index} className="product-card">
              <img
                src={product.photo || "default-image-url.jpg"}
                alt={product.productName}
                className="product-image"
              />
              <h2 className="product-name">{product.productName}</h2>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.description}</p>
              <button
                className="add-to-cart-button"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="no-products">No products available</p>
        )}
      </div>

      {isCartOpen && (
        <div className="cart">
          <h2>Your Cart</h2>
          {cart.length > 0 ? (
            <>
              <ul>
                {cart.map((item, index) => (
                  <li key={index} className="cart-item">
                    <span>{item.productName}</span>
                    <span>${item.price.toFixed(2)}</span>
                    <button
                      className="remove-from-cart-button"
                      onClick={() => removeFromCart(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button className="place-order-button" onClick={placeOrder}>
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
