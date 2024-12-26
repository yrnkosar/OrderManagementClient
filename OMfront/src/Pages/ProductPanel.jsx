import React, { useEffect, useState } from "react";
import "../styles/ProductPanel.css"; // Stil dosyası isteğe bağlı
import { useAuth } from "../AuthContext";


const ProductPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({}); 
  const { auth } = useAuth();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {console.log(auth?.token); 

        const response = await fetch("http://localhost:5132/api/Product", {
            headers: {
              Authorization: `Bearer ${auth?.token}`, 
            },
          });if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
  
    try {
      const token = auth?.token; // Token'ı auth nesnesinden alıyoruz
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }
  
      const response = await fetch(`http://localhost:5132/api/Product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token burada header'a ekleniyor
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete product.");
      }
  
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.message || "Failed to delete product.");
    }
  };
  /*const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to mark this product as deleted?"
    );
    if (!confirmDelete) return;

    try {
      const token = auth?.token;
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const updatedProduct = {
        visibility: false,
      };

      const response = await fetch(`http://localhost:5132/api/Product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to mark product as deleted.");
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId ? { ...product, visibility: 0 } : product
        )
      );

      alert("Product marked as deleted successfully.");
    } catch (error) {
      console.error("Error marking product as deleted:", error);
      alert(error.message || "Failed to mark product as deleted.");
    }
  };*/


  const openEditModal = (product) => {
    console.log(product.productId); // Make sure this logs the product ID when you open the modal
    setEditingProduct(product); // This should set the editingProduct state correctly
    setEditForm({
      productName: product.productName,
      stock: product.stock,
      price: product.price,
      description: product.description,
      photo: product.photo, // Add the current photo URL to the form
    });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    if (!editingProduct) {
      console.error("No product to edit");
      return;
    }
  
    const token = auth?.token;
  
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }
  
    const updatedProduct = {
      ProductName: editForm.productName || editingProduct.productName,
      Stock: editForm.stock !== undefined ? parseInt(editForm.stock, 10) : editingProduct.stock,
      Price: editForm.price !== undefined ? parseFloat(editForm.price) : editingProduct.price,
      Description: editForm.description || editingProduct.description,
      Photo: editForm.photo || editingProduct.photo,
    };
  
    console.log("Payload being sent:", JSON.stringify(updatedProduct));
  
    try {
      const response = await fetch(`http://localhost:5132/api/Product/${editingProduct.productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error response:", errorDetails);
        throw new Error(errorDetails.title || "Failed to update product.");
      }
  
      const updatedProductResponse = await response.json();
      console.log("Updated product:", updatedProductResponse);
  
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === updatedProductResponse.productId ? updatedProductResponse : product
        )
      );
  
      alert("Product updated successfully.");
      closeEditModal();
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.message || "Failed to update product.");
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    if (isNaN(newStock) || newStock < 0) {
      alert("Please provide a valid non-negative stock value.");
      return;
    }
  
    try {
      const token = auth?.token;
  
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }
  
      console.log(`Updating stock for Product ID: ${productId}, New Stock: ${newStock}`);
  
      const response = await fetch(`http://localhost:5132/api/Product/${productId}/update-stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: newStock.toString(),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error response:", errorDetails);
        throw new Error(errorDetails.message || "Failed to update stock.");
      }
  
      const updatedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === updatedProduct.productId ? updatedProduct : product
        )
      );
  
      alert("Stock updated successfully.");
    } catch (error) {
      console.error("Error updating stock:", error);
      alert(error.message || "Failed to update stock.");
    }
  };

  return (
   
    <div className="product-body">
      <div className="product-panel">
      <h1>Product List</h1>
      {loading && <p>Loading products...</p>}
      {error && <p className="product-error-message">{error}</p>}
      {!loading && !error && (
        <table className="product-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.stock}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.description}</td>
                <td>
                  <button
                    className="product-edit-button"
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="product-delete-button"
                    onClick={() => handleDelete(product.productId)}
                  >
                    Delete
                  </button>
                  <button
                      className="product-stock-button"
                      onClick={() => {
                        const newStock = prompt("Enter new stock value:", product.stock);
                        if (newStock !== null) {
                          handleStockUpdate(product.productId, parseInt(newStock, 10));
                        }
                      }}
                    >
                      Update Stock
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  
      {/* Modal */}
      {editingProduct && (
        <div className="product-modal">
          <div className="product-modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              {/* Salt okunur Product ID */}
              <div>
                <label>Product ID</label>
                <p>{editingProduct.productId}</p>
              </div>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.productName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, productName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Stock</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Photo (URL)</label>
                <input
                  type="text"
                  value={editForm.photo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, photo: e.target.value })
                  }
                />
              </div>
              <div className="product-modal-actions">
                <button type="submit" className="product-save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="product-cancel-button"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  
  );
};

export default ProductPanel;