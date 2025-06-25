import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../Context/CartContext';
import banner from '../Images/banner-sps.png';

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'products'), limit(8));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFeatured(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    const scrollEvent = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', scrollEvent, { passive: true });
    return () => window.removeEventListener('scroll', scrollEvent);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const categories = ['Electrical', 'Gifts', 'Fancy', 'Fashion', 'Stationery'];

  return (
    <>
      {/* 🔔 Offer Strip */}
      <div
        className="text-white text-center py-2 fw-semibold small"
        style={{
          background: 'linear-gradient(90deg, #FFDEE9 0%, #B5FFFC 100%)',
          color: '#333',
        }}
      >
        🚚 Free Delivery on Orders Above ₹999!
      </div>

      {/* 🎠 Hero Banner */}
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={banner}
              className="d-block w-100"
              alt="banner"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://source.unsplash.com/1600x500/?shopping,mall"
              className="d-block w-100"
              alt="banner2"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* 🛍️ Categories Section */}
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

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
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
                    alt={prod.name}
                    style={{ height: 180, objectFit: 'cover', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/180x180?text=Image+Not+Found';
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{prod.name}</h6>
                    <p className="text-muted small mb-1">₹{prod.price}</p>
                    <div className="mb-2">
                      <span className="text-warning small">★ ★ ★ ★ ☆</span>
                      <small className="text-muted ms-1">(120)</small>
                    </div>
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
        )}
      </div>

      {/* 🎁 CTA */}
      <div
        className="text-white text-center py-5"
        style={{
          background: 'linear-gradient(to right, #D8B5FF, #1EAE98)',
        }}
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
        <img src="/sps-logo-removebg-preview.png" alt="logo" style={{ width: 80 }} className="mb-2" />
        <p className="mb-0 small">&copy; {new Date().getFullYear()} Stone Paper Scissor | All Rights Reserved</p>
      </footer>

      {/* 🔼 Scroll To Top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary rounded-circle shadow position-fixed"
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
