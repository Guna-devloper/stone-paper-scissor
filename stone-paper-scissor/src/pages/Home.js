import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, query, startAfter } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../Context/CartContext';
import banner from '../Images/banner-sps.png';

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const categories = ['Electrical', 'Gifts', 'Fancy', 'Fashion', 'Stationery'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'products'), limit(8));
      if (lastDoc) {
        q = query(collection(db, 'products'), startAfter(lastDoc), limit(8));
      }

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (snap.docs.length > 0) {
        setLastDoc(snap.docs[snap.docs.length - 1]);
        setFeatured((prev) => [...prev, ...data]);
      }
      if (snap.docs.length < 8) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const scrollEvent = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', scrollEvent, { passive: true });
    return () => window.removeEventListener('scroll', scrollEvent);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleBuyNow = (prod) => {
    navigate(`/checkout?productId=${prod.id}`);
  };

  return (
    <>
      {/* 🔔 Offer Strip */}
      <div
        className="text-dark text-center py-2 fw-bold small"
        style={{
          background: 'linear-gradient(90deg, rgba(255,222,233,0.95) 0%, rgba(181,255,252,0.95) 100%)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          letterSpacing: '0.5px',
        }}
      >
        🚚 <strong>Free Delivery</strong> on Orders Above <span className="text-danger">₹999</span>!
      </div>

      {/* 🎠 Hero Banner */}
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={banner}
              className="d-block w-100"
              alt="Shop Now Banner"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://source.unsplash.com/1600x500/?shopping,mall"
              className="d-block w-100"
              alt="Promotional Banner"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* 🛍️ Categories */}
      <div className="container py-5">
        <h4 className="mb-4 text-center fw-bold text-gradient">Shop by Category</h4>
        <div className="row g-4 justify-content-center">
          {categories.map((cat, idx) => (
            <div className="col-4 col-sm-3 col-md-2" key={idx}>
              <Link to={`/shop?category=${cat.toLowerCase()}`} className="text-decoration-none">
                <div
                  className="card text-center p-3 shadow-sm border-0 h-100"
                  style={{
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '15px',
                    transition: '0.3s',
                  }}
                >
                  <i className="bi bi-tag-fill fs-3 text-primary mb-2"></i>
                  <strong className="small text-dark">{cat}</strong>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 Featured Products */}
      <div className="container pb-5">
        <h4 className="mb-4 text-center fw-bold text-gradient">Featured Products</h4>

        {loading && featured.length === 0 ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {featured.map((prod) => (
                <div className="col-6 col-sm-6 col-md-3" key={prod.id}>
                  <div
                    className="card h-100 shadow-lg border-0"
                    style={{
                      borderRadius: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <img
                      src={prod.imageBase64 || prod.imageURL}
                      className="card-img-top"
                      alt={prod.name || 'Product'}
                      style={{
                        height: 180,
                        objectFit: 'cover',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/180x180?text=Image+Not+Found';
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{prod.name}</h6>
                      <p className="text-muted small mb-1">₹{prod.price}</p>
                      <div className="mb-2">
                        <span className="text-warning small">
                          {"★".repeat(prod.rating || 4)}
                          {"☆".repeat(5 - (prod.rating || 4))}
                        </span>
                        <small className="text-muted ms-1">
                          ({prod.ratingCount || 120})
                        </small>
                      </div>

                      {/* ✅ Buy Now button */}
                      <button
                        className="btn btn-primary btn-sm mb-2"
                        onClick={() => handleBuyNow(prod)}
                      >
                        🚀 Buy Now
                      </button>

                      {/* 🛒 Add to Cart button */}
                      <button
                        onClick={() => addToCart(prod)}
                        className="btn btn-outline-primary btn-sm mt-auto"
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-4">
                <button className="btn btn-outline-primary" onClick={fetchProducts}>
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🎁 CTA Section */}
      <div
        className="text-white text-center py-5"
        style={{ background: 'linear-gradient(to right, #D8B5FF, #1EAE98)' }}
      >
        <h4 className="fw-bold">Start Shopping Today</h4>
        <p className="lead small">Best products. Best prices. Best experience.</p>
        <Link to="/shop" className="btn btn-light px-4 fw-semibold">
          Explore Shop
        </Link>
      </div>

      {/* 📜 Footer */}
      <footer
        className="text-white text-center py-4"
        style={{ background: 'linear-gradient(to right, #141E30, #243B55)' }}
      >
        <img src="/sps-logo-removebg-preview.png" alt="SPS Logo" style={{ width: 80 }} className="mb-2" />
        <p className="mb-0 small">
          &copy; {new Date().getFullYear()} Stone Paper Scissor | All Rights Reserved
        </p>
      </footer>

      {/* 🔼 Scroll To Top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary rounded-circle shadow position-fixed"
          aria-label="Scroll to top"
          style={{
            bottom: '20px',
            right: '20px',
            zIndex: 999,
            width: '45px',
            height: '45px',
            fontSize: '20px',
            border: 'none',
          }}
        >
          ↑
        </button>
      )}
    </>
  );
}

export default Home;
