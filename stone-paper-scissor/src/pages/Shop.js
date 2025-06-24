import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../Context/CartContext';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { addToCart } = useCart();

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category'); // e.g., 'stationery'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        let all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter by category if query param exists
        if (selectedCategory) {
          all = all.filter(
            (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
          );
        }

        setProducts(all);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-primary text-center">
        🛍️ {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` : 'All Products'}
      </h3>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted">❌ No products found for this category.</p>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div className="col-6 col-md-3" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={product.imageBase64 || product.imageURL}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: 180, objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/180x180?text=No+Image';
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{product.name}</h6>
                  <p className="text-muted small mb-1">₹{product.price}</p>
                  <div className="mb-2">
                    <span className="text-warning small">★ ★ ★ ★ ☆</span>
                    <small className="text-muted ms-1">(56)</small>
                  </div>
                  <button
                    className="btn btn-primary btn-sm mt-auto"
                    onClick={() => addToCart(product)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Shop;
