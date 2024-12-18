import React, { useEffect, useState } from "react";
import "../styles/Home.css"; // Özel stiller için bir CSS dosyası

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(""); // Hata mesajını saklamak için

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://localhost:7038/api/Product", {
          method: "GET", // GET yöntemi
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Yetkilendirme gerekiyorsa
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

  return (
    <div className="home-page">
      <h1 className="home-title">Welcome to Our Store</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.id || index} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">${product.price}</p>
            </div>
          ))
        ) : (
          <p className="no-products">No products available</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
