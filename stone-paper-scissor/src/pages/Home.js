import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../Context/CartContext';

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
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeatured(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    const scrollEvent = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', scrollEvent);
    return () => window.removeEventListener('scroll', scrollEvent);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const categories = ['Electrical', 'Gifts', 'Fancy', 'Fashion', 'Stationery'];

  return (
    <>
      {/* 🔔 Offer Strip */}
      <div className="bg-warning text-dark text-center py-2 fw-semibold small">
        🚚 Free Delivery on Orders Above ₹999!
      </div>

      {/* 🎠 Hero Carousel */}
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://source.unsplash.com/1600x500/?shopping"
              className="d-block w-100"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
              alt="banner"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://source.unsplash.com/1600x500/?electronics,fashion"
              className="d-block w-100"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
              alt="banner2"
            />
          </div>
        </div>
      </div>

      {/* 🛍️ Categories */}
      <div className="container py-5">
        <h4 className="mb-4 text-primary text-center">Shop by Category</h4>
        <div className="row g-3 justify-content-center">
          {categories.map((cat, idx) => (
            <div className="col-4 col-sm-4 col-md-2" key={idx}>
              <Link to={`/shop?category=${cat.toLowerCase()}`} className="text-decoration-none text-dark">
                <div className="card text-center p-3 shadow-sm border-0">
                  <i className="bi bi-tag-fill fs-3 text-primary mb-2"></i>
                  <strong className="small">{cat}</strong>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 Featured Products */}
      <div className="container pb-5">
        <h4 className="mb-4 text-primary text-center">Featured Products</h4>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {featured.map(prod => (
              <div className="col-6 col-sm-6 col-md-3" key={prod.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={prod.imageBase64 || prod.imageURL}
                    className="card-img-top"
                    alt={prod.name}
                    style={{ height: 180, objectFit: 'cover' }}
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
                      className="btn btn-primary btn-sm mt-auto"
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
      <div className="bg-primary text-white text-center py-5 px-3">
        <h4>Start Shopping Today</h4>
        <p className="lead small">Best products. Best prices.</p>
        <Link to="/shop" className="btn btn-light btn-sm px-4">Explore Shop</Link>
      </div>

      {/* 📜 Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <img
          src="/sps-logo-removebg-preview.png"
          alt="logo"
          style={{ width: 80 }}
          className="mb-2"
        />
        <p className="mb-0 small">&copy; {new Date().getFullYear()} Stone Paper Scissor | All Rights Reserved</p>
      </footer>

      {/* 🔼 Scroll To Top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary rounded-circle shadow position-fixed"
          style={{ bottom: '20px', right: '20px', zIndex: 999 }}
        >
          ↑
        </button>
      )}
    </>
  );
}

export default Home;
