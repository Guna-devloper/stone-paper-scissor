import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../Context/CartContext';

function BuyPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');
  const mode = queryParams.get('mode');
  const { cart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mode === 'all') {
      setProducts(cart);
      setLoading(false);
    } else if (productId) {
      fetchProductById(productId);
    }
  }, [productId, mode, cart]);

  const fetchProductById = async (id) => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProducts([{ id: docSnap.id, ...docSnap.data(), quantity: 1 }]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = products.reduce((sum, item) => sum + item.price * item.quantity + 9, 0);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="mb-4 fw-bold text-center">Order Summary</h4>

      {products.map((product, index) => (
        <div className="card mb-3 p-3 shadow-sm" key={index}>
          <div className="row">
            <div className="col-md-4">
              <img
                src={product.imageBase64 || product.imageURL}
                alt={product.name}
                className="img-fluid rounded"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/180')}
              />
            </div>
            <div className="col-md-8">
              <h5>{product.name}</h5>
              <p className="text-muted">Quantity: {product.quantity || 1}</p>
              <p>
                <strong>Price: ₹{product.price}</strong>
              </p>
              <p className="text-success">✅ Delivery by tomorrow, 11PM</p>
              <p>
                <strong>Subtotal: ₹{product.price * (product.quantity || 1)}</strong>
              </p>
              <p className="text-muted small">+ ₹9 Protection Fee</p>
            </div>
          </div>
        </div>
      ))}

      <div className="text-end">
        <h5 className="fw-bold">Total Payable: ₹{total.toFixed(2)}</h5>
        <button className="btn btn-warning mt-3 fw-bold w-100">Continue to Payment</button>
      </div>
    </div>
  );
}

export default BuyPage;
